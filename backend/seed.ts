import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Seeding database with initial courses...');

    // Create sample courses
    const courses = await prisma.course.createMany({
      data: [
        {
          title: 'Cisco CCNA',
          slug: 'cisco-ccna',
          description: 'Master CCNA networking, subnetting, and routing protocols',
          instructor: 'Cisco Learning Network',
          category: 'CISCO',
          level: 'BEGINNER',
          duration: 40,
          thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
          videoPlaylistId: 'PLEiEAq2vof0f-7bw9yb5Yy7QWgr0PH0-A',
          isPublished: true,
        },
        {
          title: 'Windows Server 2022',
          slug: 'windows-server-2022',
          description: 'Learn Windows Server administration, AD, and security',
          instructor: 'Microsoft Learn',
          category: 'WINDOWS_SERVER',
          level: 'INTERMEDIATE',
          duration: 35,
          thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
          videoPlaylistId: 'PL83Rk4V1eT8nBp4x_yqUjwR8xlMzfJ0VI',
          isPublished: true,
        },
        {
          title: 'Linux Mastery',
          slug: 'linux-mastery',
          description: 'Linux fundamentals, bash scripting, and system security',
          instructor: 'Linux Academy',
          category: 'LINUX',
          level: 'INTERMEDIATE',
          duration: 45,
          thumbnail: 'https://images.unsplash.com/photo-1610986465129-ca33cf6d8054?w=500&h=300&fit=crop',
          videoPlaylistId: 'PL8m6MhKMiHDuhTKxOxVB2r9cZ1EcDKXjd',
          isPublished: true,
        },
        {
          title: 'Ethical Hacking',
          slug: 'ethical-hacking',
          description: 'OWASP Top 10, penetration testing, and vulnerability assessment',
          instructor: 'OWASP Foundation',
          category: 'ETHICAL_HACKING',
          level: 'ADVANCED',
          duration: 50,
          thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd94c3e033b?w=500&h=300&fit=crop',
          videoPlaylistId: 'PL-5z-5DP71Hgq7MHb9jCqL5t4EkQ2Vhq6',
          isPublished: true,
        },
      ],
    });

    console.log(`✅ Created ${courses.count} courses`);
    console.log('🌱 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
