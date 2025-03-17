import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaHome, FaEye, FaEyeSlash } from 'react-icons/fa';
// import { AnimatePresence } from 'framer-motion';
// import axios from 'axios';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axiosInstance from '../../config/axios';
import images from '../../assets/img';
import { server } from '../../config';
import { toast } from 'react-toastify';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check authentication status when component mounts
  useEffect(() => {
    const currentUrl = window.location.href;
    
    // Check if we're on Google or Facebook account pages
    if (currentUrl.includes('/auth/google/account') || currentUrl.includes('/auth/facebook/account')) {
      // Redirect to home page
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please check your input and try again.');
      return;
    }

    setIsLoading(true);
    try {
      // Format the request data
      const signupData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };
      
      const response = await axiosInstance.post('/auth/signup', signupData);

      if (response.status === 201) {
        toast.success('Account created successfully! Please login to continue.');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Give user time to read the success message
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      const errorDetails = error.response?.data?.details;

      
      // Handle specific errors
      if (error.response?.status === 400) {
        if (errorDetails) {
          setErrors(prev => ({
            ...prev,
            ...Object.entries(errorDetails).reduce((acc, [key, value]) => {
              if (value) acc[key] = value;
              return acc;
            }, {})
          }));
        } else if (errorMessage.includes('exists')) {
          setErrors({ email: 'This email is already registered. Please login instead.' });
          toast.error(errorMessage);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithProvider = async (provider) => {
    try {
      toast.info(`Redirecting to ${provider} signup...`);
      window.location.href = `${server}/auth/${provider}`;
    } catch (error) {
      console.error(`${provider} signup error:`, error);
      toast.error(`Unable to signup with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${images.banner})`
        }}
      >
        {/* Very light gradient overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40"></div>
      </div>

      {/* Logo */}
      <Link to="/" className="absolute top-8 left-8 md:left-16 z-20 no-underline">
        <div className="text-3xl md:text-4xl font-bold text-red-500 cursor-pointer hover:text-red-400 transition-colors duration-300" style={{ textShadow: '0 0 10px rgba(229, 9, 20, 0.5)' }}>
          CINEMA
        </div>
      </Link>

      {/* Content */}
      <div className="container relative z-10">
        <div className="row justify-content-end">
          <div className="col-12 col-md-8 col-lg-6 offset-lg-1 px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="bg-black/40 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl border border-white/5 relative overflow-hidden"
            >
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5"></div>
              
              <div className="relative">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-red-500 mb-4 drop-shadow-lg tracking-wide">Create Account</h2>
                  <p className="text-gray-300 text-lg md:text-xl">Join us to start watching movies</p>
                </motion.div>

                {/* Social Signup Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
                >
                  <button 
                    type="button"
                    onClick={() => handleLoginWithProvider('google')}
                    className="flex items-center justify-center gap-2 md:gap-3 py-2.5 md:py-3 px-4 md:px-5 bg-dark-300/80 hover:bg-dark-400/80 text-white rounded-xl transition-all duration-300 shadow-dark border border-dark-400/30 hover:border-primary-600/50 hover:shadow-dark-lg group text-base md:text-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <FaGoogle className="text-primary-500 group-hover:text-primary-400 transition-colors text-2xl" />
                    <span>Google</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleLoginWithProvider('facebook')}
                    className="flex items-center justify-center gap-2 md:gap-3 py-2.5 md:py-3 px-4 md:px-5 bg-dark-300/80 hover:bg-dark-400/80 text-white rounded-xl transition-all duration-300 shadow-dark border border-dark-400/30 hover:border-primary-600/50 hover:shadow-dark-lg group text-base md:text-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <FaFacebook className="text-blue-500 group-hover:text-blue-400 transition-colors text-2xl" />
                    <span>Facebook</span>
                  </button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="flex-1 border-t border-dark-400/50"></div>
                  <span className="text-gray-500 text-base font-medium px-4">or continue with</span>
                  <div className="flex-1 border-t border-dark-400/50"></div>
                </motion.div>

                <motion.form 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  onSubmit={handleSubmit} 
                  className="space-y-5"
                >
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 text-base rounded-xl bg-dark-400/50 border ${errors.name ? 'border-red-500' : 'border-dark-500/50'} text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg`}
                      placeholder="Full Name"
                      required
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 text-base rounded-xl bg-dark-400/50 border ${errors.email ? 'border-red-500' : 'border-dark-500/50'} text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg`}
                      placeholder="Email address"
                      required
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div className="form-group relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 text-base rounded-xl bg-dark-400/50 border ${errors.password ? 'border-red-500' : 'border-dark-500/50'} text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg pr-12`}
                      placeholder="Password"
                      required
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('password')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>

                  <div className="form-group relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 text-base rounded-xl bg-dark-400/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-dark-500/50'} text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg pr-12`}
                      placeholder="Confirm Password"
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </button>
                  </div>

                  <div className="flex items-center mb-4 group">
                    <input
                      type="checkbox"
                      id="terms"
                      className="w-5 h-5 rounded border-dark-400 text-primary-600 focus:ring-4 focus:ring-primary-500/30 bg-dark-300 cursor-pointer transition-all duration-300 focus:scale-110 checked:scale-105"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-base text-gray-300">
                      I agree to the{' '}
                      <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors no-underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-400 hover:text-primary-300 transition-colors no-underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-5 text-base bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-xl transition-all duration-300 shadow-dark hover:shadow-dark-lg font-medium transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </motion.form>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-center mt-6"
                >
                  <p className="text-gray-400 text-lg">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors no-underline hover:underline">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 