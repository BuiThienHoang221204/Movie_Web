import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit, FaSave, FaTimes } from 'react-icons/fa';
import axiosInstance from '../../config/axios';
import { setUser, updateUserField } from '../../redux/authSlice';
import './UserInfo.css';

const UserInfo = () => {
  const navigate = useNavigate();
  const  user = useSelector((state) => state.auth.user);
  const dispacth = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const editRef = useRef(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editRef.current && !editRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    console.log(user)
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setName(user.name);
    setAvatarPreview(user.avatar);
  }, [user])

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(file); // Store the file object for upload
        setAvatarPreview(reader.result); // Preview the image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError('Tên không được để trống.');
      return;
    }

    setIsLoading(true);

    // Prepare form data for file upload
    const formData = new FormData();
    formData.append('name', name);
    if (avatar instanceof File) {
      formData.append('avatar', avatar); // Only append if it’s a new file
    }

    try {
      const updateUser = {
        ...user,
        name: name,
        avatar: avatarPreview,
      }

      dispacth(updateUserField(updateUser));
      
      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response) {
        setError(error.response.data?.message || 'Không thể cập nhật thông tin người dùng.');
      } else if (error.request) {
        setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black p-6 flex items-start justify-center pt-24"
    >
      <div className="max-w-lg w-full bg-opacity-10 p-6 rounded-xl shadow-lg border border-gray-700 relative" ref={editRef}>
        <h1 className="text-2xl font-bold text-red-400 mb-6 text-center">Hồ sơ người dùng</h1>

        {/* Error/Success Messages */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        {success && <div className="text-green-500 text-center mb-4">{success}</div>}

        {/* Avatar and Basic Info */}
        <div className="flex flex-col items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-32 h-32 rounded-full overflow-hidden border-2 border-red-500"
          >
            <img
              src={avatarPreview || 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leo&flip=true&radius=40'}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {
            user && (
              <div className="text-gray-300 text-center">
                <p><strong className="text-white">Tên:</strong> {user.name || 'Chưa đặt tên'}</p>
                <p><strong className="text-white">Email:</strong> {user.email || 'N/A'}</p>
                <p><strong className="text-white">Vai trò:</strong> {user.role || 'N/A'}</p>
              </div>
            )
          }

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            disabled={isLoading}
          >
            <FaUserEdit /> Chỉnh sửa
          </motion.button>
        </div>

        {/* Edit Form Dropdown */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-gray-700 rounded-xl shadow-lg border border-gray-600 p-4 z-10"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label htmlFor="name" className="text-gray-300 font-medium">Tên:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-1 p-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:outline-none focus:border-red-500"
                    disabled={isLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="avatar" className="text-gray-300 font-medium">Ảnh đại diện:</label>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full mt-1 p-2 bg-gray-600 text-white rounded-lg border border-gray-500"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      <FaSave />
                    )}
                    {isLoading ? 'Đang lưu...' : 'Lưu'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    <FaTimes /> Hủy
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link to="/profile">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              disabled={isLoading}
            >
              Quay lại
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default UserInfo;