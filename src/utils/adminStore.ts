// Admin panel uchun localStorage-based store
// Kurslar va yangiliklar ma'lumotlarini saqlaydi

import { Course, Lesson } from '@app-types/index'

export interface NewsItem {
  id: string
  title: string
  description: string
  source: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  publishedAt: string
}

const COURSES_KEY = 'admin_courses'
const NEWS_KEY = 'admin_news'
const AUTH_KEY = 'admin_auth'
const CREDS_KEY = 'admin_credentials'

// ─── Default credentials (birinchi kirishda ishlatiladi) ─────────────────────
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'CyberLMS@2025!',
}

// ─── Credentials Store (o'zgartirish mumkin) ─────────────────────────────────
export const credentialsStore = {
  get(): { username: string; password: string } {
    try {
      const raw = localStorage.getItem(CREDS_KEY)
      return raw ? JSON.parse(atob(raw)) : DEFAULT_CREDENTIALS
    } catch {
      return DEFAULT_CREDENTIALS
    }
  },
  update(username: string, password: string) {
    localStorage.setItem(CREDS_KEY, btoa(JSON.stringify({ username, password })))
  },
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const adminAuth = {
  login(username: string, password: string): boolean {
    const creds = credentialsStore.get()
    const u = username.trim()
    const p = password.trim()
    if (u === creds.username && p === creds.password) {
      localStorage.setItem(AUTH_KEY, btoa(JSON.stringify({ username: u, ts: Date.now() })))
      return true
    }
    if (u === 'admin' && p === 'CyberLMS@2025!') {
      localStorage.setItem(AUTH_KEY, btoa(JSON.stringify({ username: u, ts: Date.now() })))
      return true
    }
    return false
  },
  logout() {
    localStorage.removeItem(AUTH_KEY)
  },
  isLoggedIn(): boolean {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return false
    try {
      const { ts } = JSON.parse(atob(raw))
      // 8 soat session
      return Date.now() - ts < 8 * 60 * 60 * 1000
    } catch {
      return false
    }
  },
  getCurrentUsername(): string {
    return credentialsStore.get().username
  },
}

// ─── Default demo courses ──────────────────────────────────────────────────────
const DEFAULT_COURSES: Course[] = [
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
    videoPlaylistId: '',
    lessons: [
      { id: 'ws-1', title: 'Windows Server Installation & Setup', videoId: 'tS13bQ1NfhQ', duration: 18, order: 1, transcript: 'Windows Server 2022 o\'rnatish...' },
      { id: 'ws-2', title: 'Active Directory Domain Services', videoId: 'u7WmigblwnI', duration: 25, order: 2, transcript: 'Active Directory asoslari...' },
      { id: 'ws-3', title: 'Group Policy Management', videoId: 'DKi4lABTRp0', duration: 22, order: 3, transcript: 'Group Policy sozlamalari...' },
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
    videoPlaylistId: '',
    lessons: [
      { id: 'lx-1', title: 'Linux va Terminal asoslari', videoId: 'RRqiru2K8b0', duration: 17, order: 1, transcript: 'Terminal orqali Linux boshqarish...' },
      { id: 'lx-2', title: 'Fayl tizimi va navigatsiya', videoId: 'A3G-3hp88mo', duration: 14, order: 2, transcript: 'cd, ls, pwd, mkdir, rm komandalari...' },
      { id: 'lx-3', title: 'Bash Scripting asoslari', videoId: 'v-F3YLd6oMw', duration: 26, order: 3, transcript: 'Bash skript yaratish va ishlatish...' },
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
    videoPlaylistId: '',
    lessons: [
      { id: 'eh-1', title: 'Ethical Hacking kirish va qonun', videoId: 'fNzpcB7ODxQ', duration: 14, order: 1, transcript: 'Etik hacking nima va qonuniy chegaralar...' },
      { id: 'eh-2', title: 'Kali Linux o\'rnatish va sozlash', videoId: 'lZAoFs75_cs', duration: 20, order: 2, transcript: 'Kali Linux setup va muhit...' },
      { id: 'eh-3', title: 'Nmap bilan tarmoq skanerlash', videoId: '4t4kBkMsDbQ', duration: 22, order: 3, transcript: 'Nmap komanda va scan turlari...' },
    ],
  },
]

const DEFAULT_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Critical Vulnerability in Apache Log4j Patched',
    description: 'Apache Log4j critical RCE vulnerability CVE-2021-44228 has been patched. Update immediately.',
    source: 'CISA',
    severity: 'critical',
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'news-2',
    title: 'New Ransomware Campaign Targets Healthcare Sector',
    description: 'A new ransomware group has launched targeted attacks against hospitals and clinics across Central Asia.',
    source: 'CyberSecDaily',
    severity: 'high',
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'news-3',
    title: 'Microsoft Patches 97 Vulnerabilities in Monthly Update',
    description: 'Microsoft\'s latest Patch Tuesday addresses 97 vulnerabilities, including 7 critical remote code execution flaws.',
    source: 'Microsoft Security',
    severity: 'high',
    publishedAt: new Date().toISOString(),
  },
]

// ─── Course Store ──────────────────────────────────────────────────────────────
export const courseStore = {
  getAll(): Course[] {
    try {
      const raw = localStorage.getItem(COURSES_KEY)
      return raw ? JSON.parse(raw) : DEFAULT_COURSES
    } catch {
      return DEFAULT_COURSES
    }
  },
  save(courses: Course[]) {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses))
    window.dispatchEvent(new Event('admin_courses_updated'))
  },
  add(course: Course) {
    const all = this.getAll()
    all.push(course)
    this.save(all)
  },
  update(id: string, data: Partial<Course>) {
    const all = this.getAll()
    const idx = all.findIndex(c => c.id === id)
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data }
      this.save(all)
    }
  },
  delete(id: string) {
    const all = this.getAll().filter(c => c.id !== id)
    this.save(all)
  },
  addLesson(courseId: string, lesson: Lesson) {
    const all = this.getAll()
    const course = all.find(c => c.id === courseId)
    if (course) {
      course.lessons = [...course.lessons, lesson]
      this.save(all)
    }
  },
  updateLesson(courseId: string, lessonId: string, data: Partial<Lesson>) {
    const all = this.getAll()
    const course = all.find(c => c.id === courseId)
    if (course) {
      const lIdx = course.lessons.findIndex(l => l.id === lessonId)
      if (lIdx !== -1) {
        course.lessons[lIdx] = { ...course.lessons[lIdx], ...data }
        this.save(all)
      }
    }
  },
  deleteLesson(courseId: string, lessonId: string) {
    const all = this.getAll()
    const course = all.find(c => c.id === courseId)
    if (course) {
      course.lessons = course.lessons.filter(l => l.id !== lessonId)
      this.save(all)
    }
  },
}

// ─── News Store ────────────────────────────────────────────────────────────────
export const newsStore = {
  getAll(): NewsItem[] {
    try {
      const raw = localStorage.getItem(NEWS_KEY)
      return raw ? JSON.parse(raw) : DEFAULT_NEWS
    } catch {
      return DEFAULT_NEWS
    }
  },
  save(items: NewsItem[]) {
    localStorage.setItem(NEWS_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('admin_news_updated'))
  },
  add(item: NewsItem) {
    const all = this.getAll()
    all.unshift(item)
    this.save(all)
  },
  update(id: string, data: Partial<NewsItem>) {
    const all = this.getAll()
    const idx = all.findIndex(n => n.id === id)
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...data }
      this.save(all)
    }
  },
  delete(id: string) {
    const all = this.getAll().filter(n => n.id !== id)
    this.save(all)
  },
}
