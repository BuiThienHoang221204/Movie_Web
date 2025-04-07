import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { useMovies } from './MovieContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
const MovieCard = (props) => {
    const movie = props.movie;
    const { genres } = useMovies();
    
    const genreName = (genreId) => {
        const genre = genres.find(g => g.id === genreId)
        return genre ? genre.name : ''
    }

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await movieService.getGenres();
              
                if (data && data.length > 0) { 
                    setGenres(data);
                } else {
                    console.log('loi khi lay du lieu')
                }
            } catch (err) {
                console.error('Lỗi khi lấy thể loại (frontend):', err);
               
            }
        }

        fetchGenres();
    }, []);

  return (
    <>
        <Link to={`watch/${movie.id}`} className='movie-item'>
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