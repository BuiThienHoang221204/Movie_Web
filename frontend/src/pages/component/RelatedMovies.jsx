import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlay, FaStar } from 'react-icons/fa';
import './RelatedMovies.css';

const RelatedMovies = ({ currentMovieId }) => {
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Giả lập việc lấy dữ liệu phim liên quan từ API
    setTimeout(() => {
      // Dữ liệu mẫu
      const mockRelatedMovies = [
        {
          id: '1',
          title: 'Avengers: Infinity War',
          year: 2018,
          poster: 'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg',
          rating: 8.4,
          duration: '2h 29m',
          genres: ['Hành động', 'Phiêu lưu']
        },
        {
          id: '2',
          title: 'Captain America: Civil War',
          year: 2016,
          poster: 'https://m.media-amazon.com/images/M/MV5BMjQ0MTgyNjAxMV5BMl5BanBnXkFtZTgwNjUzMDkyODE@._V1_.jpg',
          rating: 7.8,
          duration: '2h 27m',
          genres: ['Hành động', 'Phiêu lưu']
        },
        {
          id: '3',
          title: 'Thor: Ragnarok',
          year: 2017,
          poster: 'https://m.media-amazon.com/images/M/MV5BMjMyNDkzMzI1OF5BMl5BanBnXkFtZTgwODcxODg5MjI@._V1_.jpg',
          rating: 7.9,
          duration: '2h 10m',
          genres: ['Hành động', 'Hài hước']
        },
        {
          id: '4',
          title: 'Black Panther',
          year: 2018,
          poster: 'https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_.jpg',
          rating: 7.3,
          duration: '2h 14m',
          genres: ['Hành động', 'Phiêu lưu']
        },
        {
          id: '5',
          title: 'Doctor Strange',
          year: 2016,
          poster: 'https://m.media-amazon.com/images/M/MV5BNjgwNzAzNjk1Nl5BMl5BanBnXkFtZTgwMzQ2NjI1OTE@._V1_.jpg',
          rating: 7.5,
          duration: '1h 55m',
          genres: ['Hành động', 'Phiêu lưu']
        }
      ];
      
      // Lọc ra phim hiện tại nếu có trong danh sách
      const filteredMovies = mockRelatedMovies.filter(movie => movie.id !== currentMovieId);
      setRelatedMovies(filteredMovies);
      setLoading(false);
    }, 1000);
  }, [currentMovieId]);

  const handleWatchNow = (movieId, event) => {
    event.preventDefault(); // Ngăn chặn hành vi mặc định của Link
    navigate(`/watch/${movieId}`);
  };

  if (loading) {
    return (
      <div className="related-movies-loading">
        <div className="spinner-small"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (relatedMovies.length === 0) {
    return <p className="no-related">Không có phim liên quan</p>;
  }

  return (
    <div className="related-movies">
      {relatedMovies.map(movie => (
        <Link to={`/watch/${movie.id}`} key={movie.id} className="related-movie-card">
          <div className="related-movie-poster">
            <img src={movie.poster} alt={movie.title} loading="lazy" />
            <div className="related-movie-rating">
              <FaStar /> {movie.rating}
            </div>
            <div className="related-movie-overlay">
              <button 
                className="watch-now-button"
                onClick={(e) => handleWatchNow(movie.id, e)}
              >
                <FaPlay /> Xem ngay
              </button>
            </div>
          </div>
          <div className="related-movie-info">
            <h3 className="related-movie-title">{movie.title}</h3>
            <div className="related-movie-meta">
              <span className="related-movie-year">{movie.year}</span>
              <span className="related-movie-duration">{movie.duration}</span>
            </div>
            {movie.genres && (
              <div className="related-movie-genres">
                {movie.genres.slice(0, 2).map((genre, index) => (
                  <span key={index} className="related-genre-tag">{genre}</span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedMovies; 