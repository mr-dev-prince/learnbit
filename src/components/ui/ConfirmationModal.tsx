'use client';

import { X, AlertTriangle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  pendingText?: string;
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
  pendingText,
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
          className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-50"
          style={{
            background: isDestructive
              ? 'linear-gradient(180deg, color-mix(in srgb, var(--destructive, #ef4444) 15%, transparent), transparent)'
              : 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 15%, transparent), transparent)',
          }}
        />
        <div className="relative flex shrink-0 items-start justify-between border-b border-border bg-surface/50 backdrop-blur-sm px-6 py-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}
            >
              {isDestructive ? <AlertTriangle size={20} /> : <Info size={20} />}
            </div>
            <h2
              className="text-xl font-semibold text-foreground"
              style={{ fontFamily: 'var(--font-brand)' }}
            >
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            aria-label="Close"
            className="rounded-lg border border-border bg-surface p-2 text-foreground/70 transition-all duration-200 hover:bg-surface-hover hover:text-foreground hover:rotate-90 disabled:pointer-events-none disabled:opacity-50"
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
              {isPending ? pendingText || 'Processing...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
