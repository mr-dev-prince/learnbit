import React, { useState } from 'react';
import { Sparkles, X, Plus } from 'lucide-react';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
}

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(title, description);
      setTitle('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create habit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-md">
      {/* Backdrop */}
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0" />

      {/* Modal */}
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
        {/* Gradient Accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--primary) 15%, transparent), transparent)',
          }}
        />

        {/* Header */}
        <div className="relative flex shrink-0 items-start justify-between border-b border-border bg-surface px-8 py-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Sparkles size={13} className="text-primary" />
              New Habit
            </div>

            <h1 className="mt-4 text-3xl" style={{ fontFamily: 'var(--font-brand)' }}>
              Start building a better you.
            </h1>

            <p className="mt-2 max-w-xl text-sm text-text-muted">
              Small steps every day lead to big changes over time.
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-text-muted">
                Habit Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Drink 8 glasses of water"
                className="w-full rounded-lg border border-border bg-surface p-3 text-text placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-text-muted"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add some details or motivation..."
                className="min-h-[100px] w-full rounded-lg border border-border bg-surface p-3 text-text placeholder-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg px-4 py-2 font-medium text-text-muted hover:bg-surface-hover hover:text-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim() || isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <Plus size={18} />
                )}
                {isSubmitting ? 'Creating...' : 'Create Habit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
