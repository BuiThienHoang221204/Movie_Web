import React, { useState, useEffect } from 'react';
import { FaArrowRight, FaArrowDown } from 'react-icons/fa';
import './WatchHistory.css';
import movieService from '../../services/movieService';
import { useMovies } from '../components/MovieContext';

const WatchHistory = (props) => {
  const { user } = props;
  const { genres } = useMovies();
  const [movies, setMovies] = useState([]);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch watch history of user
  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const data = await movieService.getWatchHistory(user.email);
        if (data && data.length > 0) {
          setWatchHistory(data);
          console.log('Watch History:', data);
        }
      } catch (err) {
        console.error('Error (frontend):', err);
        setError('Failed to fetch watch history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchHistory();
  }, []);

  useEffect(() => {
    const fetchRecommendMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        if (data && data.length > 0) {
          setMovies(data);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchRecommendMovies();
  }, []);

  // Toggle show all movies
  const toggleShowAllMovies = () => {
    setShowAllMovies((prev) => !prev);
  };

  // Adjust rating to a 5-star scale if backend uses 10-star scale
  const normalizeRating = (rating) => (rating / 2).toFixed(1);

  if (loading) {
    return (
      <div className="watch-history-container">
        <div className="loading-message">Loading...</div>
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
          <button
            className="view-all-btn"
            onClick={toggleShowAllMovies}
            disabled={watchHistory.length <= 4}
          >
            {showAllMovies ? 'Hide' : 'View all'}{' '}
            {showAllMovies ? <FaArrowDown className="arrow-icon" /> : <FaArrowRight className="arrow-icon" />}
          </button>
        </div>
      )}
      {watchHistory.length === 0 ? (
        <div className="no-history-message">You haven't watched any movie.</div>
      ) : (
        <>
          <div className="history-grid">
            {watchHistory.slice(0, 4).map((item) => {
              const movie = movies.find((m) => m.id === item.movieId);
              if (!movie) return null;
              return (
                <div
                  key={`${item.userId}-${item.movieId}`}
                  className="history-item"
                >
                  <img
                    src={movie.image || 'https://via.placeholder.com/350x500'}
                    alt={movie.title}
                    className="history-image"
                  />
                  <div className="history-info">
                    <div className="history-rating">
                      ★ {normalizeRating(movie.rating) || 0}/10
                    </div>
                    <h2 className="history-title">{movie.title}</h2>
                    <div className="history-progress">
                      Progress: {(item.progress * 100) || 0}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {showAllMovies && watchHistory.length > 4 && (
            <div className="all-movies-section">
              <h2 className="all-movies-title">Total movies watched</h2>
              <div className="all-movies-grid">
                {watchHistory.map((item) => {
                  const movie = movies.find((m) => m.id === item.movieId);
                  if (!movie) return null;
                  return (
                    <div
                      key={`${item.userId}-${item.movieId}`}
                      className="history-item"
                    >
                      <img
                        src={movie.image || 'https://via.placeholder.com/350x500'}
                        alt={movie.title}
                        className="history-image"
                      />
                      <div className="history-info">
                        <div className="history-rating">
                          ★ {normalizeRating(movie.rating) || 0}/10
                        </div>
                        <h2 className="history-title">{movie.title}</h2>
                        <div className="history-progress">
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