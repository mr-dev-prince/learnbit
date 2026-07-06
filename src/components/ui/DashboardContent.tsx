'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import TaskBox from './TaskBox';
import { useTasks } from '@/hooks/useTasks';
import { useRevisionQueue } from '@/hooks/useRevisions';

function weeklyActivityFromTasks(tasks: { createdAt: string; status: string }[]) {
  const days = Array(7).fill(0) as number[];
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
  startOfWeek.setHours(0, 0, 0, 0);

  for (const task of tasks) {
    const d = new Date(task.createdAt);
    if (d >= startOfWeek) {
      days[d.getDay()] += 1;
    }
  }
  return days;
}

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function MiniBarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const todayIdx = new Date().getDay();

  return (
    <div className="mt-5">
      <div className="flex items-end gap-1.5 h-20">
        {values.map((v, i) => {
          const heightPct = (v / max) * 100;
          const isToday = i === todayIdx;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md"
                style={{ height: '100%', display: 'flex', alignItems: 'flex-end' }}
              >
                <div
                  className={`w-full rounded-t-md transition-all duration-500 ${
                    isToday ? 'bg-primary' : 'bg-primary/20'
                  }`}
                  style={{ height: `${Math.max(heightPct, 8)}%` }}
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
  const activity = weeklyActivityFromTasks(tasks);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
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
        <div className="rounded-xl bg-surface-muted px-4 py-3">
          <div className="mb-1 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-text-muted">
            Tasks Done
          </div>
          <span className="text-2xl font-black text-(--completed-text)">{completed}</span>
        </div>
        <div className="rounded-xl bg-surface-muted px-4 py-3">
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
    <div className="relative overflow-hidden rounded-2xl bg-primary p-5">
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
            w-full rounded-xl bg-white px-4 py-2.5
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

const DashboardContent = () => {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div>
        <TaskBox />
      </div>
      <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <ProgressOverviewCard />
        <RevisionStreakCard />
      </div>
    </div>
  );
};

export default DashboardContent;
