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

function computeBestStreak(logs: {date: Date}[], skipWeekends: boolean): number {
  if (logs.length === 0) return 0;
  
  const sortedDates = logs.map(l => l.date.toISOString().split('T')[0]).sort();
  const logSet = new Set(sortedDates);
  const uniqueDates = Array.from(logSet).sort();
  
  if (uniqueDates.length === 0) return 0;
  
  let bestStreak = 0;
  let currentStreak = 0;
  
  const firstDate = new Date(`${uniqueDates[0]}T00:00:00Z`);
  const lastDate = new Date(`${uniqueDates[uniqueDates.length - 1]}T00:00:00Z`);
  
  for (let d = new Date(firstDate); d <= lastDate; d.setUTCDate(d.getUTCDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    if (logSet.has(dateStr)) {
      currentStreak++;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    } else {
      const isWeekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
      if (skipWeekends && isWeekend) {
        // Free pass
      } else {
        currentStreak = 0;
      }
    }
  }
  return bestStreak;
}

const mapHabitRecord = (habit: {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  skipWeekends: boolean;
  bestStreak: number;
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
  skipWeekends: habit.skipWeekends,
  bestStreak: Math.max(habit.bestStreak, computeBestStreak(habit.logs || [], habit.skipWeekends)),
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
    skipWeekends: typeof rawPayload.skipWeekends === 'boolean' ? rawPayload.skipWeekends : false,
  };
};

export const createHabit = async (userId: string, payload: Required<HabitPayload>) => {
  const habit = await prisma.habit.create({
    data: {
      userId,
      title: payload.title,
      description: payload.description,
      skipWeekends: payload.skipWeekends,
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
      skipWeekends: payload.skipWeekends,
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

  const allLogs = await prisma.habitLog.findMany({
    where: { habitId },
  });

  const newBestStreak = computeBestStreak(allLogs, existingHabit.skipWeekends);

  if (existingHabit.bestStreak !== newBestStreak) {
    await prisma.habit.update({
      where: { id: habitId },
      data: { bestStreak: newBestStreak },
    });
  }

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

  const allLogs = await prisma.habitLog.findMany({
    where: { habitId },
  });

  const newBestStreak = computeBestStreak(allLogs, existingHabit.skipWeekends);

  if (existingHabit.bestStreak !== newBestStreak) {
    await prisma.habit.update({
      where: { id: habitId },
      data: { bestStreak: newBestStreak },
    });
  }

  return true;
};
