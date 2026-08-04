import React, { useState, useMemo } from 'react';
import { Flame, Info, Trash2 } from 'lucide-react';
import type { Habit } from '@/types/Habit';
import { calcStreak, toLocalDateStr } from '@/utils/habitUtils';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export const NAME_W = 220; 

interface HeatmapRowProps {
  habit: Habit;
  dateWindow: string[];
  todayStr: string;
  actingDate: string | null;
  onToggle: (habitId: string, dateStr: string, currentlyDone: boolean) => void;
  onMissedClick: (habitId: string, dateStr: string) => void;
  onDelete: (habitId: string) => void;
  onViewDetails: (habit: Habit) => void;
  isDeleting: boolean;
}

export function HeatmapRow({
  habit,
  dateWindow,
  todayStr,
  actingDate,
  onToggle,
  onMissedClick,
  onDelete,
  onViewDetails,
  isDeleting,
}: HeatmapRowProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const logSet = useMemo(
    () => new Set((habit.logs ?? []).map((l) => l.date.split('T')[0])),
    [habit.logs],
  );
  const streak = useMemo(() => calcStreak(habit), [habit]);
  const createdDay = toLocalDateStr(new Date(habit.createdAt));

  return (
    <tr className="group border-b border-border last:border-0">
      {/* ── Name column ── */}
      <td className="py-3 pr-4 align-middle" style={{ minWidth: `${NAME_W}px` }}>
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{habit.title}</p>
          </div>

          {streak > 0 ? (
            <div className="shrink-0 flex items-center bg-linear-to-tr from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-full px-2 py-0.5">
              <Flame size={10} className="text-orange-500 mr-1" />
              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">{streak}</span>
            </div>
          ) : (
            <div className="shrink-0 flex items-center bg-surface-muted/30 border border-border/50 rounded-full px-2 py-0.5">
              <Flame size={10} className="text-text-muted/50 mr-1" />
              <span className="text-[10px] font-bold text-text-muted/50">0</span>
            </div>
          )}

          <div className="flex shrink-0 items-center gap-0.5 transition-opacity">
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
            onConfirm={() => { onDelete(habit.id); setShowDeleteConfirm(false); }}
            title="Delete Habit"
            description="Are you sure you want to delete this habit ? This action cannot be undone."
            confirmText="Delete"
            isPending={isDeleting}
          />
        </div>
      </td>

      {/* ── Date marker cells ── */}
      {dateWindow.map((dateStr) => {
        const isFuture = dateStr > todayStr;
        const isBeforeCreation = dateStr < createdDay;
        const isDone = logSet.has(dateStr);
        const isToday = dateStr === todayStr;
        const isPast = dateStr < todayStr;
        const key = `${habit.id}|${dateStr}`;
        const acting = actingDate === key;

        if (isBeforeCreation || isFuture) {
          return (
            <td key={dateStr} className="py-3 text-center align-middle">
              <div
                className={`mx-auto h-7 w-7 rounded-md ${
                  isBeforeCreation ? 'bg-surface-muted/30' : 'bg-surface-muted/50'
                } ${isToday ? 'ring-1 ring-primary/50' : ''}`}
              />
            </td>
          );
        }

        const isWeekend = (() => { const d = new Date(dateStr); return d.getDay() === 0 || d.getDay() === 6; })();
        const isSkipped = habit.skipWeekends && isWeekend && !isDone;

        return (
          <td key={dateStr} className="py-3 text-center align-middle">
            <button
              disabled={acting}
              onClick={() => {
                if (isPast && !isDone) {
                  onMissedClick(habit.id, dateStr);
                } else {
                  onToggle(habit.id, dateStr, isDone);
                }
              }}
              title={
                isPast
                  ? isDone ? `Completed on ${dateStr}` : isSkipped ? `Skipped on ${dateStr}` : `Missed on ${dateStr}`
                  : isDone ? `Undo: ${dateStr}` : `Mark done: ${dateStr}`
              }
              className={`
                mx-auto flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold
                transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95
                ${acting ? 'animate-pulse opacity-60' : ''}
                ${isToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}
                ${
                  isDone
                    ? 'bg-green-500/20 text-green-600 dark:bg-green-500/25 dark:text-green-400'
                    : isSkipped
                      ? 'bg-surface-muted/40 text-text-muted opacity-70 hover:bg-surface-muted/60 hover:opacity-100'
                      : 'bg-red-500/15 text-red-500 dark:bg-red-500/20 dark:text-red-400 hover:bg-red-500/25'
                }
              `}
            >
              {isDone ? '✓' : isSkipped ? '-' : '✗'}
            </button>
          </td>
        );
      })}
    </tr>
  );
}
