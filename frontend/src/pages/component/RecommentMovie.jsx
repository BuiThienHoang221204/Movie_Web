import React, { useState, useEffect } from 'react'
import images from '../../assets/img'
import './RecommentMovie.css'
import { FaPlay, FaArrowRight } from 'react-icons/fa';
function RecommentMovie() {

  const RecommentMovies = [
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
    {
      id: 3, title: "Spider-Man: Far From Home", year: "2019",
      genre: "Hành động, Phiêu lưu", rating: 4.6, match: 94,
      image: images.banner3
    },
    {
      id: 4, title: "Interstellar", year: "2014",
      genre: "Khoa học viễn tưởng, Phiêu lưu", rating: 4.8, match: 96,
      image: images.ImgMovie
    },
    {
      id: 5, title: "The Dark Knight", year: "2008",
      genre: "Hành động, Tội phạm", rating: 4.9, match: 99,
      image: images.banner3
    },
    {
      id: 6, title: "Joker", year: "2019",
      genre: "Tâm lý, Tội phạm", rating: 4.7, match: 95,
      image: images.banner2
    },
    {
      id: 7, title: "Spider-Man: Far From Home", year: "2019",
      genre: "Hành động, Phiêu lưu", rating: 4.6, match: 94,
      image: images.banner3
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllMovies, setShowAllMovies] = useState(false);
  const itemMovie = 4;
  const maxIndex = RecommentMovies.length - itemMovie;

  const handleNext = () => {
    setCurrentIndex(prev => prev === maxIndex ? 0 : prev + 1);
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => prev === 0 ? maxIndex : prev - 1);
  }

  const toggleShowAllMovies = () => {
    setShowAllMovies(!showAllMovies);
  }

  useEffect(() => {
    if (!showAllMovies) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => prev === maxIndex ? 0 : prev + 1);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showAllMovies, maxIndex]);

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
        <div className='section-movie'>
          <div className='movie-track'
            style={{
              transform: `translateX(-${currentIndex * (100 / itemMovie)}%)`,
              transition: 'transform 0.3s ease-in-out'
            }}>
            {RecommentMovies.map(movie => (
              <div key={movie.id} className='movie-item'>
                <img src={movie.image} alt={movie.title} className='movie-image' />
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
                <img src={movie.image} alt={movie.title} className='movie-image' />
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
