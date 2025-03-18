import React from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaPlay } from 'react-icons/fa'

const MovieCard = (props) => {
    const movie = props.movie;
  return (
    <>
        <Link to={`/watch/${movie.id}`} key={movie.id} className='movie-card border-0 text-decoration-none'>
            <span className='movie-rating'>
                <FaStar className="star-icon" />
                {movie.rating.toFixed(1)}/10</span>
            <span className='movie-image'>
                <img src={movie.image} alt="" />            
                <FaPlay className="play-icon-2" />
            </span>
            <span className='movie-year'>{movie.year}</span>
            <span className='movie-title'>
                {movie.title}
            </span>
        </Link>
    </>
  )
}

export default MovieCard;