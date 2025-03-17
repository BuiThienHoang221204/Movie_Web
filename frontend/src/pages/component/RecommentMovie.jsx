import React, { useState, useEffect } from 'react'
import images from '../../assets/img'
import './RecommentMovie.css'
import { FaPlay, FaArrowRight } from 'react-icons/fa';
import movieService from '../../services/movieService';
function RecommentMovie() {
  const [RecommentMovies, setRecommentMovies] = useState([]);

  useEffect(() => {
    const fetchRecommentMovies = async () => {
      try {
        const data = await movieService.getRecommendMovies();
        console.log("Dữ liệu phim từ API:", data);
        if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
          setRecommentMovies(data);
        } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
          setRecommentMovies(fallbackMovies);
        }
      } catch (err) {
        console.error('Lỗi khi lấy phim đề xuất (frontend):', err);
        // Khi có lỗi, sử dụng dữ liệu mẫu
        setRecommentMovies(fallbackMovies);
      }
    }

    fetchRecommentMovies();
  }, []);

  // Dữ liệu mẫu để sử dụng khi API không có dữ liệu
  const fallbackMovies = [
    {
      id: 1, title: "Avengers: Endgame", year: "2019",
      genre: "Hành động, Khoa học viễn tưởng", rating: 4.9, match: 98,
      image: images.ImgMovie
    },
    {
      id: 2, title: "Joker", year: "2019",
      genre: "Tâm lý, Tội phạm", rating: 4.7, match: 95,
      image: images.banner2
    },

  ];

  // hiển thị phim đề xuất
  const [currentIndex, setCurrentIndex] = useState(0);
  // hiển thị tất cả phim
  const [showAllMovies, setShowAllMovies] = useState(false);
  const itemMovie = 4;
  const [autoPlay, setAutoPlay] = useState(true);
  // số lượng phim hiển thị
  const maxIndex = Math.max(0, RecommentMovies.length - itemMovie);

  // chuyển phim tiếp theo
  const handleNext = () => {
    setCurrentIndex(prev => prev === maxIndex ? 0 : prev + 1);
  }
  // chuyển phim trước
  const handlePrev = () => {
    setCurrentIndex((prev) => prev === 0 ? maxIndex : prev - 1);
  }
  // hiển thị tất cả phim
  const toggleShowAllMovies = () => {
    setShowAllMovies(!showAllMovies);
  }

  useEffect(() => {
    if (!showAllMovies && autoPlay && RecommentMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => prev === maxIndex ? 0 : prev + 1);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [maxIndex, autoPlay, showAllMovies, RecommentMovies]);

  const play = () => setAutoPlay(true);
  const pause = () => setAutoPlay(false);

  // Nếu không có dữ liệu và đang tải, hiển thị "Đang tải..."
  if (RecommentMovies.length === 0) {
    return (
      <div className='container'>
        <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Đang tải dữ liệu phim...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container'>
      <div className='title-container'>
        <h1 className='section-title'>Phim đề xuất</h1>
        <button className='view-all-btn' onClick={toggleShowAllMovies}>
          {showAllMovies ? 'Thu gọn' : 'Xem tất cả'}
          <FaArrowRight className='arrow-icon' />
        </button>
      </div>

      {!showAllMovies ? (
        <div className='section-movie' onMouseEnter={pause} onMouseLeave={play}>
          <div className='movie-track'
            style={{
              transform: `translateX(-${currentIndex * (100 / itemMovie)}%)`,
              transition: 'transform 0.3s ease-in-out'
            }}>
            {RecommentMovies.map(movie => (
              <div key={movie.id} className='movie-item'>
                <img
                  src={movie.image}
                  alt={movie.title}
                  className='movie-image'
                  onError={(e) => { e.target.src = images.ImgMovie; }}
                />
                <FaPlay className="play-icon-2" />
                <div className='movie-info'>
                  <h3 className='movie-title'>{movie.title}</h3>
                  <p className='movie-genre'>Thể loại: {movie.genre}</p>
                  <p className='movie-match'>Phù hợp: {movie.match}%</p>
                  <p className='movie-rating'>Điểm: {movie.rating}/10</p>
                </div>
              </div>
            ))}
          </div>
          <button className="prev" onClick={handlePrev}>
            &#10094;
          </button>
          <button className="next" onClick={handleNext}>
            &#10095;
          </button>
        </div>
      ) : (
        <div className='all-movies-section'>
          <div className='all-movies-grid'>
            {RecommentMovies.map(movie => (
              <div key={movie.id} className='movie-item'>
                <img
                  src={movie.image}
                  alt={movie.title}
                  className='movie-image'
                  onError={(e) => { e.target.src = images.ImgMovie; }}
                />
                <FaPlay className="play-icon-2" />
                <div className='movie-info'>
                  <h3 className='movie-title'>{movie.title}</h3>
                  <p className='movie-genre'>Thể loại: {movie.genre}</p>
                  <p className='movie-match'>Phù hợp: {movie.match}%</p>
                  <p className='movie-rating'>Điểm: {movie.rating}/10</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RecommentMovie
