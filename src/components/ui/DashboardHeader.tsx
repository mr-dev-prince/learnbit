'use client';
import { useState } from 'react';
import TaskFilter from './TaskFilter';
import TaskBox from './TaskBox';

const DashboardHeader = () => {
  const [selected, setSelected] = useState('Daily');
  return (
    <div className="space-y-3 h-full">
      <div className="flex w-full justify-between items-center p-2">
        <div className="space-y-1">
          <p className="text-3xl font-bold font-sans">Focused Session</p>
          <p>You have 4 primary task to master today.</p>
        </div>
        <div>
          <TaskFilter selected={selected} setSelected={setSelected} />
        </div>
      </div>
      <TaskBox />
    </div>
  );
};

export default DashboardHeader;
