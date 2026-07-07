'use client';

import { useRouter } from 'next/navigation';
import { Flame, TrendingUp } from 'lucide-react';
import TaskBox from './TaskBox';
import { useTasks } from '@/hooks/useTasks';
import { useRevisionQueue } from '@/hooks/useRevisions';
import type { TaskFilterPeriod } from '@/lib/filterTasks';

function weeklyCompletionsFromTasks(tasks: { updatedAt: string; status: string }[]) {
  const days = Array(7).fill(0) as number[];
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  for (const task of tasks) {
    if (task.status === 'COMPLETED') {
      const d = new Date(task.updatedAt);
      if (d >= startOfWeek) {
        days[d.getDay()] += 1;
      }
    }
  }
  return days;
}

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function MiniBarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const todayIdx = new Date().getDay();
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted/60">
          This week
        </p>
        <p className="text-[10px] font-bold text-primary">
          {total} task{total !== 1 ? 's' : ''} completed
        </p>
      </div>
      <div className="flex items-end gap-1.5 h-20">
        {values.map((v, i) => {
          const heightPct = (v / max) * 100;
          const isToday = i === todayIdx;
          const hasData = v > 0;
          return (
            <div key={i} className="group relative flex flex-1 flex-col items-center">
              {hasData && (
                <div className="pointer-events-none absolute -top-6 left-1/2 z-10 -translate-x-1/2 rounded px-1.5 py-0.5 text-[9px] font-bold whitespace-nowrap bg-foreground text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  {v}
                </div>
              )}
              <div
                className="w-full"
                style={{ height: '80px', display: 'flex', alignItems: 'flex-end' }}
              >
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isToday
                      ? 'bg-primary shadow-[0_0_8px_0px_rgba(var(--primary-rgb),0.4)]'
                      : hasData
                        ? 'bg-primary/40'
                        : 'bg-primary/10'
                  }`}
                  style={{ height: `${Math.max(heightPct, 6)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-1.5">
        {DAY_LABELS.map((label, i) => (
          <div
            key={i}
            className={`flex-1 text-center text-[9px] font-semibold tracking-wide ${
              i === new Date().getDay() ? 'text-primary' : 'text-text-muted/60'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressOverviewCard() {
  const { data: tasks = [] } = useTasks();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const goalPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const activity = weeklyCompletionsFromTasks(tasks);

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp size={15} className="text-primary" />
        <p className="text-sm font-bold uppercase text-foreground">Progress Overview</p>
      </div>
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-text-muted">Weekly Goal</span>
          <span className="font-bold text-primary">{goalPct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${goalPct}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-lg bg-surface-muted px-4 py-3">
          <div className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
            Tasks Done
          </div>
          <span className="text-2xl font-black text-(--completed-text)">{completed}</span>
        </div>
        <div className="rounded-lg bg-surface-muted px-4 py-3">
          <div className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
            In Progress
          </div>
          <span className="text-2xl font-black text-(--progress-text)">{inProgress}</span>
        </div>
      </div>
      <MiniBarChart values={activity} />
    </div>
  );
}

function RevisionStreakCard() {
  const router = useRouter();
  const { data: revisions = [] } = useRevisionQueue();
  const pending = revisions.length;

  return (
    <div className="relative overflow-hidden rounded-lg bg-primary p-5">
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 -right-2 h-32 w-32 rounded-full bg-white/5" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <Flame size={16} className="text-white/90" />
          <p className="text-sm font-bold text-white">Revision Streak</p>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-white/75">
          {pending > 0
            ? `Maintain your learning momentum. ${pending} ${pending === 1 ? 'item is' : 'items are'} ready for review.`
            : "You're all caught up! Great job staying on top of your revisions."}
        </p>
        <button
          onClick={() => router.push('/revision-queue')}
          className="
            w-full rounded-lg bg-white px-4 py-2.5
            text-sm font-bold text-primary shadow-sm transition-all duration-200
            hover:bg-white/90 active:scale-[0.98]
          "
        >
          Start Review Session
        </button>
      </div>
    </div>
  );
}

const DashboardContent = ({ filter }: { filter: TaskFilterPeriod }) => {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div>
        <TaskBox filter={filter} />
      </div>
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <ProgressOverviewCard />
        <RevisionStreakCard />
      </div>
    </div>
  );
};

export default DashboardContent;
