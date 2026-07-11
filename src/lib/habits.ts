import 'server-only';

import { prisma } from '@/lib/database';
import type { Habit, HabitPayload } from '@/types/Habit';

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
};

const mapHabitRecord = (habit: {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  logs?: {
    id: string;
    habitId: string;
    date: Date;
    createdAt: Date;
  }[];
}): Habit => ({
  id: habit.id,
  userId: habit.userId,
  title: habit.title,
  description: habit.description,
  createdAt: habit.createdAt.toISOString(),
  updatedAt: habit.updatedAt.toISOString(),
  logs: habit.logs?.map((log) => ({
    id: log.id,
    habitId: log.habitId,
    date: log.date.toISOString(),
    createdAt: log.createdAt.toISOString(),
  })),
});

export const parseHabitPayload = (payload: unknown): Required<HabitPayload> => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Request body must be a JSON object.');
  }

  const rawPayload = payload as Record<string, unknown>;
  const title = normalizeText(rawPayload.title);

  if (!title) {
    throw new Error('`title` is required.');
  }

  return {
    title,
    description: normalizeText(rawPayload.description),
  };
};

export const createHabit = async (userId: string, payload: Required<HabitPayload>) => {
  const habit = await prisma.habit.create({
    data: {
      userId,
      title: payload.title,
      description: payload.description,
    },
    include: {
      logs: true,
    },
  });

  return mapHabitRecord(habit);
};

export const listHabits = async (userId: string) => {
  const habits = await prisma.habit.findMany({
    where: {
      userId,
    },
    include: {
      logs: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return habits.map(mapHabitRecord);
};

export const getHabitById = async (userId: string, habitId: string) => {
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
    include: {
      logs: true,
    },
  });

  return habit ? mapHabitRecord(habit) : null;
};

export const updateHabit = async (
  userId: string,
  habitId: string,
  payload: Required<HabitPayload>,
) => {
  const existingHabit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!existingHabit) {
    return null;
  }

  const habit = await prisma.habit.update({
    where: {
      id: habitId,
    },
    data: {
      title: payload.title,
      description: payload.description,
    },
    include: {
      logs: true,
    },
  });

  return mapHabitRecord(habit);
};

export const deleteHabit = async (userId: string, habitId: string) => {
  const result = await prisma.habit.deleteMany({
    where: {
      id: habitId,
      userId,
    },
  });

  return result.count > 0;
};

// Date should be an ISO string representing the local date of the user, e.g. "2024-01-01"
export const logHabitCompletion = async (userId: string, habitId: string, date: string) => {
  const existingHabit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!existingHabit) {
    throw new Error('Habit not found or unauthorized');
  }

  const parsedDate = new Date(date);

  const log = await prisma.habitLog.upsert({
    where: {
      habitId_date: {
        habitId,
        date: parsedDate,
      },
    },
    update: {},
    create: {
      habitId,
      date: parsedDate,
    },
  });

  return log;
};

export const undoHabitCompletion = async (userId: string, habitId: string, date: string) => {
  const existingHabit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!existingHabit) {
    throw new Error('Habit not found or unauthorized');
  }

  const parsedDate = new Date(date);

  await prisma.habitLog.deleteMany({
    where: {
      habitId,
      date: parsedDate,
    },
  });

  return true;
};
