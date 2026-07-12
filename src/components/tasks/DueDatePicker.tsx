'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

interface DueDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse the current value to get initial calendar month, or use today
  const initialDate = value ? new Date(value) : new Date();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );
  
  // Track selected time (HH:mm)
  const [timeValue, setTimeValue] = useState(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      }
    }
    return '18:00';
  });

  // Update current month when value changes externally (e.g., autofill)
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTimeValue(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
      }
    }
  }, [value]);

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const [hours, minutes] = timeValue.split(':').map(Number);
    newDate.setHours(hours || 18, minutes || 0, 0, 0);
    onChange(newDate.toISOString());
    setIsOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeValue(e.target.value);
    if (value) {
      // update existing date with new time
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        const [hours, minutes] = e.target.value.split(':').map(Number);
        d.setHours(hours, minutes, 0, 0);
        onChange(d.toISOString());
      }
    }
  };

  const setPreset = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(18, 0, 0, 0);
    onChange(date.toISOString());
    setIsOpen(false);
  };

  // Calendar logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const padding = Array.from({ length: firstDayOfMonth }, () => null);

  const formatDisplay = (isoString: string) => {
    if (!isoString) return 'Set due date...';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Set due date...';
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        hour: 'numeric',
        minute: '2-digit',
      }).format(d);
    } catch {
      return 'Set due date...';
    }
  };

  return (
    <div className="relative w-full">
      <div className="mb-2 flex items-center gap-2">
        <CalendarDays size={16} className="text-primary" />
        <label className="text-sm font-medium">Due Date</label>
      </div>

      <div className="relative group w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 outline-none text-left transition-colors
            ${isOpen ? 'ring-2 ring-primary/20 border-primary/40' : 'hover:border-primary/40'}
          `}
        >
          <span className={value ? 'text-foreground font-medium' : 'text-text-muted italic'}>
            {formatDisplay(value)}
          </span>
        </button>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition-colors hover:bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="mt-2 w-full rounded-xl border border-border bg-surface shadow-md p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors text-text-muted"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold text-sm">
              {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth)}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="p-1.5 hover:bg-surface-hover rounded-lg transition-colors text-text-muted"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-text-muted uppercase tracking-wider py-1">
                {day}
              </div>
            ))}
            {padding.map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const date = new Date(year, month, day);
              const isSelected = value && new Date(value).toDateString() === date.toDateString();
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`
                    flex h-8 w-full items-center justify-center rounded-lg text-sm transition-all duration-200
                    ${isSelected ? 'bg-primary text-white font-bold shadow-md' : 
                      isToday ? 'border border-primary/30 text-primary font-semibold hover:bg-primary/10' : 
                      'hover:bg-surface-hover text-foreground/80'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            <Clock size={15} className="text-text-muted" />
            <input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="bg-surface-muted border border-border rounded-md px-2 py-1 text-sm font-medium outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 text-foreground transition-all"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-border">
            {[
              ['Today', 0],
              ['Tomorrow', 1],
              ['Next Week', 7],
            ].map(([label, days]) => (
              <button
                key={label}
                type="button"
                onClick={() => setPreset(days as number)}
                className="rounded-full border border-border px-3 py-1.5 text-xs transition-all hover:scale-105 hover:bg-surface-hover hover:text-foreground text-text-muted"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-text-muted">
        Optional. Leave empty if the task has no deadline.
      </p>
    </div>
  );
}
