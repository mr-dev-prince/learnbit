'use client';

import toast from 'react-hot-toast';

import { useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  RotateCcw,
  SkipForward,
  Sparkles,
  Timer,
} from 'lucide-react';
import { useRevisionQueue, useUpdateRevision } from '@/hooks/useRevisions';
import type { PendingRevisionWithTask } from '@/services/revision.service';

function formatScheduledAt(iso: string): { label: string; overdue: boolean; today: boolean } {
  const scheduled = new Date(iso);
  const now = new Date();
  const diffMs = scheduled.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const abs = Math.abs(diffDays);
    return {
      label: abs === 1 ? 'Overdue by 1 day' : `Overdue by ${abs} days`,
      overdue: true,
      today: false,
    };
  }
  if (diffDays === 0) return { label: 'Due today', overdue: false, today: true };
  if (diffDays === 1) return { label: 'Due tomorrow', overdue: false, today: false };
  return {
    label: `Due in ${diffDays} days`,
    overdue: false,
    today: false,
  };
}

function RevisionCard({ revision }: { revision: PendingRevisionWithTask }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(revision.notes ?? '');
  const [intervalDays, setIntervalDays] = useState(revision.intervalDays);
  const [scheduledAt, setScheduledAt] = useState(
    revision.scheduledAt ? revision.scheduledAt.slice(0, 10) : '',
  );

  const { mutate: updateRevision, isPending } = useUpdateRevision();

  const due = formatScheduledAt(revision.scheduledAt);

  const handleComplete = () => {
    updateRevision(
      {
        id: revision.id,
        payload: {
          status: 'COMPLETED',
          notes: notes.trim() || null,
          intervalDays,
          scheduledAt: scheduledAt || null,
        },
      },
      {
        onSuccess: () => toast.success('Revision completed'),
        onError: () => toast.error('Failed to complete revision'),
      },
    );
  };

  const handleSkip = () => {
    updateRevision(
      {
        id: revision.id,
        payload: { status: 'SKIPPED', notes: notes.trim() || null },
      },
      {
        onSuccess: () => toast('Revision skipped', { icon: '⏭️' }),
        onError: () => toast.error('Failed to skip revision'),
      },
    );
  };

  const handleSaveNotes = () => {
    updateRevision(
      {
        id: revision.id,
        payload: {
          notes: notes.trim() || null,
          intervalDays,
          scheduledAt: scheduledAt || null,
        },
      },
      {
        onSuccess: () => toast.success('Notes saved'),
        onError: () => toast.error('Failed to save notes'),
      },
    );
  };

  return (
    <div
      className={`
        rounded-2xl border bg-surface transition-all duration-300
        ${due.overdue ? 'border-red-500/40 shadow-[0_0_0_1px_rgba(239,68,68,0.08)]' : 'border-border'}
      `}
    >
      <div className="flex items-start gap-4 p-5">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
          #{revision.revisionNumber + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">{revision.task.title}</h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                due.overdue
                  ? 'bg-red-500/10 text-red-500'
                  : due.today
                    ? 'bg-amber-400/15 text-amber-500'
                    : 'bg-(--todo-bg) text-(--todo-text)'
              }`}
            >
              <CalendarDays size={11} />
              {due.label}
            </span>
          </div>

          {revision.task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-text-muted">{revision.task.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Timer size={12} />
              Every {intervalDays}d
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw size={12} />
              Revision {revision.revisionNumber + 1}
            </span>
            {revision.notes && (
              <span className="flex items-center gap-1">
                <FileText size={12} />
                Has notes
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleSkip}
            disabled={isPending}
            title="Skip this revision"
            className="
              flex items-center gap-1.5 rounded-lg border border-border
              bg-transparent px-3 py-1.5 text-xs font-medium text-text-muted
              transition-all duration-200
              hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-500
              disabled:pointer-events-none disabled:opacity-40
            "
          >
            <SkipForward size={13} />
            Skip
          </button>

          <button
            onClick={handleComplete}
            disabled={isPending}
            className="
              flex items-center gap-1.5 rounded-lg bg-(--completed-bg)
              px-3 py-1.5 text-xs font-semibold text-(--completed-text)
              transition-all duration-200
              hover:opacity-80 active:scale-[0.98]
              disabled:pointer-events-none disabled:opacity-40
            "
          >
            <CheckCircle2 size={13} />
            Done
          </button>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="
              flex h-7 w-7 items-center justify-center rounded-lg
              text-text-muted transition-all duration-200
              hover:bg-surface-hover hover:text-foreground
            "
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                <FileText size={12} />
                Revision Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="What did you remember? What was tricky?"
                className="
                  w-full resize-none rounded-xl border border-border
                  bg-surface-muted px-4 py-3 text-sm leading-6 text-foreground
                  outline-none transition-colors placeholder:text-text-muted/40
                  focus:border-primary/40 focus:ring-2 focus:ring-primary/10
                "
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                <Timer size={12} />
                Next Interval (days)
              </label>
              <input
                type="number"
                min={1}
                value={intervalDays}
                onChange={(e) => setIntervalDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="
                  w-full rounded-xl border border-border bg-surface-muted
                  px-4 py-2.5 text-sm text-foreground outline-none
                  transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10
                "
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                <CalendarDays size={12} />
                Scheduled Date
              </label>
              <input
                type="date"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="
                  w-full rounded-xl border border-border bg-surface-muted
                  px-4 py-2.5 text-sm text-foreground outline-none
                  transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/10
                "
              />
            </div>
          </div>
          {revision.task.notes && (
            <div className="mt-5">
              <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-text-muted">
                <FileText size={12} />
                Task Notes
              </p>
              <div className="rounded-xl border border-border/60 bg-surface-muted/60 px-4 py-3 text-sm leading-6 text-foreground/80">
                <p className="whitespace-pre-wrap">{revision.task.notes}</p>
              </div>
            </div>
          )}
          <div className="mt-4 flex items-center justify-end gap-2.5">
            <button
              onClick={handleSaveNotes}
              disabled={isPending}
              className="
                rounded-lg border border-border bg-transparent px-4 py-2
                text-sm font-medium text-text-muted transition-all duration-200
                hover:bg-surface-hover hover:text-foreground
                disabled:pointer-events-none disabled:opacity-40
              "
            >
              Save
            </button>

            <button
              onClick={handleSkip}
              disabled={isPending}
              className="
                flex items-center gap-1.5 rounded-lg border border-border
                bg-transparent px-4 py-2 text-sm font-medium text-text-muted
                transition-all duration-200
                hover:border-amber-500/30 hover:bg-amber-500/5 hover:text-amber-500
                disabled:pointer-events-none disabled:opacity-40
              "
            >
              <SkipForward size={14} />
              Skip
            </button>

            <button
              onClick={handleComplete}
              disabled={isPending}
              className="
                flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2
                text-sm font-semibold text-white transition-all duration-200
                hover:opacity-90 hover:shadow-[0_4px_16px_-4px_rgba(var(--primary-rgb),0.4)]
                active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50
              "
            >
              <CheckCircle2 size={14} />
              Mark Complete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QueueStatsCard({ revisions }: { revisions: PendingRevisionWithTask[] }) {
  const overdue = revisions.filter((r) => new Date(r.scheduledAt) < new Date()).length;
  const dueToday = revisions.filter((r) => {
    const d = new Date(r.scheduledAt);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }).length;
  const upcoming = revisions.length - overdue - dueToday;

  const stats = [
    {
      label: 'Total',
      value: revisions.length,
      color: 'text-foreground',
      bg: 'bg-surface-muted',
      icon: <BookOpen size={15} className="text-text-muted" />,
    },
    {
      label: 'Overdue',
      value: overdue,
      color: 'text-red-500',
      bg: 'bg-red-500/8',
      icon: <Clock size={15} className="text-red-500/70" />,
    },
    {
      label: 'Due Today',
      value: dueToday,
      color: 'text-amber-500',
      bg: 'bg-amber-400/10',
      icon: <CalendarDays size={15} className="text-amber-500/70" />,
    },
    {
      label: 'Upcoming',
      value: upcoming,
      color: 'text-[var(--completed-text)]',
      bg: 'bg-[var(--completed-bg)]',
      icon: <Sparkles size={15} className="text-(--completed-text)/70" />,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-muted">
        <Sparkles size={12} />
        Queue Overview
      </p>
      <div className="space-y-2.5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex items-center justify-between rounded-xl px-4 py-3 ${s.bg}`}
          >
            <div className="flex items-center gap-2.5">
              {s.icon}
              <span className="text-sm font-medium text-foreground">{s.label}</span>
            </div>
            <span className={`text-xl font-black tabular-nums ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyQueue() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/6 text-primary/30">
        <Sparkles size={28} strokeWidth={1.5} />
      </div>
      <h3 className="mb-1.5 text-xl font-semibold text-foreground/80">Queue is clear!</h3>
      <p className="text-sm text-text-muted/60">
        No pending revisions. Toggle the Revision switch on any task to add it here.
      </p>
    </div>
  );
}

export default function RevisionQueuePage() {
  const { data: revisions = [], isLoading, isError } = useRevisionQueue();
  const [filter, setFilter] = useState<'all' | 'overdue' | 'today' | 'upcoming'>('all');

  const filtered = revisions.filter((r) => {
    if (filter === 'all') return true;
    const d = new Date(r.scheduledAt);
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    const isOverdue = d < now && !isToday;
    if (filter === 'overdue') return isOverdue;
    if (filter === 'today') return isToday;
    if (filter === 'upcoming') return !isOverdue && !isToday;
    return true;
  });

  const FILTERS: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 p-2">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold font-sans">Revision Queue</h1>
          </div>
          <p className="text-sm text-text-muted">
            Review and practice topics scheduled for revision
          </p>
        </div>
        {revisions.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5">
            <Clock size={14} className="text-text-muted" />
            <span className="text-sm font-semibold text-foreground">{revisions.length}</span>
            <span className="text-sm text-text-muted">pending</span>
          </div>
        )}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {revisions.length > 0 && (
            <div className="flex gap-1.5 rounded-xl border border-border bg-surface-muted p-1">
              {FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`
                    flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200
                    ${
                      filter === key
                        ? 'bg-surface text-foreground shadow-sm'
                        : 'text-text-muted hover:text-foreground'
                    }
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-2xl border border-border bg-surface"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 py-16 text-center">
              <p className="font-semibold text-red-500">Failed to load revision queue</p>
              <p className="mt-1 text-sm text-text-muted">Please refresh the page and try again</p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyQueue />
          ) : (
            <div className="space-y-3">
              {filtered.map((revision) => (
                <RevisionCard key={revision.id} revision={revision} />
              ))}
            </div>
          )}
        </div>
        {!isLoading && !isError && revisions.length > 0 && (
          <div className="lg:sticky lg:top-6 lg:self-start">
            <QueueStatsCard revisions={revisions} />
          </div>
        )}
      </div>
    </div>
  );
}
