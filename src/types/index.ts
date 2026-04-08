export type Language = 'uz' | 'ru' | 'en'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  enrolledCourses: string[]
}

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  thumbnail: string
  duration: number // in hours
  lessons: Lesson[]
  videoPlaylistId?: string
}

export interface Lesson {
  id: string
  title: string
  videoId: string
  duration: number
  transcript?: string
  resources?: string[]
  order: number
}

export interface NewsItem {
  id: string
  title: string
  description: string
  source: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  link: string
}

export interface TerminalMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AITerminalContext {
  messages: TerminalMessage[]
  isLoading: boolean
  addMessage: (message: TerminalMessage) => void
  clearMessages: () => void
  updateCourseContext: (course: string) => void
  updateLevelContext: (level: string) => void
  currentCourse: string
  currentLevel: string
}

export type AITerminalContextType = AITerminalContext
