'use client';

import { Sparkles, X } from 'lucide-react';

import TaskForm from './TaskForm';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-md">
      {/* Backdrop */}
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0" />

      {/* Modal */}
      <div className="relative flex h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
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
              Quick Add
            </div>

            <h1 className="mt-4 text-3xl" style={{ fontFamily: 'var(--font-brand)' }}>
              Capture a task before you forget it.
            </h1>

            <p className="mt-2 max-w-xl text-sm text-text-muted">
              Notes, due dates, resources, revisions and progress—all in one place.
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
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <TaskForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
