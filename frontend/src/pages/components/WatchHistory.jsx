import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowDown } from 'react-icons/fa';
import './WatchHistory.css';
import movieService from '../../services/movieService';
import {useMovies} from '../components/MovieContext';
import { Link } from 'react-router-dom';

const WatchHistory = (props) => {
  const { user } = props;
  const { genres } = useMovies();
  const [movies, setMovies] = useState([]);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0); // For navigation

  // Fetch watch history of user
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
    }

    fetchWatchHistory();
  }, []);

  useEffect(() => {
    const fetchRecommentMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        if (data && data.length > 0) {
            setMovies(data);

        }
      } catch (err) {
        console.error('Lỗi khi lấy phim đề xuất (frontend):', err);
      }
    }

    fetchRecommentMovies();
  }, []);

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
                <Link key={`${item.userId}-${item.movieId}`}  to={`/watch/${item.movieId}`} className="history-item text-decoration-none">
                  {
                    movies.map((movie) => {
                      if (movie.id === item.movieId) {
                        return (
                          <div key={`${item.userId}-${item.movieId}`} >
                            <img
                            src={movie.image || 'https://via.placeholder.com/350x500'}
                            alt={movie.title}
                            className="history-image"
                            />
                            <div className="history-info">
                              <div className="history-rating">★ {normalizeRating(movie.rating) || 0}/5</div>
                              <h2 className="history-title">
                                {item.title}
                              </h2>
                              <div className="history-genre">{item.genre || 'Unknown Genre'}</div>
                              <div className="history-match">Match: {Math.round(item.progress * 100) || 0}%</div>
                            </div>
                          </div>
                        );
                      }
                    })
                  }
                </Link>
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

                  <Link key={`${item.userId}-${item.movieId}`} to={`/watch/${item.movieId}`} className="history-item text-decoration-none">
                    {
                      movies.map((movie) => {
                        if (movie.id === item.movieId) {
                          return (
                            <div key={`${item.userId}-${item.movieId}`} >
                              <img
                              src={movie.image || 'https://via.placeholder.com/350x500'}
                              alt={movie.title}
                              className="history-image"
                              />
                              <div className="history-info">
                                <div className="history-rating">★ {normalizeRating(movie.rating) || 0}/5</div>
                                <h2 className="history-title">
                                  {item.title}
                                </h2>
                                <div className="history-genre">{item.genre || 'Unknown Genre'}</div>
                                <div className="history-match">Match: {Math.round(item.progress * 100) || 0}%</div>
                              </div>
                            </div>
                          );
                        }
                      })
                    }
                  </Link>
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