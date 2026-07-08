import { MoreVertical, CheckCircle, Clock3, CircleDashed, Edit, Trash, XCircle } from 'lucide-react';
import type { RoadmapModule } from '@/types/Roadmap';
import { useState } from 'react';

interface ModuleCardProps {
  module: RoadmapModule;
  onEdit: (module: RoadmapModule) => void;
  onDelete: (moduleId: string) => void;
  onStatusChange?: (moduleId: string, status: string) => void;
  index: number;
}

export default function ModuleCard({ module, onEdit, onDelete, onStatusChange, index }: ModuleCardProps) {

  const STATUS_COLORS: Record<string, string> = {
    PLANNED: 'bg-surface-muted text-text-muted',
    IN_PROGRESS: 'bg-[var(--progress-bg)] text-[var(--progress-text)]',
    COMPLETED: 'bg-[var(--completed-bg)] text-[var(--completed-text)]',
    SKIPPED: 'bg-surface-hover text-text-muted',
  };

  const STATUS_LABELS: Record<string, string> = {
    PLANNED: 'Planned',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    SKIPPED: 'Skipped',
  };

  return (
    <div className="group relative flex w-full items-center justify-between rounded-lg border border-border bg-surface p-4 transition-all duration-200 hover:border-border-strong hover:shadow-sm">
      <div className="flex min-w-0 flex-1 items-start sm:items-center gap-4 relative z-10 pointer-events-none">
        <div className="mt-1 sm:mt-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted border border-border font-bold text-xs text-text-muted">
          {index + 1}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-foreground">{module.title}</h3>
          
          {module.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">
              {module.description}
            </p>
          )}
        </div>
      </div>

      <div className="ml-6 flex shrink-0 flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4 relative z-10 pointer-events-auto">
        <select
          value={module.status}
          onChange={(e) => onStatusChange?.(module.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className={`appearance-none cursor-pointer text-center rounded-full px-2 py-1 text-xs font-semibold outline-none ring-1 ring-inset focus:ring-2 focus:ring-primary ${STATUS_COLORS[module.status]}`}
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value} className="bg-surface text-foreground font-medium">
              {label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit(module);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-all duration-200 hover:bg-surface-hover hover:text-foreground"
            title="Edit"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(module.id);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-all duration-200 hover:bg-red-500/10 hover:text-red-500"
            title="Delete"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
