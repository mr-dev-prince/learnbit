'use client';

import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isPending?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  isPending = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-2 backdrop-blur-md"
      onClick={(e) => e.stopPropagation()}
    >
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0" />
      <div
        className="
          animate-in
          fade-in-0
          zoom-in-[0.97]
          slide-in-from-bottom-3
          relative
          flex
          w-full
          max-w-md
          flex-col
          overflow-hidden
          rounded-lg
          border
          border-border
          bg-surface
          shadow-2xl
          duration-300
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background: isDestructive
              ? 'linear-gradient(180deg, color-mix(in srgb, var(--destructive, #ef4444) 15%, transparent), transparent)'
              : 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 15%, transparent), transparent)',
          }}
        />
        <div className="relative flex shrink-0 items-start justify-between border-b border-border bg-surface px-6 py-5">
          <h2 className="text-xl" style={{ fontFamily: 'var(--font-brand)' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-border p-2 transition-all duration-200 hover:bg-surface-hover hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative p-6">
          <p className="text-sm text-text-muted mb-8 leading-relaxed">{description}</p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="
                rounded-lg border border-border bg-transparent px-4 py-2
                text-sm font-medium text-text-muted transition-all duration-200
                hover:bg-surface-hover hover:text-foreground
                disabled:pointer-events-none disabled:opacity-50
              "
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
                className={`
                  flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white
                  transition-all duration-200 active:scale-[0.98]
                  disabled:pointer-events-none disabled:opacity-50
                  ${
                    isDestructive
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-primary hover:opacity-90 hover:shadow-[0_4px_16px_-4px_rgba(var(--primary-rgb),0.4)]'
                  }
                `}
              >
                {isPending && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                )}
                {isPending ? 'Processing...' : confirmText}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
