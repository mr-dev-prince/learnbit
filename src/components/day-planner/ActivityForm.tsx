import React, { useState } from 'react';
import { X, Sparkles, Plus, Minus, Check, Clock, Timer } from 'lucide-react';
import toast from 'react-hot-toast';

interface ActivityFormProps {
  plannerId: string;
  suggestedStartTime: string; // ISO string
  onClose: () => void;
  onSubmit: (payload: {
    plannerId: string;
    title: string;
    notes?: string | null;
    startTime: string;
    endTime: string;
  }) => Promise<void>;
  initialData?: {
    id?: string;
    title: string;
    notes?: string | null;
    durationMinutes: number;
  } | null;
}

export default function ActivityForm({
  plannerId,
  suggestedStartTime,
  onClose,
  onSubmit,
  initialData,
}: ActivityFormProps) {
  const initialDuration = initialData?.durationMinutes || 60;
  const [title, setTitle] = useState(initialData?.title || '');
  const [hours, setHours] = useState(Math.floor(initialDuration / 60));
  const [minutes, setMinutes] = useState(initialDuration % 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalMinutes = Number(hours) * 60 + Number(minutes);

  const formatDurationText = (mins: number) => {
    if (mins <= 0) return '0 mins';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h} ${h === 1 ? 'hr' : 'hrs'} ${m} ${m === 1 ? 'min' : 'mins'}`;
    if (h > 0) return `${h} ${h === 1 ? 'hr' : 'hrs'}`;
    return `${m} ${m === 1 ? 'min' : 'mins'}`;
  };

  const getCalculatedTimeRange = () => {
    if (!suggestedStartTime) return '';
    const start = new Date(suggestedStartTime);
    const end = new Date(start.getTime() + (totalMinutes > 0 ? totalMinutes : 0) * 60000);
    const formatTime = (d: Date) =>
      d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    return `${formatTime(start)} — ${formatTime(end)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (totalMinutes <= 0) {
      toast.error('Duration must be at least 1 minute');
      return;
    }

    const startDate = new Date(suggestedStartTime);
    const endDate = new Date(startDate.getTime() + totalMinutes * 60000);

    setIsSubmitting(true);
    try {
      await onSubmit({
        plannerId,
        title,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save activity';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-md">
      {/* Backdrop overlay click */}
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0" />

      {/* Modal Card */}
      <div className="relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-2xl">
        {/* Gradient Top Accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--primary) 15%, transparent), transparent)',
          }}
        />

        {/* Modal Header */}
        <div className="relative flex shrink-0 items-start justify-between border-b border-border bg-surface px-8 py-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={13} className="text-primary" />
              {initialData ? 'Edit Activity' : 'New Activity'}
            </div>

            <h1 className="mt-3 text-3xl" style={{ fontFamily: 'var(--font-brand)' }}>
              {initialData ? 'Refine your schedule.' : 'Structure your day.'}
            </h1>

            <p className="mt-1.5 max-w-xl text-sm text-text-muted">
              Allocate dedicated time to stay focused and achieve your goals.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-border p-2 transition-all duration-200 hover:bg-surface-hover hover:rotate-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
          <div>
            <label
              htmlFor="activity-title"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Activity Title
            </label>
            <input
              id="activity-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Deep Work: Build UI components"
              className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-foreground placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Duration Section */}
          <div className="rounded-xl border border-border bg-surface-muted/50 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock size={16} className="text-primary" />
                Duration
              </label>

              {/* Time Range Preview Badge */}
              <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-text-muted shadow-sm">
                <Timer size={13} className="text-primary" />
                <span>{getCalculatedTimeRange()}</span>
                <span className="text-foreground font-semibold">
                  ({formatDurationText(totalMinutes)})
                </span>
              </div>
            </div>

            {/* Stepper Inputs for Hours & Minutes */}
            <div className="grid grid-cols-2 gap-3">
              {/* Hours Stepper */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-muted">Hours</span>
                <div className="flex items-center rounded-lg border border-border bg-surface p-1 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <button
                    type="button"
                    onClick={() => setHours((h) => Math.max(0, h - 1))}
                    disabled={hours <= 0 || isSubmitting}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface-hover active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Decrease hours"
                  >
                    <Minus size={15} />
                  </button>

                  <div className="relative flex-1 flex items-center justify-center">
                    <input
                      type="number"
                      min={0}
                      max={24}
                      value={hours}
                      onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      disabled={isSubmitting}
                    />
                    <span className="text-xs font-medium text-text-muted pr-2">hrs</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setHours((h) => Math.min(24, h + 1))}
                    disabled={hours >= 24 || isSubmitting}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface-hover active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Increase hours"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* Minutes Stepper */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-text-muted">Minutes</span>
                <div className="flex items-center rounded-lg border border-border bg-surface p-1 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <button
                    type="button"
                    onClick={() => {
                      if (minutes >= 5) setMinutes(minutes - 5);
                      else if (minutes > 0) setMinutes(0);
                      else if (hours > 0) {
                        setHours(hours - 1);
                        setMinutes(55);
                      }
                    }}
                    disabled={(hours === 0 && minutes === 0) || isSubmitting}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface-hover active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Decrease minutes"
                  >
                    <Minus size={15} />
                  </button>

                  <div className="relative flex-1 flex items-center justify-center">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={minutes}
                      onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      disabled={isSubmitting}
                    />
                    <span className="text-xs font-medium text-text-muted pr-2">mins</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (minutes + 5 >= 60) {
                        setHours(hours + 1);
                        setMinutes((minutes + 5) % 60);
                      } else {
                        setMinutes(minutes + 5);
                      }
                    }}
                    disabled={isSubmitting}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface-hover active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Increase minutes"
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs font-medium text-text-muted mr-1">Presets:</span>
              {[
                { label: '15m', mins: 15 },
                { label: '25m', mins: 25 },
                { label: '30m', mins: 30 },
                { label: '45m', mins: 45 },
                { label: '1h', mins: 60 },
                { label: '1.5h', mins: 90 },
                { label: '2h', mins: 120 },
                { label: '3h', mins: 180 },
              ].map((preset) => {
                const isSelected = totalMinutes === preset.mins;
                return (
                  <button
                    key={preset.mins}
                    type="button"
                    onClick={() => {
                      setHours(Math.floor(preset.mins / 60));
                      setMinutes(preset.mins % 60);
                    }}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-primary text-white shadow-sm scale-105'
                        : 'border border-border bg-surface text-text-muted hover:border-primary/50 hover:text-foreground'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2 text-sm font-medium text-text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              ) : initialData ? (
                <Check size={16} />
              ) : (
                <Plus size={16} />
              )}
              {isSubmitting ? 'Saving...' : initialData ? 'Update Activity' : 'Add Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
