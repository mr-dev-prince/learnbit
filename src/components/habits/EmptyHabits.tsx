import React from 'react';
import { Flame, Plus } from 'lucide-react';

export function EmptyHabits({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/6 text-primary/30">
        <Flame size={28} strokeWidth={1.5} />
      </div>
      <h3 className="mb-1.5 text-xl font-semibold text-foreground/80">No habits yet</h3>
      <p className="mb-6 text-sm text-text-muted/60">
        Start tracking your daily habits to build consistency.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white
          transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Plus size={16} />
        Add your first habit
      </button>
    </div>
  );
}
