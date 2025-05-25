import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../store/slices/courseSlice';
import { getProgress } from '../store/slices/progressSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { courses, isLoading: coursesLoading } = useSelector((state) => state.courses);
  const { progress, isLoading: progressLoading } = useSelector((state) => state.progress);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCourses());
    dispatch(getProgress());
  }, [dispatch]);

  if (coursesLoading || progressLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const enrolledCourses = courses.filter((course) =>
    progress.some((p) => p.course.toString() === course._id)
  );

  const getCourseProgress = (courseId) => {
    const courseProgress = progress.find((p) => p.course.toString() === courseId);
    if (!courseProgress) return 0;
    return Math.round(
      (courseProgress.completedChapters.length / courseProgress.totalChapters) * 100
    );
  };

  const getLastAccessedChapter = (courseId) => {
    const courseProgress = progress.find((p) => p.course.toString() === courseId);
    if (!courseProgress || !courseProgress.lastAccessedChapter) return null;
    return courseProgress.lastAccessedChapter;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Continue your learning journey from where you left off.
        </p>
      </div>

      {/* Enrolled Courses */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Your Enrolled Courses
        </h2>
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No courses enrolled yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start your learning journey by enrolling in a course.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {course.description}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{getCourseProgress(course._id)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{
                            width: `${getCourseProgress(course._id)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                    {getLastAccessedChapter(course._id) && (
                      <Link
                        to={`/courses/${course._id}/chapters/${getLastAccessedChapter(
                          course._id
                        )}`}
                        className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Continue Learning
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Your Learning Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Enrolled Courses
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {enrolledCourses.length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Completed Chapters
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {progress.reduce(
                (total, p) => total + p.completedChapters.length,
                0
              )}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Average Quiz Score
            </h3>
            <p className="text-3xl font-bold text-indigo-600">
              {progress.length > 0
                ? Math.round(
                    progress.reduce(
                      (total, p) =>
                        total +
                        p.quizScores.reduce(
                          (sum, qs) => sum + (qs.score / qs.maxScore) * 100,
                          0
                        ) /
                          p.quizScores.length,
                      0
                    ) / progress.length
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 