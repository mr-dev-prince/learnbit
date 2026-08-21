'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  Eye,
} from 'lucide-react';
import type { Architecture, ArchitectureStatus } from '@/types/Architecture';
import DiagramViewer from './DiagramViewer';

interface ArchitectureCardProps {
  architecture: Architecture;
  onDelete: (id: string) => void;
}

const statusConfig: Record<
  ArchitectureStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PLANNED: {
    label: 'Planned',
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    text: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    text: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  BUILT: {
    label: 'Built & Live',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    text: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  LEARNING: {
    label: 'Learning / Study',
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    text: 'text-purple-600 dark:text-purple-400',
    dot: 'bg-purple-500',
  },
};

export default function ArchitectureCard({
  architecture,
  onDelete,
}: ArchitectureCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const statusInfo = statusConfig[architecture.status] || statusConfig.IN_PROGRESS;

  const formattedDate = new Date(architecture.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative flex flex-col bg-surface border border-border hover:border-primary/40 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <Layers size={12} />
                {architecture.category}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </span>
            </div>

            <Link
              href={`/architectures/${architecture.id}`}
              className="text-lg font-bold text-foreground hover:text-primary transition-colors line-clamp-1 mt-1 block"
            >
              {architecture.title}
            </Link>
            {architecture.description && (
              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                {architecture.description}
              </p>
            )}
          </div>

          {/* Action Menu */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-1 w-40 bg-surface border border-border rounded-xl shadow-lg py-1 z-30 animate-fadeIn text-xs">
                  <Link
                    href={`/architectures/${architecture.id}`}
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-foreground hover:bg-surface-hover transition-colors"
                  >
                    <Eye size={14} className="text-text-muted" />
                    <span>View Blueprint</span>
                  </Link>
                  <Link
                    href={`/architectures/${architecture.id}/edit`}
                    onClick={() => setShowMenu(false)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-foreground hover:bg-surface-hover transition-colors"
                  >
                    <Edit2 size={14} className="text-text-muted" />
                    <span>Edit Design</span>
                  </Link>
                  <div className="h-px bg-border my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(architecture.id);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Diagram Thumbnail Preview */}
      <Link
        href={`/architectures/${architecture.id}`}
        className="mx-4 my-1 relative h-44 bg-surface-muted/50 rounded-xl border border-border/80 overflow-hidden group-hover:border-primary/30 transition-all items-center justify-center block"
      >
        {architecture.diagram ? (
          <div className="w-full h-full pointer-events-none transform scale-[0.85] origin-center flex items-center justify-center">
            <DiagramViewer
              chart={architecture.diagram}
              allowZoom={false}
              showControls={false}
              minHeight="100%"
              className="border-0 shadow-none bg-transparent w-full h-full"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-text-subtle text-xs gap-1.5">
            <Sparkles size={20} className="opacity-40" />
            <span>No diagram defined</span>
          </div>
        )}

        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-surface/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-border shadow-xs text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Eye size={13} className="text-primary" />
            <span>Open Blueprint &rarr;</span>
          </div>
        </div>
      </Link>

      {/* Bottom Footer */}
      <div className="p-4 pt-3 mt-auto flex flex-col gap-2.5">
        {architecture.tags && architecture.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {architecture.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-surface-muted border border-border/70 text-text-muted"
              >
                {tag}
              </span>
            ))}
            {architecture.tags.length > 4 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md text-text-subtle">
                +{architecture.tags.length - 4}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-text-subtle pt-2 border-t border-border/60">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>Updated {formattedDate}</span>
          </div>
          <Link
            href={`/architectures/${architecture.id}`}
            className="text-primary hover:underline font-semibold"
          >
            View Docs &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
