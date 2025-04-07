import React, { useState, useEffect } from 'react'
import images from '../../assets/img'
import './RecommentMovie.css'
import { FaPlay, FaArrowRight } from 'react-icons/fa';
import movieService from '../../services/movieService';
import { useNavigate } from 'react-router-dom';
import { useMovies } from './MovieContext';
import config from '../../config';
import MovieCard from './MovieCard';

const RelatedMovies = () => {
  const { RecommentMovies, setRecommentMovies } = useMovies();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);// hiển thị phim đề xuất
  const [autoPlay, setAutoPlay] = useState(true);
  const itemMovie = 4; // Số lượng phim hiển thị trên mỗi slide
  const maxIndex = Math.max(0, RecommentMovies.length - itemMovie);// số lượng phim hiển thị
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

  useEffect(() => {
    if (autoPlay && RecommentMovies.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prev => prev === maxIndex ? 0 : prev + 1);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [maxIndex, autoPlay, RecommentMovies]);

  useEffect(() => {
    const fetchRecommentMovies = async () => {
      try {
        const data = await movieService.getRecommendMovies();
        console.log("Dữ liệu phim từ API:", data);
        if (data && data.length > 0) {
          setRecommentMovies(data);
        } else {
          // Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
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


  // chuyển phim tiếp theo
  const handleNext = () => {
    setCurrentIndex(prev => prev === maxIndex ? 0 : prev + 1);
  }
  // chuyển phim trước
  const handlePrev = () => {
    setCurrentIndex((prev) => prev === 0 ? maxIndex : prev - 1);
  }

  const play = () => setAutoPlay(true);
  const pause = () => setAutoPlay(false);

  const handleViewAll = () => {
    navigate(config.allRecomment);
  };

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
        <button className='view-all-btn' onClick={handleViewAll}>
          Xem chi tiết <FaArrowRight className='arrow-icon' />
        </button>
      </div>

      <div className='section-movie' onMouseEnter={pause} onMouseLeave={play}>
        <div className='movie-track'
          style={{
            transform: window.innerWidth <= 768
              ? `translateX(-${currentIndex * 105/2}%)`
              : `translateX(-${currentIndex * (102 / itemMovie)}%)`,
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          {RecommentMovies.map(movie => (
            <MovieCard movie={movie} key={movie.id}></MovieCard>
          ))}
        </div>
        <button className="prev" onClick={handlePrev}>
          &#10094;
        </button>
        <button className="next" onClick={handleNext}>
          &#10095;
        </button>
      </div>
    </div>
  )
};

export default RelatedMovies; 