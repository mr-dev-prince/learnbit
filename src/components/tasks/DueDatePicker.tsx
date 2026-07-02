'use client';

import { CalendarDays, X } from 'lucide-react';

interface DueDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  function setPreset(days: number) {
    const date = new Date();

    date.setDate(date.getDate() + days);

    date.setHours(18);
    date.setMinutes(0);

    onChange(date.toISOString().slice(0, 16));
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <CalendarDays
          size={16}
          style={{
            color: 'var(--primary)',
          }}
        />

        <label className="text-sm font-medium">Due Date</label>
      </div>

      <div className="relative">
        <input
          type="datetime-local"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border px-4 py-3 pr-12 outline-none"
          style={{
            borderColor: 'color-mix(in srgb, var(--border) 72%, transparent)',

            background: 'color-mix(in srgb, var(--background) 12%, transparent)',
          }}
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
        <button
          type="button"
          onClick={() => setPreset(0)}
          className="rounded-full border px-3 py-1 text-xs transition-all hover:scale-105"
          style={{
            borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
          }}
        >
          Today
        </button>

        <button
          type="button"
          onClick={() => setPreset(1)}
          className="rounded-full border px-3 py-1 text-xs transition-all hover:scale-105"
          style={{
            borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
          }}
        >
          Tomorrow
        </button>

        <button
          type="button"
          onClick={() => setPreset(7)}
          className="rounded-full border px-3 py-1 text-xs transition-all hover:scale-105"
          style={{
            borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
          }}
        >
          Next Week
        </button>
      </div>

      <p
        className="mt-3 text-xs"
        style={{
          color: 'color-mix(in srgb, var(--foreground) 60%, transparent)',
        }}
      >
        Optional. Leave empty if the task has no deadline.
      </p>
    </div>
  );
}
