import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { RoadmapModule, ModulePayload, ModuleStatus } from '@/types/Roadmap';

interface ModuleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ModulePayload) => Promise<void> | void;
  initialData?: RoadmapModule | null;
}

export default function ModuleFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ModuleFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ModuleStatus>('PLANNED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTitle(initialData.title);

        setDescription(initialData.description || '');

        setStatus(initialData.status);
      } else {
        setTitle('');

        setDescription('');

        setStatus('PLANNED');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        status,
        order: initialData?.order,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-md">
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 w-full h-full cursor-default"
      />

      {/* Modal */}
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
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
              <span className="text-primary">📦</span>
              Module
            </div>

            <h1 className="mt-4 text-3xl" style={{ fontFamily: 'var(--font-brand)' }}>
              {initialData ? 'Edit Module' : 'Create a Module'}
            </h1>

            <p className="mt-2 max-w-xl text-sm text-text-muted">
              Break down your roadmap into actionable steps or topics.
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

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Title</label>
              <input
                type="text"
                required
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                placeholder="e.g. Introduction to React"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50"
                placeholder="What will you learn in this module?"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ModuleStatus)}
                className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="PLANNED">Planned</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="SKIPPED">Skipped</option>
              </select>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-text-muted hover:bg-surface-hover hover:text-foreground transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSubmitting && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                )}
                {isSubmitting
                  ? initialData
                    ? 'Saving...'
                    : 'Creating...'
                  : initialData
                    ? 'Save Changes'
                    : 'Create Module'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
