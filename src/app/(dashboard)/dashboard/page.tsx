'use client';

import DashboardContent from '@/components/ui/DashboardContent';
import TaskFilter from '@/components/ui/TaskFilter';
import QuickAddModal from '@/components/tasks/QuickAddModal';
import type { TaskFilterPeriod } from '@/lib/filterTasks';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const SUBTITLE_LABEL: Record<TaskFilterPeriod, string> = {
  Daily: 'today',
  Weekly: 'this week',
  Monthly: 'this month',
};

export default function Dashboard() {
  const [selected, setSelected] = useState<TaskFilterPeriod>('Daily');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="space-y-3 h-full">
      <div className="flex flex-col sm:flex-row w-full sm:justify-between items-start sm:items-center gap-4 sm:gap-0 p-2">
        <div className="space-y-1">
          <p className="text-3xl font-bold font-sans">Focused Session</p>
          <p className="text-sm text-text-muted">Your tasks {SUBTITLE_LABEL[selected]}.</p>
        </div>
        <div className="flex items-center gap-2">
          <TaskFilter selected={selected} setSelected={setSelected} />
          <button
            type="button"
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
      <DashboardContent filter={selected} />
      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
    </div>
  );
}
