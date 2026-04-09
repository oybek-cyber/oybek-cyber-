import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronRight, Play } from 'lucide-react'
import { Course, Lesson } from '@app-types/index'

interface DynamicCoursePlayerProps {
  course: Course
  onLessonSelect?: (lesson: Lesson) => void
}

export const DynamicCoursePlayer: React.FC<DynamicCoursePlayerProps> = ({
  course,
  onLessonSelect,
}) => {
  const { t } = useTranslation()
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    course.lessons[0] || null
  )
  const [expandedSections, setExpandedSections] = useState<string[]>(['lessons'])

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    onLessonSelect?.(lesson)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
      {/* Sidebar - Lessons List */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="lg:col-span-1 bg-cyber-navy/40 backdrop-blur border border-cyber-blue/20 rounded-lg overflow-y-auto"
      >
        <div className="sticky top-0 bg-cyber-black/80 backdrop-blur p-4 border-b border-cyber-blue/20">
          <h3 className="text-white font-bold text-sm">{t('courses.lessons')}</h3>
          <p className="text-xs text-gray-500 mt-1">{course.lessons.length} lessons</p>
        </div>

        <div className="p-4 space-y-2">
          {course.lessons.map((lesson, idx) => (
            <motion.button
              key={lesson.id}
              whileHover={{ x: 4 }}
              onClick={() => handleLessonSelect(lesson)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedLesson?.id === lesson.id
                  ? 'bg-cyber-blue/30 border border-cyber-blue text-white'
                  : 'bg-cyber-black/30 border border-cyber-blue/10 text-gray-300 hover:border-cyber-blue/30'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="mt-1">
                  <Play size={14} className="flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {idx + 1}. {lesson.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{lesson.duration} min</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Main Content - Video Player */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-3 space-y-4"
      >
        {selectedLesson ? (
          <>
            {/* Video Player Container */}
            <div className="bg-cyber-black border border-cyber-blue/20 rounded-lg overflow-hidden aspect-video lg:aspect-auto lg:h-96">
              {selectedLesson.videoId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedLesson.videoId}`}
                  title={selectedLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyber-navy to-cyber-black">
                  <div className="text-center">
                    <Play size={64} className="text-cyber-blue/30 mx-auto mb-4" />
                    <p className="text-gray-500">Video not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Details */}
            <div className="bg-cyber-navy/40 backdrop-blur border border-cyber-blue/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedLesson.title}</h2>
              <p className="text-gray-400 text-sm mb-4">
                Duration: {selectedLesson.duration} minutes
              </p>

              {/* Expandable Sections */}
              <div className="space-y-3">
                {/* Transcript Section */}
                {selectedLesson.transcript && (
                  <div>
                    <button
                      onClick={() => toggleSection('transcript')}
                      className="flex items-center gap-2 text-cyber-blue hover:text-cyber-electric font-semibold transition-colors"
                    >
                      <ChevronRight
                        size={20}
                        className={`transition-transform ${
                          expandedSections.includes('transcript') ? 'rotate-90' : ''
                        }`}
                      />
                      Transcript
                    </button>
                    {expandedSections.includes('transcript') && (
                      <div className="mt-3 p-4 bg-cyber-black/50 rounded border border-cyber-blue/10 text-gray-300 text-sm max-h-48 overflow-y-auto">
                        {selectedLesson.transcript}
                      </div>
                    )}
                  </div>
                )}

                {/* Resources Section */}
                {selectedLesson.resources && selectedLesson.resources.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSection('resources')}
                      className="flex items-center gap-2 text-cyber-blue hover:text-cyber-electric font-semibold transition-colors"
                    >
                      <ChevronRight
                        size={20}
                        className={`transition-transform ${
                          expandedSections.includes('resources') ? 'rotate-90' : ''
                        }`}
                      />
                      Resources
                    </button>
                    {expandedSections.includes('resources') && (
                      <ul className="mt-3 space-y-2">
                        {selectedLesson.resources.map((resource, idx) => (
                          <li key={idx}>
                            <a
                              href="#"
                              className="text-cyber-blue hover:text-cyber-electric text-sm transition-colors flex items-center gap-2"
                            >
                              <ChevronRight size={16} />
                              {resource}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-96 text-gray-500">
            <p>Select a lesson to start</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
