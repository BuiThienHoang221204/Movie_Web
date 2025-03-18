import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, fetchAllGenres } from '../../redux/movieSlice';
import './WatchMovie.css';

function WatchMovie() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentMovie, genres, loading, error } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovieById(id));
    dispatch(fetchAllGenres());
  }, [dispatch, id]);

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error">Lỗi: {error}</div>;
  if (!currentMovie) return <div className="not-found">Không tìm thấy phim</div>;

  // Lấy tên thể loại từ ID
  const getGenreNames = () => {
    if (!genres.length || !currentMovie.genre_ids.length) return 'Chưa phân loại';
    
    return currentMovie.genre_ids
      .map(genreId => {
        const genre = genres.find(g => g.id === genreId);
        return genre ? genre.name : null;
      })
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="watch-movie-container">
      <div className="movie-backdrop" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})` }}>
        <div className="backdrop-overlay"></div>
      </div>
      
      <div className="movie-content">
        <div className="movie-header">
          <div className="movie-poster-container">
            <img 
              src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`} 
              alt={currentMovie.title} 
              className="movie-poster"
            />
          </div>
          
          <div className="movie-details">
            <h1 className="movie-title">{currentMovie.title}</h1>
            
            <div className="movie-meta">
              <span className="movie-release-date">Ngày phát hành: {currentMovie.release_date}</span>
              <span className="movie-rating">⭐ {currentMovie.vote_average.toFixed(1)}</span>
              <span className="movie-votes">({currentMovie.vote_count} đánh giá)</span>
            </div>
            
            <div className="movie-genres">
              <span>Thể loại: {getGenreNames()}</span>
            </div>
            
            <div className="movie-overview">
              <h3>Tóm tắt</h3>
              <p>{currentMovie.overview}</p>
            </div>
          </div>
        </div>
        
        <div className="movie-player-section">
          <h2>Xem phim</h2>
          <div className="movie-player">
            {currentMovie.video_url ? (
              <iframe
                src={currentMovie.video_url.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')}
                title={currentMovie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="no-video">Không có video cho phim này</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchMovie;
