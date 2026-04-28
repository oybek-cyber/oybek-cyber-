import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPassword(password: string): string {
  return await bcrypt.hash(password, 10);
}

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // 1. Create or find a demo instructor user
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const instructor = await prisma.user.upsert({
      where: { email: 'instructor@cyberlms.uz' },
      update: { password: hashedPassword },
      create: {
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
    console.log(`✅ Instructor ready: ${instructor.email}`);

    const studentPassword = await bcrypt.hash('Student123!', 10);
    const student = await prisma.user.upsert({
      where: { email: 'student@example.com' },
      update: { password: studentPassword },
      create: {
        email: 'student@example.com',
        username: 'student',
        password: studentPassword,
        firstName: 'Ali',
        lastName: 'Valiyev',
        role: 'STUDENT',
        isActive: true,
        emailVerified: true,
      },
    });
    console.log(`✅ Student ready: ${student.email}`);

    // 2. Define courses and lessons (from frontend CoursesPage.tsx)
    const coursesData = [
      {
        id: 'cisco-ccna',
        title: 'Cisco CCNA',
        slug: 'cisco-ccna',
        description: 'Cisco CCNA networking, subnetting, routing protokollari va Switch konfiguratsiyasini o\'rganing.',
        category: 'CISCO',
        level: 'BEGINNER',
        isPublished: true,
        instructorId: instructor.id,
        lessons: [
          { id: 'ccna-1', title: 'Networking fundamentals - OSI Model', slug: 'ccna-1', videoUrl: 'n275iWp-uS4', order: 1 },
          { id: 'ccna-2', title: 'IP Addressing and Subnetting', slug: 'ccna-2', videoUrl: 'ecCuyq-Wprc', order: 2 },
          { id: 'ccna-3', title: 'VLANs and Trunking', slug: 'ccna-3', videoUrl: 'jmdXv6M-eR0', order: 3 },
          { id: 'ccna-4', title: 'OSPF Routing Protocol', slug: 'ccna-4', videoUrl: '3m27C6r-N8M', order: 4 },
          { id: 'ccna-5', title: 'Access Control Lists (ACL)', slug: 'ccna-5', videoUrl: 'aX_W_RIn2jE', order: 5 },
          { id: 'ccna-6', title: 'NAT and PAT Configuration', slug: 'ccna-6', videoUrl: '4Tsc2-zV9h0', order: 6 },
          { id: 'ccna-7', title: 'WAN Technologies', slug: 'ccna-7', videoUrl: 'O6v_R9hK2oI', order: 7 },
          { id: 'ccna-8', title: 'Network Security Basics', slug: 'ccna-8', videoUrl: 'lVshXU7979o', order: 8 },
        ]
      },
      {
        id: 'windows-server',
        title: 'Windows Server 2022',
        slug: 'windows-server-2022',
        description: 'Windows Server 2022 administratsiyasi, Active Directory, Group Policy, DNS, DHCP va xavfsizlik sozlamalari.',
        category: 'WINDOWS_SERVER',
        level: 'INTERMEDIATE',
        isPublished: true,
        instructorId: instructor.id,
        lessons: [
          { id: 'ws-1', title: 'Windows Server Installation & Setup', slug: 'ws-1', videoUrl: '1668V0m2pM8', order: 1 },
          { id: 'ws-2', title: 'Active Directory Domain Services', slug: 'ws-2', videoUrl: 'GgG87pT405U', order: 2 },
          { id: 'ws-3', title: 'Group Policy Management', slug: 'ws-3', videoUrl: 'Ssq88V_W1cE', order: 3 },
          { id: 'ws-4', title: 'DNS Configuration', slug: 'ws-4', videoUrl: 'b_f4UjH3V6s', order: 4 },
          { id: 'ws-5', title: 'DHCP Server Setup', slug: 'ws-5', videoUrl: 'v77V8vY_q0A', order: 5 },
          { id: 'ws-6', title: 'File Server and Permissions', slug: 'ws-6', videoUrl: '7T5V6hG_r9Q', order: 6 },
          { id: 'ws-7', title: 'Remote Desktop Services', slug: 'ws-7', videoUrl: 'd6yP83R-h2U', order: 7 },
        ]
      },
      {
        id: 'linux-mastery',
        title: 'Linux Mastery',
        slug: 'linux-mastery',
        description: 'Linux asoslari, Bash skriptlash, tizim ma\'muriyati va kiberxavfsizlik uchun Linux sozlamalari.',
        category: 'LINUX',
        level: 'INTERMEDIATE',
        isPublished: true,
        instructorId: instructor.id,
        lessons: [
          { id: 'lx-1', title: 'Linux va Terminal asoslari', slug: 'lx-1', videoUrl: 'v_UbeHsa69U', order: 1 },
          { id: 'lx-2', title: 'Fayl tizimi va navigatsiya', slug: 'lx-2', videoUrl: 'h3_fA-X19L8', order: 2 },
          { id: 'lx-3', title: 'Foydalanuvchilar va guruhlar', slug: 'lx-3', videoUrl: 'B0696gE09-8', order: 3 },
          { id: 'lx-4', title: 'Fayllar ruxsatlari chmod & chown', slug: 'lx-4', videoUrl: 'r3S_6X_Y_q5', order: 4 },
          { id: 'lx-5', title: 'Bash Scripting asoslari', slug: 'lx-5', videoUrl: 'mX9re7_2G4U', order: 5 },
          { id: 'lx-6', title: 'Tarmoq konfiguratsiyasi', slug: 'lx-6', videoUrl: 'zM88Zt5R0kY', order: 6 },
          { id: 'lx-7', title: 'UFW Firewall sozlamalar', slug: 'lx-7', videoUrl: 'v77V8vY_q0A', order: 7 },
          { id: 'lx-8', title: 'SSH va xavfsiz ulanish', slug: 'lx-8', videoUrl: 'rZ_A-X19Lrk', order: 8 },
          { id: 'lx-9', title: 'Cron Jobs va avtomatlashtirish', slug: 'lx-9', videoUrl: 'GgG87pT405U', order: 9 },
        ]
      },
      {
        id: 'ethical-hacking',
        title: 'Ethical Hacking',
        slug: 'ethical-hacking',
        description: 'Kali Linux, Metasploit, Nmap, Burp Suite va penetratsion test methodologiyalari.',
        category: 'ETHICAL_HACKING',
        level: 'ADVANCED',
        isPublished: true,
        instructorId: instructor.id,
        lessons: [
          { id: 'eh-1', title: 'Ethical Hacking kirish va qonun', slug: 'eh-1', videoUrl: '3Kq1MIfTWCE', order: 1 },
          { id: 'eh-2', title: 'Kali Linux o\'rnatish va sozlash', slug: 'eh-2', videoUrl: 'Z0b-4r3iU98', order: 2 },
          { id: 'eh-3', title: 'Nmap bilan tarmoq skanerlash', slug: 'eh-3', videoUrl: 'v5w9dD2gM3E', order: 3 },
          { id: 'eh-4', title: 'Metasploit Framework', slug: 'eh-4', videoUrl: '8lR27R6L_O8', order: 4 },
          { id: 'eh-5', title: 'Web App Zaifliklarni Topish', slug: 'eh-5', videoUrl: 'j6k1p8l5M9W', order: 5 },
          { id: 'eh-6', title: 'Burp Suite bilan Web Testing', slug: 'eh-6', videoUrl: 'S7d9n2r4B1Q', order: 6 },
          { id: 'eh-7', title: 'Password Cracking texnikalari', slug: 'eh-7', videoUrl: 'L2k3v7hT4mJ', order: 7 },
          { id: 'eh-8', title: 'Social Engineering hujumlar', slug: 'eh-8', videoUrl: 'Y2m8V8vY_q13', order: 8 },
          { id: 'eh-9', title: 'Hisobot yozish va metodologiya', slug: 'eh-9', videoUrl: 'Z3m8V8vY_q14', order: 9 },
        ]
      }
    ];

    // 3. Upsert courses and lessons
    for (const c of coursesData) {
      const { lessons, ...courseData } = c;
      const course = await prisma.course.upsert({
        where: { slug: courseData.slug },
        update: courseData,
        create: courseData,
      });

      console.log(`📘 Course: ${course.title}`);

      for (const l of lessons) {
        await prisma.lesson.upsert({
          where: { id: l.id },
          update: {
            title: l.title,
            slug: l.slug,
            order: l.order,
            youtubeVideoId: l.videoUrl,
            courseId: course.id,
            createdById: instructor.id,
          },
          create: {
            id: l.id,
            title: l.title,
            slug: l.slug,
            order: l.order,
            videoUrl: l.videoUrl,
            courseId: course.id,
            createdById: instructor.id,
          },
        });
      }
      console.log(`   ✅ Added ${lessons.length} lessons`);
    }

    console.log('🌱 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
