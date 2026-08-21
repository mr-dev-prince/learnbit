'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Layers,
  Save,
  Tag,
  Sparkles,
} from 'lucide-react';
import type {
  Architecture,
  ArchitecturePayload,
  ArchitectureStatus,
  ArchitectureCategory,
} from '@/types/Architecture';
import UnifiedArchitectureStudio from './UnifiedArchitectureStudio';

interface ArchitectureFormProps {
  initialData?: Architecture | null;
  onSubmit: (payload: ArchitecturePayload) => Promise<void>;
  isSubmitting?: boolean;
  backHref?: string;
  pageTitle: string;
  pageSubtitle: string;
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

function getInitialDocument(initialData?: Architecture | null): string {
  if (!initialData) {
    return `# Architecture Blueprint Specification

Detailed architectural design, system topology, and technical notes.

## High-Level Architecture

\`\`\`mermaid
graph TD
    Client([🌐 Web / Mobile Client]) -->|API Requests| Gateway[API Gateway]
    Gateway --> ServiceA[Microservice A]
    Gateway --> ServiceB[Microservice B]
    ServiceA --> DB[(PostgreSQL DB)]
    ServiceB --> Cache[(Redis Cache)]
\`\`\`

## Technical Specifications & Details

Describe the components, data schemas, and key design tradeoffs.

### Component Responsibilities
- **API Gateway**: Reverse proxy, rate limiting, and auth token validation
- **Service A**: Core domain logic and persistence
- **Service B**: Async job processing and cached lookups

\`\`\`mermaid
sequenceDiagram
    autonumber
    Client->>Gateway: Request
    Gateway->>ServiceA: Forward Request
    ServiceA->>DB: Query Data
    DB-->>ServiceA: Return Results
    ServiceA-->>Client: HTTP 200 OK
\`\`\`

> **Architecture Decision Record (ADR):** Document critical decisions, database migrations, and scaling plans here.
`;
  }

  // If initialData.content is a JSON string (from previous Lexical editor) or doesn't have mermaid:
  if (initialData.content && !initialData.content.trim().startsWith('{')) {
    if (initialData.diagram && !initialData.content.includes('```mermaid')) {
      return `# ${initialData.title}\n\n${initialData.description || ''}\n\n\`\`\`mermaid\n${initialData.diagram}\n\`\`\`\n\n${initialData.content}`;
    }
    return initialData.content;
  }

  // If was Lexical JSON or empty, create unified markdown with diagram
  return `# ${initialData.title}

${initialData.description || ''}

## Visual Architecture Diagram

\`\`\`mermaid
${initialData.diagram || 'graph TD\n    Client --> Server'}
\`\`\`

## Technical Documentation & Notes

Write technical specifications and component breakdowns here...
`;
}

export default function ArchitectureForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  backHref = '/architectures',
  pageTitle,
  pageSubtitle,
}: ArchitectureFormProps) {
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
  const [documentContent, setDocumentContent] = useState<string>(() =>
    getInitialDocument(initialData),
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Extract the primary mermaid diagram from the document for card previews
    const mermaidMatch = /```mermaid\s*([\s\S]*?)```/.exec(documentContent);
    const extractedDiagram = mermaidMatch ? mermaidMatch[1].trim() : (initialData?.diagram || '');

    const payload: ArchitecturePayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      category: category as ArchitectureCategory,
      status,
      tags,
      diagram: extractedDiagram,
      content: documentContent,
    };

    await onSubmit(payload);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 pb-32">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-primary transition-colors py-1 px-2.5 rounded-lg bg-surface border border-border hover:border-primary/40 shadow-2xs mb-2 w-fit"
          >
            <ArrowLeft size={14} />
            <span>Cancel & Return</span>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {pageTitle}
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-1">
              <Sparkles size={12} />
              Unified Document Studio
            </span>
          </div>
          <p className="text-sm text-text-muted">{pageSubtitle}</p>
        </div>

        {/* Top Save Action */}
        <div className="flex items-center gap-3">
          <Link
            href={backHref}
            className="px-4 py-2.5 text-xs font-semibold text-text-muted hover:text-foreground hover:bg-surface-hover border border-border rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save size={15} />
            <span>{isSubmitting ? 'Saving Blueprint...' : 'Save Architecture'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metadata Details Card */}
        <div className="p-6 bg-surface border border-border rounded-2xl shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Title */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} className="text-primary" />
                Blueprint Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Event-Driven Microservices"
                className="w-full px-3.5 py-2.5 bg-surface-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-semibold"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ArchitectureStatus)}
                className="w-full px-3.5 py-2.5 bg-surface-muted/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Description */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Summary / Objective
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-level summary of what this architecture solves, builds, or explores..."
                className="w-full px-3.5 py-2 bg-surface-muted/50 border border-border rounded-xl text-xs text-foreground placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={13} className="text-text-muted" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="docker, redis, nextjs, grpc..."
                className="w-full px-3.5 py-2 bg-surface-muted/50 border border-border rounded-xl text-xs text-foreground placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Unified Document & Diagram Studio */}
        <div className="bg-surface border border-border rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-surface-muted/30 border-b border-border flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Layers size={16} className="text-primary" />
                Architecture Document & Visual Diagrams
              </h3>
              <p className="text-xs text-text-muted">
                Write headings, explanations, and embed interactive Mermaid diagrams directly inline anywhere in the document.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted">
              <Sparkles size={13} className="text-primary" />
              <span>Inline Diagrams + Rich Markdown</span>
            </div>
          </div>

          {/* Studio Canvas */}
          <div className="p-4 sm:p-6 bg-surface-muted/5 min-h-150">
            <UnifiedArchitectureStudio
              value={documentContent}
              onChange={setDocumentContent}
              minHeight="580px"
            />
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href={backHref}
            className="px-5 py-2.5 text-xs font-semibold text-text-muted hover:text-foreground hover:bg-surface-hover border border-border rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save size={15} />
            <span>{isSubmitting ? 'Saving Blueprint...' : 'Save Architecture Blueprint'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
