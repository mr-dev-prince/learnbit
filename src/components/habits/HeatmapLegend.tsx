import React from 'react';

export function HeatmapLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded bg-green-500/20" />
        <span>Completed</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded bg-red-500/15" />
        <span>Missed</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded bg-surface-muted/40 text-center text-[10px] font-bold text-text-muted leading-4">
          -
        </div>
        <span>Skipped</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded bg-surface-muted/50" />
        <span>N/A</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-4 w-4 rounded ring-2 ring-primary" />
        <span>Today</span>
      </div>
    </div>
  );
}
