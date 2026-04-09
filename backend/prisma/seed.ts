import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Simple password hash for seeding purposes
function hashPassword(password: string): string {
  return '$2a$10$seedhashfordemopurposesonly' + createHash('sha256').update(password).digest('hex').slice(0, 31);
}

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Create or find a demo instructor user
    const hashedPassword = hashPassword('Password123!');

    let instructor = await prisma.user.findUnique({
      where: { email: 'instructor@cyberlms.uz' },
    });

    if (!instructor) {
      instructor = await prisma.user.create({
        data: {
          email: 'instructor@cyberlms.uz',
          username: 'instructor',
          password: hashedPassword,
          firstName: 'Demo',
          lastName: 'Instructor',
          role: 'INSTRUCTOR',
          isActive: true,
          emailVerified: true,
        },
      });
      console.log(`✅ Created instructor: ${instructor.email}`);
    } else {
      console.log(`ℹ️  Instructor already exists: ${instructor.email}`);
    }

    // Create courses
    const coursesData = [
      {
        title: 'Cisco CCNA',
        slug: 'cisco-ccna',
        description: 'Master CCNA networking, subnetting, va routing protokollarini o\'rganing',
        category: 'CISCO',
        level: 'BEGINNER',
        isPublished: true,
        instructorId: instructor.id,
      },
      {
        title: 'Windows Server 2022',
        slug: 'windows-server-2022',
        description: 'Windows Server administratsiyasi, Active Directory va xavfsizlikni o\'rganing',
        category: 'WINDOWS_SERVER',
        level: 'INTERMEDIATE',
        isPublished: true,
        instructorId: instructor.id,
      },
      {
        title: 'Linux Mastery',
        slug: 'linux-mastery',
        description: 'Linux asoslari, bash skriptlash va tizim xavfsizligi',
        category: 'LINUX',
        level: 'INTERMEDIATE',
        isPublished: true,
        instructorId: instructor.id,
      },
      {
        title: 'Ethical Hacking',
        slug: 'ethical-hacking',
        description: 'OWASP Top 10, penetratsion test va zaifliklarni baholash',
        category: 'ETHICAL_HACKING',
        level: 'ADVANCED',
        isPublished: true,
        instructorId: instructor.id,
      },
    ];

    let createdCount = 0;
    for (const courseData of coursesData) {
      const existing = await prisma.course.findUnique({ where: { slug: courseData.slug } });
      if (!existing) {
        await prisma.course.create({ data: courseData });
        createdCount++;
      }
    }

    console.log(`✅ Created ${createdCount} courses (${coursesData.length - createdCount} already existed)`);
    console.log('🌱 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
