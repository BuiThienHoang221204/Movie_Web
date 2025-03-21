import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowDown } from 'react-icons/fa';
import './WatchHistory.css';

const WatchHistory = ({ user }) => {
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // For navigation

  // Fetch watch history
  useEffect(() => {
    const fetchWatchHistory = async () => {
      if (!user || !user._id) {
        setError('Không thể tải lịch sử xem phim: Thiếu thông tin người dùng.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/watch-history/${user._id}`);
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setWatchHistory(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching watch history:', err);
        setError(`Không thể tải lịch sử xem phim: ${err.message}`);
        setWatchHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, [user]);

  // Toggle show all movies
  const toggleShowAllMovies = () => {
    setShowAllMovies((prev) => !prev);
  };

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 4, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 4, watchHistory.length - 4));
  };

  if (loading) {
    return (
      <div className="watch-history-container">
        <div className="loading-message">Đang tải lịch sử xem phim...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="watch-history-container">
        <div className="error-message">{error}</div>
      </div>    );
  }

  // Adjust rating to a 5-star scale if backend uses 10-star scale
  const normalizeRating = (rating) => (rating / 2).toFixed(1);

  return (
    <div className="watch-history-container">
      {watchHistory.length > 0 && (
        <div className="title-container">
          <h1 className="watch-history-title">Xem gần đây</h1>
          <button
            className="view-all-btn"
            onClick={toggleShowAllMovies}
            disabled={watchHistory.length <= 4}
          >
            {showAllMovies ? 'Ẩn' : 'Xem tất cả'}{' '}
            {showAllMovies ? <FaArrowDown className="arrow-icon" /> : <FaArrowRight className="arrow-icon" />}
          </button>
        </div>
      )}
      {watchHistory.length === 0 ? (
        <div className="no-history-message">Bạn chưa xem bộ phim nào.</div>
      ) : (
        <>
          <div className="history-grid">
            <div className="movie-track">
              {watchHistory.slice(currentIndex, currentIndex + 4).map((item) => (
                <div key={`${item.userId}-${item.movieId}`} className="history-item">
                  <img
                    src={item.image || 'https://via.placeholder.com/350x500'}
                    alt={item.title}
                    className="history-image"
                  />
                  <div className="history-info">
                    <div className="history-rating">★ {normalizeRating(item.rating) || 0}/5</div>
                    <h2 className="history-title">
                      {item.title || item.videoUrl.split('/').pop().replace('.mp4', '') || 'Unknown Video'}
                    </h2>
                    <div className="history-genre">{item.genre || 'Unknown Genre'}</div>
                    <div className="history-match">Match: {Math.round(item.progress * 100) || 0}%</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="prev"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              ◄
            </button>
            <button
              className="next"
              onClick={handleNext}
              disabled={currentIndex + 4 >= watchHistory.length}
            >
              ►
            </button>
          </div>
          {showAllMovies && watchHistory.length > 4 && (
            <div className="all-movies-section">
              <h2 className="all-movies-title">Toàn bộ phim đã xem</h2>
              <div className="all-movies-grid">
                {watchHistory.map((item) => (
                  <div key={`${item.userId}-${item.movieId}`} className="history-item">
                    <img
                      src={item.image || 'https://via.placeholder.com/350x500'}
                      alt={item.title}
                      className="history-image"
                    />
                    <div className="history-info">
                      <div className="history-rating">★ {normalizeRating(item.rating) || 0}/5</div>
                      <h2 className="history-title">
                        {item.title || item.videoUrl.split('/').pop().replace('.mp4', '') || 'Unknown Video'}
                      </h2>
                      <div className="history-genre">{item.genre || 'Unknown Genre'}</div>
                      <div className="history-match">Match: {Math.round(item.progress * 100) || 0}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WatchHistory;