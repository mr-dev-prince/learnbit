import Link from 'next/link';
import {
  Map,
  Clock,
  CheckCircle,
  Clock3,
  CircleDashed,
  MoreVertical,
  Trash,
  Edit,
} from 'lucide-react';
import type { Roadmap } from '@/types/Roadmap';

interface RoadmapCardProps {
  roadmap: Roadmap;
  onEdit: (roadmap: Roadmap) => void;
  onDelete: (roadmapId: string) => void;
  onStatusChange?: (roadmapId: string, status: string) => void;
}

export default function RoadmapCard({
  roadmap,
  onEdit,
  onDelete,
  onStatusChange,
}: RoadmapCardProps) {
  const STATUS_COLORS: Record<string, string> = {
    PLANNED: 'bg-surface-muted text-text-muted',
    IN_PROGRESS: 'bg-[var(--progress-bg)] text-[var(--progress-text)]',
    COMPLETED: 'bg-[var(--completed-bg)] text-[var(--completed-text)]',
    ARCHIVED: 'bg-[var(--archived-bg)] text-[var(--archived-text)]',
  };

  const STATUS_LABELS: Record<string, string> = {
    PLANNED: 'Planned',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    ARCHIVED: 'Archived',
  };

  return (
    <div className="group relative flex w-full items-center justify-between rounded-lg border border-border bg-surface p-4 transition-all duration-200 hover:border-border-strong hover:shadow-sm">
      <Link href={`/roadmaps/${roadmap.id}`} className="absolute inset-0 z-0" />

      <div className="flex min-w-0 flex-1 items-start sm:items-center gap-4 relative z-10 pointer-events-none">
        <div className="mt-1 sm:mt-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Map size={20} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-foreground">{roadmap.title}</h3>

          {roadmap.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-text-muted">
              {roadmap.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-4 text-xs font-medium text-text-muted">
            {roadmap.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock size={13} />
                <span>{roadmap.estimatedTime}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <div className="flex h-4 items-center justify-center rounded bg-primary/10 px-1.5 text-[10px] font-bold text-primary">
                {roadmap.modules?.length || 0}
              </div>
              <span>Modules</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ml-6 flex shrink-0 flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4 relative z-10 pointer-events-auto">
        <select
          value={roadmap.status}
          onChange={(e) => onStatusChange?.(roadmap.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className={`appearance-none cursor-pointer text-center rounded-full px-3 py-1 text-xs font-semibold outline-none ring-1 ring-inset focus:ring-2 focus:ring-primary ${STATUS_COLORS[roadmap.status]}`}
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
              onEdit(roadmap);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-all duration-200 hover:bg-surface-hover hover:text-foreground"
            title="Edit"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(roadmap.id);
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
