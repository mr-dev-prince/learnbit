import React from 'react';
import { CheckCircle2, Flame, Sparkles } from 'lucide-react';
import type { Habit } from '@/types/Habit';

export function HabitStatsCard({ habits, todayStr }: { habits: Habit[]; todayStr: string }) {
  const completedToday = habits.filter((h) =>
    h.logs?.some((l) => l.date.split('T')[0] === todayStr),
  ).length;

  const totalToday = habits.length;

  const allBestStreaks = habits.map((h) => h.bestStreak ?? 0);
  const bestStreak = allBestStreaks.length ? Math.max(...allBestStreaks) : 0;
  const totalCompletions = habits.reduce((acc, h) => acc + (h.logs?.length ?? 0), 0);

  const stats = [
    {
      label: "Today's Progress",
      value: `${completedToday}/${totalToday}`,
      color: 'text-foreground',
      bg: 'bg-surface-muted',
      icon: <CheckCircle2 size={15} className="text-text-muted" />,
    },
    {
      label: 'Best Streak',
      value: `${bestStreak}d`,
      color: 'text-orange-500',
      bg: 'bg-orange-500/8',
      icon: <Flame size={15} className="text-orange-500/70" />,
    },
    {
      label: 'Total Completions',
      value: totalCompletions,
      color: 'text-[var(--completed-text)]',
      bg: 'bg-[var(--completed-bg)]',
      icon: <Sparkles size={15} className="text-(--completed-text)/70" />,
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-text-muted">
        <Sparkles size={12} />
        Overview
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex items-center justify-between rounded-lg px-5 py-4 ${s.bg}`}
          >
            <div className="flex items-center gap-3">
              {s.icon}
              <span className="text-sm font-medium text-foreground">{s.label}</span>
            </div>
            <span className={`text-2xl font-black tabular-nums ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
