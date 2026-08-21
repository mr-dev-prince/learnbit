'use client';

import React, { useState, useRef } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Table,
  Minus,
  Sparkles,
  Columns,
  Eye,
  PenLine,
  Layers,
  ArrowRightLeft,
  Database,
  Workflow,
} from 'lucide-react';
import UnifiedDocumentRenderer from './UnifiedDocumentRenderer';
import { ARCHITECTURE_TEMPLATES, ArchitectureTemplate } from './architectureTemplates';

interface UnifiedArchitectureStudioProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}

export default function UnifiedArchitectureStudio({
  value,
  onChange,
  minHeight = '550px',
}: UnifiedArchitectureStudioProps) {
  const [viewMode, setViewMode] = useState<'split' | 'write' | 'preview'>('split');
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to wrap or insert text at cursor position without causing scroll jumps
  const insertTextAtCursor = (prefix: string, suffix = '', placeholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(`${value}\n${prefix}${placeholder}${suffix}`);
      return;
    }

    const savedScrollTop = textarea.scrollTop;
    const savedWindowScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const isTextSelected = start !== end;
    const selectedText = value.substring(start, end) || placeholder;
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
    onChange(newText);

    // Preserve scroll and selection positions seamlessly
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        const el = textareaRef.current;
        el.focus({ preventScroll: true });

        const selectionStart = start + prefix.length;
        const selectionEnd = isTextSelected
          ? selectionStart + selectedText.length
          : selectionStart + (placeholder ? placeholder.length : 0);

        el.setSelectionRange(selectionStart, selectionEnd);
        el.scrollTop = savedScrollTop;

        if (typeof window !== 'undefined') {
          window.scrollTo({ top: savedWindowScrollY, behavior: 'instant' as ScrollBehavior });
        }
      }
    });
  };

  const insertHeading = (level: 1 | 2 | 3) => {
    const hashes = '#'.repeat(level);
    insertTextAtCursor(`\n${hashes} `, '\n', `Heading ${level}`);
  };

  const insertDiagram = (type: 'flowchart' | 'sequence' | 'erd' | 'blank') => {
    let snippet = '';
    if (type === 'flowchart') {
      snippet = `\n\`\`\`mermaid
graph TD
    Client([🌐 Web / Mobile Client]) -->|HTTPS Requests| Gateway[API Gateway]
    Gateway --> ServiceA[Auth & User Service]
    Gateway --> ServiceB[Core Business Logic]
    ServiceA --> DB[(PostgreSQL Database)]
    ServiceB --> Cache[(Redis Cache)]
\`\`\`\n`;
    } else if (type === 'sequence') {
      snippet = `\n\`\`\`mermaid
sequenceDiagram
    autonumber
    Client->>Server: 1. POST /api/checkout
    Server->>PaymentGateway: 2. Process Charge
    PaymentGateway-->>Server: 3. Charge Successful
    Server->>Database: 4. Create Order Record
    Server-->>Client: 5. 200 OK (Order Receipt)
\`\`\`\n`;
    } else if (type === 'erd') {
      snippet = `\n\`\`\`mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER {
        string id PK
        string email
        string name
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        string id PK
        string userId FK
        float totalAmount
        string status
    }
    ORDER_ITEM {
        string id PK
        string orderId FK
        string productId
        int quantity
    }
\`\`\`\n`;
    } else {
      snippet = `\n\`\`\`mermaid
graph TD
    NodeA[System A] --> NodeB[System B]
\`\`\`\n`;
    }

    insertTextAtCursor(snippet);
  };

  const insertTable = () => {
    const tableSnippet = `\n| Component | Tech Stack | Responsibility |\n|---|---|---|\n| Frontend | Next.js 16, TailwindCSS | User interface and dashboards |\n| Backend | Node.js, Prisma ORM | API endpoints and business logic |\n| Database | PostgreSQL | Persistent structured data storage |\n\n`;
    insertTextAtCursor(tableSnippet);
  };

  const insertCallout = () => {
    insertTextAtCursor(
      '\n> **Architecture Decision Record (ADR):** Document critical decisions, tradeoffs, and rationale here.\n\n',
    );
  };

  const handleApplyPresetTemplate = (tmpl: ArchitectureTemplate) => {
    const documentBody = `# ${tmpl.name}

${tmpl.description}

## System Overview & Topology

\`\`\`mermaid
${tmpl.diagram}
\`\`\`

## Key Architectural Decisions

> **Architecture Note:** This blueprint follows production best practices with separation of concerns and high scalability.

### Core Components & Responsibilities

| Layer / Service | Technology | Key Responsibility |
|---|---|---|
| Client Gateway | Next.js / Edge | Reverse proxy, authentication gate, static assets |
| Core Service | Node.js API | Business workflows and transactional operations |
| Persistence | Database / Cache | High throughput structured records and caching |

### Security & Data Flow
- All traffic encrypted via TLS 1.3
- JWT tokens with short expiry and rotating refresh tokens
- Automated schema migrations and connection pooling
`;

    onChange(documentBody);
    setShowTemplatesModal(false);
  };

  return (
    <div className="relative flex flex-col h-full space-y-4">
      {/* Top Header Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-surface border border-border rounded-2xl shadow-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface-muted/60 border border-border/80 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'split'
                  ? 'bg-surface text-primary shadow-xs border border-border/60'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              <Columns size={14} />
              <span>Split Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('write')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'write'
                  ? 'bg-surface text-primary shadow-xs border border-border/60'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              <PenLine size={14} />
              <span>Write Only</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-surface text-primary shadow-xs border border-border/60'
                  : 'text-text-muted hover:text-foreground'
              }`}
            >
              <Eye size={14} />
              <span>Live Document</span>
            </button>
          </div>
        </div>

        <div className="text-xs text-text-muted flex items-center gap-1.5 px-2">
          <Sparkles size={13} className="text-primary" />
          <span>Sticky bottom toolbar active — document scrolls in the background</span>
        </div>
      </div>

      {/* Main Studio Canvas Area */}
      <div className="flex-1 grid grid-cols-1 gap-4" style={{ minHeight }}>
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* Editor Pane */}
            <div className="flex flex-col h-full bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-surface-muted/50 border-b border-border text-xs font-bold text-text-muted flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <PenLine size={14} className="text-primary" />
                  Document & Diagram Source
                </span>
                <span className="text-[11px] font-mono opacity-70">Markdown + Mermaid</span>
              </div>
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Write your architecture specification here...&#10;&#10;# System Architecture&#10;Describe system components and flows...&#10;&#10;```mermaid&#10;graph TD&#10;    Client --> Server&#10;```&#10;&#10;## Data Flow Notes&#10;More documentation and notes..."
                className="flex-1 w-full p-4 pb-28 font-mono text-xs sm:text-sm text-foreground bg-transparent resize-none outline-none leading-relaxed overflow-y-auto"
                spellCheck={false}
              />
            </div>

            {/* Live Interactive Preview Pane */}
            <div className="flex flex-col h-full bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-surface-muted/50 border-b border-border text-xs font-bold text-text-muted flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Eye size={14} className="text-primary" />
                  Live Unified Document Preview
                </span>
                <span className="text-[11px] font-semibold text-primary">Interactive</span>
              </div>
              <div className="flex-1 p-6 pb-28 overflow-y-auto bg-surface">
                {value.trim() ? (
                  <UnifiedDocumentRenderer content={value} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-text-subtle text-sm gap-2">
                    <span>Document preview will appear here as you type.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'write' && (
          <div className="flex flex-col h-full bg-surface border border-border rounded-2xl overflow-hidden shadow-xs min-h-125">
            <div className="px-4 py-2.5 bg-surface-muted/50 border-b border-border text-xs font-bold text-text-muted flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <PenLine size={14} className="text-primary" />
                Full-Width Document & Diagram Editor
              </span>
              <span className="text-[11px] font-mono opacity-70">Markdown + Mermaid</span>
            </div>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write your architecture specification here..."
              className="flex-1 w-full p-6 pb-28 font-mono text-sm text-foreground bg-transparent resize-none outline-none leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="flex flex-col h-full bg-surface border border-border rounded-2xl overflow-hidden shadow-xs min-h-125">
            <div className="px-4 py-2.5 bg-surface-muted/50 border-b border-border text-xs font-bold text-text-muted flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Eye size={14} className="text-primary" />
                Unified Technical Document View
              </span>
              <span className="text-[11px] font-semibold text-primary">Live</span>
            </div>
            <div className="flex-1 p-8 pb-28 overflow-y-auto max-w-5xl mx-auto w-full">
              {value.trim() ? (
                <UnifiedDocumentRenderer content={value} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-text-subtle text-sm gap-2 py-16">
                  <span>No content in document yet.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Sticky Bottom Toolbar (Always Pinned to Screen Bottom) */}
      <div className="fixed bottom-6 left-[60vw] -translate-x-1/2 z-40 w-fit">
        <div className="flex flex-col items-center justify-center gap-1.5 p-1.5 bg-surface/95 dark:bg-surface/95 backdrop-blur-xl border border-border/90 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 animate-fadeIn">
          <div className="flex items-center justify-center">
            {/* Headings */}
            <div className="flex items-center bg-surface-muted/70 border border-border/80 rounded-xl p-0.5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertHeading(1)}
                className="px-2 py-1 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors font-bold text-xs cursor-pointer"
                title="Heading 1 (#)"
              >
                <Heading1 size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertHeading(2)}
                className="px-2 py-1 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors font-bold text-xs cursor-pointer"
                title="Heading 2 (##)"
              >
                <Heading2 size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertHeading(3)}
                className="px-2 py-1 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors font-bold text-xs cursor-pointer"
                title="Heading 3 (###)"
              >
                <Heading3 size={14} />
              </button>
            </div>

            <div className="h-4 w-px bg-border my-auto mx-0.5" />

            {/* Inline Styles */}
            <div className="flex items-center bg-surface-muted/70 border border-border/80 rounded-xl p-0.5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertTextAtCursor('**', '**', 'bold text')}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Bold (**text**)"
              >
                <Bold size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertTextAtCursor('*', '*', 'italic text')}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Italic (*text*)"
              >
                <Italic size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertTextAtCursor('~~', '~~', 'strikethrough')}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Strikethrough (~~text~~)"
              >
                <Strikethrough size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertTextAtCursor('`', '`', 'code')}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Inline Code (`code`)"
              >
                <Code size={14} />
              </button>
            </div>

            <div className="h-4 w-px bg-border my-auto mx-0.5" />

            {/* Lists & Blocks */}
            <div className="flex items-center bg-surface-muted/70 border border-border/80 rounded-xl p-0.5">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertTextAtCursor('\n- ', '', 'Bullet item')}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Bullet List (- item)"
              >
                <List size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertTextAtCursor('\n1. ', '', 'Numbered item')}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Numbered List (1. item)"
              >
                <ListOrdered size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={insertCallout}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Callout Box (> Note)"
              >
                <Quote size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={insertTable}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Insert Table"
              >
                <Table size={14} />
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => insertTextAtCursor('\n---\n')}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface transition-colors cursor-pointer"
                title="Horizontal Rule (---)"
              >
                <Minus size={14} />
              </button>
            </div>
          </div>

          {/* Inline Diagram Insert Tools */}
          <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-xl p-0.5">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertDiagram('flowchart')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/15 rounded-lg transition-colors cursor-pointer"
              title="Insert Flowchart Diagram"
            >
              <Workflow size={14} />
              <span>+ Diagram</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertDiagram('sequence')}
              className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-medium text-text-muted hover:text-foreground hover:bg-surface rounded-lg transition-colors cursor-pointer"
              title="Insert Sequence Flow Diagram"
            >
              <ArrowRightLeft size={13} />
              <span>Sequence</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertDiagram('erd')}
              className="hidden md:flex items-center gap-1 px-2 py-1 text-xs font-medium text-text-muted hover:text-foreground hover:bg-surface rounded-lg transition-colors cursor-pointer"
              title="Insert Database Schema ERD"
            >
              <Database size={13} />
              <span>ERD</span>
            </button>

            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowTemplatesModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-primary hover:opacity-90 rounded-lg transition-all shadow-2xs cursor-pointer ml-1"
            >
              <Sparkles size={13} />
              <span>Templates</span>
            </button>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Layers size={18} className="text-primary" />
                  Full Architecture Blueprint Templates
                </h3>
                <p className="text-xs text-text-muted">
                  Insert complete production architectures with embedded visual diagrams, tables,
                  and specifications
                </p>
              </div>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
              {ARCHITECTURE_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="p-4 rounded-xl border border-border hover:border-primary/50 bg-surface-muted/30 hover:bg-surface-muted/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted max-w-md">{tmpl.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tmpl.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded bg-surface border border-border text-text-subtle"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleApplyPresetTemplate(tmpl)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg shadow-xs hover:opacity-90 active:scale-95 transition-all self-end sm:self-center shrink-0 cursor-pointer"
                  >
                    Load Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
