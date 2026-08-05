const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.count();
  console.log("Users:", users);

  try {
    const tasks = await prisma.task.count();
    console.log("Tasks:", tasks);
  } catch(e) { console.log("Tasks error"); }
  
  try {
    const roadmaps = await prisma.roadmap.count();
    console.log("Roadmaps:", roadmaps);
  } catch(e) { console.log("Roadmaps error"); }
  
  try {
    const notes = await prisma.note.count();
    console.log("Notes:", notes);
  } catch (e) {
    console.log("Notes table does not exist or Prisma doesn't have it");
  }

  try {
    const dayplanners = await prisma.dayPlanner.count();
    console.log("DayPlanners:", dayplanners);
  } catch (e) {
    console.log("DayPlanner table does not exist");
  }
}
main().then(() => prisma.$disconnect());
