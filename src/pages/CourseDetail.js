import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourse, enrollInCourse } from '../store/slices/courseSlice';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { course, isLoading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    dispatch(getCourse(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user && course) {
      setIsEnrolled(user.enrolledCourses?.includes(course._id));
    }
  }, [user, course]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(enrollInCourse(id)).unwrap();
      setIsEnrolled(true);
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
  };

  if (isLoading || !course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Course Header */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src={course.thumbnail}
            alt={course.title}
          />
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {course.title}
              </h1>
              <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                {course.description}
              </p>
              <div className="mt-4 flex items-center">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {course.level}
                </span>
                <span className="ml-4 text-white">
                  Duration: {course.duration} minutes
                </span>
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:ml-8">
              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/courses/${course._id}/chapters/${course.chapters[0]?._id}`)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                >
                  Continue Learning
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Course Overview
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-600">{course.description}</p>
            </div>

            {/* Chapters List */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Course Chapters
              </h3>
              <div className="space-y-4">
                {course.chapters.map((chapter, index) => (
                  <div
                    key={chapter._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Chapter {index + 1}: {chapter.title}
                        </h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Duration: {chapter.duration} minutes
                        </p>
                      </div>
                      {isEnrolled && (
                        <button
                          onClick={() =>
                            navigate(`/courses/${course._id}/chapters/${chapter._id}`)
                          }
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                        >
                          Start Chapter
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Course Details
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Level</dt>
                  <dd className="mt-1 text-sm text-gray-900">{course.level}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Duration
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {course.duration} minutes
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Number of Chapters
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {course.chapters.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rating</dt>
                  <dd className="mt-1">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <svg
                            key={rating}
                            className={`h-5 w-5 ${
                              rating < course.averageRating
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {course.averageRating?.toFixed(1) ?? '0.0'}
                      </span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 