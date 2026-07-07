'use client';

import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  Search,
  SortAsc,
  SortDesc,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useUpdateTask } from '@/hooks/useTasks';
import TaskViewModal from '@/components/ui/TaskViewModal';
import type { Task } from '@/types/Task';
import toast from 'react-hot-toast';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* -------------------------------------------------------------------------- */
/*                              Stat pill                                     */
/* -------------------------------------------------------------------------- */
function StatPill({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </p>
        <p className="text-2xl font-black text-foreground tabular-nums">{value}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           Completed task card                              */
/* -------------------------------------------------------------------------- */
function CompletedCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="
        group flex cursor-pointer items-start gap-4
        rounded-2xl border border-border
        bg-surface p-5
        transition-all duration-200
        hover:border-(--completed-text)/20
        hover:shadow-sm
      "
    >
      {/* Check icon */}
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--completed-bg) text-(--completed-text)">
        <CheckCircle2 size={17} strokeWidth={2.5} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-(--completed-text)">
          {task.title}
        </h3>

        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">{task.description}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            Completed {timeAgo(task.updatedAt)}
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              Due {formatDate(task.dueDate)}
            </span>
          )}
          {task.notes && (
            <span className="flex items-center gap-1">
              <FileText size={11} />
              Has notes
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Empty state                                   */
/* -------------------------------------------------------------------------- */
function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/6 text-primary/30">
        {hasFilter ? (
          <Search size={28} strokeWidth={1.5} />
        ) : (
          <Sparkles size={28} strokeWidth={1.5} />
        )}
      </div>
      <h3 className="mb-1.5 text-xl font-semibold text-foreground/80">
        {hasFilter ? 'No matches found' : 'Nothing completed yet'}
      </h3>
      <p className="text-sm text-text-muted/60">
        {hasFilter
          ? 'Try a different search term.'
          : 'Mark tasks as Completed and they will appear here.'}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Page                                      */
/* -------------------------------------------------------------------------- */
type SortKey = 'recent' | 'oldest' | 'alpha';

export default function CompletedPage() {
  const { data: tasks = [], isLoading } = useTasks();
  const { mutate: updateTask } = useUpdateTask();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('recent');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const completed = useMemo(() => {
    let list = tasks.filter((t) => t.status === 'COMPLETED');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q),
      );
    }

    switch (sort) {
      case 'recent':
        list = [...list].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        break;
      case 'oldest':
        list = [...list].sort(
          (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        );
        break;
      case 'alpha':
        list = [...list].sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return list;
  }, [tasks, search, sort]);

  const totalCompleted = tasks.filter((t) => t.status === 'COMPLETED').length;
  const completedThisWeek = useMemo(() => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return tasks.filter((t) => t.status === 'COMPLETED' && new Date(t.updatedAt) >= startOfWeek)
      .length;
  }, [tasks]);

  const handleEdit = (updated: Task) => {
    updateTask(
      {
        id: updated.id,
        payload: {
          title: updated.title,
          description: updated.description,
          notes: updated.notes,
          resourceLinks: updated.resourceLinks,
          dueDate: updated.dueDate,
          status: updated.status,
        },
      },
      {
        onSuccess: () => toast.success('Task updated'),
        onError: () => toast.error('Failed to update task'),
      },
    );
  };

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="p-2">
        <h1 className="mb-1.5 text-3xl font-bold font-sans">Completed</h1>
        <p className="text-sm text-text-muted">Your learning milestones and finished tasks</p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatPill
          icon={<CheckCircle2 size={17} className="text-(--completed-text)" />}
          label="Total"
          value={totalCompleted}
          color="bg-[var(--completed-bg)]"
        />
        <StatPill
          icon={<Sparkles size={17} className="text-primary" />}
          label="This week"
          value={completedThisWeek}
          color="bg-primary/10"
        />
        <StatPill
          icon={<Calendar size={17} className="text-text-muted" />}
          label="All tasks"
          value={tasks.length}
          color="bg-surface-muted"
        />
      </div>

      {/* ── Controls ── */}
      {totalCompleted > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search
              size={14}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted/60"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search completed tasks…"
              className="
                w-full rounded-xl border border-border bg-surface
                py-2.5 pl-9 pr-4 text-sm text-foreground
                outline-none placeholder:text-text-muted/40
                transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10
              "
            />
          </div>

          {/* Sort */}
          <div className="flex gap-1 rounded-xl border border-border bg-surface-muted p-1">
            {(
              [
                { key: 'recent', label: 'Recent', icon: <SortDesc size={13} /> },
                { key: 'oldest', label: 'Oldest', icon: <SortAsc size={13} /> },
                { key: 'alpha', label: 'A–Z', icon: null },
              ] as { key: SortKey; label: string; icon: React.ReactNode }[]
            ).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                className={`
                  flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200
                  ${sort === key ? 'bg-surface text-foreground shadow-sm' : 'text-text-muted hover:text-foreground'}
                `}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Task list ── */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : completed.length === 0 ? (
        <EmptyState hasFilter={!!search.trim()} />
      ) : (
        <div className="space-y-3">
          {completed.map((task) => (
            <CompletedCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
          ))}
        </div>
      )}

      {/* ── Task detail modal ── */}
      <TaskViewModal
        task={selectedTask}
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        onEdit={handleEdit}
      />
    </div>
  );
}
