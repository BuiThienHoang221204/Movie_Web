import React, {useEffect, useState, useRef} from 'react'
import images from '../../assets/img';
import './Filter.css';
import MovieList from './MovieList';
import movieService from '../../services/movieService';
import { useMovies } from '../components/MovieContext';
import { FaUndo } from 'react-icons/fa';

const Filter = () => {
    const [movies, setMovies] = useState([]);
    const { genres } = useMovies();
    const [currentPage, setCurrentPage] = useState(1);
    const filterPropsRef = useRef(null);
    const movieListRef = useRef(null);

    const [filteredMovies, setFilteredMovies] = useState(movies);
    const [activeGenre, setActiveGenre] = useState('All');
    const [activeYear, setActiveYear] = useState('All');
    const [activeMatch, setActiveMatch] = useState('All');

    useEffect(() => {
        const fetchRecommentMovies = async () => {
          try {
            const data = await movieService.getAllMovies();
            if (data && data.length > 0) {
                setMovies(data);
                setFilteredMovies(data);
            } else {
              setMovies(fallbackMovies);
              setFilteredMovies(fallbackMovies);
            }
          } catch (err) {
            console.error('Lỗi khi lấy phim đề xuất (frontend):', err);
            setMovies(fallbackMovies);
            setFilteredMovies(fallbackMovies);
          }
        }
    
        fetchRecommentMovies();
    }, []);

    // Thêm useEffect để focus vào filter-props khi component mount
    useEffect(() => {
        if (filterPropsRef.current) {
            filterPropsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const fallbackMovies = [
        {
            id: 1, title: "Avengers: Endgame", year: "2019",
            genre: "Hành động, Khoa học viễn tưởng", rating: 4.9, match: 98,
            image: images.ImgMovie
        },
        {
            id: 2, title: "Joker", year: "2019",
            genre: "Tâm lý, Tội phạm", rating: 4.7, match: 95,
            image: images.banner2
        },
    ];

    // Hàm scroll đến phần list-movie
    const scrollToMovieList = () => {
        if (movieListRef.current) {
            movieListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    };

    const filterByGenre = (genre) => {
        let result = movies;
        console.log("genre", genre);
        setActiveGenre(genre);
        if (genre !== 'All') {
          result = result.filter((movie) => movie.genre.includes(Number(genre)));
        }
        if (activeYear !== 'All') {
          result = result.filter((movie) => movie.year === activeYear);
        }
        if (activeMatch !== 'All') {
          result = result.filter((movie) => movie.match === Number(activeMatch));
        }
        setFilteredMovies(result);
        setCurrentPage(1);
        scrollToMovieList();
    };

    const filterByYear = (year) => {
        let result = movies;
        setActiveYear(year);
        if (activeGenre !== 'All') {
            result = result.filter(movie => movie.genre.includes(Number(activeGenre)));
        }
        if (year !== 'All') {
            result = result.filter(movie => movie.year === year);
        }
        if (activeMatch !== 'All') {
            result = result.filter(movie => movie.match === Number(activeMatch));
        }
        setFilteredMovies(result);
        setCurrentPage(1);
        scrollToMovieList();
    }

    const filterByMatch = (match) => {
        let result = movies;
        setActiveMatch(match);
        if (activeGenre !== 'All') {
            result = result.filter(movie => movie.genre.includes(Number(activeGenre)));
        }
        if (activeYear !== 'All') {
            result = result.filter(movie => movie.year === activeYear);
        }
        if (match !== 'All') {
            result = result.filter(movie => movie.match === Number(match));
        }
        setFilteredMovies(result);
        setCurrentPage(1);
        scrollToMovieList();
    }

    const resetFilters = () => {
        setActiveGenre('All');
        setActiveYear('All');
        setActiveMatch('All');
        setFilteredMovies(movies);
        setCurrentPage(1);
        scrollToMovieList();
    }

return (
    <div>
            <div className='filter-header'> 
                    <h1 ref={filterPropsRef}>FILTER</h1>
                    <p>Where you can filter movies based on your preferences</p>
            </div>
            <div className='container filter-props h-50 bg-dark border rounded-3 p-3 text-white'>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h4 className='m-0'>Filter Options</h4>
                        <button 
                            className='btn btn-outline-light refresh-btn d-flex'
                            onClick={resetFilters}
                            title="Reset all filters"
                        >
                            <FaUndo></FaUndo> Refresh
                        </button>
                    </div>
                    <div className='mb-3 genre-filter'>
                            <h4 className='m-3 ms-0 title bg-dark'>Genres</h4>
                            <span  className={`m-3 ms-0 ${activeGenre === 'All' ? 'active' : ''}`} onClick={() => filterByGenre('All')}>All</span>
                            {genres.map((genre) => (
                                            <span key={genre.id} className={`m-3 ${Number(activeGenre) === genre.id ? 'active' : ''}`} onClick={() => filterByGenre(genre.id)}>{genre.name}</span>
                                    ))}
                            {
                                    <form action="">
                                            <select name="genre" id="genre" className='genre-form text-danger bg-dark-400' value={activeGenre} onChange={(e) => filterByGenre(e.target.value)}>
                                                    <option value='All' className='text-light' onClick={() => filterByGenre('All')}>All</option>
                                                    {genres.map((genre) => (
                                                            <option key={genre.id} className='text-light' value={genre.id} onClick={() => filterByGenre(genre.id)}>{genre.name}</option>
                                                    ))}
                                            </select>
                                    </form>
                            }
                    </div>
                    <div className='mb-3 year-filter'>
                            <h4 className='m-3 ms-0 title bg-dark'>Year</h4>
                            <span  className={`m-3 ms-0 ${activeYear === 'All' ? 'active' : ''}`} onClick={() => filterByYear('All')}>All</span>
                            {
                            [...new Set(movies.map((movie) => movie.year))].map((year) => (
                                    year &&
                                    <span key={year} className={`m-3 ${activeYear === year ? 'active' : ''}`} onClick={() => {filterByYear(year)}}>{year}</span>
                            ))}

                            {
                                    <form action="">
                                            <select name="year" id="year" className='year-form text-danger bg-dark-400' value={activeYear} onChange={(e) => filterByYear(e.target.value)}>
                                                    <option value='All' className='text-light' onClick={() => filterByYear('All')}>All</option>
                                                    {[...new Set(movies.map((movie) => movie.year))].map((year) => (
                                                            <option key={year} value={year} className='text-light' onClick={() => filterByYear(year)}>{year}</option>
                                                    ))}
                                            </select>
                                    </form>
                            }
                    </div>
                    <div className='mb-1 match-filter'>
                            <h4 className='m-3 ms-0 title bg-dark'>Match</h4>
                            <span  className={`m-3 ms-0 ${activeMatch === 'All' ? 'active' : ''}`} onClick={() => filterByMatch('All')}>All</span>
                            {[...new Set(movies.map((movie) => movie.match))].sort((a, b) => b - a).map((match) => (
                                    <span key={match} className={`m-3 ${Number(activeMatch) === match ? 'active' : ''}`} onClick={() => {filterByMatch(match)}}>{match}%</span>
                            ))}

                            {
                                    <form action="">
                                            <select name="match" id="match" className='match-form text-danger bg-dark-400' value={activeMatch} onChange={(e) => filterByMatch(e.target.value)}>
                                                    <option value='All' className='text-light' onClick={() => filterByMatch('All')}>All</option>
                                                    {[...new Set(movies.map((movie) => movie.match))].sort((a, b) => b - a).map((match) => (
                                                            <option key={match} value={match} className='text-light' onClick={() => filterByMatch(match)}>{match}%</option>
                                                    ))}
                                            </select>
                                    </form>
                            }
                    </div>
            </div>
            <div ref={movieListRef}>
                <MovieList scrollToMovieList={scrollToMovieList} filteredMovies={filteredMovies} currentPage={currentPage} setCurrentPage={setCurrentPage}></MovieList>
            </div>
    </div>
)
}

export default Filter;