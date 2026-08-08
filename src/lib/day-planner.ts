import { prisma } from '@/lib/database';
import { DayPlanner, Activity } from '@prisma/client';

export interface CreateDayPlannerPayload {
  date: Date;
  wakeTime: Date;
  sleepTime: Date;
}

export interface CreateActivityPayload {
  plannerId: string;
  title: string;
  notes?: string | null;
  startTime: Date;
  endTime: Date;
}

export interface UpdateActivityPayload {
  title?: string;
  notes?: string | null;
  startTime?: Date;
  endTime?: Date;
  completed?: boolean;
}

export const getDayPlanner = async (userId: string, date: Date) => {
  // Reset time to start of day for accurate lookup
  const searchDate = new Date(date);
  searchDate.setUTCHours(0, 0, 0, 0);

  return prisma.dayPlanner.findFirst({
    where: {
      userId,
      date: searchDate,
    },
    include: {
      activities: {
        orderBy: {
          startTime: 'asc',
        },
      },
    },
  });
};

export const createDayPlanner = async (userId: string, payload: CreateDayPlannerPayload) => {
  const searchDate = new Date(payload.date);
  searchDate.setUTCHours(0, 0, 0, 0);

  let availableMinutes = Math.floor(
    (payload.sleepTime.getTime() - payload.wakeTime.getTime()) / 60000,
  );
  // Handle cross-midnight sleep where wakeTime is after sleepTime (e.g. sleep 23:00, wake 07:00)
  if (availableMinutes < 0) {
    availableMinutes += 24 * 60;
  }

  return prisma.dayPlanner.create({
    data: {
      userId,
      date: searchDate,
      wakeTime: payload.wakeTime,
      sleepTime: payload.sleepTime,
      availableMinutes,
      remainingMinutes: availableMinutes,
    },
    include: {
      activities: true,
    },
  });
};

export const updateDayPlanner = async (
  userId: string,
  id: string,
  payload: { wakeTime?: Date; sleepTime?: Date },
) => {
  const existing = await prisma.dayPlanner.findUnique({
    where: { id, userId },
    include: { activities: true },
  });
  if (!existing) throw new Error('Planner not found');

  const newWakeTime = payload.wakeTime || existing.wakeTime;
  const newSleepTime = payload.sleepTime || existing.sleepTime;

  let availableMinutes = Math.floor((newSleepTime.getTime() - newWakeTime.getTime()) / 60000);
  if (availableMinutes < 0) {
    availableMinutes += 24 * 60;
  }

  // Recalculate remaining minutes
  const usedMinutes = existing.activities.reduce((acc, act) => acc + act.durationMinutes, 0);
  const remainingMinutes = availableMinutes - usedMinutes;

  return prisma.dayPlanner.update({
    where: { id },
    data: {
      wakeTime: newWakeTime,
      sleepTime: newSleepTime,
      availableMinutes,
      remainingMinutes,
    },
    include: {
      activities: {
        orderBy: {
          startTime: 'asc',
        },
      },
    },
  });
};

export const createActivity = async (userId: string, payload: CreateActivityPayload) => {
  const planner = await prisma.dayPlanner.findUnique({
    where: { id: payload.plannerId, userId },
  });
  if (!planner) throw new Error('Planner not found');

  let durationMinutes = Math.floor(
    (payload.endTime.getTime() - payload.startTime.getTime()) / 60000,
  );
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }

  if (planner.remainingMinutes < durationMinutes) {
    throw new Error('Not enough remaining time in the day.');
  }

  // We could check overlaps here, but usually it's handled properly in the service/API or frontend.
  // For safety, let's allow it here and assume the client checked, or we'll just trust the UI validations.

  const activity = await prisma.activity.create({
    data: {
      ...payload,
      durationMinutes,
    },
  });

  await prisma.dayPlanner.update({
    where: { id: payload.plannerId },
    data: {
      remainingMinutes: planner.remainingMinutes - durationMinutes,
    },
  });

  return activity;
};

export const updateActivity = async (
  userId: string,
  id: string,
  payload: UpdateActivityPayload,
) => {
  const existingActivity = await prisma.activity.findUnique({
    where: { id },
    include: { planner: true },
  });

  if (!existingActivity || existingActivity.planner.userId !== userId) {
    throw new Error('Activity not found');
  }

  const planner = existingActivity.planner;

  const newStartTime = payload.startTime || existingActivity.startTime;
  const newEndTime = payload.endTime || existingActivity.endTime;

  let newDuration = Math.floor((newEndTime.getTime() - newStartTime.getTime()) / 60000);
  if (newDuration < 0) {
    newDuration += 24 * 60;
  }

  const durationDifference = newDuration - existingActivity.durationMinutes;

  if (planner.remainingMinutes - durationDifference < 0) {
    throw new Error('Not enough remaining time in the day.');
  }

  const activity = await prisma.activity.update({
    where: { id },
    data: {
      title: payload.title,
      notes: payload.notes,
      startTime: payload.startTime,
      endTime: payload.endTime,
      completed: payload.completed,
      durationMinutes: newDuration,
    },
  });

  if (durationDifference !== 0) {
    await prisma.dayPlanner.update({
      where: { id: planner.id },
      data: {
        remainingMinutes: planner.remainingMinutes - durationDifference,
      },
    });
  }

  return activity;
};

export const deleteActivity = async (userId: string, id: string) => {
  const existingActivity = await prisma.activity.findUnique({
    where: { id },
    include: { planner: true },
  });

  if (!existingActivity || existingActivity.planner.userId !== userId) {
    throw new Error('Activity not found');
  }

  await prisma.activity.delete({
    where: { id },
  });

  await prisma.dayPlanner.update({
    where: { id: existingActivity.plannerId },
    data: {
      remainingMinutes:
        existingActivity.planner.remainingMinutes + existingActivity.durationMinutes,
    },
  });

  return true;
};
