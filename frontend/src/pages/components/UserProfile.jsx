import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import WatchHistory from '../components/WatchHistory';
import './UserProfile.css';
import movieService from '../../services/movieService';

function UserProfile({ user: propUser }) {
  const reduxUser = useSelector((state) => state.auth.user);
  const user = reduxUser || propUser;
  const [watchStats, setWatchStats] = useState({
    totalWatched: 0,
    favoriteGenre: 'N/A',
    hoursWatched: 0,
  });

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

  if (!user) {
    return (
      <div className="user-profile-container">
        <h1 className="profile-title">Không tìm thấy thông tin người dùng</h1>
        <p>Vui lòng đăng nhập để xem hồ sơ của bạn.</p>
        <Link to="/login">
          <button className="edit-profile-btn">Đăng nhập</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img
            src={user.avatar || 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Leo&flip=true&radius=40'}
            alt="User avatar"
            className="avatar-image"
          />
        </div>
        <div>
          <div className="profile-info">
            <h1 className="profile-title">Chào mừng bạn, {user.name || 'User'}!</h1>
            <p className="profile-email">{user.email || 'email@example.com'}</p>
            <Link to="/user-info" state={{ user }}>
              <button className="edit-profile-btn">Chỉnh sửa hồ sơ</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="watch-stats">
        <h2 className="section-title">Số liệu của bạn</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{watchStats.totalWatched}</span>
            <span className="stat-label">Số phim đã xem</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{watchStats.hoursWatched}</span>
            <span className="stat-label">Số giờ đã xem</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{watchStats.favoriteGenre}</span>
            <span className="stat-label">Thể loại yêu thích</span>
          </div>
        </div>
      </div>

      <div className="watch-history-section">
        <WatchHistory user={user} />
      </div>
    </div>
  );
}

export default UserProfile;