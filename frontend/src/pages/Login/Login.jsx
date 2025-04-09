import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaHome, FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../config/axios';
import images from '../../assets/img';
import { server } from '../../config';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setAccessToken, setUser } from '../../redux/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check authentication status when component mounts
  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');

    if (accessToken) {
      // Store the access token (e.g., in localStorage or your state management solution)
      localStorage.setItem('accessToken', accessToken);
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await axiosInstance.post('/auth/login', formData);

      if (response.status === 200) {
        const { accessToken, user } = response.data;

        // Update Redux store
        dispatch(setAccessToken(accessToken));
        dispatch(setUser(user));

        toast.success('Welcome! Login successful.');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';

      // Show toast notification for all errors
      toast.error(errorMessage);

      // Set form errors for authentication issues
      if (error.response?.status === 401 || error.response?.status === 400) {
        setErrors({}); // Clear any existing errors instead of setting them
      }

      // Special handling for provider-specific errors
      if (error.response?.data?.message?.includes('authentication')) {
        const provider = error.response.data.message.match(/with (\w+)/)?.[1];
        if (provider) {
          toast.info(`Please use ${provider} to login to this account.`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithProvider = async (provider) => {
    try {
      toast.info(`Redirecting to ${provider} login...`);
      window.location.href = `${server}/auth/${provider}`;
    } catch (error) {
      toast.error(`Unable to login with ${provider}. Please try again.`);
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
      <Link to="/" className="absolute top-4 left-2 md:left-9 z-20 logo text-decoration-none">
        HMOVIE
      </Link>

      {/* Content */}
      <div className="container relative z-10">
        <div className="row justify-content-end">
          <div className="col-12 col-md-8 col-lg-6 offset-lg-1 px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="bg-black/50 backdrop-blur-md rounded-3xl p-6 border border-gray-700 relative overflow-hidden"
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
                  <h2 className="sm:text-3xl md:text-5xl font-bold text-red-500 sm:mb-2 md:mb-4 drop-shadow-lg tracking-wide">Welcome</h2>
                  <p className="text-gray-300 md:text-lg">Sign in to continue watching movies</p>
                </motion.div>

                {/* Social Login Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="grid grid-cols-2 gap-3 mb-6"
                >
                  <button
                    type="button"
                    onClick={() => handleLoginWithProvider('google')}
                    className="flex items-center justify-center gap-2 md:gap-3 py-2.5 sm:py-0 sm:px-0 md:py-3 px-4 md:px-5 bg-dark-300/80 hover:bg-dark-400/80 text-white rounded-xl transition-all duration-300 shadow-dark border border-dark-400/30 hover:border-primary-600/50 hover:shadow-dark-lg group text-base md:text-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <FaGoogle className="text-primary-500 group-hover:text-primary-400 transition-colors sm:text-xl md:text-2xl" />
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoginWithProvider('facebook')}
                    className="flex items-center justify-center gap-2 md:gap-3 py-2.5 sm:py-0 sm:px-0 md:py-3 px-4 md:px-5 bg-dark-300/80 hover:bg-dark-400/80 text-white rounded-xl transition-all duration-300 shadow-dark border border-dark-400/30 hover:border-primary-600/50 hover:shadow-dark-lg group text-base md:text-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <FaFacebook className="text-blue-500 group-hover:text-blue-400 transition-colors sm:text-xl md:text-2xl" />
                    <span>Facebook</span>
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center gap-1 mb-6"
                >
                  <div className="flex-1 border-t border-dark-900/50"></div>
                  <span className="text-gray-500 text-base font-medium px-4">or continue with</span>
                  <div className="flex-1 border-t border-dark-900/50"></div>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="form-group relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 text-base rounded-xl bg-dark-400/50 border border-dark-500/50 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.01] focus:shadow-lg`}
                      placeholder="Email address"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaEnvelope size={18} />
                    </div>
                  </div>

                  <div className="form-group relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-5 py-3 text-base rounded-xl bg-dark-400/50 border border-dark-500/50 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.01] focus:shadow-lg`}
                      placeholder="Password"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaLock size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center group">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-5 h-5 rounded border-dark-400 text-primary-600 focus:ring-4 focus:ring-primary-500/30 bg-dark-300 cursor-pointer transition-all duration-300 focus:scale-110 checked:scale-105"
                      />
                      <label htmlFor="remember" className="ml-2 text-base text-gray-300">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="text-base text-primary-400 hover:text-primary-300 transition-colors no-underline">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 text-base bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-xl transition-all duration-300 shadow-dark hover:shadow-dark-lg font-medium transform hover:-translate-y-0.5 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </motion.form>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="text-center mt-6"
                >
                  <p className="text-gray-400 sm:text-sm md:text-lg">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors no-underline hover:underline">
                      Sign up
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

export default Login; 