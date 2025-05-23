import React, { useState, useEffect } from 'react';
import './Banner.css';
import images from '../../assets/img';
import { FaPlay, FaPlus, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import configs from '../../config';
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
            description: "In a world where technology meets primal instinct, an ape must face its greatest challenge: a mechanized version of itself. A battle for the future of both species begins.",
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
            description: "A group of brave astronauts explores a mysterious black hole, leading them to a new dimension full of danger and wonder. Can they find their way back home?",
            image: images.banner2
        },
        {
            id: 3,
            title: "Avengers",
            year: "2023",
            duration: "2h 15min",
            genres: "Horror, Mystery",
            rating: "8.7",
            ageRating: "18+",
            description: "The most powerful superhero team in the Marvel Cinematic Universe (MCU), assembled by Nick Fury to protect Earth from dangerous threats.",
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
                {/* Phần buttons chứa các nút hành động - căn chỉnh ngang */}
                <div className="buttons">
                    {/* Nút Watch Now - Sử dụng flex và align-items để căn chỉnh icon và text thẳng hàng ngang */}
                    <button className="btn btn-danger">
                        <div className="btn-content">
                            <FaPlay className="btn-icon" />
                            <Link to={configs.home} className="btn-text">Watch Now</Link>
                        </div>
                    </button>
                    {/* Nút Add to My List - Sử dụng flex và align-items để căn chỉnh icon và text thẳng hàng ngang */}
                    <button className="btn btn-secondary">
                        <div className="btn-content">
                            <FaPlus className="btn-icon" />
                            <span className="btn-text">Add to My List</span>
                        </div>
                    </button>
                </div>
            </div>
            
            {/* Di chuyển phần hiển thị poster phim ra ngoài banner-content để định vị độc lập */}
            <div className="movie-poster-container">
                <div className="movie-poster-banner">
                    <div className="play-button-banner">
                        {/* Sử dụng icon từ react-icons thay vì hình ảnh */}
                        <FaPlay className="play-icon-banner" />
                    </div>
                    {/* Sử dụng hình ảnh từ movie hiện tại */}
                    <img 
                        src={movie.image} 
                        alt={`${movie.title} poster`} 
                        className="poster-image"
                    />
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
