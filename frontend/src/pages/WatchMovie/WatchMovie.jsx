import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../component/VideoPlayer';
import MovieInfo from '../component/MovieInfo';
import RelatedMovies from '../component/RelatedMovies';
import './WatchMovie.css';

const WatchMovie = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy thông tin phim dựa trên ID
    // Đây là dữ liệu mẫu
    setTimeout(() => {
      const mockMovie = {
        id: id || '1',
        title: 'O.LEW - MỘT NGƯỜI ĐÁNH MẤT MỘT NGƯỜI',
        description: 'O.LEW - MỘT NGƯỜI ĐÁNH MẤT MỘT NGƯỜI | PIANO COVER | NGUYENN. Đây là bản piano cover của bài hát nổi tiếng, được trình bày bởi nghệ sĩ NGUYENN.',
        year: 2023,
        poster: 'https://i.ytimg.com/vi/wkckCahPeJ0/hqdefault.jpg',
        rating: 9.2,
        duration: '3m 42s',
        genres: ['Âm nhạc', 'Piano Cover'],
        director: 'NGUYENN',
        cast: ['O.LEW', 'NGUYENN'],
        language: 'Tiếng Việt',
        subtitles: ['Tiếng Việt', 'Tiếng Anh'],
        releaseDate: '2023-01-15'
      };

      // Đặt URL video YouTube
      // Trong thực tế, URL này sẽ được lấy từ API
      setVideoUrl('https://www.youtube.com/embed/wkckCahPeJ0?list=RDHqs_MhnbOqc');
      
      setMovie(mockMovie);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Hàm thay đổi URL video
  const changeVideo = (newUrl) => {
    setVideoUrl(newUrl);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải phim...</p>
      </div>
    );
  }

  return (
    <div className="watch-movie-container">
      <div className="video-section">
        <div className="video-wrapper">
          <iframe 
            width="100%" 
            height="100%" 
            src={videoUrl}
            title={movie.title}
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="movie-content">
        <div className="movie-info-section">
          <MovieInfo movie={movie} />
        </div>
        
        <div className="related-movies-section">
          <h2>Phim liên quan</h2>
          <RelatedMovies currentMovieId={movie.id} />
        </div>

        <div className="video-samples">
          <h2>Video khác</h2>
          <div className="video-samples-grid">
            {[
              'https://www.youtube.com/embed/wkckCahPeJ0',
              'https://www.youtube.com/embed/Hqs_MhnbOqc',
              'https://www.youtube.com/embed/dQw4w9WgXcQ',
              'https://www.youtube.com/embed/jfKfPfyJRdk'
            ].map((url, index) => (
              <div key={index} className="video-sample-item" onClick={() => changeVideo(url)}>
                <div className="video-thumbnail">
                  <img 
                    src={`https://img.youtube.com/vi/${url.split('/').pop()}/mqdefault.jpg`} 
                    alt={`Video ${index + 1}`} 
                  />
                  <div className="play-overlay">
                    <i className="fa fa-play"></i>
                  </div>
                </div>
                <p>Video {index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchMovie;
