'use client';

import { useState } from 'react';
import { CalendarOff, ClipboardList, Plus } from 'lucide-react';

import type { Task } from '@/types/Task';
import { useTasks } from '@/hooks/useTasks';
import { filterTasksByPeriod, type TaskFilterPeriod } from '@/lib/filterTasks';
import { useAppDispatch } from '@/hooks/useRedux';
import { openQuickAdd } from '@/store/slices/modalSlice';
import TaskElement from './TaskElement';
import TaskViewModal from './TaskViewModal';

function TaskSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-border bg-surface px-4 py-3.5">
      <div className="flex items-start gap-3">
        {/* Status dot */}
        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-border" />
        <div className="flex-1 space-y-2.5">
          {/* Title */}
          <div className="h-4 w-2/3 rounded-md bg-border" />
          {/* Subtitle / meta row */}
          <div className="flex gap-2">
            <div className="h-3 w-16 rounded-md bg-border/70" />
            <div className="h-3 w-20 rounded-md bg-border/70" />
          </div>
        </div>
        {/* Action button placeholder */}
        <div className="h-6 w-16 shrink-0 rounded-lg bg-border/60" />
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 text-primary/40">
        <ClipboardList size={30} strokeWidth={1.5} />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-foreground">No tasks yet</h3>
        <p className="max-w-xs text-sm text-text-muted">
          Add your first task to start tracking your learning progress.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="
          flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5
          text-sm font-semibold text-white shadow-sm transition-all duration-200
          hover:opacity-90 hover:shadow-[0_4px_16px_-4px_rgba(var(--primary-rgb),0.5)]
          active:scale-[0.98]
        "
      >
        <Plus size={15} />
        Add Task
      </button>
    </div>
  );
}

function NoMatchState({ period }: { period: TaskFilterPeriod }) {
  const label: Record<TaskFilterPeriod, string> = {
    Daily: 'today',
    Weekly: 'this week',
    Monthly: 'this month',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8 text-primary/40">
        <CalendarOff size={26} strokeWidth={1.5} />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">No tasks {label[period]}</h3>
        <p className="max-w-xs text-sm text-text-muted">
          Tasks created {label[period]} will appear here.
        </p>
      </div>
    </div>
  );
}

export default function TaskBox({ filter }: { filter: TaskFilterPeriod }) {
  const { data: tasks, isPending } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const dispatch = useAppDispatch();

  if (isPending) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!tasks || 0 === tasks.length) {
    return (
      <div>
        <EmptyState onAdd={() => dispatch(openQuickAdd())} />
      </div>
    );
  }

  const filteredTasks = filterTasksByPeriod(tasks, filter);

  if (filteredTasks.length === 0) {
    return <NoMatchState period={filter} />;
  }

  return (
    <>
      <div className="flex flex-col h-fit rounded-2xl border border-border gap-3 bg-surface p-4">
        {filteredTasks.map((task) => (
          <TaskElement key={task.id} task={task} onClick={() => setSelectedTask(task)} />
        ))}
      </div>

      <TaskViewModal
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        onEdit={(task) => {
          // TODO: open edit modal
          setSelectedTask(null);
        }}
        onDelete={(task) => {
          // TODO: call delete mutation
          setSelectedTask(null);
        }}
      />
    </>
  );
}
