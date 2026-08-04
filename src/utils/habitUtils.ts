import type { Habit } from '@/types/Habit';

export function toLocalDateStr(d: Date): string {
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().split('T')[0];
}

export function buildDateWindow(days: number): string[] {
  const result: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(toLocalDateStr(d));
  }
  return result;
}

export function dayLabel(dateStr: string): string {
  return String(new Date(dateStr + 'T12:00:00').getDate());
}

export function monthLabel(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleString('default', { month: 'short' });
}

export function calcStreak(habit: Habit): number {
  const logSet = new Set((habit.logs ?? []).map((l) => l.date.split('T')[0]));
  if (logSet.size === 0) return 0;

  const sortedDates = Array.from(logSet).sort();
  let streak = 0;
  const d = new Date();
  const todayStr = toLocalDateStr(d);

  while (true) {
    const dateStr = toLocalDateStr(d);
    if (logSet.has(dateStr)) {
      streak++;
    } else {
      if (dateStr === todayStr) {
        // Today not logged yet, doesn't break streak
      } else {
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        if (habit.skipWeekends && isWeekend) {
          // Free pass
        } else {
          break;
        }
      }
    }
    d.setDate(d.getDate() - 1);
    if (dateStr < sortedDates[0]) break;
  }
  return streak;
}
