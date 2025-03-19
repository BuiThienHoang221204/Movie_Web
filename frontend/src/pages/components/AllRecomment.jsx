import { useState } from 'react';
import { useMovies } from '../components/MovieContext';
import { FaPlay } from 'react-icons/fa';
import images from '../../assets/img';
import { useNavigate } from 'react-router-dom';
import './AllRecomment.css';

function AllRecomment() {
    const { RecommentMovies, genres } = useMovies();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 10; //số phim hiển thị trên mỗi trang

    //tính toán phim hiển thị trên mỗi trang
    const indexOfLastMovie = currentPage * moviesPerPage; //phim cuối cùng trên trang hiện tại
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage; //phim đầu tiên trên trang hiện tại
    const currentMovies = RecommentMovies.slice(indexOfFirstMovie, indexOfLastMovie); //phim hiển thị trên trang hiện tại

    //tính tổng số trang
    const totalPages = Math.ceil(RecommentMovies.length / moviesPerPage);

    const genreName = (genreId) => {
        const genre = genres.find(g => g.id === genreId);
        return genre ? genre.name : 'Không xác định';
    };

    const handleWatchMovie = (movieId) => {
        navigate(`/watch/${movieId}`);
    };

    return (
        <>
            <div className="trend-header">
                <div className="trend-header-content">
                    <h1>Phim đề xuất</h1>
                    <p>Khám phá những bộ phim được yêu thích nhất hiện nay</p>
                </div>
            </div>
            <div className='all-movies-section container'>
                <h1 className='section-title my-5'>Tất cả phim đề xuất</h1>
                <div className='all-movies-grid'>
                    {currentMovies.map(movie => (
                        <div key={movie.id} className='movie-item' onClick={() => handleWatchMovie(movie.id)}>
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className='movie-image'
                                onError={(e) => { e.target.src = images.ImgMovie; }}
                            />
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
                                <p className='movie-rating'>Điểm: {movie.rating}/10</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* phân trang */}
            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => {
                    return (
                        <button key={index} className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index + 1)}>
                            {index + 1}
                        </button>
                    )
                })}
            </div>
        </>
    )
}

export default AllRecomment