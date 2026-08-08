import React, { useState } from 'react';
import LexicalEditor from '@/components/common/LexicalEditor';
import { X, Sparkles, Plus, Check } from 'lucide-react';
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
  const [title, setTitle] = useState(initialData?.title || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes || 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    const startDate = new Date(suggestedStartTime);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

    setIsSubmitting(true);
    try {
      await onSubmit({
        plannerId,
        title,
        notes,
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

          <div>
            <label
              htmlFor="duration-select"
              className="mb-1.5 block text-sm font-semibold text-foreground"
            >
              Duration
            </label>
            <select
              id="duration-select"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-surface p-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              disabled={isSubmitting}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
              <option value={150}>2.5 hours</option>
              <option value={180}>3 hours</option>
              <option value={240}>4 hours</option>
              {initialData &&
                ![15, 30, 45, 60, 90, 120, 150, 180, 240].includes(initialData.durationMinutes) && (
                  <option value={initialData.durationMinutes}>
                    {Math.floor(initialData.durationMinutes / 60)}h{' '}
                    {initialData.durationMinutes % 60}m
                  </option>
                )}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Notes (Optional)
            </label>
            <div className="rounded-lg border border-border bg-surface overflow-hidden min-h-40">
              <LexicalEditor initialContent={notes} onChange={setNotes} />
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
