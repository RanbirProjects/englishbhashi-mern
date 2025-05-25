import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../store/slices/courseSlice';
import { motion } from 'framer-motion';

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, isLoading } = useSelector((state) => state.courses);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const tabs = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="courses-container">
        <div className="courses-header">
          <h1>Available Courses</h1>
          <p>Choose from our wide range of English courses designed for all levels</p>
        </div>

        <div className="courses-tabs">
          {tabs.map(tab => (
            <motion.div
              key={tab.id}
              className={`courses-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label}
            </motion.div>
          ))}
        </div>

        <div className="courses-search">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <motion.div
          className="courses-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative pb-48">
                <img
                  className="absolute h-full w-full object-cover"
                  src={course.thumbnail}
                  alt={course.title}
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    {course.level}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {course.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <svg
                          key={rating}
                          className={`h-5 w-5 ${
                            rating < course.rating
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
                      {course.rating?.toFixed(1) ?? '0.0'}
                    </span>
                  </div>
                  <Link
                    to={`/courses/${course._id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* No Results Message */}
        {filteredCourses.length === 0 && (
          <div className="no-courses">
            <h3>No courses found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        <div className="courses-info">
          <div className="info-section">
            <h2>English Bhashi</h2>
            <p>Empowering learners worldwide with comprehensive English language education.</p>
          </div>

          <div className="info-section">
            <h3>Quick Links</h3>
            <div className="info-links">
              <Link to="/courses">Courses</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div className="info-section">
            <h3>Contact Us</h3>
            <a href="mailto:support@englishbhashi.com">support@englishbhashi.com</a>
            <a href="tel:+1234567890">+1 (234) 567-890</a>
          </div>

          <div className="info-footer">
            <p>© 2025 English Bhashi. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses; 