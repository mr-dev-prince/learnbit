import type { Task } from '@/types/Task';

export type TaskFilterPeriod = 'Daily' | 'Weekly' | 'Monthly';

/**
 * Returns the [start, end) boundaries for a given filter period.
 *
 * - **Daily**   → [today 00:00, tomorrow 00:00)
 * - **Weekly**  → [Sunday 00:00, next Sunday 00:00)
 * - **Monthly** → [1st 00:00, 1st of next month 00:00)
 */
function getPeriodRange(period: TaskFilterPeriod): { start: Date; end: Date } {
  const now = new Date();

  switch (period) {
    case 'Daily': {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return { start, end };
    }
    case 'Weekly': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay()); // Sunday
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      return { start, end };
    }
    case 'Monthly': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return { start, end };
    }
  }
}

/**
 * Filters tasks whose `dueDate` falls within the selected period.
 * Tasks without a dueDate are excluded.
 */
export function filterTasksByPeriod(tasks: Task[], period: TaskFilterPeriod): Task[] {
  const { start, end } = getPeriodRange(period);
  return tasks.filter((task) => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    return due >= start && due < end;
  });
}
