import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function computeBestStreak(logs: { date: Date }[], skipWeekends: boolean): number {
  if (logs.length === 0) return 0;

  const sortedDates = logs.map((l) => l.date.toISOString().split('T')[0]).sort();
  const logSet = new Set(sortedDates);
  const uniqueDates = Array.from(logSet).sort();

  if (uniqueDates.length === 0) return 0;

  let bestStreak = 0;
  let currentStreak = 0;

  const firstDate = new Date(`${uniqueDates[0]}T00:00:00Z`);
  const lastDate = new Date(`${uniqueDates[uniqueDates.length - 1]}T00:00:00Z`);

  for (let d = new Date(firstDate); d <= lastDate; d.setUTCDate(d.getUTCDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    if (logSet.has(dateStr)) {
      currentStreak++;
      if (currentStreak > bestStreak) {
        bestStreak = currentStreak;
      }
    } else {
      const isWeekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
      if (skipWeekends && isWeekend) {
        // Free pass
      } else {
        currentStreak = 0;
      }
    }
  }
  return bestStreak;
}

async function main() {
  const habits = await prisma.habit.findMany({ include: { logs: true } });
  let updated = 0;
  for (const habit of habits) {
    const bestStreak = computeBestStreak(habit.logs, habit.skipWeekends);
    if (habit.bestStreak !== bestStreak) {
      await prisma.habit.update({
        where: { id: habit.id },
        data: { bestStreak },
      });
      updated++;
    }
  }
  console.log(`Updated ${updated} habits with correct best streak.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
