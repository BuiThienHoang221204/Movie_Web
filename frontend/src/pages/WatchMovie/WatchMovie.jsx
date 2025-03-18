import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import movieService from '../../services/movieService';
import './WatchMovie.css';
import { FaStar, FaCalendarAlt, FaUsers, FaPlayCircle } from 'react-icons/fa';
import images from '../../assets/img';

function WatchMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const data = await movieService.getMovieDetail(id);
        setMovie(data);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết phim:', err);
        setError('Không thể tải thông tin phim. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Đang tải phim...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!movie) {
    return <div className="not-found">Không tìm thấy phim</div>;
  }



  return (
    <div className="watch-movie-container">
      <div className="movie-content">
        {/* Phần thông tin phim */}
        <div className="movie-info-section">
          <div className="movie-header">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-badges">
              <span className="movie-badge quality-badge">HD</span>
              <span className="movie-badge year-badge">{movie.release_date?.split('-')[0]}</span>
            </div>
          </div>

          {/* Container cho hình ảnh và thông tin */}
          <div className="movie-details-container">
            <div className="movie-poster-wrapper">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
                className="movie-poster"
                onError={(e) => { e.target.src = images.ImgMovie; }}
              />
             
            </div>

            <div className="movie-details">
              <div className="movie-meta-info">
                <div className="meta-item">
                  <FaCalendarAlt className="meta-icon" />
                  <span>Ngày phát hành: {movie.release_date}</span>
                </div>
                <div className="meta-item">
                  <FaStar className="meta-icon star-icon" />
                  <span>Đánh giá: {movie.vote_average?.toFixed(1)}/10</span>
                </div>
                <div className="meta-item">
                  <FaUsers className="meta-icon" />
                  <span>{movie.vote_count} lượt đánh giá</span>
                </div>
              </div>

              <div className="movie-genres">
                <h3>Thể loại:</h3>
                <div className="genre-tags">
                  {movie.genre_ids?.map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  )) || <span className="genre-tag">Chưa phân loại</span>}
                </div>
              </div>

              <div className="movie-description">
                <h3>Tóm tắt phim:</h3>
                <p>{movie.overview || 'Chưa có mô tả cho phim này.'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phần xem phim */}
        <div className="movie-player-section">
          <div className="section-header">
            <h2>Xem Phim</h2>
            <div className="player-quality">
              <span className="quality-label">Chất lượng:</span>
              <select className="quality-select">
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>
          </div>

          <div className="movie-player">
            {movie.video_url ? (
              <iframe
                src={movie.video_url.replace('youtu.be/', 'youtube.com/embed/').replace('watch?v=', 'embed/')}
                title={movie.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="no-video">
                <FaPlayCircle className="no-video-icon" />
                <p>Không có video cho phim này</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchMovie;
