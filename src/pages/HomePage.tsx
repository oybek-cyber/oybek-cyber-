import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Card } from '@components/atoms/Card'
import { Button } from '@components/atoms/Button'
import { ArrowRight, Code, Shield, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { newsStore, NewsItem } from '@utils/adminStore'
import { useState, useEffect } from 'react'
import { useAuth } from '@contexts/AuthContext'

export const HomePage: React.FC = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const [latestNews, setLatestNews] = useState<NewsItem[]>([])

  useEffect(() => {
    // Fetch from local store for simplicity or backend if needed
    // The user wants "latest" news at the bottom.
    const allNews = newsStore.getAll()
    setLatestNews(allNews.slice(0, 3))
  }, [])

  const courses = [
    {
      id: 'cisco-ccna',
      title: t('courses.cisco'),
      description: 'Master CCNA networking, subnetting, and routing protocols',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop',
      level: t('courses.beginner'),
      duration: '40 hours',
      icon: <Code size={32} />,
    },
    {
      id: 'windows-server',
      title: t('courses.windows'),
      description: 'Learn Windows Server administration, AD, and security',
      image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=500&h=300&fit=crop',
      level: 'Intermediate',
      duration: '35 hours',
      icon: <Shield size={32} />,
    },
    {
      id: 'linux-mastery',
      title: t('courses.linux'),
      description: 'Linux fundamentals, bash scripting, and system security',
      image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=500&h=300&fit=crop',
      level: 'Intermediate',
      duration: '45 hours',
      icon: <Terminal size={32} />,
    },
    {
      id: 'ethical-hacking',
      title: t('courses.hacking'),
      description: 'OWASP Top 10, penetration testing, and vulnerability assessment',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=500&h=300&fit=crop',
      level: 'Advanced',
      duration: '50 hours',
      icon: <Shield size={32} />,
    },
  ]



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-black via-cyber-navy to-cyber-black">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 via-transparent to-cyber-electric/5" />
          <motion.div
            animate={{
              rotate: 360,
              y: [0, 30, 0],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
              y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute top-1/4 -right-32 w-64 h-64 bg-cyber-blue/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              y: [0, -30, 0],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
              y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute bottom-1/4 -left-32 w-64 h-64 bg-cyber-electric/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 gradient-text"
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg sm:text-xl text-gray-300 mb-8"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/courses">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                {t('hero.cta')}
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/terminal">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Try AI Terminal
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>



      {/* Courses Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Choose your path and master the skills that matter in cybersecurity
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {courses.map((course) => (
              <motion.div key={course.id} variants={itemVariants}>
                <Card
                  title={course.title}
                  description={course.description}
                  image={course.image}
                  level={course.level}
                  duration={course.duration}
                >
                  <Link to={`/courses/${course.id}`}>
                    <Button size="sm" variant="primary" className="w-full mt-4">
                      {t('courses.viewCourse')}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>


      {/* Latest News Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative px-4 py-20 sm:px-6 lg:px-8 border-t border-cyber-blue/10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Latest Security News
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stay updated with the latest threats and vulnerabilities in the cyber world
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
          >
            {latestNews.length > 0 ? (
              latestNews.map((news, idx) => (
                <motion.div key={news.id} variants={itemVariants}>
                  <div className="bg-cyber-black/40 border border-cyber-blue/20 rounded-xl p-6 h-full flex flex-col hover:border-cyber-blue/50 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${
                        news.severity === 'critical' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                        news.severity === 'high' ? 'text-orange-400 border-orange-400/30 bg-orange-400/10' :
                        'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                      }`}>
                        {news.severity}
                      </span>
                      <span className="text-gray-600 text-[10px]">{new Date(news.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-white font-bold mb-2 line-clamp-2 leading-snug">{news.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{news.description}</p>
                    <div className="text-xs text-cyber-blue font-medium mt-auto">{news.source}</div>
                  </div>
                </motion.div>
              ))
            ) : (
                <div className="col-span-3 text-center text-gray-600 py-10">No news articles yet.</div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <Link to="/news">
              <Button variant="secondary" className="gap-2">
                View All News <ArrowRight size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Call To Action (CTA) Section */}
      {!isAuthenticated && (
        <motion.section
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative px-4 py-24 sm:px-6 lg:px-8 border-t border-cyber-blue/10 bg-gradient-to-b from-transparent to-cyber-blue/5 overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-blue/5 rounded-full blur-[100px]" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center bg-cyber-navy/50 backdrop-blur border border-cyber-blue/20 rounded-3xl p-10 shadow-2xl shadow-cyber-blue/10">
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-5xl font-bold text-white mb-6">
              Kiberxavfsizlik olamiga tayyormisiz?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Hozir ro'yxatdan o'ting va o'z sohangizning yetuk mutaxassisiga aylaning. Darslar, savol-javoblar va amaliy mashg'ulotlarga to'liq kirish huquqini qo'lga kiriting.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto shadow-[0_0_20px_rgba(0,195,255,0.3)]">
                  Bepul ro'yxatdan o'tish
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Darsliklarni ko'rish
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}

    </div>
  )
}
