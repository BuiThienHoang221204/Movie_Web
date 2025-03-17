import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCog, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { clearAccessToken } from '../../redux/authSlice';

const User = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearAccessToken());
  };

  const menuItems = [
    { icon: <FaUser className="w-5 h-5" />, label: 'Thông tin', path: '/profile' },
    { icon: <FaCog className="w-5 h-5" />, label: 'Cài đặt', path: '/settings' },
    { icon: <FaSignOutAlt className="w-5 h-5" />, label: 'Đăng xuất', onClick: handleLogout },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-500 hover:border-primary-400 transition-colors duration-300">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leo&flip=true&radius=40"
              alt="Default avatar"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <span className="text-white font-medium hidden md:block">{user?.name}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white"
        >
          ▼
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-dark-300 rounded-xl shadow-lg border border-dark-400/50 backdrop-blur-md"
          >
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.onClick ? (
                    <button
                      onClick={item.onClick}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-dark-400/50 hover:text-white transition-colors duration-200"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.path}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-dark-400/50 hover:text-white transition-colors duration-200"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default User; 