'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Layers,
  Tag,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import PasswordGate from '@/components/architectures/PasswordGate';
import UnifiedDocumentRenderer from '@/components/architectures/UnifiedDocumentRenderer';
import {
  useArchitecture,
  useDeleteArchitecture,
} from '@/hooks/useArchitectures';
import type { ArchitectureStatus } from '@/types/Architecture';

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

function formatDocumentContent(
  title: string,
  description?: string | null,
  diagram?: string | null,
  content?: string | null,
): string {
  // If content is already valid Markdown with mermaid or custom structure:
  if (content && !content.trim().startsWith('{')) {
    if (diagram && !content.includes('```mermaid')) {
      return `# ${title}\n\n${description || ''}\n\n\`\`\`mermaid\n${diagram}\n\`\`\`\n\n${content}`;
    }
    return content;
  }

  // If content is empty or previous JSON, generate markdown with diagram
  let doc = `# ${title}\n\n`;
  if (description) {
    doc += `${description}\n\n`;
  }
  if (diagram) {
    doc += `\`\`\`mermaid\n${diagram}\n\`\`\`\n\n`;
  }
  return doc;
}

export default function ArchitectureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: architecture, isLoading } = useArchitecture(resolvedParams.id);
  const deleteArchitecture = useDeleteArchitecture();

  const handleDelete = () => {
    if (!architecture) return;
    if (confirm('Are you sure you want to permanently delete this architecture blueprint?')) {
      deleteArchitecture.mutate(architecture.id, {
        onSuccess: () => {
          toast.success('Architecture blueprint deleted');
          router.push('/architectures');
        },
        onError: () => toast.error('Failed to delete architecture'),
      });
    }
  };

  if (isLoading) {
    return (
      <PasswordGate>
        <div className="space-y-6 px-2 pb-8 max-w-5xl mx-auto animate-pulse">
          <div className="h-6 w-40 bg-surface-muted rounded-md" />
          <div className="h-28 bg-surface rounded-2xl border border-border" />
          <div className="h-96 bg-surface rounded-2xl border border-border" />
        </div>
      </PasswordGate>
    );
  }

  if (!architecture) {
    return (
      <PasswordGate>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
          <div className="p-4 rounded-2xl bg-surface-muted border border-border text-text-muted">
            <Layers size={36} />
          </div>
          <h2 className="text-xl font-bold text-foreground">Architecture Not Found</h2>
          <p className="text-sm text-text-muted max-w-sm">
            This architecture blueprint may have been deleted or does not belong to your account.
          </p>
          <Link
            href="/architectures"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
          >
            <ArrowLeft size={16} />
            <span>Return to Architectures</span>
          </Link>
        </div>
      </PasswordGate>
    );
  }

  const statusInfo = statusConfig[architecture.status] || statusConfig.IN_PROGRESS;
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

  const fullDocument = formatDocumentContent(
    architecture.title,
    architecture.description,
    architecture.diagram,
    architecture.content,
  );

  return (
    <PasswordGate>
      <div className="space-y-6 px-2 pb-16 max-w-6xl mx-auto flex flex-col">
        {/* Back Link */}
        <div className="pt-2">
          <Link
            href="/architectures"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-primary transition-colors py-1 px-2.5 rounded-lg bg-surface border border-border hover:border-primary/40 shadow-2xs w-fit"
          >
            <ArrowLeft size={14} />
            <span>Back to Architecture Hub</span>
          </Link>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  <Layers size={13} />
                  {architecture.category}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  {statusInfo.label}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {architecture.title}
              </h1>

              {architecture.description && (
                <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-3xl">
                  {architecture.description}
                </p>
              )}

              {/* Tags and Dates */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-text-subtle">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>Created {formattedCreated}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>Last Updated {formattedUpdated}</span>
                </div>
                {architecture.tags && architecture.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag size={13} className="text-text-muted" />
                    {architecture.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-surface-muted border border-border/80 text-text-muted font-medium text-[11px]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
              <Link
                href={`/architectures/${architecture.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl shadow-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Edit2 size={15} />
                <span>Edit Blueprint</span>
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 border border-border hover:border-red-500/30 rounded-xl transition-colors cursor-pointer"
                title="Delete Architecture Blueprint"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Unified Document Presentation Body */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-10 shadow-xs relative">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-border text-xs text-text-muted font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-primary" />
              Interactive Technical Document & Architecture Diagrams
            </span>
            <span>Zoom, Pan & SVG Export enabled on all diagrams</span>
          </div>

          <UnifiedDocumentRenderer content={fullDocument} />
        </div>
      </div>
    </PasswordGate>
  );
}
