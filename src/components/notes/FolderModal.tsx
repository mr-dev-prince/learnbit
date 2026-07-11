import React, { useState, useEffect } from 'react';
import { Folder as FolderIcon, X } from 'lucide-react';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, parentId?: string | null) => void;
  parentId?: string | null;
}

export default function FolderModal({ isOpen, onClose, onSubmit, parentId }: FolderModalProps) {
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFolderName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSubmit(folderName.trim(), parentId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-md">
      {/* Backdrop */}
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0" />

      {/* Modal */}
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
        {/* Gradient Accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32"
          style={{
            background:
              'linear-gradient(180deg, color-mix(in srgb, var(--primary) 15%, transparent), transparent)',
          }}
        />

        {/* Header */}
        <div className="relative flex shrink-0 items-start justify-between border-b border-border bg-surface px-6 py-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <FolderIcon size={13} className="text-primary" />
              New Folder
            </div>

            <h1 className="mt-3 text-2xl" style={{ fontFamily: 'var(--font-brand)' }}>
              Organize your notes.
            </h1>

            <p className="mt-1 text-sm text-text-muted">
              {parentId
                ? 'Create a subfolder to further categorize your notes.'
                : 'Create a new top-level folder for your notes.'}
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

        {/* Form Body */}
        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="folderName"
                className="block text-sm font-medium text-foreground mb-1.5"
              >
                Folder Name
              </label>
              <input
                id="folderName"
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="e.g. Work, React Concepts, Ideas..."
                className="w-full rounded-lg border border-border bg-card-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                autoFocus
                required
              />
            </div>

            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!folderName.trim()}
                className="rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--primary)', color: 'white' }}
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
