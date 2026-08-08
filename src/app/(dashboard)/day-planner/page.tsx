'use client';

import React, { useState } from 'react';
import { useDayPlanner } from '@/hooks/useDayPlanner';
import PlannerSetup from '@/components/day-planner/PlannerSetup';
import PlannerDashboard from '@/components/day-planner/PlannerDashboard';
import { Loader2, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function DayPlannerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Format the date to YYYY-MM-DD in local time for the query
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const {
    planner,
    isLoading,
    createPlanner,
    updatePlanner,
    createActivity,
    updateActivity,
    deleteActivity,
  } = useDayPlanner(dateStr);

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
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(selectedDate);
  selected.setHours(0, 0, 0, 0);
  const isToday = selected.getTime() === today.getTime();
  const isPastDay = selected.getTime() < today.getTime();

  return (
    <div className="space-y-6 h-full flex flex-col px-2">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row w-full sm:justify-between items-start sm:items-center gap-4 sm:gap-0 pt-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-sans text-foreground">Day Planner</h1>
          <p className="text-sm text-text-muted">
            Plan your waking hours, structure activities, and track daily progress.
          </p>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={handleToday}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-muted hover:bg-surface-hover hover:text-foreground transition-colors shadow-sm"
            >
              Today
            </button>
          )}

          <div className="inline-flex items-center rounded-lg border border-border bg-surface shadow-sm overflow-hidden">
            <button
              onClick={handlePrevDay}
              className="p-2 hover:bg-surface-hover text-foreground transition-colors border-r border-border"
              title="Previous Day"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground select-none">
              <Calendar size={15} className="text-primary" />
              <span>{formatDate(selectedDate)}</span>
            </div>

            <button
              onClick={handleNextDay}
              className="p-2 hover:bg-surface-hover text-foreground transition-colors border-l border-border"
              title="Next Day"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-surface/50">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : planner ? (
          <PlannerDashboard
            planner={planner}
            createActivity={createActivity}
            updateActivity={updateActivity}
            deleteActivity={deleteActivity}
            updatePlanner={updatePlanner}
            isReadOnly={isPastDay}
          />
        ) : (
          <PlannerSetup
            date={selectedDate}
            isReadOnly={isPastDay}
            onSetup={async (wakeTime, sleepTime) => {
              await createPlanner({
                date: dateStr,
                wakeTime: wakeTime.toISOString(),
                sleepTime: sleepTime.toISOString(),
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
