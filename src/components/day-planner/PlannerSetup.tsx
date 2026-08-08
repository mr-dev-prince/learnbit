import React, { useState } from 'react';
import { Clock, Sun, Moon, Sparkles, CalendarX } from 'lucide-react';

interface PlannerSetupProps {
  date: Date;
  onSetup: (wakeTime: Date, sleepTime: Date) => Promise<void>;
  isReadOnly?: boolean;
}

export default function PlannerSetup({ date, onSetup, isReadOnly = false }: PlannerSetupProps) {
  const [wakeTimeStr, setWakeTimeStr] = useState('07:00');
  const [sleepTimeStr, setSleepTimeStr] = useState('23:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (d: Date) => {
    return d.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    setIsSubmitting(true);

    // Convert HH:mm to actual Date objects on the selected date
    const [wakeH, wakeM] = wakeTimeStr.split(':').map(Number);
    const wakeDate = new Date(date);
    wakeDate.setHours(wakeH, wakeM, 0, 0);

    const [sleepH, sleepM] = sleepTimeStr.split(':').map(Number);
    const sleepDate = new Date(date);
    sleepDate.setHours(sleepH, sleepM, 0, 0);

    // If sleep time is numerically less than or equal to wake time, assume they sleep past midnight
    if (sleepH <= wakeH) {
      sleepDate.setDate(sleepDate.getDate() + 1);
    }

    try {
      await onSetup(wakeDate, sleepDate);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isReadOnly) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
        <div className="flex max-w-md flex-col items-center text-center space-y-4 rounded-xl border border-border bg-surface p-8 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-text-muted border border-border">
            <CalendarX size={28} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-foreground">No Day Plan Created</h2>
            <p className="text-xs text-text-muted">
              No schedule or activities were logged for {formatDate(date)}. Past days cannot be
              modified or set up retroactively.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
      <div className="flex max-w-lg flex-col items-center text-center space-y-6">
        {/* Brand Icon Badge */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm border border-primary/20">
          <Clock size={32} />
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
            <Sparkles size={12} className="text-primary" />
            Day Setup
          </div>
          <h2
            className="text-3xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-brand)' }}
          >
            Structure Your Day
          </h2>
          <p className="text-sm text-text-muted max-w-md">
            Define your waking schedule to automatically calculate available hours for your
            activities.
          </p>
        </div>

        {/* Setup Form Card */}
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-xl border border-border bg-surface p-6 shadow-sm space-y-5 text-left"
        >
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sun size={16} className="text-amber-500" />
              Wake-up Time
            </label>
            <input
              type="time"
              required
              value={wakeTimeStr}
              onChange={(e) => setWakeTimeStr(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Moon size={16} className="text-indigo-500" />
              Sleep Time
            </label>
            <input
              type="time"
              required
              value={sleepTimeStr}
              onChange={(e) => setSleepTimeStr(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Day Plan...' : 'Create Day Plan'}
          </button>
        </form>
      </div>
    </div>
  );
}
