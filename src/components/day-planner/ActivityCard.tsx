import React from 'react';
import { Activity } from '@prisma/client';
import { Check, Edit2, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import LexicalEditor from '@/components/common/LexicalEditor';

interface ActivityCardProps {
  activity: Activity;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
}

export default function ActivityCard({ activity, onEdit, onDelete, onToggleComplete }: ActivityCardProps) {
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
    <div className={`bg-surface border ${activity.completed ? 'border-primary/50 bg-primary/5' : 'border-border'} rounded-xl shadow-sm overflow-hidden transition-all duration-200`}>
      <div className="p-4 flex items-start gap-4">
        <button
          onClick={onToggleComplete}
          className={`shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            activity.completed ? 'bg-primary border-primary text-white' : 'border-border hover:border-primary text-transparent'
          }`}
        >
          <Check size={14} className={activity.completed ? 'opacity-100' : 'opacity-0'} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-bold text-lg truncate ${activity.completed ? 'line-through text-foreground/50' : 'text-foreground'}`}>
              {activity.title}
            </h4>
            
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={onEdit} className="p-1.5 text-foreground/50 hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                <Edit2 size={16} />
              </button>
              <button onClick={onDelete} className="p-1.5 text-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-1 text-sm font-medium text-foreground/60">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{durationStr()}</span>
          </div>

          {activity.notes && (
            <div className="mt-3">
              <button 
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {expanded ? 'Hide Notes' : 'View Notes'}
              </button>
              
              {expanded && (
                <div className="mt-3 bg-background rounded-lg border border-border p-3 pointer-events-none opacity-80">
                  <LexicalEditor initialContent={activity.notes} readOnly />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
