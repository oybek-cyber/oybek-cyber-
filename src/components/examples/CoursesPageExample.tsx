import { useState, useEffect } from 'react';
import { courseService, PaginatedResponse, Course } from '@services';
import { useApi } from '@hooks';
import { showErrorToast } from '@api';

/**
 * Example Courses List Component
 * Demonstrates how to use courseService with useApi hook
 * 
 * Usage:
 * <Route path="/courses" element={<CoursesPageExample />} />
 */

export const CoursesPageExample = () => {
  const [page, setPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);

  /**
   * Fetch courses using useApi hook
   */
  const { data, loading, error, refetch } = useApi(
    () => courseService.getAllCourses({ page, limit: 10 })
  );

  /**
   * Update local courses when data fetches
   */
  useEffect(() => {
    if (data?.data) {
      setCourses(data.data);
    }
  }, [data]);

  /**
   * Handle enrollment
   */
  const handleEnroll = async (courseId: string) => {
    try {
      await courseService.enrollCourse(courseId);
      
      // Update course status
      setCourses(prev =>
        prev.map(course =>
          course.id === courseId
            ? { ...course, isEnrolled: true }
            : course
        )
      );
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to enroll');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Cybersecurity Courses
          </h1>
          <p className="text-gray-400">
            Learn from industry experts and master cybersecurity skills
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Courses Grid */}
        {!loading && courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white">
                Page {page} of {data?.pagination.pages || 1}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page === data?.pagination.pages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded"
              >
                Next
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Course Card Component
 */
interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => Promise<void>;
}

const CourseCard = ({ course, onEnroll }: CourseCardProps) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnrollClick = async () => {
    setIsEnrolling(true);
    try {
      await onEnroll(course.id);
    } finally {
      setIsEnrolling(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition">
      {/* Thumbnail */}
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
      )}

      {/* Content */}
      <div className="p-6">
        <div className="mb-3 flex justify-between items-start">
          <span className="text-xs font-semibold text-blue-400 uppercase">
            {course.level}
          </span>
          <span className="text-yellow-400">★ {course.rating.toFixed(1)}</span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {course.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center mb-4 pb-4 border-b border-gray-700">
          <div>
            <p className="text-sm text-gray-300">
              {course.instructor.firstName} {course.instructor.lastName}
            </p>
            <p className="text-xs text-gray-500">{course.lessonsCount} lessons</p>
          </div>
        </div>

        {/* Enroll Button */}
        <button
          onClick={handleEnrollClick}
          disabled={isEnrolling || course.isEnrolled}
          className={`w-full py-2 rounded font-semibold transition ${
            course.isEnrolled
              ? 'bg-green-600/20 text-green-400 cursor-default'
              : isEnrolling
              ? 'bg-blue-500/50 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isEnrolling ? 'Enrolling...' : course.isEnrolled ? '✓ Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default CoursesPageExample;
