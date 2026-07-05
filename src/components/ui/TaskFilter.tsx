'use client';

interface TaskFilterProps {
  selected: string;
  setSelected: (value: string) => void;
}

const FILTERS = ['Daily', 'Weekly', 'Monthly'] as const;

export default function TaskFilter({ selected, setSelected }: TaskFilterProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-border bg-surface-muted p-1">
      {FILTERS.map((filter) => {
        const active = selected === filter;

        return (
          <button
            key={filter}
            type="button"
            onClick={() => setSelected(filter)}
            className={`
              min-w-[96px]
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              transition-all
              duration-200
              ${
                active
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:bg-surface-hover hover:text-foreground'
              }
            `}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
