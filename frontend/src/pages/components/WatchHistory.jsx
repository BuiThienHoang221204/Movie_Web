import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './WatchHistory.css';
import movieService from '../../services/movieService';
import { useMovies } from '../components/MovieContext';
import { useNavigate } from 'react-router-dom';

const WatchHistory = (props) => {
  const { user } = props;
  const { genres } = useMovies();
  const [movies, setMovies] = useState([]);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const data = await movieService.getWatchHistory(user.email);
        if (data && data.length > 0) {
          setWatchHistory(data);
        }
      } catch (err) {
        console.error('Lỗi khi lấy lịch sử xem phim (frontend):', err);
        setError('Lỗi khi lấy lịch sử xem phim.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, [user.email]);

  useEffect(() => {
    const fetchRecommendedMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        if (data && data.length > 0) {
          setMovies(data);
        }
      } catch (err) {
        console.error('Lỗi khi lấy phim đề xuất (frontend):', err);
      }
    };

    fetchRecommendedMovies();
  }, []);

  const toggleShowAllMovies = () => {
    setShowAllMovies((prev) => !prev);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 4, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 4, watchHistory.length - 4));
  };

  const handleMovieClick = async (movieId, historyId) => {
    try {
      const updatedProgress = 0.1;
      await movieService.updateWatchHistory(historyId, { progress: updatedProgress });

      const updatedData = await movieService.getWatchHistory(user.email);
      setWatchHistory(updatedData);

      navigate(`/watch/${movieId}`);
    } catch (err) {
      console.error('Error updating watch history on click:', err);
      setError('Không thể cập nhật lịch sử xem phim.');
    }
  };

  const normalizeRating = (rating) => (rating / 2).toFixed(1);

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
      </div>
    );
  }

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
            <button
              className="nav-btn prev"
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <FaChevronLeft />
            </button>
            <div className="movie-track">
              {watchHistory.slice(currentIndex, currentIndex + 4).map((item) => {
                const movie = movies.find((m) => m.id === item.movieId);
                if (!movie) return null;
                return (
                  <div
                    key={`${item.userId}-${item.movieId}`}
                    className="history-item"
                    onClick={() => handleMovieClick(item.movieId, item._id)}
                  >
                    <img
                      src={movie.image || 'https://via.placeholder.com/350x500'}
                      alt={movie.title}
                      className="history-image"
                    />
                    <div className="history-info">
                      <div className="history-rating">
                        ★ {normalizeRating(movie.rating) || 0}/5
                      </div>
                      <h2 className="history-title">{movie.title}</h2>
                      <div className="history-match">
                        Progress: {(item.progress * 100) || 0}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              className="nav-btn next"
              onClick={handleNext}
              disabled={currentIndex + 4 >= watchHistory.length}
            >
              <FaChevronRight />
            </button>
          </div>
          {showAllMovies && watchHistory.length > 4 && (
            <div className="all-movies-section">
              <h2 className="all-movies-title">Toàn bộ phim đã xem</h2>
              <div className="all-movies-grid">
                {watchHistory.map((item) => {
                  const movie = movies.find((m) => m.id === item.movieId);
                  if (!movie) return null;
                  return (
                    <div
                      key={`${item.userId}-${item.movieId}`}
                      className="history-item"
                      onClick={() => handleMovieClick(item.movieId, item._id)}
                    >
                      <img
                        src={movie.image || 'https://via.placeholder.com/350x500'}
                        alt={movie.title}
                        className="history-image"
                      />
                      <div className="history-info">
                        <div className="history-rating">
                          ★ {normalizeRating(movie.rating) || 0}/5
                        </div>
                        <h2 className="history-title">{movie.title}</h2>
                        <div className="history-match">
                          Progress: {(item.progress * 100) || 0}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WatchHistory;