import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Roadmap, RoadmapPayload, RoadmapStatus } from '@/types/Roadmap';

interface RoadmapFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: RoadmapPayload) => void;
  initialData?: Roadmap | null;
}

export default function RoadmapFormModal({ isOpen, onClose, onSubmit, initialData }: RoadmapFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [status, setStatus] = useState<RoadmapStatus>('PLANNED');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setDescription(initialData.description || '');
        setEstimatedTime(initialData.estimatedTime || '');
        setStatus(initialData.status);
      } else {
        setTitle('');
        setDescription('');
        setEstimatedTime('');
        setStatus('PLANNED');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      estimatedTime,
      status,
      resources: initialData?.resources || [], // Assuming resources are managed elsewhere for now
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-md">
      {/* Backdrop */}
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0 w-full h-full cursor-default" />

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
              <span className="text-primary">🗺️</span>
              Roadmap
            </div>

            <h1 className="mt-4 text-3xl" style={{ fontFamily: 'var(--font-brand)' }}>
              {initialData ? 'Edit Roadmap' : 'Create a Roadmap'}
            </h1>

            <p className="mt-2 max-w-xl text-sm text-text-muted">
              Define your learning journey, estimate your time, and start achieving your goals.
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
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="e.g. Learn Full-Stack Web Dev"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="What will you learn?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Estimated Time</label>
                <input
                  type="text"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="e.g. 3 Months"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as RoadmapStatus)}
                  className="w-full rounded-lg border border-border bg-surface-muted px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option value="PLANNED">Planned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold text-text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all"
              >
                {initialData ? 'Save Changes' : 'Create Roadmap'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
