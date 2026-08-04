'use client';

import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { CreateHabitModal } from '@/components/habits/CreateHabitModal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { toast } from 'react-hot-toast';
import type { Habit } from '@/types/Habit';

import { buildDateWindow, dayLabel, monthLabel, toLocalDateStr } from '@/utils/habitUtils';
import { HabitDetailsModal } from '@/components/habits/HabitDetailsModal';
import { HeatmapRow, NAME_W } from '@/components/habits/HeatmapRow';
import { HabitStatsCard } from '@/components/habits/HabitStatsCard';
import { HeatmapLegend } from '@/components/habits/HeatmapLegend';
import { EmptyHabits } from '@/components/habits/EmptyHabits';

const WINDOW = 14;

const HabitTracker = () => {
  const { habits, isLoading, createHabit, deleteHabit, logCompletion, undoCompletion } =
    useHabits();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [actingDate, setActingDate] = useState<string | null>(null);
  const [actingDelete, setActingDelete] = useState<Record<string, boolean>>({});
  const [honestyPrompt, setHonestyPrompt] = useState<{ habitId: string; dateStr: string } | null>(
    null,
  );

  const todayStr = useMemo(() => toLocalDateStr(new Date()), []);

  const dateWindow = useMemo(() => buildDateWindow(WINDOW), []);

  const columnHeaders = useMemo(() => {
    return dateWindow.map((d, i) => {
      const prev = i > 0 ? dateWindow[i - 1] : null;
      const showMonth = !prev || monthLabel(prev) !== monthLabel(d);
      return { dateStr: d, day: dayLabel(d), month: monthLabel(d), showMonth };
    });
  }, [dateWindow]);

  const handleCreateHabit = async (title: string, description: string, skipWeekends: boolean) => {
    await createHabit({ title, description: description || null, skipWeekends });
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
      const timezoneOffset = new Date().getTimezoneOffset();
      if (isDone) {
        await undoCompletion({ id: habitId, date: dateStr, timezoneOffset });
        toast.success('Marked as missed');
      } else {
        await logCompletion({ id: habitId, date: dateStr, timezoneOffset });
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
        <div className="flex flex-col gap-6">
          <HabitStatsCard habits={habits} todayStr={todayStr} />

          <div className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                Habit History
              </p>
              <HeatmapLegend />
            </div>

            <div className="px-5 pb-3">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th
                      className="py-2 pr-4 text-left text-[11px] font-bold uppercase tracking-widest text-text-muted"
                      style={{ minWidth: `${NAME_W}px` }}
                    >
                      Habit
                    </th>
                    {columnHeaders.map(({ dateStr, day, month, showMonth }) => (
                      <th
                        key={dateStr}
                        className={`py-2 text-center align-bottom text-[10px] font-semibold tabular-nums ${
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
                      onMissedClick={(habitId, dateStr) => setHonestyPrompt({ habitId, dateStr })}
                      onDelete={handleDeleteHabit}
                      onViewDetails={setSelectedHabit}
                      isDeleting={actingDelete[habit.id] ?? false}
                    />
                  ))}
                </tbody>
              </table>
            </div>
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

      <ConfirmationModal
        isOpen={honestyPrompt !== null}
        onClose={() => setHonestyPrompt(null)}
        onConfirm={() => {
          if (honestyPrompt) {
            handleToggle(honestyPrompt.habitId, honestyPrompt.dateStr, false);
            setHonestyPrompt(null);
          }
        }}
        title="Be honest !"
        description="Did you really complete this ?"
        confirmText="Yes, I did!"
        isPending={false}
      />
    </div>
  );
};

export default HabitTracker;
