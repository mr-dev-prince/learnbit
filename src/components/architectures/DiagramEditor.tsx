'use client';

import React, { useState } from 'react';
import {
  Code2,
  Eye,
  Columns,
  Sparkles,
  Layers,
  Database,
  Server,
  Smartphone,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import DiagramViewer from './DiagramViewer';
import { ARCHITECTURE_TEMPLATES, ArchitectureTemplate } from './architectureTemplates';

interface DiagramEditorProps {
  value: string;
  onChange: (value: string) => void;
  onApplyTemplate?: (template: ArchitectureTemplate) => void;
}

export default function DiagramEditor({
  value,
  onChange,
  onApplyTemplate,
}: DiagramEditorProps) {
  const [viewMode, setViewMode] = useState<'split' | 'code' | 'preview'>('split');
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const insertSnippet = (snippet: string) => {
    const updated = value ? `${value.trimEnd()}\n    ${snippet}` : `graph TD\n    ${snippet}`;
    onChange(updated);
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-surface-muted/60 border border-border rounded-xl">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-surface border border-border rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
              title="Split View"
            >
              <Columns size={13} />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'code'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
              title="Code Editor Only"
            >
              <Code2 size={13} />
              <span className="hidden sm:inline">Code</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'preview'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-foreground hover:bg-surface-hover'
              }`}
              title="Diagram Preview Only"
            >
              <Eye size={13} />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowTemplatesModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles size={13} />
            <span>Templates</span>
          </button>
        </div>

        {/* Quick Node Insert Shortcuts */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => insertSnippet('User([👤 Client / User])')}
            className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface border border-border/60 rounded-md text-xs transition-colors"
            title="Insert Client Node"
          >
            <Smartphone size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('Service[⚙️ API Service]')}
            className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface border border-border/60 rounded-md text-xs transition-colors"
            title="Insert Service Node"
          >
            <Server size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('Database[(🗄️ Database)]')}
            className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface border border-border/60 rounded-md text-xs transition-colors"
            title="Insert Database Node"
          >
            <Database size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('Queue[[📬 Message Queue]]')}
            className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface border border-border/60 rounded-md text-xs transition-colors"
            title="Insert Queue Node"
          >
            <Layers size={13} />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('NodeA -->|Sends Data| NodeB')}
            className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface border border-border/60 rounded-md text-xs transition-colors"
            title="Insert Arrow Connection"
          >
            <ArrowRight size={13} />
          </button>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="p-1.5 text-text-muted hover:text-foreground hover:bg-surface border border-border/60 rounded-md text-xs transition-colors"
            title="Syntax Help"
          >
            <HelpCircle size={13} />
          </button>
        </div>
      </div>

      {/* Syntax Quick Help */}
      {showHelp && (
        <div className="p-3 bg-surface-muted/80 border border-border rounded-xl text-xs space-y-1.5 text-text-muted font-mono animate-fadeIn">
          <div className="font-semibold text-foreground font-sans flex items-center justify-between">
            <span>Mermaid Syntax Cheat Sheet:</span>
            <button
              onClick={() => setShowHelp(false)}
              className="text-text-subtle hover:text-foreground font-sans"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div>• <span className="text-foreground">graph TD</span> / <span className="text-foreground">graph LR</span> (Top-Down / Left-to-Right)</div>
            <div>• <span className="text-foreground">A([Round Node])</span>, <span className="text-foreground">B[(Cylinder DB)]</span></div>
            <div>• <span className="text-foreground">A --&gt;|Label| B</span> (Arrow with text)</div>
            <div>• <span className="text-foreground">subgraph &quot;Title&quot; ... end</span> (Container boundary)</div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-[360px] grid grid-cols-1 gap-3">
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
            <div className="flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden">
              <div className="px-3 py-2 bg-surface-muted/50 border-b border-border text-xs font-semibold text-text-muted flex items-center justify-between">
                <span>Mermaid Architecture Code</span>
                <span className="text-[11px] font-mono opacity-70">graph TD / flowchart</span>
              </div>
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter Mermaid diagram code e.g. graph TD\n  Client --> Gateway..."
                className="flex-1 w-full p-3 font-mono text-xs text-foreground bg-transparent resize-none outline-none leading-relaxed"
                spellCheck={false}
              />
            </div>
            <div className="h-full">
              <DiagramViewer chart={value} minHeight="100%" className="h-full" />
            </div>
          </div>
        )}

        {viewMode === 'code' && (
          <div className="flex flex-col h-full bg-surface border border-border rounded-xl overflow-hidden min-h-[380px]">
            <div className="px-3 py-2 bg-surface-muted/50 border-b border-border text-xs font-semibold text-text-muted flex items-center justify-between">
              <span>Mermaid Architecture Code Editor</span>
              <span className="text-[11px] font-mono opacity-70">graph TD / flowchart / sequenceDiagram / erDiagram</span>
            </div>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Enter Mermaid diagram code e.g. graph TD\n  Client --> Gateway..."
              className="flex-1 w-full p-4 font-mono text-sm text-foreground bg-transparent resize-none outline-none leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="h-full min-h-[380px]">
            <DiagramViewer chart={value} minHeight="100%" className="h-full" />
          </div>
        )}
      </div>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground">Architecture Presets & Templates</h3>
                <p className="text-xs text-text-muted">
                  Choose a blueprint to fast-track your architecture diagram and documentation
                </p>
              </div>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="p-1 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
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
                    onClick={() => {
                      if (onApplyTemplate) {
                        onApplyTemplate(tmpl);
                      } else {
                        onChange(tmpl.diagram);
                      }
                      setShowTemplatesModal(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-primary rounded-lg shadow-xs hover:opacity-90 active:scale-95 transition-all self-end sm:self-center shrink-0 cursor-pointer"
                  >
                    Apply Template
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
