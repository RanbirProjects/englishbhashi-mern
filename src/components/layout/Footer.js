import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-indigo-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2"
          >
            <Link to="/" className="text-2xl font-bold text-white hover:text-indigo-300 transition-colors duration-200">
              English Bhashi
            </Link>
            <p className="mt-4 text-gray-300">
              Empowering learners worldwide with comprehensive English language education.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-indigo-300 tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-4">
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/courses" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                  Courses
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/login" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                  Login
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <Link to="/register" className="text-base text-gray-300 hover:text-white transition-colors duration-200">
                  Register
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-indigo-300 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <motion.li whileHover={{ x: 5 }}>
                <a 
                  href="mailto:support@englishbhashi.com" 
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                >
                  support@englishbhashi.com
                </a>
              </motion.li>
              <motion.li whileHover={{ x: 5 }}>
                <a 
                  href="tel:+1234567890" 
                  className="text-base text-gray-300 hover:text-white transition-colors duration-200"
                >
                  +1 (234) 567-890
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 border-t border-gray-700 pt-8"
        >
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} English Bhashi. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 