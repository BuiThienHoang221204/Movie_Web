import React, {useEffect, useState} from 'react'
import images from '../../assets/img';
import './Filter.css';
import MovieList from './MovieList';
import movieService from '../../services/movieService';
import { useMovies } from '../components/MovieContext';

const Filter = () => {
    const [movies, setMovies] = useState([]);
    const { genres } = useMovies();
    const [currentPage, setCurrentPage] = useState(1);

    const [filteredMovies, setFilteredMovies] = useState(movies);
    const [activeGenre, setActiveGenre] = useState('All');
    const [activeYear, setActiveYear] = useState('All');
    const [activeMatch, setActiveMatch] = useState('All');

    useEffect(() => {
        const fetchRecommentMovies = async () => {
          try {
            const data = await movieService.getAllMovies();
            console.log("Dữ liệu phim từ API:", data);
            if (data && data.length > 0) {
                setMovies(data);
                setFilteredMovies(data);

            //   setMovies(data);
            //   setFilteredMovies(data);
            } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
              setMovies(fallbackMovies);
              setFilteredMovies(fallbackMovies);
            }
          } catch (err) {
            console.error('Lỗi khi lấy phim đề xuất (frontend):', err);
            // Khi có lỗi, sử dụng dữ liệu mẫu
            setMovies(fallbackMovies);
            setFilteredMovies(fallbackMovies);
          }
        }
    
        fetchRecommentMovies();
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
    }

return (
    <div>
            <div className='filter-header'> 
                    <h1>FILTER</h1>
                    <p>Where you can filter movies based on your preferences</p>
            </div>
            <div className='container filter-props h-50 bg-dark border rounded-3 p-3 text-white'>
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
            <MovieList filteredMovies={filteredMovies} currentPage={currentPage} setCurrentPage={setCurrentPage}></MovieList>
    </div>
)
}

export default Filter;