'use client';

import { useMemo, useState } from 'react';
import { CalendarDays, Link2, NotebookPen, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { TaskStatus } from '@/types/Task';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  title: string;
  description: string;
  notes: string;
  resourceLinks: string;
  scheduledFor: string;
  status: TaskStatus;
}

const INITIAL_FORM_STATE: FormState = {
  title: '',
  description: '',
  notes: '',
  resourceLinks: '',
  scheduledFor: '',
  status: 'pending',
};

const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export default function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resourceLinkCount = useMemo(
    () =>
      formState.resourceLinks
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean).length,
    [formState.resourceLinks],
  );

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFormState(INITIAL_FORM_STATE);
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formState.title,
          description: formState.description,
          notes: formState.notes,
          resourceLinks: formState.resourceLinks
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean),
          scheduledFor: formState.scheduledFor
            ? new Date(formState.scheduledFor).toISOString()
            : null,
          status: formState.status,
        }),
      });

      const payload = (await response.json()) as {
        success: boolean;
        error?: { message?: string };
      };

      if (!response.ok || !payload.success) {
        setError(payload.error?.message ?? 'Unable to create task right now.');
        return;
      }

      setSuccessMessage('Task created successfully.');
      setFormState(INITIAL_FORM_STATE);
      router.refresh();

      window.setTimeout(() => {
        handleClose();
      }, 700);
    } catch {
      setError('Unable to create task right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-md">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={handleClose}
      />

      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border shadow-2xl"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--card-background) 88%, transparent)',
          borderColor: 'color-mix(in srgb, var(--border) 80%, transparent)',
          boxShadow: '0 40px 100px color-mix(in srgb, black 48%, transparent)',
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--primary) 18%, transparent), transparent)',
          }}
        />

        <div className="relative flex items-start justify-between gap-6 border-b px-6 py-6 sm:px-8">
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em]"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 76%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              Quick Add
            </div>
            <h2
              className="mt-4 text-3xl font-semibold"
              style={{ fontFamily: 'var(--font-brand)', color: 'var(--foreground)' }}
            >
              Capture a learning task before it slips away.
            </h2>
            <p
              className="mt-2 max-w-xl text-sm leading-6"
              style={{ color: 'color-mix(in srgb, var(--foreground) 68%, transparent)' }}
            >
              Add a task, attach helpful links, and place it into your study flow with the right
              status and timing.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl border p-2.5 transition-colors hover:bg-surface/70"
            style={{
              color: 'var(--foreground)',
              borderColor: 'color-mix(in srgb, var(--border) 76%, transparent)',
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form className="relative px-6 py-6 sm:px-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Title</span>
                <input
                  type="text"
                  value={formState.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  placeholder="Read the system design chapter"
                  required
                  autoFocus
                  className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--border) 76%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
                    color: 'var(--foreground)',
                  }}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Description</span>
                <textarea
                  value={formState.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Add a quick summary of what this task is about."
                  rows={3}
                  className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--border) 76%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
                    color: 'var(--foreground)',
                  }}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <NotebookPen size={16} style={{ color: 'var(--primary)' }} />
                  Notes
                </span>
                <textarea
                  value={formState.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  placeholder="Key ideas, reminders, or revision hints."
                  rows={4}
                  className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--border) 76%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
                    color: 'var(--foreground)',
                  }}
                />
              </label>
            </div>

            <div className="space-y-5">
              <div
                className="rounded-[1.5rem] border p-4"
                style={{
                  borderColor: 'color-mix(in srgb, var(--border) 74%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--background) 14%, transparent)',
                }}
              >
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                    <CalendarDays size={16} style={{ color: 'var(--primary)' }} />
                    Schedule
                  </span>
                  <input
                    type="datetime-local"
                    value={formState.scheduledFor}
                    onChange={(event) => updateField('scheduledFor', event.target.value)}
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--border) 76%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
                      color: 'var(--foreground)',
                    }}
                  />
                </label>

                <label className="mt-4 block">
                  <span className="mb-2 block text-sm font-medium">Status</span>
                  <select
                    value={formState.status}
                    onChange={(event) =>
                      updateField('status', event.target.value as TaskStatus)
                    }
                    className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--border) 76%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
                      color: 'var(--foreground)',
                    }}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Link2 size={16} style={{ color: 'var(--primary)' }} />
                  Resource links
                </span>
                <textarea
                  value={formState.resourceLinks}
                  onChange={(event) => updateField('resourceLinks', event.target.value)}
                  placeholder="One URL per line"
                  rows={7}
                  className="w-full rounded-2xl border px-4 py-3.5 text-sm outline-none"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--border) 76%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--background) 18%, transparent)',
                    color: 'var(--foreground)',
                  }}
                />
              </label>

              <div
                className="rounded-[1.5rem] border px-4 py-3 text-sm"
                style={{
                  borderColor: 'color-mix(in srgb, var(--border) 72%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--card-background) 62%, transparent)',
                  color: 'color-mix(in srgb, var(--foreground) 72%, transparent)',
                }}
              >
                {resourceLinkCount} resource link{resourceLinkCount === 1 ? '' : 's'} ready to
                attach
              </div>
            </div>
          </div>

          {error && (
            <div
              className="mt-5 rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: 'rgba(239, 68, 68, 0.35)',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                color: '#b91c1c',
              }}
            >
              {error}
            </div>
          )}

          {successMessage && (
            <div
              className="mt-5 rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: 'color-mix(in srgb, var(--secondary) 42%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--secondary) 14%, transparent)',
                color: 'var(--foreground)',
              }}
            >
              {successMessage}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-2xl border px-5 py-3 text-sm font-semibold transition-colors hover:bg-surface/70 disabled:opacity-60"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 76%, transparent)',
                color: 'var(--foreground)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl px-5 py-3 text-sm font-semibold transition-transform duration-200 disabled:opacity-60"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#0f172a',
                boxShadow: '0 16px 48px color-mix(in srgb, var(--primary) 32%, transparent)',
              }}
            >
              {isSubmitting ? 'Creating task...' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
