const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const lessons = await prisma.lesson.findMany();
  console.log('Total lessons:', lessons.length);
  console.log('Lesson IDs:', lessons.map(l => l.id));
  await prisma.$disconnect();
}

check().catch(console.error);
