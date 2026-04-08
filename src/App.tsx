import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@i18n/index'
import { AuthProvider } from '@contexts/AuthContext'
import { TerminalProvider } from '@contexts/TerminalContext'
import { Navbar } from '@components/molecules/Navbar'
import { Layout } from '@components/organisms/Layout'
import { HomePage } from '@pages/HomePage'
import { CoursesPage } from '@pages/CoursesPage'
import { TerminalPage } from '@pages/TerminalPage'
import { motion } from 'framer-motion'

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-cyber-black">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 border-4 border-cyber-blue/20 border-t-cyber-blue rounded-full"
    />
  </div>
)

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CoursesPage />} />
            <Route path="/terminal" element={<TerminalPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  )
}

export function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <TerminalProvider>
            <AppContent />
          </TerminalProvider>
        </AuthProvider>
      </I18nextProvider>
    </Suspense>
  )
}

export default App
