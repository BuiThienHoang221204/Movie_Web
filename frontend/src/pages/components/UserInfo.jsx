import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './UserInfo.css';

const UserInfo = ({ user }) => {
  // Fallback to an empty object if user is undefined
  const safeUser = user || {};

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(safeUser.name || '');
  const [avatar, setAvatar] = useState(safeUser.avatar || '');
  const [avatarPreview, setAvatarPreview] = useState(safeUser.avatar || '');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(file);
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...safeUser,
      name,
      avatar: avatarPreview,
    };
    console.log('Updated User:', updatedUser);
    setIsEditing(false);
  };

  // If user is undefined, show a loading or error message
  if (!user) {
    return (
      <div className="user-info-container">
        <h1 className="user-info-title">Hồ sơ người dùng</h1>
        <p>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</p>
        <Link to="/profile">
          <button className="back-btn">Quay lại</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="user-info-container">
      <h1 className="user-info-title">Hồ sơ người dùng</h1>
      <div className="user-info-content">
        <div className="avatar-section">
          <img src={avatarPreview || 'https://via.placeholder.com/150'} alt="Avatar" className="user-avatar" />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="avatar-input"
            />
          )}
        </div>
        <div className="info-section">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Tên:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={safeUser.email || ''}
                  disabled
                  className="form-input disabled"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Lưu</button>
                <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">Hủy</button>
              </div>
            </form>
          ) : (
            <>
              <p><strong>Tên:</strong> {name}</p>
              <p><strong>Email:</strong> {safeUser.email || ''}</p>
              <p><strong>Nhà cung cấp:</strong> {safeUser.provider || ''}</p>
              <p><strong>Vai trò:</strong> {safeUser.role || ''}</p>
              <button onClick={() => setIsEditing(true)} className="edit-btn">Chỉnh sửa</button>
              <Link to="/">
                <button className="back-btn">Quay lại</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;