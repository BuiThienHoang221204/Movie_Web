import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit, FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';
import WatchHistory from '../components/WatchHistory';
import './UserProfile.css';
import movieService from '../../services/movieService';

// 1. Component Definition and Props
function UserProfile({ user: propUser }) {
  // 2. State and Hooks Initialization
  const reduxUser = useSelector((state) => state.auth.user);
  const user = reduxUser || propUser;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [watchStats, setWatchStats] = useState({
    totalWatched: 0,
    hoursWatched: 0,
  });

  // 3. Fetch Watch Stats Effect
  useEffect(() => {
    const fetchWatchStats = async () => {
      try {
        const data = await movieService.getWatchHistory(user.email);
        const totalWatched = data.length;
        let favoriteGenre = 'N/A';

        const hoursWatched = data.reduce((acc, item) => acc + (item.progress || 0) * 2, 0); // Assume 2 hours per movie

        setWatchStats({
          totalWatched,
          favoriteGenre,
          hoursWatched: Math.round(hoursWatched),
        });
      } catch (err) {
        console.error('Error fetching watch stats:', err);
      }
    };

    fetchWatchStats();
  }, [user]);

  // 4. Dropdown Click Outside Effect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 5. Logout Handler
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

  // 6. No User Render
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-black text-white p-6"
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

  // 7. Main Render
  return (
    <>
      <div className="bg-black min-h-screen text-white">

        {/* 8. Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 pt-24"
        >
          <div className="max-w-5xl mx-auto space-y-8">
            {/* 9. Profile Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="profile-header"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="avatar-container"
              >
                <img
                  src={user.avatar || 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leo&flip=true&radius=40'}
                  alt="User avatar"
                  className="avatar-image"
                />
              </motion.div>
              <div className="profile-info">
                <h1 className="welcome-text">
                  Chào mừng bạn, {user.name || 'User'}!
                </h1>
                <p className="email-text">{user.email || 'email@example.com'}</p>
                <Link to="/user-info" state={{ user }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="edit-profile-btn"
                  >
                    <FaUserEdit /> Chỉnh sửa hồ sơ
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* 10. Watch Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="watch-stats"
            >
              <h2 className="section-title">Số liệu của bạn</h2>
              <div className="stats-grid">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="stat-card"
                >
                  <span className="stat-number">{watchStats.totalWatched}</span>
                  <p className="stat-label">Số phim đã xem</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="stat-card"
                >
                  <span className="stat-number">{watchStats.hoursWatched}</span>
                  <p className="stat-label">Số giờ đã xem</p>
                </motion.div>
              </div>
            </motion.div>

            {/* 11. Watch History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="watch-history"
            >
              <h2 className="section-title">Lịch sử xem</h2>
              <WatchHistory user={user} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="watch-history-section">
        <WatchHistory user={user} />
      </div>
    </>
  );
}

export default UserProfile;