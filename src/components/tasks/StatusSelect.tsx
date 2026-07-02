'use client';

import { CheckCircle2, Circle, Clock3, Archive } from 'lucide-react';

import type { TaskStatus } from '@/types/Task';

interface StatusSelectProps {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
}

const STATUS_OPTIONS: Array<{
  value: TaskStatus;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'TODO',
    label: 'To Do',
    icon: <Circle size={16} />,
  },
  {
    value: 'IN_PROGRESS',
    label: 'In Progress',
    icon: <Clock3 size={16} />,
  },
  {
    value: 'COMPLETED',
    label: 'Completed',
    icon: <CheckCircle2 size={16} />,
  },
  {
    value: 'ARCHIVED',
    label: 'Archived',
    icon: <Archive size={16} />,
  },
];

export default function StatusSelect({ value, onChange }: StatusSelectProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">Status</label>

      <div className="grid grid-cols-2 gap-3">
        {STATUS_OPTIONS.map((status) => {
          const active = value === status.value;

          return (
            <button
              key={status.value}
              type="button"
              onClick={() => onChange(status.value)}
              className="flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{
                borderColor: active
                  ? 'var(--primary)'
                  : 'color-mix(in srgb, var(--border) 70%, transparent)',

                background: active
                  ? 'color-mix(in srgb, var(--primary) 14%, transparent)'
                  : 'color-mix(in srgb, var(--background) 12%, transparent)',
              }}
            >
              <span
                style={{
                  color: active
                    ? 'var(--primary)'
                    : 'color-mix(in srgb, var(--foreground) 65%, transparent)',
                }}
              >
                {status.icon}
              </span>

              <span>{status.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
