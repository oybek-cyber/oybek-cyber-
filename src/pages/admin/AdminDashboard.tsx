import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BookOpen, Newspaper, LogOut, Plus, Edit2, Trash2,
  Save, X, ChevronDown, ChevronUp, Play, Shield, Eye, Settings, KeyRound, CheckCircle, MessageSquare, Clock, Loader2
} from 'lucide-react'
import axiosInstance from '@api/axiosInstance'
import { adminAuth, courseStore, newsStore, newsStore as ns, NewsItem, credentialsStore } from '@utils/adminStore'
import { Course, Lesson } from '@app-types/index'

type Tab = 'overview' | 'courses' | 'news' | 'discussions' | 'community' | 'settings'

// ─── Helpers ─────────────────────────────────────────────────────────────────
function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-green-500/20 text-green-400 border-green-500/30',
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-cyber-navy border border-cyber-blue/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
    >
      <div className="flex items-center justify-between p-5 border-b border-cyber-blue/20">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5">
          <X size={20} />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </motion.div>
  </div>
)

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <input
      {...props}
      className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyber-blue transition-colors placeholder-gray-600"
    />
  </div>
)

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyber-blue transition-colors placeholder-gray-600 resize-none"
    />
  </div>
)

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, ...props }) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
    <select
      {...props}
      className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyber-blue transition-colors"
    >
      {children}
    </select>
  </div>
)

// ─── Courses Tab ──────────────────────────────────────────────────────────────
const CoursesTab: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(courseStore.getAll())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [modal, setModal] = useState<'add-course' | 'edit-course' | 'add-lesson' | 'edit-lesson' | null>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingLesson, setEditingLesson] = useState<{ courseId: string; lesson: Lesson } | null>(null)
  const [activeCourseId, setActiveCourseId] = useState<string>('')

  const refresh = () => setCourses(courseStore.getAll())

  // Course form state
  const [cf, setCf] = useState({ id: '', title: '', description: '', instructor: '', level: 'Beginner', thumbnail: '', duration: 0 })
  // Lesson form state
  const [lf, setLf] = useState({ id: '', title: '', videoId: '', duration: 10, transcript: '' })
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const res = await fetch(`/api/upload-video?name=${file.name}`, { method: 'POST', body: file })
      const data = await res.json()
      if (data.url) setLf({ ...lf, videoId: data.url })
    } catch(err) {
      alert("Yuklashda xato yuz berdi")
    } finally {
      setIsUploading(false)
    }
  }

  const openAddCourse = () => {
    setCf({ id: generateId('course'), title: '', description: '', instructor: '', level: 'Beginner', thumbnail: '', duration: 20 })
    setModal('add-course')
  }
  const openEditCourse = (course: Course) => {
    setEditingCourse(course)
    setCf({ id: course.id, title: course.title, description: course.description, instructor: course.instructor, level: course.level, thumbnail: course.thumbnail, duration: course.duration })
    setModal('edit-course')
  }
  const openAddLesson = (courseId: string) => {
    setActiveCourseId(courseId)
    setLf({ id: generateId('lesson'), title: '', videoId: '', duration: 10, transcript: '' })
    setModal('add-lesson')
  }
  const openEditLesson = (courseId: string, lesson: Lesson) => {
    setActiveCourseId(courseId)
    setEditingLesson({ courseId, lesson })
    setLf({ id: lesson.id, title: lesson.title, videoId: lesson.videoId, duration: lesson.duration, transcript: lesson.transcript || '' })
    setModal('edit-lesson')
  }

  const saveCourse = () => {
    if (modal === 'add-course') {
      courseStore.add({ ...cf, level: cf.level as any, lessons: [], videoPlaylistId: '' } as Course)
    } else if (modal === 'edit-course' && editingCourse) {
      courseStore.update(editingCourse.id, { ...cf, level: cf.level as any })
    }
    refresh(); setModal(null)
  }

  const saveLesson = () => {
    const course = courses.find(c => c.id === activeCourseId)
    const newLesson: Lesson = { ...lf, order: (course?.lessons.length || 0) + 1 }
    if (modal === 'add-lesson') {
      courseStore.addLesson(activeCourseId, newLesson)
    } else if (modal === 'edit-lesson' && editingLesson) {
      courseStore.updateLesson(activeCourseId, editingLesson.lesson.id, lf)
    }
    refresh(); setModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Kurslar boshqaruvi</h2>
        <motion.button whileHover={{ scale: 1.04 }} onClick={openAddCourse}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-500">
          <Plus size={16} /> Yangi kurs
        </motion.button>
      </div>

      {courses.map(course => (
        <div key={course.id} className="bg-cyber-black/40 border border-cyber-blue/20 rounded-xl overflow-hidden">
          <div className="flex items-center gap-4 p-4">
            <img src={course.thumbnail || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=80&h=50&fit=crop'}
              alt={course.title} className="w-16 h-10 rounded object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{course.title}</p>
              <p className="text-gray-500 text-xs">{course.instructor} · {course.lessons.length} ta dars · {course.level}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEditCourse(course)}
                className="p-2 text-gray-400 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded-lg transition-all">
                <Edit2 size={15} />
              </button>
              <button onClick={() => { courseStore.delete(course.id); refresh() }}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                <Trash2 size={15} />
              </button>
              <button onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
                className="p-2 text-gray-400 hover:text-white rounded-lg transition-all">
                {expandedId === course.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {expandedId === course.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                className="overflow-hidden border-t border-cyber-blue/10">
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Darslar ro'yxati</p>
                    <button onClick={() => openAddLesson(course.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-xs font-semibold rounded-lg hover:bg-cyber-blue/20 transition-all">
                      <Plus size={13} /> Dars qo'shish
                    </button>
                  </div>
                  {course.lessons.length === 0 && (
                    <p className="text-gray-600 text-sm text-center py-4">Hali darslar qo'shilmagan</p>
                  )}
                  {course.lessons.map((lesson, idx) => (
                    <div key={lesson.id} className="flex items-center gap-3 p-3 bg-cyber-black/30 rounded-lg border border-cyber-blue/10">
                      <span className="text-xs text-gray-600 w-5 text-center">{idx + 1}</span>
                      <Play size={12} className="text-cyber-blue flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{lesson.title}</p>
                        <p className="text-gray-600 text-xs">videoId: {lesson.videoId || '—'} · {lesson.duration} min</p>
                      </div>
                      <button onClick={() => openEditLesson(course.id, lesson)}
                        className="p-1.5 text-gray-500 hover:text-cyber-blue rounded transition-all"><Edit2 size={13} /></button>
                      <button onClick={() => { courseStore.deleteLesson(course.id, lesson.id); refresh() }}
                        className="p-1.5 text-gray-500 hover:text-red-400 rounded transition-all"><Trash2 size={13} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Course Modal */}
      <AnimatePresence>
        {(modal === 'add-course' || modal === 'edit-course') && (
          <Modal title={modal === 'add-course' ? 'Yangi kurs qo\'shish' : 'Kursni tahrirlash'} onClose={() => setModal(null)}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Input label="Kurs nomi *" value={cf.title} onChange={e => setCf({ ...cf, title: e.target.value })} placeholder="Cisco CCNA" /></div>
              <div className="col-span-2"><TextArea label="Tavsif" value={cf.description} onChange={e => setCf({ ...cf, description: e.target.value })} placeholder="Kurs haqida batafsil..." /></div>
              <Input label="O'qituvchi" value={cf.instructor} onChange={e => setCf({ ...cf, instructor: e.target.value })} placeholder="NetworkChuck" />
              <Select label="Daraja" value={cf.level} onChange={e => setCf({ ...cf, level: e.target.value })}>
                <option value="Beginner">Boshlang'ich</option>
                <option value="Intermediate">O'rta</option>
                <option value="Advanced">Ilg'or</option>
              </Select>
              <div className="col-span-2"><Input label="Thumbnail URL (rasm)" value={cf.thumbnail} onChange={e => setCf({ ...cf, thumbnail: e.target.value })} placeholder="https://..." /></div>
              <Input label="Davomiyligi (soat)" type="number" value={cf.duration} onChange={e => setCf({ ...cf, duration: +e.target.value })} />
              <Input label="Kurs ID (slug)" value={cf.id} onChange={e => setCf({ ...cf, id: e.target.value })} placeholder="cisco-ccna" />
            </div>
            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-cyber-blue/10">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Bekor</button>
              <button onClick={saveCourse} disabled={!cf.title}
                className="flex items-center gap-2 px-5 py-2 bg-cyber-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-500 disabled:opacity-50">
                <Save size={15} /> Saqlash
              </button>
            </div>
          </Modal>
        )}

        {/* Lesson Modal */}
        {(modal === 'add-lesson' || modal === 'edit-lesson') && (
          <Modal title={modal === 'add-lesson' ? 'Yangi dars qo\'shish' : 'Darsni tahrirlash'} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Input label="Dars nomi *" value={lf.title} onChange={e => setLf({ ...lf, title: e.target.value })} placeholder="OSI Model asoslari" />
              <div>
                <Input label="YouTube Video ID yoki Local URL" value={lf.videoId} onChange={e => setLf({ ...lf, videoId: e.target.value })} placeholder="vv4y_uOneC0 yoki /uploads/video.mp4" />
                <div className="mt-3 flex items-center justify-between border-b border-cyber-blue/10 pb-3">
                  <p className="text-xs text-gray-500 max-w-[200px]">
                    YouTube ID kiriting (masalan: vv4y_uOneC0) <b>YOKI</b> kompyuteringizdan video yuklang:
                  </p>
                  <div className="flex items-center">
                    <input type="file" accept="video/mp4,video/webm" onChange={handleFileUpload} disabled={isUploading} 
                      className="text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyber-blue/20 file:text-cyber-blue hover:file:bg-cyber-blue/30 transition-all focus:outline-none" 
                    />
                    {isUploading && <span className="text-xs text-yellow-400 animate-pulse ml-2 font-semibold delay-100">Yuklanmoqda...</span>}
                  </div>
                </div>
                {lf.videoId && !lf.videoId.startsWith('/') && !lf.videoId.startsWith('http') && (
                  <div className="mt-3 rounded-lg overflow-hidden aspect-video bg-black border border-cyber-blue/20 shadow-lg">
                    <iframe src={`https://www.youtube.com/embed/${lf.videoId}`} width="100%" height="100%" allowFullScreen className="w-full h-full" />
                  </div>
                )}
                {lf.videoId && (lf.videoId.startsWith('/') || lf.videoId.startsWith('http')) && (
                  <div className="mt-3 rounded-lg overflow-hidden aspect-video bg-black border border-cyber-blue/20 shadow-lg">
                    <video src={lf.videoId} controls className="w-full h-full object-contain" />
                  </div>
                )}
              </div>
              <Input label="Davomiyligi (daqiqa)" type="number" value={lf.duration} onChange={e => setLf({ ...lf, duration: +e.target.value })} />
              <TextArea label="Dars tavsifi / transcript" value={lf.transcript} onChange={e => setLf({ ...lf, transcript: e.target.value })} placeholder="Dars haqida qisqacha..." />
            </div>
            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-cyber-blue/10">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Bekor</button>
              <button onClick={saveLesson} disabled={!lf.title}
                className="flex items-center gap-2 px-5 py-2 bg-cyber-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-500 disabled:opacity-50">
                <Save size={15} /> Saqlash
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Settings Tab ────────────────────────────────────────────────────────────
const SettingsTab: React.FC = () => {
  const navigate = useNavigate()
  const [oldPass, setOldPass] = useState('')
  const [newUser, setNewUser] = useState(credentialsStore.get().username)
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const save = () => {
    setMsg(null)
    const creds = credentialsStore.get()
    if (oldPass !== creds.password) {
      setMsg({ type: 'error', text: 'Joriy parol noto\'g\'ri!' })
      return
    }
    if (newPass.length < 8) {
      setMsg({ type: 'error', text: 'Yangi parol kamida 8 ta belgidan iborat bo\'lishi kerak!' })
      return
    }
    if (newPass !== confirmPass) {
      setMsg({ type: 'error', text: 'Yangi parollar mos kelmaydi!' })
      return
    }
    if (!newUser.trim()) {
      setMsg({ type: 'error', text: 'Login bo\'sh bo\'lmasligi kerak!' })
      return
    }
    credentialsStore.update(newUser.trim(), newPass)
    adminAuth.logout()
    setMsg({ type: 'success', text: 'Muvaffaqiyatli o\'zgartirildi! Qayta kirishingiz kerak.' })
    setTimeout(() => navigate('/x-panel'), 2000)
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-lg font-bold text-white mb-6">Kirish ma'lumotlarini o'zgartirish</h2>

      <div className="bg-cyber-black/40 border border-cyber-blue/20 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <KeyRound size={16} className="text-yellow-400 flex-shrink-0" />
          <p className="text-yellow-300 text-xs">Parolni o'zgartirish uchun joriy parolni kiriting. O'zgartirgandan so'ng tizimdan chiqarilasiz.</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Joriy parol *</label>
          <input
            type="password"
            value={oldPass}
            onChange={e => setOldPass(e.target.value)}
            placeholder="Hozirgi parolingiz"
            className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyber-blue transition-colors placeholder-gray-600"
          />
        </div>

        <div className="border-t border-cyber-blue/10 pt-4">
          <label className="block text-xs font-medium text-gray-400 mb-1">Yangi login nomi</label>
          <input
            type="text"
            value={newUser}
            onChange={e => setNewUser(e.target.value)}
            placeholder="yangi_admin"
            className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyber-blue transition-colors placeholder-gray-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Yangi parol (kamida 8 belgi)</label>
          <input
            type="password"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            placeholder="••••••••••"
            className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyber-blue transition-colors placeholder-gray-600"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Yangi parolni tasdiqlang</label>
          <input
            type="password"
            value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)}
            placeholder="••••••••••"
            className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-cyber-blue transition-colors placeholder-gray-600"
          />
        </div>

        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                msg.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}
            >
              {msg.type === 'success' ? <CheckCircle size={15} /> : <X size={15} />}
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={save}
          disabled={!oldPass || !newPass || !confirmPass}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-cyber-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Save size={15} /> Parolni saqlash
        </motion.button>
      </div>
    </div>
  )
}

// ─── News Tab ─────────────────────────────────────────────────────────────────
const NewsTab: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>(newsStore.getAll())
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<NewsItem | null>(null)
  const [nf, setNf] = useState<NewsItem>({ id: '', title: '', description: '', source: '', severity: 'medium', publishedAt: new Date().toISOString() })

  const refresh = () => setNews(newsStore.getAll())
  const openAdd = () => { setNf({ id: generateId('news'), title: '', description: '', source: '', severity: 'medium', publishedAt: new Date().toISOString() }); setModal('add') }
  const openEdit = (item: NewsItem) => { setEditing(item); setNf(item); setModal('edit') }

  const save = () => {
    if (modal === 'add') newsStore.add(nf)
    else if (modal === 'edit' && editing) newsStore.update(editing.id, nf)
    refresh(); setModal(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Yangiliklar boshqaruvi</h2>
        <motion.button whileHover={{ scale: 1.04 }} onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-500">
          <Plus size={16} /> Yangilik qo'shish
        </motion.button>
      </div>

      <div className="space-y-3">
        {news.map(item => (
          <div key={item.id} className="flex items-start gap-4 p-4 bg-cyber-black/40 border border-cyber-blue/20 rounded-xl">
            <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full border font-semibold capitalize ${SEVERITY_COLORS[item.severity]}`}>
              {item.severity}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold">{item.title}</p>
              <p className="text-gray-500 text-xs mt-1 line-clamp-2">{item.description}</p>
              <p className="text-gray-600 text-xs mt-1">{item.source} · {new Date(item.publishedAt).toLocaleDateString('uz-UZ')}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded-lg transition-all"><Edit2 size={15} /></button>
              <button onClick={() => { newsStore.delete(item.id); refresh() }} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(modal === 'add' || modal === 'edit') && (
          <Modal title={modal === 'add' ? 'Yangilik qo\'shish' : 'Yangilikni tahrirlash'} onClose={() => setModal(null)}>
            <div className="space-y-4">
              <Input label="Sarlavha *" value={nf.title} onChange={e => setNf({ ...nf, title: e.target.value })} placeholder="Critical vulnerability discovered..." />
              <TextArea label="Tavsif" value={nf.description} onChange={e => setNf({ ...nf, description: e.target.value })} placeholder="Yangilik haqida batafsil..." />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Manba" value={nf.source} onChange={e => setNf({ ...nf, source: e.target.value })} placeholder="CISA, NVD, CVE..." />
                <Select label="Og'irlik darajasi" value={nf.severity} onChange={e => setNf({ ...nf, severity: e.target.value as any })}>
                  <option value="critical">🔴 Critical</option>
                  <option value="high">🟠 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-cyber-blue/10">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Bekor</button>
              <button onClick={save} disabled={!nf.title}
                className="flex items-center gap-2 px-5 py-2 bg-cyber-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-500 disabled:opacity-50">
                <Save size={15} /> Saqlash
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Discussions Tab Helpers ──────────────────────────────────────────────────
const UnreadBadge: React.FC = () => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axiosInstance.get('/discussions')
        if (res.data.success) {
          const pending = res.data.data.filter((d: any) => !d.isAdminReplied).length
          setCount(pending)
        }
      } catch (err) {}
    }
    fetchCount();
    const inv = setInterval(fetchCount, 30000);
    return () => clearInterval(inv);
  }, [])

  if (count === 0) return null
  return (
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
      {count > 9 ? '9+' : count}
    </span>
  )
}

// ─── Discussions Tab ──────────────────────────────────────────────────────────
const DiscussionsTab: React.FC = () => {
  const [discussions, setDiscussions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'answered'>('all')

  const fetchDiscussions = async () => {
    try {
      setIsLoading(true)
      const res = await axiosInstance.get('/discussions')
      if (res.data.success) setDiscussions(res.data.data)
    } catch (err) {
      console.error('Fetch discussions error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscussions()
  }, [])

  const handleReply = async (id: string, currentAnswer?: string) => {
    if (!replyText.trim()) return
    try {
      const res = await axiosInstance.patch(`/discussions/${id}/reply`, { answer: replyText.trim() })
      if (res.data.success) {
        setReplyText('')
        setReplyingTo(null)
        fetchDiscussions()
      }
    } catch (err) {
      alert('Javob yuborishda xato yuz berdi')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Haqiqatan ham ushbu savolni o\'chirmoqchimisiz?')) return
    try {
      const res = await axiosInstance.delete(`/discussions/${id}`)
      if (res.data.success) {
        fetchDiscussions()
      }
    } catch (err) {
      alert('O\'chirishda xato yuz berdi')
    }
  }

  const handleClearAnswer = async (id: string) => {
    if (!window.confirm('Javobni o\'chirmoqchimisiz? (Savolning o\'zi qoladi)')) return
    try {
      const res = await axiosInstance.delete(`/discussions/${id}/reply`)
      if (res.data.success) {
        fetchDiscussions()
      }
    } catch (err) {
      alert('Javobni o\'chirishda xato yuz berdi')
    }
  }

  const startReply = (d: any) => {
    setReplyingTo(d.id)
    setReplyText(d.answer || '')
  }

  const filtered = discussions.filter(d => {
    if (filter === 'pending') return !d.isAdminReplied
    if (filter === 'answered') return d.isAdminReplied
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Savol-javoblar boshqaruvi</h2>
        <div className="flex gap-2 p-1 bg-cyber-black/40 border border-cyber-blue/20 rounded-lg">
          {(['all', 'pending', 'answered'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${filter === f ? 'bg-cyber-blue text-white shadow-lg shadow-cyber-blue/20' : 'text-gray-500 hover:text-white'}`}>
              {f === 'all' ? 'Hammasi' : f === 'pending' ? 'Kutilayotgan' : 'Javob berilgan'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center"><div className="w-8 h-8 border-2 border-cyber-blue/20 border-t-cyber-blue rounded-full animate-spin mx-auto" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-500 text-sm border border-dashed border-cyber-blue/10 rounded-xl">Savollar topilmadi</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(d => (
            <div key={d.id} className="bg-cyber-black/40 border border-cyber-blue/20 rounded-xl overflow-hidden group hover:border-cyber-blue/40 transition-all">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold text-sm">{d.userName}</span>
                      <span className="text-[10px] text-gray-600 font-mono bg-cyber-blue/5 px-1.5 py-0.5 rounded border border-cyber-blue/10">Dars: {d.lessonId}</span>
                      {!d.isAdminReplied && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{d.question}</p>
                    <p className="text-[10px] text-gray-600 mt-2 flex items-center gap-1"><Clock size={10} /> {new Date(d.createdAt).toLocaleString('uz-UZ')}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(d.id)}
                      title="Savolni o'chirish"
                      className="flex-shrink-0 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all border border-transparent hover:border-red-400/30">
                      <Trash2 size={16} />
                    </button>
                    {d.isAdminReplied && (
                      <button onClick={() => handleClearAnswer(d.id)}
                        title="Javobni o'chirish"
                        className="flex-shrink-0 p-1.5 text-gray-500 hover:text-orange-400 hover:bg-orange-400/10 rounded-lg transition-all border border-transparent hover:border-orange-400/30">
                        <X size={16} />
                      </button>
                    )}
                    <button onClick={() => replyingTo === d.id ? setReplyingTo(null) : startReply(d)}
                      className={`flex-shrink-0 px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${d.isAdminReplied ? 'text-gray-400 border-gray-500/30 hover:bg-white/5' : 'bg-cyber-blue text-white border-cyber-blue/50 hover:bg-blue-500 shadow-lg shadow-cyber-blue/20'}`}>
                      {d.isAdminReplied ? 'Tahrirlash' : 'Javob berish'}
                    </button>
                  </div>
                </div>

                {d.isAdminReplied && replyingTo !== d.id && (
                  <div className="mt-3 pl-3 border-l-2 border-green-500/50 bg-green-500/5 p-3 rounded-r-lg">
                    <p className="text-[10px] text-green-400 font-bold mb-1 flex items-center gap-1 uppercase tracking-tighter"><Shield size={10} /> Javobingiz:</p>
                    <p className="text-xs text-gray-400 italic">"{d.answer}"</p>
                  </div>
                )}

                <AnimatePresence>
                  {replyingTo === d.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-cyber-blue/10">
                      <textarea
                        autoFocus
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Javobingizni shu yerga yozing..."
                        className="w-full bg-cyber-black/80 border border-cyber-blue/30 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyber-blue transition-colors h-24 resize-none placeholder-gray-600"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 text-xs text-gray-500 hover:text-white">Bekor</button>
                        <button onClick={() => handleReply(d.id)} disabled={!replyText.trim() || replyText.trim() === d.answer}
                          className="px-5 py-1.5 bg-cyber-blue text-white text-xs font-bold rounded-lg hover:bg-blue-500 disabled:opacity-50 transition-all">
                          Saqlash
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Community Tab ────────────────────────────────────────────────────────────
const CommunityTab: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    try {
      const res = await axiosInstance.get('/community/messages')
      if (res.data.success && Array.isArray(res.data.data)) {
        setMessages(res.data.data)
      } else {
        setMessages([])
      }
    } catch (err) {
      console.error('Fetch messages error:', err)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const deleteMsg = async (id: string) => {
    if (!window.confirm('Xabarni o\'chirmoqchimisiz?')) return
    try {
      await axiosInstance.delete(`/community/messages/${id}`)
      setMessages(messages.filter(m => m.id !== id))
    } catch (err) { alert('Xatolik!') }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">Jamoatchilik chati boshqaruvi</h2>
      {loading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin text-cyber-blue mx-auto" /></div>
      ) : (
        <div className="bg-cyber-black/40 border border-cyber-blue/20 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-cyber-blue/10 text-gray-400 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Foydalanuvchi</th>
                <th className="px-4 py-3">Xabar</th>
                <th className="px-4 py-3">Vaqt</th>
                <th className="px-4 py-3 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyber-blue/10">
              {messages.map(m => (
                <tr key={m.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-semibold">{m.user.username}</span>
                      <span className="text-[10px] text-gray-600">({m.user.role})</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 max-w-xs truncate">{m.content}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(m.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteMsg(m.id)} className="p-2 text-gray-500 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')

  useEffect(() => {
    if (!adminAuth.isLoggedIn()) {
      navigate('/x-panel')
    }
  }, [navigate])

  const handleLogout = () => {
    adminAuth.logout()
    navigate('/x-panel')
  }

  const courses = courseStore.getAll()
  const news = newsStore.getAll()

  const tabs = [
    { id: 'overview', label: 'Umumiy', icon: <LayoutDashboard size={16} /> },
    { id: 'courses', label: 'Kurslar', icon: <BookOpen size={16} /> },
    { id: 'news', label: 'Yangiliklar', icon: <Newspaper size={16} /> },
    { id: 'discussions', label: 'Savollar', icon: <MessageSquare size={16} />, badge: true },
    { id: 'community', label: 'Chat', icon: <MessageSquare size={16} /> },
    { id: 'settings', label: 'Sozlamalar', icon: <Settings size={16} /> },
  ] as const

  return (
    <div className="min-h-screen bg-cyber-black" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,80,160,0.1) 0%, #020817 50%)' }}>
      {/* Header */}
      <div className="border-b border-cyber-blue/20 bg-cyber-black/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center">
              <Shield size={16} className="text-cyber-blue" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">CyberLMS Admin</h1>
              <p className="text-gray-600 text-xs">Boshqaruv paneli</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
              <Eye size={14} /> Saytni ko'rish
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/5">
              <LogOut size={14} /> Chiqish
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 pb-1">
          {tabs.map(t => {
            const pendingCount = t.id === 'discussions' ? 0 : 0; // Hozircha statik, pastda yangilaymiz
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${tab === t.id ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                {t.icon} {t.label}
                {t.id === 'discussions' && (
                  <UnreadBadge />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-lg font-bold text-white mb-5">Umumiy ko'rinish</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Jami kurslar', value: courses.length, color: 'text-cyber-blue', icon: <BookOpen size={20} /> },
                { label: 'Jami darslar', value: courses.reduce((a, c) => a + c.lessons.length, 0), color: 'text-purple-400', icon: <Play size={20} /> },
                { label: 'Yangiliklar', value: news.length, color: 'text-yellow-400', icon: <Newspaper size={20} /> },
                { label: 'Sayt holati', value: '🟢 Faol', color: 'text-green-400', icon: <Shield size={20} /> },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="bg-cyber-black/40 border border-cyber-blue/20 rounded-xl p-5 text-center">
                  <div className={`inline-flex p-2 rounded-lg bg-current/10 mb-3 ${stat.color}`}>{stat.icon}</div>
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-cyber-black/40 border border-cyber-blue/20 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-3">So'nggi kurslar</h3>
                <div className="space-y-2">
                  {courses.slice(0, 4).map(c => (
                    <div key={c.id} className="flex items-center gap-3 text-sm">
                      <BookOpen size={14} className="text-cyber-blue flex-shrink-0" />
                      <span className="text-gray-300 flex-1 truncate">{c.title}</span>
                      <span className="text-gray-600 text-xs">{c.lessons.length} dars</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-cyber-black/40 border border-cyber-blue/20 rounded-xl p-5">
                <h3 className="text-sm font-bold text-white mb-3">So'nggi yangiliklar</h3>
                <div className="space-y-2">
                  {news.slice(0, 4).map(n => (
                    <div key={n.id} className="flex items-center gap-3 text-sm">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${n.severity === 'critical' ? 'bg-red-500' : n.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                      <span className="text-gray-300 flex-1 truncate text-xs">{n.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'courses' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><CoursesTab /></motion.div>}
        {tab === 'news' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><NewsTab /></motion.div>}
        {tab === 'discussions' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><DiscussionsTab /></motion.div>}
        {tab === 'community' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><CommunityTab /></motion.div>}
        {tab === 'settings' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><SettingsTab /></motion.div>}
      </div>
    </div>
  )
}
