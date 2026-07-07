'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, Trash2 } from 'lucide-react';
import {
  useDeleteTask,
  useMarkRevision,
  useTaskRevisions,
  useUnmarkRevision,
  useUpdateTask,
} from '@/hooks/useTasks';
import type { Task, TaskStatus } from '@/types/Task';
import Switch from './Switch';

interface TaskElementProps {
  task: Task;
  onClick?: () => void;
  onDeleted?: () => void;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: 'bg-[var(--todo-bg)] text-[var(--todo-text)]',
  IN_PROGRESS: 'bg-[var(--progress-bg)] text-[var(--progress-text)]',
  COMPLETED: 'bg-[var(--completed-bg)] text-[var(--completed-text)]',
  ARCHIVED: 'bg-[var(--archived-bg)] text-[var(--archived-text)]',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
};

const ALL_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];

function StatusChip({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { mutate: updateTask, isPending } = useUpdateTask();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleSelect = (status: TaskStatus) => {
    if (status === task.status) {
      setOpen(false);
      return;
    }
    updateTask(
      {
        id: task.id,
        payload: {
          title: task.title,
          description: task.description,
          notes: task.notes,
          resourceLinks: task.resourceLinks,
          dueDate: task.dueDate,
          status,
        },
      },
      {
        onSuccess: () => toast.success(`Status updated to ${STATUS_LABELS[status]}`),
        onError: () => toast.error('Failed to update status'),
      },
    );
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        disabled={isPending}
        className={`
          ${STATUS_COLORS[task.status]}
          inline-flex items-center gap-1.5
          rounded-full px-3 py-0.5
          text-xs font-semibold
          transition-opacity duration-150
          hover:opacity-80
          disabled:pointer-events-none disabled:opacity-50
        `}
      >
        {STATUS_LABELS[task.status]}
        <ChevronDown
          size={11}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-full z-50 mt-1.5
            min-w-[148px] overflow-hidden
            rounded-lg border border-border
            bg-surface shadow-lg
          "
          onClick={(e) => e.stopPropagation()}
        >
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              className={`
                flex w-full items-center gap-2.5 px-3 py-2
                text-left text-xs font-semibold
                transition-colors duration-150
                hover:bg-surface-hover
                ${s === task.status ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${STATUS_COLORS[s].split(' ')[1].replace('text-', 'bg-')}`}
              />
              <span className={STATUS_COLORS[s].split(' ')[1]}>{STATUS_LABELS[s]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskElement({ task, onClick, onDeleted }: TaskElementProps) {
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const { data: revisions = [] } = useTaskRevisions(task.id);
  const isMarkedForRevision = revisions.some((r) => r.status === 'PENDING');

  const { mutate: markRevision, isPending: isMarking } = useMarkRevision();
  const { mutate: unmarkRevision, isPending: isUnmarking } = useUnmarkRevision();
  const isRevisionPending = isMarking || isUnmarking;

  const handleRevisionToggle = (checked: boolean) => {
    if (checked) {
      markRevision(
        { taskId: task.id },
        {
          onSuccess: () => toast.success('Added to revision queue'),
          onError: () => toast.error('Failed to add to revision queue'),
        },
      );
    } else {
      unmarkRevision(task.id, {
        onSuccess: () => toast.success('Removed from revision queue'),
        onError: () => toast.error('Failed to remove from revision queue'),
      });
    }
  };

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
        rounded-lg border border-border
        bg-surface
        p-4
        transition-all duration-200
        hover:border-border-strong
        hover:shadow-sm
        cursor-pointer
      "
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="h-6 w-6 shrink-0 rounded-full border-2 border-border" />

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-foreground">{task.title}</h3>

          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="ml-6 flex shrink-0 items-center gap-5">
        <StatusChip task={task} />

        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-medium transition-colors duration-200 ${
              isMarkedForRevision ? 'text-blue-500' : 'text-text-muted'
            }`}
          >
            Revision
          </span>

          <Switch
            checked={isMarkedForRevision}
            onChange={handleRevisionToggle}
            disabled={isRevisionPending}
          />
        </div>

        <button
          aria-label="Delete task"
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task.id, {
              onSuccess: () => {
                toast.success('Task deleted');
                onDeleted?.();
              },
              onError: () => toast.error('Failed to delete task'),
            });
          }}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            text-text-muted
            transition-all
            duration-200
            hover:bg-red-500/10
            hover:text-red-500
            disabled:pointer-events-none
            disabled:opacity-40
          "
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
