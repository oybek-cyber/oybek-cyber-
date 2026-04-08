import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/atoms/Button'
import { motion } from 'framer-motion'

export const NewsTickerWidget: React.FC = () => {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)

  const newsItems = [
    {
      id: '1',
      title: 'Critical Vulnerability in Apache Log4j Patched',
      severity: 'critical',
      source: 'CISA',
    },
    {
      id: '2',
      title: 'New Ransomware Campaign Targets Healthcare Sector',
      severity: 'high',
      source: 'CyberSecDaily',
    },
    {
      id: '3',
      title: 'Zero-Day Exploit in Windows Kernel Discovered',
      severity: 'critical',
      source: 'SecureList',
    },
    {
      id: '4',
      title: 'Microsoft Patches 97 Vulnerabilities in Monthly Update',
      severity: 'high',
      source: 'Microsoft Security',
    },
  ]

  const severityColors = {
    critical: 'text-red-500',
    high: 'text-orange-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % newsItems.length)
  }

  return (
    <div className="bg-gradient-to-r from-cyber-navy to-cyber-black border border-cyber-blue/20 rounded-lg p-4">
      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
        <div className="w-2 h-2 bg-cyber-electric rounded-full animate-pulse-cyber" />
        {t('news.latestThreats')}
      </h3>
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-2"
      >
        <p className={`font-semibold text-sm ${severityColors[newsItems[currentIndex].severity]}`}>
          {newsItems[currentIndex].title}
        </p>
        <p className="text-xs text-gray-500">{newsItems[currentIndex].source}</p>
      </motion.div>
      <Button
        size="sm"
        variant="secondary"
        onClick={handleNext}
        className="mt-3 w-full"
      >
        Next Threat →
      </Button>
    </div>
  )
}
