import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, Lock } from 'lucide-react'
import { adminAuth } from '@utils/adminStore'

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    await new Promise(r => setTimeout(r, 800)) // loading effect

    const ok = adminAuth.login(username, password)
    setIsLoading(false)

    if (ok) {
      navigate('/x-panel/dashboard')
    } else {
      setError('Noto\'g\'ri login yoki parol!')
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,100,200,0.15) 0%, #020817 60%)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyber-blue/10 border border-cyber-blue/30 mb-4"
          >
            <Shield size={32} className="text-cyber-blue" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">CyberLMS boshqaruv tizimi</p>
        </div>

        {/* Form */}
        <div className="bg-cyber-navy/40 backdrop-blur-xl border border-cyber-blue/20 rounded-2xl p-8 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Foydalanuvchi nomi
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="off"
                  className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-cyber-blue transition-colors placeholder-gray-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-cyber-black/60 border border-cyber-blue/20 text-white rounded-lg pl-9 pr-10 py-3 text-sm focus:outline-none focus:border-cyber-blue transition-colors placeholder-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2"
              >
                ⚠️ {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || !username || !password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-cyber-blue hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Tekshirilmoqda...
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Kirish
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6">
            Bu sahifa himoyalangan. Ruxsatsiz kirish ta'qiqlanadi.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
