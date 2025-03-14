import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaHome, FaEye, FaEyeSlash } from 'react-icons/fa';
import images from '../../assets/img';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        // Handle successful signup
        console.log('Signup successful:', data);
      } else {
        // Handle signup error
        console.error('Signup failed:', data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/google/url');
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Google signup error:', error);
    }
  };

  const handleFacebookSignup = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/facebook/url');
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Facebook signup error:', error);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image & Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${images.banner3})`
        }}
      >
        {/* Very light gradient overlay */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <Link 
              to="/" 
              className="block mb-2 text-white hover:text-gray-200 font-medium transition-all duration-300 no-underline group flex items-center gap-2 text-base"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">Back to Home</span>
            </Link>
            <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/5 relative overflow-hidden">
              {/* Glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 via-transparent to-primary-500/5"></div>
              
              <div className="relative">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg tracking-wide">Create Account</h2>
                  <p className="text-gray-300 text-lg">Join us to explore amazing movies</p>
                </div>

                {/* Social Signup Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button 
                    onClick={handleGoogleSignup}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-dark-300/80 hover:bg-dark-400/80 text-white rounded-xl transition-all duration-300 shadow-dark border border-dark-400/30 hover:border-primary-600/50 hover:shadow-dark-lg group text-base"
                  >
                    <FaGoogle className="text-primary-500 group-hover:text-primary-400 transition-colors text-xl" />
                    <span>Google</span>
                  </button>
                  <button 
                    onClick={handleFacebookSignup}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 bg-dark-300/80 hover:bg-dark-400/80 text-white rounded-xl transition-all duration-300 shadow-dark border border-dark-400/30 hover:border-primary-600/50 hover:shadow-dark-lg group text-base"
                  >
                    <FaFacebook className="text-blue-500 group-hover:text-blue-400 transition-colors text-xl" />
                    <span>Facebook</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 border-t border-dark-400/50"></div>
                  <span className="text-gray-500 text-sm font-medium px-4">or continue with</span>
                  <div className="flex-1 border-t border-dark-400/50"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-base rounded-xl bg-dark-400/50 border border-dark-500/50 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                      placeholder="Full Name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-base rounded-xl bg-dark-400/50 border border-dark-500/50 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg"
                      placeholder="Email address"
                      required
                    />
                  </div>

                  <div className="form-group relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 text-base rounded-xl bg-dark-400/50 border border-dark-500/50 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg pr-12"
                      placeholder="Password"
                      required
                    />
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
                      className="w-full px-4 py-2.5 text-base rounded-xl bg-dark-400/50 border border-dark-500/50 text-white placeholder-gray-400 focus:outline-none focus:border-primary-500/70 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg pr-12"
                      placeholder="Confirm Password"
                      required
                    />
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
                      className="w-4 h-4 rounded border-dark-400 text-primary-600 focus:ring-4 focus:ring-primary-500/30 bg-dark-300 cursor-pointer transition-all duration-300 focus:scale-110 checked:scale-105"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
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
                    className="w-full py-2.5 px-4 text-base bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-xl transition-all duration-300 shadow-dark hover:shadow-dark-lg font-medium transform hover:-translate-y-0.5"
                  >
                    Create Account
                  </button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-gray-400 text-base">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors no-underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 