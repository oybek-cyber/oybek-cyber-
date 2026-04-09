import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { DynamicCoursePlayer } from '@components/organisms/DynamicCoursePlayer'
import { Course, Lesson } from '@app-types/index'
import axiosInstance from '@api/axiosInstance'

export const CoursesPage: React.FC = () => {
  const { t } = useTranslation()
  const { courseId } = useParams<{ courseId?: string }>()
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get('/courses')
        // The API returns { data: { courses: [...], pagination: {...} } }
        let coursesArray = response.data?.data?.courses || response.data?.courses || []
        
        // Fallback in case the wrapper structure is different
        if (!Array.isArray(coursesArray)) {
          if (Array.isArray(response.data?.data)) {
            coursesArray = response.data.data
          } else if (Array.isArray(response.data)) {
            coursesArray = response.data
          } else {
            coursesArray = []
          }
        }

        // Transform API response to Course format
        const transformedCourses: Course[] = coursesArray.map((course: any) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          instructor: course.instructor || 'Instructor',
          level: course.level || 'Beginner',
          thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&h=300&fit=crop',
          duration: course.duration || 40,
          lessons: course.lessons || [],
          videoPlaylistId: course.videoPlaylistId || '',
        }))

        setCourses(transformedCourses)

        // Select course if courseId is in URL, otherwise select first course
        if (courseId && transformedCourses.length > 0) {
          const selected = transformedCourses.find((c) => c.id === courseId)
          setSelectedCourse(selected || transformedCourses[0])
        } else if (transformedCourses.length > 0) {
          setSelectedCourse(transformedCourses[0])
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err)
        setError('Failed to load courses. Please try again later.')
        // Fallback to empty state instead of mock data
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [courseId])

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyber-black via-cyber-navy to-cyber-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyber-blue mx-auto mb-4" />
          <p className="text-gray-300">Loading courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyber-black via-cyber-navy to-cyber-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-cyber-blue text-white rounded-lg hover:bg-cyan-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-black via-cyber-navy to-cyber-black px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">{t('nav.courses')}</h1>
          <p className="text-gray-400">
            Choose a course below and start your learning journey
          </p>
        </motion.div>

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 mb-4">No courses available at the moment.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-cyber-blue text-white rounded-lg hover:bg-cyan-600 transition"
            >
              Refresh
            </button>
          </motion.div>
        ) : (
          <>
            {/* Course Selection Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-cyber-blue/20"
            >
              {courses.map((course) => (
                <motion.button
                  key={course.id}
                  onClick={() => handleCourseSelect(course)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedCourse?.id === course.id
                      ? 'bg-cyber-blue text-white'
                      : 'bg-cyber-navy/40 text-gray-300 border border-cyber-blue/20 hover:border-cyber-blue/50'
                  }`}
                >
                  {course.title}
                </motion.button>
              ))}
            </motion.div>

            {/* Course Info */}
            {selectedCourse && (
              <motion.div
                key={selectedCourse.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-cyber-navy/20 border border-cyber-blue/20 rounded-lg p-6 mb-8"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={selectedCourse.thumbnail}
                    alt={selectedCourse.title}
                    className="w-full md:w-48 h-32 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-gray-300 mb-4">{selectedCourse.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Instructor:</span>
                        <p className="text-white font-semibold">{selectedCourse.instructor}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Level:</span>
                        <p className="text-cyber-blue font-semibold">{selectedCourse.level}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <p className="text-white font-semibold">{selectedCourse.duration} hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Course Player */}
            {selectedCourse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black rounded-lg border border-cyber-blue/20 p-4 min-h-[600px]"
              >
                <DynamicCoursePlayer
                  course={selectedCourse}
                  onLessonSelect={(lesson) => {
                    console.log('Selected lesson:', lesson)
                  }}
                />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
