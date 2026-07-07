import React from 'react';
import { CheckCircle, Circle, Trash2 } from 'lucide-react';
import type { Habit } from '@/types/Habit';

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggleCompletion: (habitId: string) => void;
  onDelete: (habitId: string) => void;
  isLogging: boolean;
  isDeleting: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompletedToday,
  onToggleCompletion,
  onDelete,
  isLogging,
  isDeleting,
}) => {
  return (
    <div
      className={`group relative flex items-center justify-between rounded-xl border p-4 shadow-xs transition-all ${
        isCompletedToday
          ? 'border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10'
          : 'border-border bg-card hover:border-primary/30'
      }`}
    >
      <div className="flex flex-1 items-start gap-4">
        <button
          onClick={() => onToggleCompletion(habit.id)}
          disabled={isLogging}
          className={`mt-0.5 shrink-0 transition-colors focus:outline-none ${
            isCompletedToday
              ? 'text-green-500 hover:text-green-600'
              : 'text-muted-foreground hover:text-primary'
          } ${isLogging ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isCompletedToday ? (
            <CheckCircle className="h-6 w-6" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>

        <div className="flex flex-col">
          <h3
            className={`text-lg font-semibold transition-all ${
              isCompletedToday ? 'text-muted-foreground line-through' : 'text-foreground'
            }`}
          >
            {habit.title}
          </h3>
          {habit.description && (
            <p
              className={`mt-1 text-sm ${
                isCompletedToday ? 'text-muted-foreground/70' : 'text-muted-foreground'
              }`}
            >
              {habit.description}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(habit.id)}
        disabled={isDeleting}
        className={`ml-4 rounded-md p-2 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100 ${
          isDeleting ? 'cursor-not-allowed opacity-50' : ''
        }`}
        aria-label="Delete habit"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};
