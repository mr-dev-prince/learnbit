import React, { useState } from 'react';
import { DayPlannerWithActivities } from '@/services/day-planner.service';
import ActivityCard from './ActivityCard';
import ActivityForm from './ActivityForm';
import { Plus, CheckCircle, Clock, Edit2 } from 'lucide-react';

import { Activity } from '@prisma/client';

interface PlannerDashboardProps {
  planner: DayPlannerWithActivities;
  createActivity: (payload: { plannerId: string; title: string; notes?: string | null; startTime: string; endTime: string }) => Promise<Activity>;
  updateActivity: (args: { id: string; payload: { title?: string; notes?: string | null; startTime?: string; endTime?: string; completed?: boolean } }) => Promise<Activity>;
  deleteActivity: (id: string) => Promise<void>;
  updatePlanner: (args: { id: string; payload: { wakeTime?: string; sleepTime?: string } }) => Promise<DayPlannerWithActivities>;
}

export default function PlannerDashboard({
  planner,
  createActivity,
  updateActivity,
  deleteActivity,
  updatePlanner,
}: PlannerDashboardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const [isEditingTimes, setIsEditingTimes] = useState(false);
  const [wakeTimeStr, setWakeTimeStr] = useState('');
  const [sleepTimeStr, setSleepTimeStr] = useState('');
  const [isUpdatingTimes, setIsUpdatingTimes] = useState(false);

  const handleEditTimes = () => {
    const w = new Date(planner.wakeTime);
    setWakeTimeStr(`${w.getHours().toString().padStart(2, '0')}:${w.getMinutes().toString().padStart(2, '0')}`);
    
    const s = new Date(planner.sleepTime);
    setSleepTimeStr(`${s.getHours().toString().padStart(2, '0')}:${s.getMinutes().toString().padStart(2, '0')}`);
    
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
        sleepTime: sleepDate.toISOString() 
      } 
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
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      await deleteActivity(id);
    }
  };

  const handleToggleComplete = async (activity: Activity) => {
    await updateActivity({ id: activity.id, payload: { completed: !activity.completed } });
  };

  const formatMinutes = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hours}h ${m}m`;
  };

  const calculatedActivities = planner.activities.reduce<Array<Activity & { calculatedStartTime: Date, calculatedEndTime: Date }>>((acc, activity) => {
    const prevEndTime = acc.length > 0 ? acc[acc.length - 1].calculatedEndTime.getTime() : new Date(planner.wakeTime).getTime();
    const start = new Date(prevEndTime);
    const end = new Date(prevEndTime + activity.durationMinutes * 60000);
    acc.push({ ...activity, calculatedStartTime: start, calculatedEndTime: end });
    return acc;
  }, []);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col justify-center relative group">
          <div className="flex justify-between items-center mb-1">
            <div className="text-foreground/60 font-semibold text-sm uppercase tracking-wider">Day Schedule</div>
            {!isEditingTimes && (
              <button 
                onClick={handleEditTimes}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground/40 hover:text-primary p-1"
                title="Edit times"
              >
                <Edit2 size={14} />
              </button>
            )}
          </div>
          
          {isEditingTimes ? (
            <div className="mt-2 space-y-3">
              <div className="flex gap-2 items-center">
                <input 
                  type="time" 
                  value={wakeTimeStr}
                  onChange={e => setWakeTimeStr(e.target.value)}
                  className="w-full p-1.5 text-sm rounded border border-border bg-background focus:ring-1 focus:ring-primary outline-none" 
                />
                <span className="text-foreground/40">-</span>
                <input 
                  type="time" 
                  value={sleepTimeStr}
                  onChange={e => setSleepTimeStr(e.target.value)}
                  className="w-full p-1.5 text-sm rounded border border-border bg-background focus:ring-1 focus:ring-primary outline-none" 
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveTimes}
                  disabled={isUpdatingTimes}
                  className="flex-1 bg-primary text-white text-xs font-bold py-1.5 rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  Save
                </button>
                <button 
                  onClick={() => setIsEditingTimes(false)}
                  disabled={isUpdatingTimes}
                  className="flex-1 bg-foreground/10 text-foreground text-xs font-bold py-1.5 rounded hover:bg-foreground/20"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-xl font-black text-foreground mt-1">
                {formatTime(planner.wakeTime)} - {formatTime(planner.sleepTime)}
              </div>
              <div className="text-sm font-medium text-primary mt-1">
                {formatMinutes(planner.availableMinutes)} Available
              </div>
            </>
          )}
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <div className="text-foreground/60 font-semibold text-sm mb-1 uppercase tracking-wider">Remaining Time</div>
          <div className={`text-3xl font-black ${planner.remainingMinutes === 0 ? 'text-green-500' : 'text-foreground'}`}>
            {formatMinutes(planner.remainingMinutes)}
          </div>
          {planner.remainingMinutes === 0 && (
            <div className="text-sm font-medium text-green-500 mt-1 flex items-center gap-1">
              <CheckCircle size={14} /> Fully Planned
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <div className="text-foreground/60 font-semibold text-sm mb-1 uppercase tracking-wider">Progress</div>
          <div className="flex items-end gap-3">
            <div className="text-3xl font-black text-foreground">{progressPercent}%</div>
            <div className="text-sm font-medium text-foreground/60 pb-1">
              {completedCount} / {totalCount} completed
            </div>
          </div>
          <div className="w-full bg-border h-2.5 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Timeline</h3>
        <button
          onClick={() => {
            setEditingActivity(null);
            setIsFormOpen(true);
          }}
          disabled={planner.remainingMinutes <= 0}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg shadow-sm transition-all ${
            planner.remainingMinutes <= 0 
              ? 'bg-foreground/10 text-foreground/40 cursor-not-allowed' 
              : 'bg-primary text-white hover:opacity-90 active:scale-95'
          }`}
        >
          <Plus size={18} /> Add Activity
        </button>
      </div>

      <div className="space-y-4 relative">
        {calculatedActivities.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-surface/50">
            <Clock size={32} className="mx-auto text-primary mb-3 opacity-50" />
            <p className="text-foreground/60 font-medium">No activities planned yet.</p>
            <p className="text-foreground/40 text-sm mt-1">Click &quot;Add Activity&quot; to start filling your day.</p>
          </div>
        ) : (
          calculatedActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={{
                ...activity,
                startTime: activity.calculatedStartTime,
                endTime: activity.calculatedEndTime
              } as unknown as Activity}
              onEdit={() => handleEdit(activity as Activity)}
              onDelete={() => handleDelete(activity.id)}
              onToggleComplete={() => handleToggleComplete(activity as Activity)}
            />
          ))
        )}
      </div>

      {isFormOpen && (
        <ActivityForm
          plannerId={planner.id}
          suggestedStartTime={
            editingActivity 
              ? (calculatedActivities.find(a => a.id === editingActivity.id)?.calculatedStartTime.toISOString() || planner.wakeTime.toString())
              : (calculatedActivities.length > 0 
                  ? calculatedActivities[calculatedActivities.length - 1].calculatedEndTime.toISOString() 
                  : planner.wakeTime.toString())
          }
          initialData={editingActivity ? { ...editingActivity, durationMinutes: editingActivity.durationMinutes } : null}
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
