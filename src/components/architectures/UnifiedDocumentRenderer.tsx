'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import DiagramViewer from './DiagramViewer';

interface UnifiedDocumentRendererProps {
  content: string;
  className?: string;
}

export default function UnifiedDocumentRenderer({
  content,
  className = '',
}: UnifiedDocumentRendererProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className={`prose dark:prose-invert max-w-none text-foreground ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight border-b border-border pb-3 mb-6 mt-8 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight border-b border-border/60 pb-2 mb-4 mt-8">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mb-3 mt-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-foreground mb-2 mt-4">
              {children}
            </h4>
          ),

          // Paragraphs & Text
          p: ({ children }) => (
            <p className="text-sm sm:text-base leading-relaxed text-foreground/90 mb-4">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-foreground">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-6 space-y-2 mb-4 text-sm sm:text-base text-foreground/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-6 space-y-2 mb-4 text-sm sm:text-base text-foreground/90">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,

          // Blockquotes / Callout Boxes
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-l-4 border-primary bg-primary/5 dark:bg-primary/10 rounded-r-xl p-4 text-foreground/90 not-italic flex items-start gap-3 shadow-2xs">
              <Info size={20} className="text-primary shrink-0 mt-0.5" />
              <div className="text-sm sm:text-base leading-relaxed">{children}</div>
            </blockquote>
          ),

          // Horizontal Divider
          hr: () => <hr className="my-8 border-t border-border" />,

          // Tables
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-surface-muted border-b border-border text-xs uppercase tracking-wider font-semibold text-foreground">
              {children}
            </thead>
          ),
          th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
          td: ({ children }) => (
            <td className="px-4 py-3 border-t border-border/60 text-foreground/90">
              {children}
            </td>
          ),

          // Code blocks & Inline Code (Embeds Mermaid DiagramViewer inline!)
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1].toLowerCase() : '';
            const codeText = String(children).replace(/\n$/, '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-surface-muted border border-border font-mono text-xs text-primary font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Inline Interactive Diagram Rendering!
            if (language === 'mermaid' || language === 'diagram') {
              return (
                <div className="my-8 rounded-2xl border border-border/90 overflow-hidden shadow-xs bg-surface">
                  <div className="px-4 py-2 bg-surface-muted/60 border-b border-border flex items-center justify-between text-xs font-semibold text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Interactive Architecture Diagram
                    </span>
                    <span className="font-mono text-[11px] opacity-70">Mermaid.js</span>
                  </div>
                  <DiagramViewer
                    chart={codeText}
                    minHeight="380px"
                    className="border-0 rounded-none shadow-none"
                  />
                </div>
              );
            }

            // Standard code block
            const codeIndex = Math.random();
            return (
              <div className="relative my-6 rounded-xl border border-border overflow-hidden bg-surface-muted/80">
                <div className="flex items-center justify-between px-4 py-2 bg-surface-muted border-b border-border text-xs text-text-muted">
                  <span className="font-mono">{language || 'code'}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(codeText, codeIndex)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-surface text-text-muted hover:text-foreground transition-colors cursor-pointer"
                  >
                    {copiedIndex === codeIndex ? (
                      <>
                        <Check size={13} className="text-secondary" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
