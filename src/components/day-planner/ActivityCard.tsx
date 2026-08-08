import React from 'react';
import { Activity } from '@prisma/client';
import { Check, Edit2, Trash2, Clock, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import LexicalEditor from '@/components/common/LexicalEditor';

interface ActivityCardProps {
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  isReadOnly?: boolean;
}

export default function ActivityCard({
  activity,
  onEdit,
  onDelete,
  onToggleComplete,
  isReadOnly = false,
}: ActivityCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const formatTime = (dateStr: Date | string) => {
    return new Date(dateStr).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const durationStr = () => {
    const hours = Math.floor(activity.durationMinutes / 60);
    const mins = activity.durationMinutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  return (
    <div className="relative pl-10 sm:pl-12">
      {/* Timeline Node Dot - Centered on vertical line at left-4 (16px) / sm:left-5 (20px) */}
      <button
        onClick={isReadOnly ? undefined : onToggleComplete}
        disabled={isReadOnly}
        title={
          isReadOnly
            ? activity.completed
              ? 'Completed'
              : 'Incomplete'
            : activity.completed
              ? 'Mark incomplete'
              : 'Mark complete'
        }
        className={`absolute left-4 sm:left-5 top-5 -translate-x-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
          isReadOnly ? 'cursor-default' : 'cursor-pointer'
        } ${
          activity.completed
            ? 'border-primary bg-primary text-white shadow-sm ring-4 ring-primary/15'
            : isReadOnly
              ? 'border-border-strong bg-surface text-transparent'
              : 'border-border-strong bg-surface hover:border-primary text-transparent hover:text-primary/40'
        }`}
      >
        <Check size={12} strokeWidth={3} />
      </button>

      {/* Main Activity Card Container */}
      <div
        className={`rounded-xl border transition-all duration-200 bg-surface shadow-sm ${
          activity.completed
            ? 'border-border/70 bg-surface/60'
            : 'border-border hover:border-primary/40 hover:shadow-md'
        }`}
      >
        <div className="p-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h4
                className={`text-base font-semibold font-sans truncate ${
                  activity.completed ? 'line-through text-text-muted' : 'text-foreground'
                }`}
              >
                {activity.title}
              </h4>

              {/* Action Buttons */}
              {!isReadOnly && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={onEdit}
                    title="Edit activity"
                    className="rounded-lg p-1.5 text-text-muted hover:bg-surface-hover hover:text-primary transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={onDelete}
                    title="Delete activity"
                    className="rounded-lg p-1.5 text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Time & Duration Pill Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-text-muted tabular-nums">
                <Clock size={12} className="text-primary shrink-0" />
                {formatTime(activity.startTime)} – {formatTime(activity.endTime)}
              </span>

              <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-text-muted tabular-nums">
                {durationStr()}
              </span>
            </div>

            {/* Notes Section Toggle */}
            {activity.notes && (
              <div className="mt-3">
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <FileText size={13} />
                  {expanded ? 'Hide Notes' : 'View Notes'}
                  {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </button>

                {expanded && (
                  <div className="mt-2.5 rounded-lg border border-border bg-surface-muted/50 p-3 pointer-events-none text-xs text-foreground/80">
                    <LexicalEditor initialContent={activity.notes} readOnly />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
