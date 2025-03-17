import React, { useState, useEffect } from 'react'
import images from '../../assets/img'
import { FaPlay } from 'react-icons/fa';
import movieService from '../../services/movieService';

function MoiveUpdate() {
    const [moviesUpdate, setMoviesUpdate] = useState([]);
    useEffect(() => {
        const fetchMovieUpdate = async () => {
            try{
                const data = await movieService.getNewMovies();
                if(data && data.length > 0){
                    setMoviesUpdate(data);
                }else{
                    setMoviesUpdate(fallbackMoviesUpdate);
                }
            }catch(err){
                console.error('Lỗi khi lấy phim mới cập nhật:', err);
                setMoviesUpdate(fallbackMoviesUpdate);
            }
        }
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
    )
}

export default MoiveUpdate