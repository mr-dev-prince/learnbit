'use client';

import { SubmitEvent, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import type { TaskStatus } from '@/types/Task';

import ResourceLinksInput from './ResourceLinksInput';
import StatusSelect from './StatusSelect';
import DueDatePicker from './DueDatePicker';
import { useCreateTask } from '@/hooks/useTasks';

interface TaskFormProps {
  onSuccess: () => void;
}

interface FormState {
  title: string;
  description: string;
  notes: string;
  dueDate: string;
  status: TaskStatus;
  resourceLinks: string[];
}

const INITIAL_STATE: FormState = {
  title: '',
  description: '',
  notes: '',
  dueDate: '',
  status: 'TODO',
  resourceLinks: [''],
};

export default function TaskForm({ onSuccess }: TaskFormProps) {
  const createTask = useCreateTask();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(INITIAL_STATE);
  }, [form]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        const formElement = document.getElementById('task-form') as HTMLFormElement | null;
        formElement?.requestSubmit();
      }
    };

    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      await createTask.mutateAsync({
        title: form.title,
        description: form.description || null,
        notes: form.notes || null,
        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
        status: form.status,
        resourceLinks: form.resourceLinks.map((link) => link.trim()).filter(Boolean),
      });

      setForm(INITIAL_STATE);
      toast.success('Task created successfully');
      onSuccess();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
      toast.error(message);
    }
  }

  return (
    <form id="task-form" onSubmit={handleSubmit} className="space-y-4 px-4 py-4">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Title</label>

            <input
              autoFocus
              required
              maxLength={120}
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Build authentication middleware"
              className="w-full rounded-lg border px-4 py-3 outline-none transition-all focus:ring-2"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
                background: 'color-mix(in srgb, var(--background) 15%, transparent)',
              }}
            />

            <div
              className="mt-2 text-right text-xs"
              style={{
                color: 'color-mix(in srgb, var(--foreground) 55%, transparent)',
              }}
            >
              {form.title.length}/120
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Description</label>

            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe the goal of this task..."
              className="w-full resize-none rounded-lg border px-4 py-3 outline-none"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
                background: 'color-mix(in srgb, var(--background) 15%, transparent)',
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Notes</label>

            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Anything important you want to remember..."
              className="w-full resize-none rounded-lg border px-4 py-3 outline-none"
              style={{
                borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
                background: 'color-mix(in srgb, var(--background) 15%, transparent)',
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div
            className="rounded-3xl border p-4"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
            }}
          >
            <DueDatePicker
              value={form.dueDate}
              onChange={(value) => updateField('dueDate', value)}
            />

            <div className="mt-6">
              <StatusSelect
                value={form.status}
                onChange={(value) => updateField('status', value)}
              />
            </div>
          </div>

          <ResourceLinksInput
            value={form.resourceLinks}
            onChange={(links) => updateField('resourceLinks', links)}
          />
        </div>
      </div>

      {error && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            borderColor: 'rgb(239 68 68 / .35)',
            background: 'rgb(239 68 68 / .08)',
            color: 'rgb(220 38 38)',
          }}
        >
          {error}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-600 pt-3">
        <div
          className="text-sm"
          style={{
            color: 'color-mix(in srgb, var(--foreground) 55%, transparent)',
          }}
        >
          ⌘ / Ctrl + Enter to create task
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            disabled={createTask.isPending}
            onClick={() => {
              if (!isDirty || confirm('Discard changes?')) {
                onSuccess();
              }
            }}
            className="rounded-lg border p-3 font-medium transition-all hover:opacity-80"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 70%, transparent)',
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createTask.isPending}
            className="inline-flex min-w-40 items-center justify-center gap-2 rounded-lg p-3 font-semibold transition-all hover:scale-[1.02] disabled:opacity-60"
            style={{
              background: 'var(--primary)',
              color: '#0f172a',
            }}
          >
            {createTask.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating...
              </>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
