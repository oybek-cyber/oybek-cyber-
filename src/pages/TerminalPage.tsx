import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CyberTerminal } from '@components/organisms/CyberTerminal'

export const TerminalPage: React.FC = () => {
  const { t } = useTranslation()

  const features = [
    {
      title: 'Real-Time AI Assistance',
      description: 'Get instant help with your cybersecurity questions',
    },
    {
      title: 'Multi-Language Support',
      description: 'Ask in your preferred language - Uzbek, Russian, or English',
    },
    {
      title: 'Command Explanations',
      description: 'Learn what each command does and how to use it safely',
    },
    {
      title: 'Security Best Practices',
      description: 'Get recommendations for secure coding and networking',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-black via-cyber-navy to-cyber-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">{t('terminal.title')}</h1>
          <p className="text-gray-400 text-lg">{t('terminal.subtitle')}</p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className="bg-cyber-navy/30 border border-cyber-blue/20 rounded-lg p-4 hover:border-cyber-blue/50 transition-all"
            >
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="h-96 md:h-screen max-h-[800px]"
        >
          <CyberTerminal />
        </motion.div>
      </div>
    </div>
  )
}
