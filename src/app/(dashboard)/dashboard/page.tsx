'use client';

import DashboardContent from '@/components/ui/DashboardContent';
import TaskFilter from '@/components/ui/TaskFilter';
import { useState } from 'react';

export default function Dashboard() {
  const [selected, setSelected] = useState('Daily');

  return (
    <div className="space-y-3 h-full">
      <div className="flex w-full justify-between items-center p-2">
        <div className="space-y-1">
          <p className="text-3xl font-bold font-sans">Focused Session</p>
          <p className="text-sm text-text-muted">You have 4 primary task to master today.</p>
        </div>
        <div>
          <TaskFilter selected={selected} setSelected={setSelected} />
        </div>
      </div>
      <DashboardContent />
    </div>
  );
}
