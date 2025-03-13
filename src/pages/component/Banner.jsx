import React, { useState, useEffect } from 'react';
import './Banner.css';
import images from '../../assets/img';
import { FaPlay, FaPlus, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Banner() {
    // Dữ liệu slideshow
    const movies = [
        {
            id: 1,
            title: "Ape vs Mecha",
            year: "2023",
            duration: "2h 45min",
            genres: "Action, Thriller, Sci-Fi",
            rating: "9.5",
            ageRating: "14+",
            description: "Trong một thế giới mà công nghệ gặp bản năng nguyên thủy, một con vượn phải đối mặt với thách thức lớn nhất của mình: một phiên bản cơ giới hóa của chính mình. Một trận chiến cho tương lai của cả hai loài bắt đầu.",
            image: images.banner
        },
        {
            id: 2,
            title: "Cosmic Journey",
            year: "2023",
            duration: "2h 30min",
            genres: "Sci-Fi, Adventure",
            rating: "9.2",
            ageRating: "12+",
            description: "Một nhóm phi hành gia dũng cảm khám phá một lỗ đen bí ẩn, dẫn họ đến một chiều không gian mới đầy nguy hiểm và kỳ diệu. Liệu họ có thể tìm đường về nhà?",
            image: images.banner2
        },
        {
            id: 3,
            title: "Phantom Shadows",
            year: "2023",
            duration: "2h 15min",
            genres: "Horror, Mystery",
            rating: "8.7",
            ageRating: "18+",
            description: "Khi một gia đình chuyển đến một ngôi nhà cổ bí ẩn, họ bắt đầu trải nghiệm những hiện tượng siêu nhiên đáng sợ. Bí mật đen tối của ngôi nhà dần dần được hé lộ.",
            image: images.banner3
        }
    ];

    const [currentMovie, setCurrentMovie] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);

    // Tự động chuyển slide
    useEffect(() => {
        const interval = setInterval(() => {
            if (autoPlay) {
                setCurrentMovie(prev => (prev + 1) % movies.length);
            }
        }, 5000); // Chuyển slide sau mỗi 5 giây
        
        return () => clearInterval(interval); // Dọn dẹp timer sau khi component unmount
    }, [autoPlay, movies.length, currentMovie]);

    const nextSlide = () => {
        setCurrentMovie(prev => (prev + 1) % movies.length); // Đến slide cuối cùng thì quay lại đầu
    };
    
    const prevSlide = () => {
        setCurrentMovie(prev => (prev - 1 + movies.length) % movies.length); // Đến slide đầu thì quay lại cuối
    };
    
    // Tạm dừng khi chạm vào slide
    const pause = () => setAutoPlay(false);
    const play = () => setAutoPlay(true);
    
    // Lấy phim hiện tại
    const movie = movies[currentMovie];

    return (
        <div className='banner'
            onMouseEnter={pause}
            onMouseLeave={play}>
            <div className="banner-content">
                <div className="rating-container">
                    <div className="rating">
                        <FaStar className="star-icon" />
                        <span>{movie.rating}/10</span>
                    </div>
                    <span className="age-rating">{movie.ageRating}</span>
                </div>
                <h1>{movie.title}</h1>
                <p className="movie-info">{movie.year} | {movie.duration} | {movie.genres}</p>
                <p className="movie-description">{movie.description}</p>
                <div className="buttons">
                    <button className="btn btn-danger">
                        <FaPlay className="btn-icon" /> Watch Now
                    </button>
                    <button className="btn btn-secondary">
                        <FaPlus className="btn-icon" /> Add to My List
                    </button>
                </div>
            </div>
            <img src={movie.image} alt={movie.title} className="banner-image" />
            
            {/* Nút điều hướng */}
            <button className="slide-arrow slide-arrow-left" onClick={prevSlide}>
                <FaChevronLeft />
            </button>
            <button className="slide-arrow slide-arrow-right" onClick={nextSlide}>
                <FaChevronRight />
            </button>
            
            {/* Chỉ báo slide */}
            <div className="slide-indicators">
                {movies.map((_, index) => (
                    <button 
                        key={index} 
                        className={`slide-indicator ${index === currentMovie ? 'active' : ''}`}
                        onClick={() => setCurrentMovie(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Banner;
