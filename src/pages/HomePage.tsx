import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Card } from '@components/atoms/Card'
import { Button } from '@components/atoms/Button'
import { NewsTickerWidget } from '@components/molecules/NewsTickerWidget'
import { ArrowRight, Code, Shield, Terminal } from 'lucide-react'
import { Link } from 'react-router-dom'

export const HomePage: React.FC = () => {
  const { t } = useTranslation()

  const courses = [
    {
      id: 'cisco',
      title: t('courses.cisco'),
      description: 'Master CCNA networking, subnetting, and routing protocols',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
      level: t('courses.beginner'),
      duration: '40 hours',
      icon: <Code size={32} />,
    },
    {
      id: 'windows',
      title: t('courses.windows'),
      description: 'Learn Windows Server administration, AD, and security',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
      level: 'Intermediate',
      duration: '35 hours',
      icon: <Shield size={32} />,
    },
    {
      id: 'linux',
      title: t('courses.linux'),
      description: 'Linux fundamentals, bash scripting, and system security',
      image: 'https://images.unsplash.com/photo-1610986465129-ca33cf6d8054?w=500&h=300&fit=crop',
      level: 'Intermediate',
      duration: '45 hours',
      icon: <Terminal size={32} />,
    },
    {
      id: 'hacking',
      title: t('courses.hacking'),
      description: 'OWASP Top 10, penetration testing, and vulnerability assessment',
      image: 'https://images.unsplash.com/photo-1550751827-4bd94c3e033b?w=500&h=300&fit=crop',
      level: 'Advanced',
      duration: '50 hours',
      icon: <Shield size={32} />,
    },
  ]

  const curriculum = [
    { icon: <Code size={24} />, title: 'Hands-on Labs', desc: 'Real-world cybersecurity scenarios' },
    { icon: <Terminal size={24} />, title: 'AI Terminal', desc: 'Interactive coding assistance' },
    { icon: <Shield size={24} />, title: 'Best Practices', desc: 'Industry-standard security protocols' },
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

      {/* News Ticker Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <NewsTickerWidget />
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

      {/* Curriculum Overview */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-r from-cyber-navy/50 to-cyber-black/50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose CyberLMS?
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {curriculum.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="text-center p-6 rounded-lg bg-cyber-black/40 border border-cyber-blue/20 hover:border-cyber-blue/50 transition-all"
              >
                <div className="inline-block p-3 rounded-lg bg-cyber-blue/10 text-cyber-blue mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
