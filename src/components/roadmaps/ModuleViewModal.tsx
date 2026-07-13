'use client';

import { BookOpen, X, CircleDashed, CheckCircle, Clock3 } from 'lucide-react';
import LexicalEditor from '@/components/notes/LexicalEditor';
import type { RoadmapModule } from '@/types/Roadmap';

interface ModuleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: RoadmapModule | null;
}

export default function ModuleViewModal({ isOpen, onClose, module }: ModuleViewModalProps) {
  if (!isOpen || !module) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle size={16} className="text-(--completed-text)" />;
      case 'IN_PROGRESS':
        return <Clock3 size={16} className="text-(--progress-text)" />;
      case 'SKIPPED':
        return <CircleDashed size={16} className="text-text-muted opacity-70" />;
      default:
        return <CircleDashed size={16} className="text-text-muted" />;
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 backdrop-blur-md">
      {/* Backdrop */}
      <button aria-label="Close modal" onClick={onClose} className="absolute inset-0" />

      {/* Modal */}
      <div className="relative flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-2xl">
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
          <div className="w-full">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <BookOpen size={13} className="text-primary" />
              Module Details
            </div>

            <h1
              className="mt-4 text-3xl wrap-break-words"
              style={{ fontFamily: 'var(--font-brand)' }}
            >
              {module.title}
            </h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium">
                {getStatusIcon(module.status)}
                <span className="capitalize">{formatStatus(module.status).toLowerCase()}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border border-border p-2 transition-all duration-200 hover:bg-surface-hover hover:rotate-90 ml-4 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-2">
                Description
              </h3>
              {module.description ? (
                <LexicalEditor initialContent={module.description} contentId={module.id} readOnly />
              ) : (
                <p className="text-text-muted italic">No description provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
