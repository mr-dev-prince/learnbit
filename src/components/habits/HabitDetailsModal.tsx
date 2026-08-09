import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import type { Habit } from '@/types/Habit';
import { toLocalDateStr } from '@/utils/habitUtils';

export function HabitDetailsModal({
  isOpen,
  onClose,
  habit,
}: {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentDate(new Date());
      setIsDescriptionExpanded(false);
    }
  }, [isOpen]);

  if (!isOpen || !habit) return null;

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() - 1);
      return d;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + 1);
      return d;
    });
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startWeekday = firstDayOfMonth.getDay();

  const todayStr = toLocalDateStr(new Date());
  const createdDay = toLocalDateStr(new Date(habit.createdAt));
  const logSet = new Set((habit.logs ?? []).map((l) => l.date.split('T')[0]));

  const calendarCells = [];
  for (let i = 0; i < startWeekday; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-2 backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div
        className="animate-in fade-in-0 zoom-in-[0.97] slide-in-from-bottom-3 relative flex w-full max-w-md flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--primary) 15%, transparent), transparent)',
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

        <div className="relative p-6 max-h-[80vh] overflow-y-auto">
          {habit.description && (
            <div className="mb-6 rounded-lg border border-border bg-surface-muted/30 p-3 transition-all">
              <button
                type="button"
                onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-text-muted hover:text-foreground transition-colors"
              >
                <span>Description</span>
                <span className="flex items-center gap-1 text-xs font-medium text-primary">
                  {isDescriptionExpanded ? 'Hide' : 'Show'}
                  {isDescriptionExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </button>

              {isDescriptionExpanded && (
                <p className="mt-2.5 border-t border-border/50 pt-2.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {habit.description}
                </p>
              )}
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                History
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevMonth}
                  className="rounded-md p-1.5 text-text-muted transition-all hover:bg-surface-muted hover:text-foreground"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold min-w-24 text-center">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="rounded-md p-1.5 text-text-muted transition-all hover:bg-surface-muted hover:text-foreground"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2"
                >
                  {day}
                </div>
              ))}

              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-8" />;
                }

                // Format as YYYY-MM-DD
                const d = new Date(currentYear, currentMonth, day);
                const dateStr = toLocalDateStr(d);

                const isFuture = dateStr > todayStr;
                const isBeforeCreation = dateStr < createdDay;
                const isDone = logSet.has(dateStr);
                const isToday = dateStr === todayStr;
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const isSkipped = habit.skipWeekends && isWeekend && !isDone;

                let stateClass = '';
                let stateChar = '';

                if (isBeforeCreation || isFuture) {
                  stateClass = isBeforeCreation ? 'bg-surface-muted/30' : 'bg-surface-muted/50';
                  stateChar = '';
                } else if (isDone) {
                  stateClass =
                    'bg-green-500/20 text-green-600 dark:bg-green-500/25 dark:text-green-400';
                  stateChar = '✓';
                } else if (isSkipped) {
                  stateClass = 'bg-surface-muted/40 text-text-muted opacity-70';
                  stateChar = '-';
                } else {
                  // Missed
                  stateClass = 'bg-red-500/15 text-red-500 dark:bg-red-500/20 dark:text-red-400';
                  stateChar = '✗';
                }

                return (
                  <div key={dateStr} className="flex flex-col items-center justify-center p-1">
                    <span
                      className={`text-[10px] mb-1 font-medium ${isToday ? 'text-primary font-bold' : 'text-text-muted'}`}
                    >
                      {day}
                    </span>
                    <div
                      title={dateStr}
                      className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-bold ${stateClass} ${isToday ? 'ring-2 ring-primary ring-offset-1 ring-offset-background' : ''}`}
                    >
                      {stateChar}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-border pt-4 mt-2">
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
