import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const { name, email, password, password2 } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      console.error('Passwords do not match');
    } else {
      const userData = {
        name,
        email,
        password
      };

      dispatch(register(userData));
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
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-container">
          <div className="login-tabs">
            <div 
              className="login-tab"
              onClick={() => navigate('/login')}
            >
              Sign In
            </div>
            <div 
              className="login-tab active"
            >
              Register
            </div>
          </div>

          <form className="login-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="Create a password"
                value={password}
                onChange={onChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password2">Confirm Password</label>
              <input
                type="password"
                id="password2"
                name="password2"
                className="form-input"
                placeholder="Confirm your password"
                value={password2}
                onChange={onChange}
                required
              />
            </div>

            <button type="submit" className="login-button">
              Create Account
            </button>

            <p className="text-center text-white mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        <div className="login-info">
          <h2>English Bhashi</h2>
          <p>
            Empowering learners worldwide with comprehensive English language education through innovative teaching methods and personalized learning experiences.
          </p>

          <div className="login-links">
            <Link to="/courses" className="login-link">Browse Courses</Link>
            <Link to="/login" className="login-link">Sign In</Link>
            <Link to="/contact" className="login-link">Contact Support</Link>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
            <a href="mailto:support@englishbhashi.com" className="login-link">
              support@englishbhashi.com
            </a>
            <a href="tel:+1234567890" className="login-link">
              +1 (234) 567-890
            </a>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-white/60 text-sm">
              © 2025 English Bhashi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 