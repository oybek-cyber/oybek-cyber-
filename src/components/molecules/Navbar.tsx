import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LanguageSwitcher } from '@components/atoms/LanguageSwitcher'
import { useAuth } from '@contexts/AuthContext'

export const Navbar: React.FC = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.courses'), href: '/courses' },
    { label: t('nav.terminal'), href: '/terminal' },
    { label: t('nav.news'), href: '/news' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-cyber-black/80 backdrop-blur border-b border-cyber-blue/20"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyber-blue to-cyber-electric rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-white font-bold text-xl hidden sm:inline">CyberLMS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="text-gray-300 hover:text-cyber-blue transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          
          <div className="hidden sm:flex items-center gap-3 mr-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 bg-cyber-blue/10 px-3 py-1.5 rounded-lg border border-cyber-blue/20">
                <div className="w-6 h-6 bg-cyber-blue text-white flex items-center justify-center rounded-full text-xs font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-semibold text-white mr-2">{user?.name?.split(' ')[0]}</span>
                <button 
                  onClick={() => navigate('/auth/logout')} // Actually call logout
                  onMouseDown={() => logout()}
                  className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Chiqish
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  Kirish
                </Link>
                <Link to="/signup" className="text-sm font-bold bg-cyber-blue hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg transition-colors shadow-lg shadow-cyber-blue/20">
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>

          <LanguageSwitcher />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2 hover:bg-cyber-navy rounded-lg"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-cyber-navy/90 backdrop-blur border-t border-cyber-blue/20"
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block text-gray-300 hover:text-cyber-blue py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="my-2 border-t border-cyber-blue/20 pt-2" />
            
            {isAuthenticated ? (
              <div className="flex items-center justify-between py-2">
                 <span className="text-sm font-semibold text-white">{user?.name}</span>
                 <button 
                  onClick={() => { setIsOpen(false); logout(); }}
                  className="text-xs text-red-400 font-medium bg-red-400/10 px-3 py-1 rounded border border-red-400/20"
                 >
                   Chiqish
                 </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-2 text-sm font-semibold text-gray-300 hover:text-white bg-white/5 rounded-lg border border-white/10">
                  Kirish
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="text-center py-2 text-sm font-bold bg-cyber-blue text-white rounded-lg shadow-lg shadow-cyber-blue/20">
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
