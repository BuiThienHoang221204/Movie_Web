import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit, FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';
import WatchHistory from '../components/WatchHistory';
import movieService from '../../services/movieService';
import { clearAccessToken } from '../../redux/authSlice';
import './UserProfile.css';

function UserProfile({ user: propUser }) {
  const reduxUser = useSelector((state) => state.auth.user);
  const user = reduxUser || propUser;
  const navigate = useNavigate();
  const dispatch = useSelector((state) => state.auth.user);
  const [watchStats, setWatchStats] = useState({
    totalWatched: 0,
    favoriteGenre: 'N/A',
    hoursWatched: 0,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchWatchStats = async () => {
      if (!user?.email) return;
      try {
        const data = await movieService.getWatchHistory(user.email);
        const totalWatched = data.length;
        const hoursWatched = data.reduce((acc, item) => acc + (item.progress || 0) * 2, 0);

        setWatchStats({
          totalWatched,
          hoursWatched: Math.round(hoursWatched),
        });
      } catch (err) {
        console.error('Error fetching watch stats:', err);
      }
    };

    fetchWatchStats();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      dispatch(clearAccessToken());
      navigate('/');
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(clearAccessToken());
      navigate('/');
      setIsDropdownOpen(false);
    }
  };

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-black text-white p-6" // Changed to bg-black
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Không tìm thấy thông tin người dùng</h1>
          <p className="text-gray-400 mb-6">Vui lòng đăng nhập để xem hồ sơ của bạn.</p>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Đăng nhập
            </motion.button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white mt-5"> {/* Changed to bg-black */}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-500"
            >
              <img
                src={user.avatar || 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leo&flip=true&radius=40'}
                alt="User avatar"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="text md:text-left">
              <h1 className="text-3xl font-bold text-red-400">
                Chào mừng bạn, {user.name || 'User'}!
              </h1>
              <p className="text-gray-400 mt-1">{user.email || 'email@example.com'}</p>
              <Link to="/user-info" state={{ user }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <FaUserEdit /> Chỉnh sửa hồ sơ
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Watch Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-red-400 mb-4">Số liệu của bạn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-700 p-4 rounded-lg text-center"
              >
                <span className="text-4xl font-bold text-red-500">{watchStats.totalWatched}</span>
                <p className="text-gray-300 mt-2">Số phim đã xem</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-700 p-4 rounded-lg text-center"
              >
                <span className="text-4xl font-bold text-red-500">{watchStats.hoursWatched}</span>
                <p className="text-gray-300 mt-2">Số giờ đã xem</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Watch History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-red-400 mb-4">Lịch sử xem</h2>
            <WatchHistory user={user} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default UserProfile;