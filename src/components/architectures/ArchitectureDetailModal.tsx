'use client';

import React, { useState } from 'react';
import {
  X,
  Edit2,
  Calendar,
  Layers,
  Tag,
  Code2,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import type { Architecture } from '@/types/Architecture';
import DiagramViewer from './DiagramViewer';
import RichArchitectureEditor from './RichArchitectureEditor';

interface ArchitectureDetailModalProps {
  architecture: Architecture | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (architecture: Architecture) => void;
}

export default function ArchitectureDetailModal({
  architecture,
  isOpen,
  onClose,
  onEdit,
}: ArchitectureDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'both' | 'diagram' | 'doc'>('both');

  if (!isOpen || !architecture) return null;

  const formattedCreated = new Date(architecture.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedUpdated = new Date(architecture.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-6xl h-[92vh] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                <Layers size={12} />
                {architecture.category}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-muted border border-border text-text-muted font-medium">
                {architecture.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">{architecture.title}</h2>
            {architecture.description && (
              <p className="text-xs text-text-muted max-w-2xl">{architecture.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(architecture);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              <Edit2 size={14} />
              <span>Edit Design</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* View Switcher & Tags */}
        <div className="px-6 py-2.5 bg-surface-muted/40 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'both'
                  ? 'bg-surface text-primary border border-border font-semibold shadow-xs'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              Unified View
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('diagram')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'diagram'
                  ? 'bg-surface text-primary border border-border font-semibold shadow-xs'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              Diagram Focus
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('doc')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'doc'
                  ? 'bg-surface text-primary border border-border font-semibold shadow-xs'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              Documentation Focus
            </button>
          </div>

          <div className="flex items-center gap-4 text-text-subtle text-[11px]">
            <div className="flex items-center gap-1">
              <Calendar size={13} />
              <span>Created {formattedCreated}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={13} />
              <span>Updated {formattedUpdated}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-surface-muted/10 min-h-0 space-y-6">
          {activeTab === 'both' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
              <div className="flex flex-col space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Code2 size={14} className="text-primary" />
                  Visual Architecture Diagram
                </h4>
                {architecture.diagram ? (
                  <DiagramViewer
                    chart={architecture.diagram}
                    minHeight="480px"
                    className="flex-1 shadow-sm"
                  />
                ) : (
                  <div className="p-8 text-center text-text-subtle border border-border rounded-xl bg-surface text-sm">
                    No diagram attached to this architecture.
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <FileText size={14} className="text-primary" />
                  Technical Specification & Notes
                </h4>
                <div className="flex-1 bg-surface border border-border rounded-xl p-2 shadow-sm overflow-hidden">
                  <RichArchitectureEditor
                    initialContent={architecture.content}
                    contentId={architecture.id}
                    readOnly={true}
                    minHeight="460px"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diagram' && (
            <div className="space-y-2 h-full">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Code2 size={14} className="text-primary" />
                Visual Architecture Diagram
              </h4>
              {architecture.diagram ? (
                <DiagramViewer
                  chart={architecture.diagram}
                  minHeight="540px"
                  className="shadow-sm"
                />
              ) : (
                <div className="p-8 text-center text-text-subtle border border-border rounded-xl bg-surface text-sm">
                  No diagram attached.
                </div>
              )}
            </div>
          )}

          {activeTab === 'doc' && (
            <div className="space-y-2 h-full">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <FileText size={14} className="text-primary" />
                Technical Specification & Notes
              </h4>
              <div className="bg-surface border border-border rounded-xl p-2 shadow-sm">
                <RichArchitectureEditor
                  initialContent={architecture.content}
                  contentId={architecture.id}
                  readOnly={true}
                  minHeight="540px"
                />
              </div>
            </div>
          )}

          {/* Tags list */}
          {architecture.tags && architecture.tags.length > 0 && (
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <Tag size={13} className="text-text-muted" />
              {architecture.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-surface border border-border text-xs text-text-muted font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-border bg-surface flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-1 text-primary">
            <Sparkles size={14} />
            <span>Interactive Diagramming & Rich Documentation</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-surface-muted hover:bg-surface-hover rounded-lg text-foreground font-medium transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
}
