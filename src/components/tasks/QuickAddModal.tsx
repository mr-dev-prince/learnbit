'use client';

import { X, Sparkles } from 'lucide-react';

import TaskForm from './TaskForm';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-4xl border"
        style={{
          background: 'color-mix(in srgb, var(--card-background) 94%, transparent)',
          borderColor: 'color-mix(in srgb, var(--border) 75%, transparent)',
          boxShadow: '0 40px 120px color-mix(in srgb, black 55%, transparent)',
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-56"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--primary) 14%, transparent), transparent)',
          }}
        />

        <div className="relative border-b px-8 py-7">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-xl border p-2 transition-all hover:rotate-90"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 75%, transparent)',
            }}
          >
            <X size={18} />
          </button>

          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-widest uppercase"
            style={{
              borderColor: 'color-mix(in srgb, var(--border) 75%, transparent)',
            }}
          >
            <Sparkles
              size={14}
              style={{
                color: 'var(--primary)',
              }}
            />
            Quick Add
          </div>

          <h1
            className="mt-5 text-4xl font-semibold"
            style={{
              fontFamily: 'var(--font-brand)',
            }}
          >
            Capture a task before you forget it.
          </h1>

          <p
            className="mt-3 max-w-2xl text-sm leading-7"
            style={{
              color: 'color-mix(in srgb, var(--foreground) 70%, transparent)',
            }}
          >
            Keep everything in one place—notes, due dates, learning resources and progress.
          </p>
        </div>

        <TaskForm onSuccess={onClose} />
      </div>
    </div>
  );
}
