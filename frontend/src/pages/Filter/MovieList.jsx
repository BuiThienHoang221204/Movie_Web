import React from 'react'
import MovieCard from '../components/MovieCard';

const MovieList = (props) => {
    const {filteredMovies, currentPage, setCurrentPage} = props;
    const moviesPerPage = 12; //số phim hiển thị trên mỗi trang

    //tính toán phim hiển thị trên mỗi trang
    const indexOfLastMovie = currentPage * moviesPerPage; //phim cuối cùng trên trang hiện tại
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage; //phim đầu tiên trên trang hiện tại
    const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie); //phim hiển thị trên trang hiện tại

    //tính tổng số trang
    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);
  return (
    <div>
      <div className='container-fluid'>
        <div className='list-movie'>
          {currentMovies.length === 0 ? <h3 className='text-white text-center'>No results</h3> : currentMovies.map((movie) => (
            <MovieCard movie={movie} />
          ))}
        </div>
      </div>
      {/* phân trang */}
      <div className="pagination px-3">
          {[...Array(totalPages)].map((_, index) => {
              return (
                <button key={index} className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(index + 1)}>
                    {index + 1}
                </button>
              )
          })}
      </div>
    </div>

    
  )
}

export default MovieList;