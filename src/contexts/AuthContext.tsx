import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { User } from '@types/index'
import AuthService from '@services/authService'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  loginWithGoogle: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Failed to parse stored user:', error)
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await AuthService.login({ email, password })
      if (response) {
        const userData: User = {
          id: response.user.id,
          email: response.user.email,
          name: `${response.user.firstName} ${response.user.lastName}`,
          enrolledCourses: [],
        }
        setUser(userData)
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    try {
      const [firstName, lastName] = name.split(' ')
      const response = await AuthService.register({
        email,
        password,
        confirmPassword: password,
        firstName,
        lastName: lastName || '',
      })
      if (response) {
        const userData: User = {
          id: response.user.id,
          email: response.user.email,
          name: `${response.user.firstName} ${response.user.lastName}`,
          enrolledCourses: [],
        }
        setUser(userData)
      }
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      // Redirect to backend Google OAuth endpoint
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
      const redirectUri = `${window.location.origin}/auth/callback`
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile`
      window.location.href = authUrl
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        loginWithGoogle,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
