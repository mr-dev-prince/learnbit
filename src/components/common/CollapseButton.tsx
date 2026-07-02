'use client';

import { ChevronLeft } from 'lucide-react';

interface CollapseButtonProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function CollapseButton({ isCollapsed, onToggle }: CollapseButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-lg border p-1  transition-colors hover:bg-surface/80"
      style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
      aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      <ChevronLeft
        size={16}
        className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
      />
    </button>
  );
}
