/**
 * API Configuration
 * Environment-based setup for development and production
 */

export const apiConfig = {
  // Base URL from environment variable
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',

  // Request timeout (ms)
  requestTimeout: 30000,

  // Retry configuration
  retryAttempts: 3,
  retryDelay: 1000,

  // Enable detailed logging in development
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Feature flags
  enableErrorReporting: import.meta.env.PROD,
  enableRequestLogging: import.meta.env.DEV,
};

/**
 * Local storage keys for auth
 */
export const storageKeys = {
  authToken: 'authToken',
  refreshToken: 'refreshToken',
  user: 'user',
  sessionId: 'terminalSessionId',
};

/**
 * API endpoints
 */
export const apiEndpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    profile: '/auth/profile',
  },

  // Courses
  courses: {
    list: '/courses',
    detail: (id: string) => `/courses/${id}`,
    lessons: (id: string) => `/courses/${id}/lessons`,
    create: '/courses',
    update: (id: string) => `/courses/${id}`,
    delete: (id: string) => `/courses/${id}`,
    enroll: (id: string) => `/courses/${id}/enroll`,
    myEnrolled: '/courses/my-courses',
    completeLesson: (id: string, lessonId: string) =>
      `/courses/${id}/lessons/${lessonId}/complete`,
    progress: (id: string) => `/courses/${id}/progress`,
  },

  // Terminal
  terminal: {
    execute: '/terminal/execute',
    session: {
      start: '/terminal/session/start',
      end: (id: string) => `/terminal/session/${id}/end`,
      current: '/terminal/session/current',
      history: '/terminal/session/history',
    },
    commands: {
      list: '/terminal/commands',
      suggest: '/terminal/commands/suggest',
      feedback: '/terminal/feedback',
      history: '/terminal/history',
    },
    challenges: {
      execute: (id: string) => `/terminal/challenges/${id}/execute`,
    },
  },

  // News/Feed
  news: {
    list: '/news',
    detail: (id: string) => `/news/${id}`,
  },

  // Health
  health: '/health',
};
