import { useState } from 'react';
import { useMovies } from '../components/MovieContext';
import './AllRecomment.css';
import MovieCard from './MovieCard';

function AllRecomment() {
    const { RecommentMovies } = useMovies();
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 10; // số phim hiển thị trên mỗi trang

    // tính toán phim hiển thị trên mỗi trang
    const indexOfLastMovie = currentPage * moviesPerPage; // phim cuối cùng trên trang hiện tại
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage; // phim đầu tiên trên trang hiện tại
    const currentMovies = RecommentMovies.slice(indexOfFirstMovie, indexOfLastMovie); // phim hiển thị trên trang hiện tại

    // tính tổng số trang
    const totalPages = Math.ceil(RecommentMovies.length / moviesPerPage);

    return (
        <>
            <div className="trend-header">
                <div className="trend-header-content">
                    <h1>Recommended Movies</h1>
                    <p>Discover the most popular movies right now</p>
                </div>
            </div>
            <div className='all-movies-section container'>
                <h1 className='section-title my-5'>All Recommended Movies</h1>
                <div className='all-movies-grid'>
                    {currentMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
            {/* phân trang */}
            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => {
                    return (
                        <button
                            key={index}
                            className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    )
                })}
            </div>
        </>
    )
}

export default AllRecomment;
