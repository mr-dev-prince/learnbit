export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
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
}
