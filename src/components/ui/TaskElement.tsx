'use client';

import type { Task } from '@/types/Task';
import Switch from './Switch';

interface TaskElementProps {
  task: Task;
  onClick?: () => void;
}

const STATUS_COLORS = {
  TODO: 'bg-[var(--todo-bg)] text-[var(--todo-text)]',
  IN_PROGRESS: 'bg-[var(--progress-bg)] text-[var(--progress-text)]',
  COMPLETED: 'bg-[var(--completed-bg)] text-[var(--completed-text)]',
  ARCHIVED: 'bg-[var(--archived-bg)] text-[var(--archived-text)]',
} as const;

const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
} as const;

export default function TaskElement({ task, onClick }: TaskElementProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="
        flex w-full items-center justify-between
        rounded-xl border border-border
        bg-surface
        p-4
        transition-all duration-200
        hover:border-border-strong
        hover:bg-surface-hover
        hover:shadow-md
        cursor-pointer
      "
    >
      {/* Left */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="h-6 w-6 shrink-0 rounded-full border-2 border-border" />

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-foreground">
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="ml-6 flex shrink-0 items-center gap-5">
        <span
          className={`
            ${STATUS_COLORS[task.status]}
            inline-flex
            min-w-[110px]
            items-center
            justify-center
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
          `}
        >
          {STATUS_LABELS[task.status]}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Revision
          </span>

          <Switch />
        </div>
      </div>
    </div>
  );
}