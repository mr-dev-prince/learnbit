'use client';

import React, { useState, useEffect } from 'react';
import { useDayPlanner } from '@/hooks/useDayPlanner';
import PlannerSetup from '@/components/day-planner/PlannerSetup';
import PlannerDashboard from '@/components/day-planner/PlannerDashboard';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DayPlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Format the date to YYYY-MM-DD in local time for the query
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const { planner, isLoading, createPlanner, updatePlanner, createActivity, updateActivity, deleteActivity } = useDayPlanner(dateStr);

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };
  
  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);
  const isPrevDisabled = selected.getTime() <= today.getTime();

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Day Planner</h1>
        <div className="flex items-center gap-4">
          <button onClick={handleToday} className="text-sm text-primary hover:underline font-medium">
            Today
          </button>
          <div className="flex items-center bg-surface border border-border rounded-lg overflow-hidden">
            <button 
              onClick={handlePrevDay} 
              disabled={isPrevDisabled}
              className={`p-2 transition-colors ${isPrevDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary/10'}`}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 py-2 font-medium text-sm w-56 text-center select-none">
              {formatDate(selectedDate)}
            </div>
            <button onClick={handleNextDay} className="p-2 hover:bg-primary/10 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : planner ? (
          <PlannerDashboard 
            planner={planner} 
            createActivity={createActivity} 
            updateActivity={updateActivity}
            deleteActivity={deleteActivity}
            updatePlanner={updatePlanner}
          />
        ) : (
          <PlannerSetup 
            date={selectedDate} 
            onSetup={async (wakeTime, sleepTime) => {
              await createPlanner({
                date: dateStr,
                wakeTime: wakeTime.toISOString(),
                sleepTime: sleepTime.toISOString(),
              });
            }} 
          />
        )}
      </main>
    </div>
  );
}
