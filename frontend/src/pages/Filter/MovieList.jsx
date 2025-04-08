import React from 'react'
import MovieCard from '../components/MovieCard';

const MovieList = (props) => {
    const { filteredMovies, currentPage, setCurrentPage, scrollToMovieList } = props;
    const moviesPerPage = 10; //số phim hiển thị trên mỗi trang

    //tính toán phim hiển thị trên mỗi trang
    const indexOfLastMovie = currentPage * moviesPerPage; //phim cuối cùng trên trang hiện tại
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage; //phim đầu tiên trên trang hiện tại
    const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie); //phim hiển thị trên trang hiện tại

    //tính tổng số trang
    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

    // Hàm render nút phân trang
    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 3; // Số trang tối đa hiển thị  

        // Nếu tổng số trang ít hơn hoặc bằng maxVisiblePages, hiển thị tất cả
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button 
                        key={i} 
                        className={`page-btn ${currentPage === i ? 'active' : ''}`}
                        onClick={() => {setCurrentPage(i);scrollToMovieList()}}
                    >
                        {i}
                    </button>
                );
            }
            return pages;
        }

        // Thêm trang đầu tiên
        pages.push(
            <button 
                key={1} 
                className={`page-btn ${currentPage === 1 ? 'active' : ''}`}
                onClick={() => {setCurrentPage(1);scrollToMovieList()}}
            >
                1
            </button>
        );

        // Thêm dấu ... sau trang đầu nếu cần
        if (currentPage > 3) {
            pages.push(
                <button 
                    key="start-ellipsis" 
                    className="page-btn ellipsis"
                    disabled
                >
                    •••
                </button>
            );
        }

        // Thêm trang trước trang hiện tại
        if (currentPage > 2) {
            pages.push(
                <button 
                    key={currentPage - 1} 
                    className="page-btn"
                    onClick={() => {setCurrentPage(currentPage - 1);scrollToMovieList()}}
                >
                    {currentPage - 1}
                </button>
            );
        }

        // Thêm trang hiện tại nếu không phải trang đầu hoặc cuối
        if (currentPage !== 1 && currentPage !== totalPages) {
            pages.push(
                <button 
                    key={currentPage} 
                    className="page-btn active"
                    onClick={() => {setCurrentPage(currentPage);scrollToMovieList()}}
                >
                    {currentPage}
                </button>
            );
        }

        // Thêm trang sau trang hiện tại
        if (currentPage < totalPages - 1) {
            pages.push(
                <button 
                    key={currentPage + 1} 
                    className="page-btn"
                    onClick={() => {setCurrentPage(currentPage + 1);scrollToMovieList()}}
                >
                    {currentPage + 1}
                </button>
            );
        }

        // Thêm dấu ... trước trang cuối nếu cần
        if (currentPage < totalPages - 2) {
            pages.push(
                <button 
                    key="end-ellipsis" 
                    className="page-btn ellipsis"
                    disabled
                >
                    •••
                </button>
            );
        }

        // Thêm trang cuối cùng
        pages.push(
            <button 
                key={totalPages} 
                className={`page-btn ${currentPage === totalPages ? 'active' : ''}`}
                onClick={() => {setCurrentPage(totalPages);scrollToMovieList()}}
            >
                {totalPages}
            </button>
        );

        return pages;
    };

    return (
        <div>
            <div className='container'>
                <div className='list-movie'>
                    {currentMovies.length === 0 ? <h3 className='text-white text-center'>No results</h3> : currentMovies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
            {/* phân trang */}
            <div className="pagination px-3">
                {renderPagination()}
            </div>
        </div>
    )
}

export default MovieList;