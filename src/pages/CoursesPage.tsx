import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Play, Clock, BookOpen, Users, Star, ChevronRight, CheckCircle } from 'lucide-react'
import { Course, Lesson } from '@app-types/index'
import axiosInstance from '@api/axiosInstance'
import { useParams } from 'react-router-dom'

// ─── Demo courses bilan real YouTube videolar ──────────────────────────────
const DEMO_COURSES: Course[] = [
  {
    id: 'cisco-ccna',
    title: 'Cisco CCNA',
    description: 'Cisco CCNA networking, subnetting, routing protokollari va Switch konfiguratsiyasini o\'rganing. Real laboratoriya mashqlari bilan.',
    instructor: 'NetworkChuck',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=340&fit=crop',
    duration: 40,
    videoPlaylistId: 'PLIhvC56v63IJVXv0GJcl9vO5Z6znCVb1-',
    lessons: [
      { id: 'ccna-1', title: 'Networking fundamentals - OSI Model', videoId: 'vv4y_uOneC0', duration: 15, order: 1, transcript: 'Bu darsda OSI modelini chuqur ko\'ramiz...' },
      { id: 'ccna-2', title: 'IP Addressing and Subnetting', videoId: '1TgSuB3VG0k', duration: 20, order: 2, transcript: 'IP manzillash va subnetting asoslari...' },
      { id: 'ccna-3', title: 'VLANs and Trunking', videoId: 'MmwF1oHOvmg', duration: 18, order: 3, transcript: 'VLAN va trunk portlar...' },
      { id: 'ccna-4', title: 'OSPF Routing Protocol', videoId: 'kfvJ8QVJscc', duration: 22, order: 4, transcript: 'OSPF dinamik routing...' },
      { id: 'ccna-5', title: 'Access Control Lists (ACL)', videoId: 'MRBD7BjHJkA', duration: 19, order: 5, transcript: 'ACL bilan tarmoq himoyasi...' },
      { id: 'ccna-6', title: 'NAT and PAT Configuration', videoId: 'QBqPEoKVoqE', duration: 16, order: 6, transcript: 'NAT va PAT konfiguratsiyasi...' },
      { id: 'ccna-7', title: 'WAN Technologies', videoId: 'JtRKKLCCEq8', duration: 25, order: 7, transcript: 'WAN texnologiyalari...' },
      { id: 'ccna-8', title: 'Network Security Basics', videoId: 'E03gh1huvW4', duration: 21, order: 8, transcript: 'Tarmoq xavfsizligi asoslari...' },
    ],
  },
  {
    id: 'windows-server',
    title: 'Windows Server 2022',
    description: 'Windows Server 2022 administratsiyasi, Active Directory, Group Policy, DNS, DHCP va xavfsizlik sozlamalari.',
    instructor: 'Taylor Kinser',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=600&h=340&fit=crop',
    duration: 35,
    videoPlaylistId: 'PL83Rk4V1eT8nBp4x_yqUjwR8xlMzfJ0VI',
    lessons: [
      { id: 'ws-1', title: 'Windows Server Installation & Setup', videoId: 'tS13bQ1NfhQ', duration: 18, order: 1, transcript: 'Windows Server 2022 o\'rnatish...' },
      { id: 'ws-2', title: 'Active Directory Domain Services', videoId: 'u7WmigblwnI', duration: 25, order: 2, transcript: 'Active Directory asoslari...' },
      { id: 'ws-3', title: 'Group Policy Management', videoId: 'DKi4lABTRp0', duration: 22, order: 3, transcript: 'Group Policy sozlamalari...' },
      { id: 'ws-4', title: 'DNS Configuration', videoId: 'YEVEomWolXg', duration: 15, order: 4, transcript: 'DNS xizmati sozlash...' },
      { id: 'ws-5', title: 'DHCP Server Setup', videoId: '8BNShwGJ5wk', duration: 14, order: 5, transcript: 'DHCP server konfiguratsiya...' },
      { id: 'ws-6', title: 'File Server and Permissions', videoId: 'MiHRd65SMVA', duration: 20, order: 6, transcript: 'File server va ruxsatlar...' },
      { id: 'ws-7', title: 'Remote Desktop Services', videoId: '0l-3gOxPbpI', duration: 17, order: 7, transcript: 'Remote Desktop xizmati...' },
    ],
  },
  {
    id: 'linux-mastery',
    title: 'Linux Mastery',
    description: 'Linux asoslari, Bash skriptlash, tizim ma\'muriyati va kiberxavfsizlik uchun Linux sozlamalari.',
    instructor: 'Ziyodbek Nabijonov',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&h=340&fit=crop',
    duration: 45,
    videoPlaylistId: 'PLtGnc4I6s8dkBknNhj_9ueHPCxSMlO1cI',
    lessons: [
      { id: 'lx-1', title: 'Linux va Terminal asoslari', videoId: 'RRqiru2K8b0', duration: 17, order: 1, transcript: 'Terminal orqali Linux boshqarish...' },
      { id: 'lx-2', title: 'Fayl tizimi va navigatsiya', videoId: 'A3G-3hp88mo', duration: 14, order: 2, transcript: 'cd, ls, pwd, mkdir, rm komandalari...' },
      { id: 'lx-3', title: 'Foydalanuvchilar va guruhlar', videoId: 'jwnvKOjmtMo', duration: 19, order: 3, transcript: 'useradd, usermod, passwd...' },
      { id: 'lx-4', title: 'Fayllar ruxsatlari chmod & chown', videoId: '4e669hSjaX8', duration: 15, order: 4, transcript: 'chmod 755 va chown boshqaruvi...' },
      { id: 'lx-5', title: 'Bash Scripting asoslari', videoId: 'v-F3YLd6oMw', duration: 26, order: 5, transcript: 'Bash skript yaratish va ishlatish...' },
      { id: 'lx-6', title: 'Tarmoq konfiguratsiyasi', videoId: 'yCj7n4KOHno', duration: 18, order: 6, transcript: 'ifconfig, ip addr, netstat...' },
      { id: 'lx-7', title: 'UFW Firewall sozlamalar', videoId: 'qPEA6J9pjG8', duration: 16, order: 7, transcript: 'UFW bilan xavfsizlik devori...' },
      { id: 'lx-8', title: 'SSH va xavfsiz ulanish', videoId: 'Atbl7D_yPug', duration: 20, order: 8, transcript: 'SSH konfiguratsiya va xavfsizlik...' },
      { id: 'lx-9', title: 'Cron Jobs va avtomatlashtirish', videoId: 'v952m13p-b4', duration: 13, order: 9, transcript: 'Cron orqali vazifalar avtomatlash...' },
    ],
  },
  {
    id: 'ethical-hacking',
    title: 'Ethical Hacking',
    description: 'Kali Linux, Metasploit, Nmap, Burp Suite va penetratsion test methodologiyalari. OWASP Top 10 zaifliklar.',
    instructor: 'TCM Security',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=340&fit=crop',
    duration: 50,
    videoPlaylistId: 'PLLKT__MCUeixCoi2jtP2Jj8nZzM4MOzBL',
    lessons: [
      { id: 'eh-1', title: 'Ethical Hacking kirish va qonun', videoId: 'fNzpcB7ODxQ', duration: 14, order: 1, transcript: 'Etik hacking nima va qonuniy chegaralar...' },
      { id: 'eh-2', title: 'Kali Linux o\'rnatish va sozlash', videoId: 'lZAoFs75_cs', duration: 20, order: 2, transcript: 'Kali Linux setup va muhit...' },
      { id: 'eh-3', title: 'Nmap bilan tarmoq skanerlash', videoId: '4t4kBkMsDbQ', duration: 22, order: 3, transcript: 'Nmap komanda va scan turlari...' },
      { id: 'eh-4', title: 'Metasploit Framework', videoId: 'QltiGGxlJ4M', duration: 28, order: 4, transcript: 'Metasploit asosiy buyruqlar...' },
      { id: 'eh-5', title: 'Web App Zaifliklarni Topish', videoId: 'jmgsgjPn1vs', duration: 24, order: 5, transcript: 'SQL Injection, XSS, CSRF...' },
      { id: 'eh-6', title: 'Burp Suite bilan Web Testing', videoId: 'G3hpAeoZ4ek', duration: 26, order: 6, transcript: 'Burp Suite interceptor va scanner...' },
      { id: 'eh-7', title: 'Password Cracking texnikalari', videoId: 'aXkPHZ5f2rI', duration: 19, order: 7, transcript: 'Hashcat, John the Ripper...' },
      { id: 'eh-8', title: 'Social Engineering hujumlar', videoId: 'PWVN3Rq4gzw', duration: 17, order: 8, transcript: 'Phishing va social engineering...' },
      { id: 'eh-9', title: 'Hisobot yozish va metodologiya', videoId: 'i2S8uiZ2cRM', duration: 21, order: 9, transcript: 'Penetration test hisoboti...' },
    ],
  },
]

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/30',
  Intermediate: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  Advanced: 'text-red-400 bg-red-400/10 border-red-400/30',
}

export const CoursesPage: React.FC = () => {
  const { t } = useTranslation()
  const { courseId } = useParams<{ courseId?: string }>()
  const [courses] = useState<Course[]>(DEMO_COURSES)

  // Select course based on URL param, default to first
  const initialCourse = courseId
    ? DEMO_COURSES.find(c => c.id === courseId) || DEMO_COURSES[0]
    : DEMO_COURSES[0]

  const [selectedCourse, setSelectedCourse] = useState<Course>(initialCourse)
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(initialCourse.lessons[0])
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())

  // Update selected course when URL param changes
  useEffect(() => {
    if (courseId) {
      const found = DEMO_COURSES.find(c => c.id === courseId)
      if (found) {
        setSelectedCourse(found)
        setSelectedLesson(found.lessons[0])
        setCompletedLessons(new Set())
      }
    }
  }, [courseId])

  const progress = Math.round((completedLessons.size / selectedCourse.lessons.length) * 100)

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setCompletedLessons(prev => new Set([...prev, lesson.id]))
  }

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    setSelectedLesson(course.lessons[0])
    setCompletedLessons(new Set())
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-black via-cyber-navy to-cyber-black">
      {/* Top course tabs */}
      <div className="border-b border-cyber-blue/20 bg-cyber-black/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {courses.map(course => (
              <motion.button
                key={course.id}
                onClick={() => handleCourseSelect(course)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-shrink-0 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedCourse.id === course.id
                    ? 'bg-cyber-blue text-white shadow-lg shadow-cyber-blue/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {course.title}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Course header */}
        <motion.div
          key={selectedCourse.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-4 mb-6 bg-cyber-navy/30 border border-cyber-blue/20 rounded-xl p-5"
        >
          <img
            src={selectedCourse.thumbnail}
            alt={selectedCourse.title}
            className="w-full md:w-48 h-32 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-white">{selectedCourse.title}</h1>
              <span className={`text-xs px-2 py-1 rounded-full border font-semibold ${LEVEL_COLORS[selectedCourse.level]}`}>
                {selectedCourse.level}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-3">{selectedCourse.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Users size={14} className="text-cyber-blue" /> {selectedCourse.instructor}</span>
              <span className="flex items-center gap-1"><BookOpen size={14} className="text-cyber-blue" /> {selectedCourse.lessons.length} ta dars</span>
              <span className="flex items-center gap-1"><Clock size={14} className="text-cyber-blue" /> {selectedCourse.duration} soat</span>
              <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" /> 4.8 / 5.0</span>
            </div>
            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span className="text-cyber-blue font-semibold">{progress}%</span>
              </div>
              <div className="h-1.5 bg-cyber-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyber-blue to-cyan-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main layout: sidebar + player */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Lesson sidebar */}
          <motion.div
            key={selectedCourse.id + '-sidebar'}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-cyber-navy/30 border border-cyber-blue/20 rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-cyber-blue/20 bg-cyber-black/30">
              <h3 className="text-white font-bold text-sm">Darslar</h3>
              <p className="text-xs text-gray-500 mt-1">
                {completedLessons.size} / {selectedCourse.lessons.length} tugatildi
              </p>
            </div>
            <div className="overflow-y-auto max-h-[520px] p-2 space-y-1">
              {selectedCourse.lessons.map((lesson, idx) => {
                const isDone = completedLessons.has(lesson.id)
                const isActive = selectedLesson?.id === lesson.id
                return (
                  <motion.button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    whileHover={{ x: 3 }}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-cyber-blue/25 border border-cyber-blue text-white'
                        : 'border border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0">
                        {isDone
                          ? <CheckCircle size={14} className="text-green-400" />
                          : isActive
                            ? <Play size={14} className="text-cyber-blue" />
                            : <span className="text-xs text-gray-600 font-mono w-3.5 inline-block text-center">{idx + 1}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold leading-tight truncate">{lesson.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{lesson.duration} min</p>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Video player area */}
          <motion.div
            key={selectedLesson?.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-3 space-y-4"
          >
            {/* YouTube embed */}
            <div className="rounded-xl overflow-hidden border border-cyber-blue/20 bg-black aspect-video">
              {selectedLesson?.videoId ? (
                <iframe
                  key={selectedLesson.videoId}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedLesson.videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={selectedLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyber-navy to-cyber-black">
                  <div className="text-center">
                    <Play size={64} className="text-cyber-blue/30 mx-auto mb-4" />
                    <p className="text-gray-500">Video topilmadi</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson info */}
            <div className="bg-cyber-navy/30 border border-cyber-blue/20 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{selectedLesson?.title}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Clock size={14} />
                    {selectedLesson?.duration} daqiqa
                    <span className="text-cyber-blue">•</span>
                    {selectedCourse.instructor}
                  </p>
                </div>
                <motion.button
                  onClick={() => {
                    if (selectedLesson) setCompletedLessons(prev => new Set([...prev, selectedLesson.id]))
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedLesson && completedLessons.has(selectedLesson.id)
                      ? 'bg-green-500/20 border border-green-500 text-green-400'
                      : 'bg-cyber-blue text-white hover:bg-cyan-500'
                  }`}
                >
                  {selectedLesson && completedLessons.has(selectedLesson.id) ? '✓ Tugatildi' : "Dars tugatildi"}
                </motion.button>
              </div>

              {selectedLesson?.transcript && (
                <div className="mt-4 pt-4 border-t border-cyber-blue/10">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">📝 Dars haqida</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{selectedLesson.transcript}</p>
                </div>
              )}

              {/* Next lesson button */}
              {(() => {
                const currentIdx = selectedCourse.lessons.findIndex(l => l.id === selectedLesson?.id)
                const nextLesson = selectedCourse.lessons[currentIdx + 1]
                return nextLesson ? (
                  <motion.button
                    onClick={() => handleLessonSelect(nextLesson)}
                    whileHover={{ x: 4 }}
                    className="mt-4 flex items-center gap-2 text-cyber-blue hover:text-cyan-400 text-sm font-semibold transition-colors"
                  >
                    Keyingi dars: {nextLesson.title}
                    <ChevronRight size={16} />
                  </motion.button>
                ) : (
                  <div className="mt-4 flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <CheckCircle size={16} />
                    Kurs muvaffaqiyatli tugatildi!
                  </div>
                )
              })()}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
