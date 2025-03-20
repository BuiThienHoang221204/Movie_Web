import React, { useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom'
import movieService from '../../services/movieService';
import { useMovies } from './MovieContext';

const MovieCard = (props) => {
    const movie = props.movie;
    const navigate = useNavigate();
    const { genres, setGenres } = useMovies()

    const handleWatchMovie = (movieId, e) => {
        e.preventDefault();
        navigate(`/watch/${movieId}`);
    };
    const genreName = (genreId) => {
        const genre = genres.find(g => g.id === genreId)
        return genre ? genre.name : ''
    }

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await movieService.getGenres();
                console.log("Dữ liệu thể loại từ API:", data);
                if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
                    setGenres(data);
                } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
                }
            } catch (err) {
                console.error('Lỗi khi lấy thể loại (frontend):', err);
                // Khi có lỗi, sử dụng dữ liệu mẫu
            }
        }

        fetchGenres();
    }, []);

  return (
    <>
        <Link to={`/watch/${movie.id}`} key={movie.id} className='movie-item' onClick={() => handleWatchMovie(movie.id)}>
            <img src={movie.image} alt={movie.title} className='movie-image' />
            <FaPlay className="play-icon-2" />
            <div className='movie-info'>
                <h3 className='recomment-movie-title'>{movie.title}</h3>
                <p className='movie-genre'>Thể loại: {""}
                    {movie.genre
                        .map((id) => genreName(id))
                        .filter((gName) => gName !== "Không xác định")
                        .join(", ")
                    }
                </p>
                <p className='movie-match'>Phù hợp: {movie.match}%</p>
                <p className='movie-rating'>Điểm: {movie.rating.toFixed(1)}/10</p>
            </div>
        </Link>
    </>
  )
}

export default MovieCard;