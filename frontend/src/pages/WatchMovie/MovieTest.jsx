import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MovieTest.css';

function MovieTest() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const navigate = useNavigate();

  // Hàm lấy danh sách phim
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/movies');
      setMovies(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Lỗi khi lấy danh sách phim: ' + error.message);
      setLoading(false);
    }
  };

  // Hàm lấy danh sách thể loại
  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:5000/genres');
      setGenres(response.data.data);
    } catch (error) {
      setError('Lỗi khi lấy danh sách thể loại: ' + error.message);
    }
  };

  // Hàm lấy phim theo thể loại
  const fetchMoviesByGenre = async (genreId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/movies/genre/${genreId}`);
      setMovies(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Lỗi khi lấy danh sách phim theo thể loại: ' + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  // Xử lý khi chọn thể loại
  const handleGenreSelect = (genreId) => {
    if (selectedGenre === genreId) {
      setSelectedGenre(null);
      fetchMovies();
    } else {
      setSelectedGenre(genreId);
      fetchMoviesByGenre(genreId);
    }
  };

  // Xử lý khi nhấn vào phim
  const handleMovieClick = (movieId) => {
    navigate(`/watch/${movieId}`);
  };

  if (loading) return <div className="loading">Đang tải dữ liệu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="movie-test-container">
      <h1>Test Kết Nối MongoDB Atlas</h1>
      
      <div className="genre-section">
        <h2>Danh sách thể loại phim</h2>
        <div className="genre-list">
          {genres.map(genre => (
            <button
              key={genre.id}
              className={`genre-button ${selectedGenre === genre.id ? 'active' : ''}`}
              onClick={() => handleGenreSelect(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <div className="movie-section">
        <h2>Danh sách phim {selectedGenre ? 'theo thể loại' : ''}</h2>
        <div className="movie-list">
          {movies.length > 0 ? (
            movies.map(movie => (
              <div 
                className="movie-card" 
                key={movie.id}
                onClick={() => handleMovieClick(movie.id)}
              >
                <img 
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                  alt={movie.title} 
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>Ngày phát hành: {movie.release_date}</p>
                  <p>Đánh giá: ⭐ {movie.vote_average.toFixed(1)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-movies">Không có phim nào</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieTest; 