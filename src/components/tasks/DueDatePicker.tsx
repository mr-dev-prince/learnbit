'use client';

import { useEffect } from 'react';
import { CalendarDays, X } from 'lucide-react';

interface DueDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

function getCurrentDateTime() {
  const date = new Date();

  const timezoneOffset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

export default function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  useEffect(() => {
    if (!value) {
      onChange(getCurrentDateTime());
    }
  }, [onChange, value]);

  function setPreset(days: number) {
    const date = new Date();

    date.setDate(date.getDate() + days);
    date.setHours(18, 0, 0, 0);

    const timezoneOffset = date.getTimezoneOffset() * 60000;

    onChange(new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16));
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <CalendarDays size={16} className="text-primary" />
        <label className="text-sm font-medium">Due Date</label>
      </div>

      <div className="relative">
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 outline-none"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 transition-colors hover:bg-red-500/10"
          >
            <X size={16} className="text-red-500" />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {[
          ['Today', 0],
          ['Tomorrow', 1],
          ['Next Week', 7],
        ].map(([label, days]) => (
          <button
            key={label}
            type="button"
            onClick={() => setPreset(days as number)}
            className="rounded-full border border-border px-3 py-1 text-xs transition-all hover:scale-105 hover:bg-surface-hover"
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-text-muted">
        Optional. Leave empty if the task has no deadline.
      </p>
    </div>
  );
}
