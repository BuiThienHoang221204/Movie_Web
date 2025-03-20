import React, { useState, useEffect } from 'react'
import images from '../../assets/img'
import movieService from '../../services/movieService';
import MovieCard from './MovieCard';

function MovieUpdate() {
    const [moviesUpdate, setMoviesUpdate] = useState([]);
    // lấy tất cả thể loại phim

    const fetchMovieUpdate = async () => {
        try {
            const data = await movieService.getNewMovies();
            if (data && data.length > 0) {
                setMoviesUpdate(data);
            } else {
                setMoviesUpdate(fallbackMoviesUpdate);
            }
        } catch (err) {
            console.error('Lỗi khi lấy phim mới cập nhật:', err);
            setMoviesUpdate(fallbackMoviesUpdate);
        }
    }

    useEffect(() => {
        fetchMovieUpdate();
    }, []);

    // Dữ liệu phim mới cập nhật
    const fallbackMoviesUpdate = [
        {
            id: 1,
            title: "Dune: Part Two",
            year: "2024",
            genre: "Khoa học viễn tưởng, Phiêu lưu",
            rating: 4.8,
            match: 97,
            image: images.banner3
        },
        {
            id: 2,
            title: "Oppenheimer",
            year: "2023",
            genre: "Tiểu sử, Chính kịch",
            rating: 4.9,
            match: 98,
            image: images.ImgMovie
        },
    ];

    return (
        <div className='all-movies-section container'>
            <h1 className='section-title'>Phim mới cập nhật</h1>
            <div className='all-movies-grid my-5'>
                {moviesUpdate.map(movie => (
                    <MovieCard movie={movie}></MovieCard>
                ))}
            </div>
        </div>
    )
}

export default MovieUpdate