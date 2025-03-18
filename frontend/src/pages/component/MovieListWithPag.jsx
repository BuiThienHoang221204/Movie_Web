import React, { useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import 'bootstrap/dist/css/bootstrap.min.css';
import MovieList from './MovieList';

const MovieListWithPag = (props) => {
    const { title, movies } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(6);
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
  return (
    <>
        <div className='container'>
            <div className='d-flex justify-content-between align-items-center'>
                <h2 className='text-danger'>{title}</h2>
                <Pagination className='mb-0'>
                    <Pagination.Prev linkStyle={{fontWeight: 'bolder'}} disabled={currentPage === 1} onClick={() => {
                        if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                        }
                    }} />
                    {Array.from({ length: Math.ceil(movies.length / moviesPerPage) }, (_, i) => i + 1).map((number) => (
                        <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>{number}</Pagination.Item>
                    ))}
                    <Pagination.Next linkStyle={{fontWeight: 'bolder'}} disabled={currentPage === Math.ceil(movies.length / moviesPerPage)} onClick={() => {
                        if (currentPage < Math.ceil(movies.length / moviesPerPage)) {
                            setCurrentPage(currentPage + 1);
                        }
                    }} />
                </Pagination>
            </div>
            <MovieList filteredMovies={currentMovies} />
            <hr />
        </div>
    </>
  )
}

export default MovieListWithPag