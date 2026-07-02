'use client';

import { X } from 'lucide-react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="animate-in fade-in zoom-in duration-200 mx-4 w-full max-w-md rounded-2xl border p-8 shadow-2xl"
        style={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--border)' }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            Quick Add
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-surface/80"
            style={{ color: 'var(--foreground)' }}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="What would you like to add?"
            className="w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
            onFocus={(event) => {
              event.currentTarget.style.boxShadow = '0 0 0 2px var(--primary)';
            }}
            onBlur={(event) => {
              event.currentTarget.style.boxShadow = 'none';
            }}
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border px-4 py-2 font-medium transition-colors hover:bg-surface/70"
              style={{ borderColor: 'var(--border)', color: 'var(--primary)' }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg px-4 py-2 font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
