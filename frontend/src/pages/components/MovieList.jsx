import React from 'react'
import MovieCard from './MovieCard';

const MovieList = (props) => {
    const filteredMovies = props.filteredMovies;
  return (
    <div className='list-movie'>
        {filteredMovies.length === 0 ? <h3 className='d-inline-block text-white'>Loading, please wait...</h3> : filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
        ))}
    </div>
  )
}

export default MovieList;