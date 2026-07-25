export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  skipWeekends: boolean;
  bestStreak: number;
  logs?: HabitLog[];
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  createdAt: string;
}

export interface HabitPayload {
  title: string;
  description?: string | null;
  skipWeekends?: boolean;
}
