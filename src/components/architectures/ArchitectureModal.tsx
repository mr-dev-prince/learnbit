'use client';

import React, { useState } from 'react';
import {
  X,
  Layers,
  Save,
  Tag,
  AlignLeft,
  Columns,
  Code2,
  FileText,
  Sparkles,
} from 'lucide-react';
import type {
  Architecture,
  ArchitecturePayload,
  ArchitectureStatus,
  ArchitectureCategory,
} from '@/types/Architecture';
import DiagramEditor from './DiagramEditor';
import RichArchitectureEditor from './RichArchitectureEditor';
import { ArchitectureTemplate } from './architectureTemplates';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: ArchitecturePayload) => Promise<void>;
  initialData?: Architecture | null;
}

const CATEGORIES: ArchitectureCategory[] = [
  'System Architecture',
  'Frontend Architecture',
  'Backend & APIs',
  'Full-Stack',
  'Database & Data Flow',
  'Cloud & DevOps',
  'AI & Machine Learning',
  'Learning & Experiments',
];

const STATUS_OPTIONS: { value: ArchitectureStatus; label: string }[] = [
  { value: 'PLANNED', label: 'Planned' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'BUILT', label: 'Built / Implemented' },
  { value: 'LEARNING', label: 'Learning / Study' },
];

function ArchitectureModalContent({
  onClose,
  onSubmit,
  initialData,
}: {
  onClose: () => void;
  onSubmit: (payload: ArchitecturePayload) => Promise<void>;
  initialData?: Architecture | null;
}) {
  const [activeTab, setActiveTab] = useState<'diagram' | 'doc' | 'split'>('split');
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<string>(
    initialData?.category || 'System Architecture',
  );
  const [status, setStatus] = useState<ArchitectureStatus>(
    initialData?.status || 'IN_PROGRESS',
  );
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags ? initialData.tags.join(', ') : '',
  );
  const [diagram, setDiagram] = useState(
    initialData?.diagram ||
      `graph TD\n    Client([🌐 Web / Mobile Client]) -->|API Requests| Gateway[API Gateway]\n    Gateway --> ServiceA[Microservice A]\n    Gateway --> ServiceB[Microservice B]\n    ServiceA --> DB[(PostgreSQL DB)]\n    ServiceB --> Cache[(Redis Cache)]`,
  );
  const [content, setContent] = useState(initialData?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApplyTemplate = (tmpl: ArchitectureTemplate) => {
    setDiagram(tmpl.diagram);
    if (!title || title.trim() === '') {
      setTitle(tmpl.name);
    }
    if (!description || description.trim() === '') {
      setDescription(tmpl.description);
    }
    setCategory(tmpl.category);
    if (tmpl.tags && tmpl.tags.length > 0) {
      setTagsInput(tmpl.tags.join(', '));
    }
    if (!content || content.trim() === '') {
      setContent(tmpl.defaultContent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        category,
        status,
        diagram: diagram.trim() || null,
        content: content.trim() || null,
        tags,
      });
      onClose();
    } catch {
      // Error handled in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-6xl h-[94vh] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Layers size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {initialData ? 'Edit Architecture Design' : 'Create New Architecture Blueprint'}
              </h2>
              <p className="text-xs text-text-muted">
                Document diagrams, technical specifications, and system designs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-text-muted hover:text-foreground hover:bg-surface-hover rounded-xl transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Form & Workspace */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
          {/* Metadata Row */}
          <div className="px-6 py-3.5 bg-surface-muted/40 border-b border-border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-text-muted mb-1">
                Architecture Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Notification System / Learnbit Next.js Architecture"
                required
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-text-muted mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-text-muted mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArchitectureStatus)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-text-muted mb-1">Short Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this architecture accomplishes..."
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-text-muted mb-1 items-center gap-1">
                <Tag size={12} />
                <span>Tags (comma-separated)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Next.js, Redis, Kafka, Microservices, Auth"
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Workspace Tabs */}
          <div className="px-6 py-2 bg-surface border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'split'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-muted hover:text-foreground hover:bg-surface-muted'
                }`}
              >
                <Columns size={14} />
                <span>Split Canvas (Diagram & Specs)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('diagram')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'diagram'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-muted hover:text-foreground hover:bg-surface-muted'
                }`}
              >
                <Code2 size={14} />
                <span>Architecture Diagram</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('doc')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'doc'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-text-muted hover:text-foreground hover:bg-surface-muted'
                }`}
              >
                <FileText size={14} />
                <span>Rich Documentation & Notes</span>
              </button>
            </div>
          </div>

          {/* Tab Content Canvas */}
          <div className="flex-1 p-6 overflow-y-auto min-h-0 bg-surface-muted/20">
            {activeTab === 'split' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full min-h-120">
                <div className="flex flex-col h-full space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Code2 size={14} className="text-primary" />
                      Mermaid Diagram
                    </span>
                  </div>
                  <div className="flex-1 min-h-95">
                    <DiagramEditor
                      value={diagram}
                      onChange={setDiagram}
                      onApplyTemplate={handleApplyTemplate}
                    />
                  </div>
                </div>

                <div className="flex flex-col h-full space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <AlignLeft size={14} className="text-primary" />
                      Rich Text Documentation & Technical Notes
                    </span>
                  </div>
                  <div className="flex-1 min-h-95">
                    <RichArchitectureEditor
                      initialContent={content}
                      contentId={initialData?.id || 'new'}
                      onChange={setContent}
                      minHeight="380px"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'diagram' && (
              <div className="h-full min-h-125">
                <DiagramEditor
                  value={diagram}
                  onChange={setDiagram}
                  onApplyTemplate={handleApplyTemplate}
                />
              </div>
            )}

            {activeTab === 'doc' && (
              <div className="h-full min-h-125">
                <RichArchitectureEditor
                  initialContent={content}
                  contentId={initialData?.id || 'new'}
                  onChange={setContent}
                  minHeight="480px"
                />
              </div>
            )}
          </div>

          {/* Modal Bottom Actions */}
          <div className="px-6 py-4 border-t border-border bg-surface flex items-center justify-between">
            <div className="text-xs text-text-muted flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary" />
              <span>Full Mermaid & Rich Text formatting enabled</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-hover rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="inline-flex items-center gap-2 px-6 py-2 text-sm font-semibold text-white bg-primary rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Save size={16} />
                <span>{isSubmitting ? 'Saving...' : 'Save Architecture'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ArchitectureModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <ArchitectureModalContent
      key={initialData?.id || 'new'}
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
    />
  );
}
