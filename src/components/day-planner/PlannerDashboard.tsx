import React, { useState } from 'react';
import { DayPlannerWithActivities } from '@/services/day-planner.service';
import ActivityCard from './ActivityCard';
import ActivityForm from './ActivityForm';
import { Plus, CheckCircle2, Clock, Edit2, Sun, Moon, Lock } from 'lucide-react';
import { Activity } from '@prisma/client';

interface PlannerDashboardProps {
  planner: DayPlannerWithActivities;
  createActivity: (payload: {
    plannerId: string;
    title: string;
    notes?: string | null;
    startTime: string;
    endTime: string;
  }) => Promise<Activity>;
  updateActivity: (args: {
    id: string;
    payload: {
      title?: string;
      notes?: string | null;
      startTime?: string;
      endTime?: string;
      completed?: boolean;
    };
  }) => Promise<Activity>;
  deleteActivity: (id: string) => Promise<void>;
  updatePlanner: (args: {
    id: string;
    payload: { wakeTime?: string; sleepTime?: string };
  }) => Promise<DayPlannerWithActivities>;
  isReadOnly?: boolean;
}

export default function PlannerDashboard({
  planner,
  createActivity,
  updateActivity,
  deleteActivity,
  updatePlanner,
  isReadOnly = false,
}: PlannerDashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [isEditingTimes, setIsEditingTimes] = useState(false);
  const [wakeTimeStr, setWakeTimeStr] = useState('');
  const [sleepTimeStr, setSleepTimeStr] = useState('');
  const [isUpdatingTimes, setIsUpdatingTimes] = useState(false);

  const handleEditTimes = () => {
    const w = new Date(planner.wakeTime);
    setWakeTimeStr(
      `${w.getHours().toString().padStart(2, '0')}:${w.getMinutes().toString().padStart(2, '0')}`,
    );

    const s = new Date(planner.sleepTime);
    setSleepTimeStr(
      `${s.getHours().toString().padStart(2, '0')}:${s.getMinutes().toString().padStart(2, '0')}`,
    );

    setIsEditingTimes(true);
  };

  const handleSaveTimes = async () => {
    setIsUpdatingTimes(true);

    const date = new Date(planner.date);

    const [wakeH, wakeM] = wakeTimeStr.split(':').map(Number);
    const wakeDate = new Date(date);
    wakeDate.setHours(wakeH, wakeM, 0, 0);

    const [sleepH, sleepM] = sleepTimeStr.split(':').map(Number);
    const sleepDate = new Date(date);
    sleepDate.setHours(sleepH, sleepM, 0, 0);

    if (sleepH <= wakeH) {
      sleepDate.setDate(sleepDate.getDate() + 1);
    }

    await updatePlanner({
      id: planner.id,
      payload: {
        wakeTime: wakeDate.toISOString(),
        sleepTime: sleepDate.toISOString(),
      },
    });

    setIsEditingTimes(false);
    setIsUpdatingTimes(false);
  };

  const completedCount = planner.activities.filter((a) => a.completed).length;
  const totalCount = planner.activities.length;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const formatTime = (dateStr: Date | string) => {
    return new Date(dateStr).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = (activity: Activity) => {
    if (isReadOnly) return;
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (isReadOnly) return;
    if (confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity(id);
    }
  };

  const handleToggleComplete = async (activity: Activity) => {
    if (isReadOnly) return;
    await updateActivity({ id: activity.id, payload: { completed: !activity.completed } });
  };

  const formatMinutes = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours > 0 && m > 0) return `${hours}h ${m}m`;
    if (hours > 0) return `${hours}h`;
    return `${m}m`;
  };

  const calculatedActivities = planner.activities.reduce<
    Array<Activity & { calculatedStartTime: Date; calculatedEndTime: Date }>
  >((acc, activity) => {
    const prevEndTime =
      acc.length > 0
        ? acc[acc.length - 1].calculatedEndTime.getTime()
        : new Date(planner.wakeTime).getTime();
    const start = new Date(prevEndTime);
    const end = new Date(prevEndTime + activity.durationMinutes * 60000);
    acc.push({ ...activity, calculatedStartTime: start, calculatedEndTime: end });
    return acc;
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Waking Schedule Card */}
        <div className="group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:border-border-strong">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                Day Schedule
              </span>
              {!isReadOnly && !isEditingTimes && (
                <button
                  onClick={handleEditTimes}
                  className="rounded-md p-1 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-hover hover:text-foreground"
                  title="Edit day schedule"
                >
                  <Edit2 size={13} />
                </button>
              )}
            </div>

            {isEditingTimes ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-semibold text-text-muted block mb-1">
                      Wake
                    </label>
                    <input
                      type="time"
                      value={wakeTimeStr}
                      onChange={(e) => setWakeTimeStr(e.target.value)}
                      className="w-full rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <span className="text-text-muted mt-4">-</span>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase font-semibold text-text-muted block mb-1">
                      Sleep
                    </label>
                    <input
                      type="time"
                      value={sleepTimeStr}
                      onChange={(e) => setSleepTimeStr(e.target.value)}
                      className="w-full rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTimes}
                    disabled={isUpdatingTimes}
                    className="flex-1 rounded-md bg-primary py-1 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingTimes(false)}
                    disabled={isUpdatingTimes}
                    className="flex-1 rounded-md bg-surface-muted py-1 text-xs font-semibold text-text-muted hover:bg-surface-hover hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3">
                <div className="text-2xl font-bold font-sans tracking-tight text-foreground tabular-nums">
                  {formatTime(planner.wakeTime)} – {formatTime(planner.sleepTime)}
                </div>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Clock size={12} />
                  <span>{formatMinutes(planner.availableMinutes)} Total</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Remaining Time Card */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:border-border-strong">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Unallocated Time
            </span>
            <Clock size={15} className="text-text-muted" />
          </div>

          <div className="mt-3">
            <div
              className={`text-3xl font-extrabold font-sans tabular-nums ${
                planner.remainingMinutes === 0 ? 'text-emerald-500' : 'text-foreground'
              }`}
            >
              {formatMinutes(planner.remainingMinutes)}
            </div>

            <div className="mt-2">
              {planner.remainingMinutes === 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={12} /> Fully Scheduled
                </span>
              ) : (
                <span className="text-xs text-text-muted font-medium">
                  Available for activities
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Completion Progress Card */}
        <div className="flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-sm transition-all duration-200 hover:border-border-strong">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
              Daily Completion
            </span>
            <span className="text-xs font-semibold text-text-muted tabular-nums">
              {completedCount} / {totalCount} done
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold font-sans tabular-nums text-foreground">
                {progressPercent}%
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-sans text-foreground flex items-center gap-2">
            Activity Schedule
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Sequential breakdown of your day from waking to sleep.
          </p>
        </div>

        {isReadOnly ? (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-muted shadow-xs">
            <Lock size={14} className="text-amber-500" />
            <span>Past Day (Read Only)</span>
          </div>
        ) : (
          <button
            onClick={() => {
              setEditingActivity(null);
              setIsFormOpen(true);
            }}
            disabled={planner.remainingMinutes <= 0}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Plus size={16} /> Add Activity
          </button>
        )}
      </div>

      {/* Timeline Activities List */}
      {calculatedActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-surface/50 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Clock size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              {isReadOnly ? 'No activities recorded for this day' : 'No activities scheduled yet'}
            </h3>
            <p className="max-w-sm text-sm text-text-muted">
              {isReadOnly
                ? 'No activities were scheduled for this date. Past days are read-only.'
                : 'Start building your day by adding your first task or routine block.'}
            </p>
          </div>
          {!isReadOnly && (
            <button
              onClick={() => {
                setEditingActivity(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              <Plus size={16} /> Add Activity
            </button>
          )}
        </div>
      ) : (
        <div className="relative space-y-4 py-2 before:absolute before:left-4 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border-strong/40">
          {/* Wake Up start node */}
          <div className="relative pl-10 sm:pl-12 flex items-center gap-2 text-xs font-semibold text-text-muted">
            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full  text-amber-600 dark:text-amber-400 border border-amber-500/30 bg-surface">
              <Sun size={13} />
            </div>
            <span className="tabular-nums">Wake Up — {formatTime(planner.wakeTime)}</span>
          </div>

          {/* Activity Cards */}
          {calculatedActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={
                {
                  ...activity,
                  startTime: activity.calculatedStartTime,
                  endTime: activity.calculatedEndTime,
                } as unknown as Activity
              }
              onEdit={() => handleEdit(activity as Activity)}
              onDelete={() => handleDelete(activity.id)}
              onToggleComplete={() => handleToggleComplete(activity as Activity)}
              isReadOnly={isReadOnly}
            />
          ))}

          {/* Sleep Time end node */}
          <div className="relative pl-10 sm:pl-12 flex items-center gap-2 text-xs font-semibold text-text-muted pt-2">
            <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 bg-surface">
              <Moon size={13} />
            </div>
            <span className="tabular-nums">Sleep Time — {formatTime(planner.sleepTime)}</span>
          </div>
        </div>
      )}

      {/* Activity Form Modal */}
      {!isReadOnly && isFormOpen && (
        <ActivityForm
          plannerId={planner.id}
          suggestedStartTime={
            editingActivity
              ? calculatedActivities
                  .find((a) => a.id === editingActivity.id)
                  ?.calculatedStartTime.toISOString() || planner.wakeTime.toString()
              : calculatedActivities.length > 0
                ? calculatedActivities[
                    calculatedActivities.length - 1
                  ].calculatedEndTime.toISOString()
                : planner.wakeTime.toString()
          }
          initialData={
            editingActivity
              ? { ...editingActivity, durationMinutes: editingActivity.durationMinutes }
              : null
          }
          onClose={() => {
            setIsFormOpen(false);
            setEditingActivity(null);
          }}
          onSubmit={async (payload) => {
            if (editingActivity) {
              await updateActivity({ id: editingActivity.id, payload });
            } else {
              await createActivity(payload);
            }
          }}
        />
      )}
    </div>
  );
}
