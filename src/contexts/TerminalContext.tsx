import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { TerminalMessage, AITerminalContextType as AITerminalContextType } from '@types/index'
import axiosInstance from '@api/axiosInstance'

const TerminalContext = createContext<AITerminalContextType | undefined>(undefined)

export const TerminalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<TerminalMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentCourse, setCurrentCourse] = useState<string>('General')
  const [currentLevel, setCurrentLevel] = useState<string>('beginner')

  // Get current user's course and level from localStorage or set defaults
  useEffect(() => {
    try {
      const user = localStorage.getItem('user')
      if (user) {
        const userData = JSON.parse(user)
        // If user has enrolled courses, use the first one
        if (userData.enrolledCourses && userData.enrolledCourses.length > 0) {
          setCurrentCourse(userData.enrolledCourses[0].title || 'General')
        }
      }
    } catch (error) {
      console.error('Failed to load user course:', error)
    }
  }, [])

  const addMessage = async (message: TerminalMessage) => {
    setMessages((prev) => [...prev, message])
    
    if (message.role === 'user') {
      setIsLoading(true)
      try {
        const response = await axiosInstance.post('/terminal/chat', {
          message: message.content,
          context: {
            course: currentCourse,
            level: currentLevel
          }
        })

        const aiResponse: TerminalMessage = {
          id: Math.random().toString(),
          role: 'assistant',
          content: response.data.message || response.data.content || 'No response',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
      } catch (error) {
        console.error('Terminal API error:', error)
        const errorResponse: TerminalMessage = {
          id: Math.random().toString(),
          role: 'assistant',
          content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorResponse])
      }
      setIsLoading(false)
    }
  }

  const clearMessages = () => {
    setMessages([])
  }

  // Methods to update course and level dynamically
  const updateCourseContext = (course: string) => {
    setCurrentCourse(course)
  }

  const updateLevelContext = (level: string) => {
    setCurrentLevel(level)
  }

  return (
    <TerminalContext.Provider
      value={{
        messages,
        isLoading,
        addMessage,
        clearMessages,
        updateCourseContext,
        updateLevelContext,
        currentCourse,
        currentLevel,
      }}
    >
      {children}
    </TerminalContext.Provider>
  )
}

export const useTerminal = () => {
  const context = useContext(TerminalContext)
  if (!context) {
    throw new Error('useTerminal must be used within TerminalProvider')
  }
  return context
}
