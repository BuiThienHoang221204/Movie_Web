import React, { useState } from 'react';
import { FaStar, FaShareAlt, FaHeart, FaRegHeart, FaPlay, FaCalendarAlt, FaLanguage, FaClosedCaptioning, FaInfoCircle } from 'react-icons/fa';
import './MovieInfo.css';

const MovieInfo = ({ movie }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Trong thực tế, bạn sẽ gọi API để lưu trạng thái yêu thích
  };
  
  const handleShare = () => {
    // Xử lý chia sẻ phim
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: `Xem phim ${movie.title} trên Movie Web`,
        url: window.location.href,
      })
      .catch((error) => console.log('Lỗi khi chia sẻ:', error));
    } else {
      // Fallback cho trình duyệt không hỗ trợ Web Share API
      alert('Sao chép liên kết này để chia sẻ: ' + window.location.href);
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="tab-content overview-tab">
            <div className="movie-description">
              <p className={showFullDescription ? '' : 'truncated'}>
                {movie.description}
              </p>
              {movie.description.length > 200 && (
                <button className="description-toggle" onClick={toggleDescription}>
                  {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
                </button>
              )}
            </div>
            
            <div className="movie-details-section">
              <div className="detail-item">
                <span className="detail-label"><FaCalendarAlt /> Phát hành:</span>
                <span className="detail-value">{movie.releaseDate || 'Không có thông tin'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FaInfoCircle /> Đạo diễn:</span>
                <span className="detail-value">{movie.director || 'Không có thông tin'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FaInfoCircle /> Diễn viên:</span>
                <span className="detail-value">{movie.actors || 'Không có thông tin'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FaLanguage /> Ngôn ngữ:</span>
                <span className="detail-value">{movie.language || 'Không có thông tin'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label"><FaClosedCaptioning /> Phụ đề:</span>
                <span className="detail-value">
                  {movie.subtitles && movie.subtitles.length > 0 
                    ? movie.subtitles.join(', ') 
                    : 'Không có thông tin'}
                </span>
              </div>
            </div>
          </div>
        );
      case 'cast':
        return (
          <div className="tab-content cast-tab">
            <p className="no-content-message">Thông tin diễn viên sẽ được cập nhật sớm.</p>
          </div>
        );
      case 'reviews':
        return (
          <div className="tab-content reviews-tab">
            <p className="no-content-message">Chưa có đánh giá nào cho phim này.</p>
            <button className="write-review-button">Viết đánh giá</button>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="movie-info">
      <div className="movie-info-header">
        <div className="movie-meta">
          <div className="movie-rating">
            <FaStar className="star-icon" />
            <span className="rating-value">{movie.rating}</span>
            <span className="rating-max">/10</span>
          </div>
          
          <div className="movie-genres">
            {movie.genres && movie.genres.map((genre, index) => (
              <span key={index} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
        </div>
        
        <div className="movie-actions">
          <button 
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={toggleFavorite}
            title={isFavorite ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
          >
            {isFavorite ? <FaHeart /> : <FaRegHeart />}
          </button>
          
          <button 
            className="share-button"
            onClick={handleShare}
            title="Chia sẻ phim này"
          >
            <FaShareAlt />
          </button>
        </div>
      </div>
      
      <div className="movie-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Tổng quan
          </button>
          <button 
            className={`tab-button ${activeTab === 'cast' ? 'active' : ''}`}
            onClick={() => setActiveTab('cast')}
          >
            Diễn viên
          </button>
          <button 
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Đánh giá
          </button>
        </div>
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MovieInfo; 