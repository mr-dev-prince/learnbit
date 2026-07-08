'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2, Flame, Plus, Sparkles, Trash2, Info, X } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { CreateHabitModal } from '@/components/habits/CreateHabitModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { toast } from 'react-hot-toast';
import type { Habit } from '@/types/Habit';

function toLocalDateStr(d: Date): string {
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().split('T')[0];
}

function HabitDetailsModal({
  isOpen,
  onClose,
  habit,
}: {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
}) {
  if (!isOpen || !habit) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-2 backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
    >
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0 cursor-default" />
      <div
        className="animate-in fade-in-0 zoom-in-[0.97] slide-in-from-bottom-3 relative flex w-full max-w-md flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 15%, transparent), transparent)'
          }}
        />
        <div className="relative flex shrink-0 items-start justify-between border-b border-border bg-surface px-6 py-5">
          <h2 className="text-xl font-bold font-sans text-foreground">{habit.title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-border p-2 transition-all duration-200 hover:bg-surface-hover hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative p-6">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
            Description
          </h3>
          {habit.description ? (
            <p className="mb-6 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {habit.description}
            </p>
          ) : (
            <p className="mb-6 text-sm italic text-text-muted opacity-60">
              No description provided.
            </p>
          )}

          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildDateWindow(days: number): string[] {
  const result: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push(toLocalDateStr(d));
  }
  return result;
}

function dayLabel(dateStr: string): string {
  return String(new Date(dateStr + 'T12:00:00').getDate());
}

function monthLabel(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleString('default', { month: 'short' });
}

function calcStreak(habit: Habit, dateWindow: string[]): number {
  const logSet = new Set((habit.logs ?? []).map((l) => l.date.split('T')[0]));
  let streak = 0;
  for (let i = dateWindow.length - 1; i >= 0; i--) {
    if (logSet.has(dateWindow[i])) streak++;
    else break;
  }
  return streak;
}


const WINDOW = 14; 

interface HeatmapRowProps {
  habit: Habit;
  dateWindow: string[];
  todayStr: string;
  actingDate: string | null; 
  onToggle: (habitId: string, dateStr: string, currentlyDone: boolean) => void;
  onDelete: (habitId: string) => void;
  onViewDetails: (habit: Habit) => void;
  isDeleting: boolean;
}

function HeatmapRow({
  habit,
  dateWindow,
  todayStr,
  actingDate,
  onToggle,
  onDelete,
  onViewDetails,
  isDeleting,
}: HeatmapRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const logSet = useMemo(
    () => new Set((habit.logs ?? []).map((l) => l.date.split('T')[0])),
    [habit.logs],
  );

  const streak = useMemo(() => calcStreak(habit, dateWindow), [habit, dateWindow]);
  const createdDay = toLocalDateStr(new Date(habit.createdAt));

  return (
    <tr className="group border-b border-border last:border-0">
      <td className="w-48 min-w-44 max-w-52 py-3 pr-4 align-middle">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{habit.title}</p>
            {streak > 0 && (
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-semibold text-orange-500">
                <Flame size={9} />
                {streak}d streak
              </span>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={() => onViewDetails(habit)}
              aria-label="View habit details"
              className="rounded-md p-1.5 text-text-muted transition-all hover:bg-primary/10 hover:text-primary"
            >
              <Info size={13} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              aria-label="Delete habit"
              className="rounded-md p-1.5 text-text-muted transition-all hover:bg-red-500/10 hover:text-red-500 disabled:pointer-events-none disabled:opacity-30"
            >
              <Trash2 size={13} />
            </button>
          </div>

          <ConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={() => {
              onDelete(habit.id);
              setShowDeleteConfirm(false);
            }}
            title="Delete Habit"
            description="Are you sure you want to delete this habit ? This action cannot be undone."
            confirmText="Delete"
            isPending={isDeleting}
          />
        </div>
      </td>

      {dateWindow.map((dateStr) => {
        const isFuture = dateStr > todayStr;
        const isBeforeCreation = dateStr < createdDay;
        const isDone = logSet.has(dateStr);
        const isToday = dateStr === todayStr;
        const key = `${habit.id}|${dateStr}`;
        const acting = actingDate === key;

        if (isBeforeCreation || isFuture) {
          return (
            <td key={dateStr} className="px-0.5 py-3 text-center align-middle">
              <div
                className={`mx-auto h-7 w-7 rounded-md ${isBeforeCreation ? 'bg-surface-muted/30' : 'bg-surface-muted/50'} ${isToday ? 'ring-1 ring-primary/50' : ''}`}
              />
            </td>
          );
        }

        return (
          <td key={dateStr} className="px-0.5 py-3 text-center align-middle">
            <button
              disabled={acting}
              onClick={() => onToggle(habit.id, dateStr, isDone)}
              title={isDone ? `Undo: ${dateStr}` : `Mark done: ${dateStr}`}
              className={`
                mx-auto flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold
                transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95
                ${acting ? 'animate-pulse opacity-60' : ''}
                ${isToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}
                ${
                  isDone
                    ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30 dark:bg-green-500/25 dark:text-green-400'
                    : 'bg-red-500/15 text-red-500 hover:bg-red-500/25 dark:bg-red-500/20 dark:text-red-400'
                }
              `}
            >
              {isDone ? '✓' : '✗'}
            </button>
          </td>
        );
      })}
    </tr>
  );
}

function HabitStatsCard({ habits, todayStr }: { habits: Habit[]; todayStr: string }) {
  const dateWindow = useMemo(() => buildDateWindow(WINDOW), []);

  const completedToday = habits.filter((h) =>
    h.logs?.some((l) => l.date.split('T')[0] === todayStr),
  ).length;

  const totalToday = habits.length;

  const allStreaks = habits.map((h) => calcStreak(h, dateWindow));
  const bestStreak = allStreaks.length ? Math.max(...allStreaks) : 0;
  const totalCompletions = habits.reduce((acc, h) => acc + (h.logs?.length ?? 0), 0);

  const stats = [
    {
      label: "Today's Progress",
      value: `${completedToday}/${totalToday}`,
      color: 'text-foreground',
      bg: 'bg-surface-muted',
      icon: <CheckCircle2 size={15} className="text-text-muted" />,
    },
    {
      label: 'Best Streak',
      value: `${bestStreak}d`,
      color: 'text-orange-500',
      bg: 'bg-orange-500/8',
      icon: <Flame size={15} className="text-orange-500/70" />,
    },
    {
      label: 'Total Completions',
      value: totalCompletions,
      color: 'text-[var(--completed-text)]',
      bg: 'bg-[var(--completed-bg)]',
      icon: <Sparkles size={15} className="text-(--completed-text)/70" />,
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-muted">
        <Sparkles size={12} />
        Overview
      </p>
      <div className="space-y-2.5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex items-center justify-between rounded-lg px-4 py-3 ${s.bg}`}
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

function HeatmapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded bg-green-500/20" />
        <span>Completed</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded bg-red-500/15" />
        <span>Missed</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded bg-surface-muted/50" />
        <span>N/A</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded ring-2 ring-primary" />
        <span>Today</span>
      </div>
    </div>
  );
}

function EmptyHabits({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/6 text-primary/30">
        <Flame size={28} strokeWidth={1.5} />
      </div>
      <h3 className="mb-1.5 text-xl font-semibold text-foreground/80">No habits yet</h3>
      <p className="mb-6 text-sm text-text-muted/60">
        Start tracking your daily habits to build consistency.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white
          transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Plus size={16} />
        Add your first habit
      </button>
    </div>
  );
}

const HabitTracker = () => {
  const { habits, isLoading, createHabit, deleteHabit, logCompletion, undoCompletion } =
    useHabits();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [actingDate, setActingDate] = useState<string | null>(null);
  const [actingDelete, setActingDelete] = useState<Record<string, boolean>>({});

  const todayStr = useMemo(() => toLocalDateStr(new Date()), []);
  const dateWindow = useMemo(() => buildDateWindow(WINDOW), []);

  const columnHeaders = useMemo(() => {
    return dateWindow.map((d, i) => {
      const prev = i > 0 ? dateWindow[i - 1] : null;
      const showMonth = !prev || monthLabel(prev) !== monthLabel(d);
      return { dateStr: d, day: dayLabel(d), month: monthLabel(d), showMonth };
    });
  }, [dateWindow]);

  const handleCreateHabit = async (title: string, description: string) => {
    await createHabit({ title, description: description || null });
    toast.success('Habit created successfully');
  };

  const handleDeleteHabit = async (habitId: string) => {
    setActingDelete((p) => ({ ...p, [habitId]: true }));
    try {
      await deleteHabit(habitId);
      toast.success('Habit deleted');
    } catch {
      toast.error('Failed to delete habit');
    } finally {
      setActingDelete((p) => ({ ...p, [habitId]: false }));
    }
  };

  const handleToggle = async (habitId: string, dateStr: string, isDone: boolean) => {
    const key = `${habitId}|${dateStr}`;
    setActingDate(key);
    try {
      if (isDone) {
        await undoCompletion({ id: habitId, date: dateStr });
        toast.success('Marked as missed');
      } else {
        await logCompletion({ id: habitId, date: dateStr });
        toast.success(dateStr === todayStr ? 'Habit completed for today! 🎉' : 'Day marked ✓');
      }
    } catch {
      toast.error('Failed to update habit');
    } finally {
      setActingDate(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex w-full justify-between items-center p-2">
          <div className="space-y-2">
            <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-muted" />
            <div className="h-4 w-56 animate-pulse rounded bg-surface-muted" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-surface-muted" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-lg border border-border bg-surface"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 p-2">
        <div>
          <h1 className="text-3xl font-bold font-sans">Habit Tracker</h1>
          <p className="mt-1 text-sm text-text-muted">
            Build consistent habits — track your daily progress below.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2.5
            text-sm font-semibold text-white transition-all duration-200
            hover:opacity-90 hover:shadow-[0_4px_16px_-4px_rgba(246,73,0,0.4)]
            active:scale-[0.98]"
        >
          <Plus size={16} />
          New Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <EmptyHabits onAdd={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="rounded-lg border border-border bg-surface min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                Last {WINDOW} Days
              </p>
              <HeatmapLegend />
            </div>
            <div className="overflow-x-auto px-5 py-3">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-48 min-w-44 py-2 pr-4 text-left text-[11px] font-bold uppercase tracking-widest text-text-muted">
                      Habit
                    </th>
                    {columnHeaders.map(({ dateStr, day, month, showMonth }) => (
                      <th
                        key={dateStr}
                        className={`px-0.5 py-2 text-center align-bottom text-[10px] font-semibold tabular-nums ${
                          dateStr === todayStr ? 'text-primary' : 'text-text-muted'
                        }`}
                      >
                        {showMonth && (
                          <div className="mb-0.5 text-[9px] uppercase tracking-wider opacity-60">
                            {month}
                          </div>
                        )}
                        <div>{day}</div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {habits.map((habit) => (
                    <HeatmapRow
                      key={habit.id}
                      habit={habit}
                      dateWindow={dateWindow}
                      todayStr={todayStr}
                      actingDate={actingDate}
                      onToggle={handleToggle}
                      onDelete={handleDeleteHabit}
                      onViewDetails={setSelectedHabit}
                      isDeleting={actingDelete[habit.id] ?? false}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <HabitStatsCard habits={habits} todayStr={todayStr} />
          </div>
        </div>
      )}

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateHabit}
      />

      <HabitDetailsModal
        isOpen={selectedHabit !== null}
        onClose={() => setSelectedHabit(null)}
        habit={selectedHabit}
      />
    </div>
  );
};

export default HabitTracker;
