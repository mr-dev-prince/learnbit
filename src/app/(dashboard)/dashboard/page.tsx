'use client';

import DashboardContent from '@/components/ui/DashboardContent';
import TaskFilter from '@/components/ui/TaskFilter';
import type { TaskFilterPeriod } from '@/lib/filterTasks';
import { useState } from 'react';

const SUBTITLE_LABEL: Record<TaskFilterPeriod, string> = {
  Daily: 'today',
  Weekly: 'this week',
  Monthly: 'this month',
};

export default function Dashboard() {
  const [selected, setSelected] = useState<TaskFilterPeriod>('Daily');

  return (
    <div className="space-y-3 h-full">
      <div className="flex flex-col sm:flex-row w-full sm:justify-between items-start sm:items-center gap-4 sm:gap-0 p-2">
        <div className="space-y-1">
          <p className="text-3xl font-bold font-sans">Focused Session</p>
          <p className="text-sm text-text-muted">
            Your tasks {SUBTITLE_LABEL[selected]}.
          </p>
        </div>
        <div>
          <TaskFilter selected={selected} setSelected={setSelected} />
        </div>
      </div>
      <DashboardContent filter={selected} />
    </div>
  );
}

