import React, {useEffect, useState} from 'react'
import images from '../../assets/img';
import './Filter.css';
import MovieList from '../components/MovieList';
import movieService from '../../services/movieService';
import genreService from '../../services/genreService';

const Filter = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);

    const [filteredMovies, setFilteredMovies] = useState(movies);
    const [activeGenre, setActiveGenre] = useState('All');
    const [activeYear, setActiveYear] = useState('All');
    const [activeMatch, setActiveMatch] = useState('All');

    useEffect(() => {
        const fetchRecommentMovies = async () => {
          try {
            const data = await movieService.getAllMovies();
            console.log("Dữ liệu phim từ API:", data);
            if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
                //Loại bỏ dữ liệu có id trùng
                let uniqueMovies = [];
                data.forEach(movie => {
                    if (!uniqueMovies.some(item => item.id === movie.id)) {
                        uniqueMovies.push(movie);
                    }
                });
                setMovies(uniqueMovies);
                setFilteredMovies(uniqueMovies);

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

    useEffect(() => {
        const fetchGenres = async () => {
          try {
            const data = await genreService.getAllGenres();
            console.log("Dữ liệu thể loại từ API:", data);
            if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
              setGenres(data);
            } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
            }
          } catch (err) {
            console.error('Lỗi khi lấy thể loại (frontend):', err);
            // Khi có lỗi, sử dụng dữ liệu mẫu
          }
        }
    
        fetchGenres();
    }
    , []);

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
    };

    const filterByYear = (year) => {
        let result = movies;
        setActiveYear(year);
        if (activeGenre !== 'All') {
            result = result.filter(movie => movie.genre.split(', ').includes(activeGenre));
        }
        if (year !== 'All') {
            result = result.filter(movie => movie.year === year);
        }
        if (activeMatch !== 'All') {
            result = result.filter(movie => movie.ageRating === activeMatch);
        }
        setFilteredMovies(result);
    }

    const filterByMatch = (match) => {
        let result = movies;
        setActiveMatch(match);
        if (activeGenre !== 'All') {
            result = result.filter(movie => movie.genre.split(', ').includes(activeGenre));
        }
        if (activeYear !== 'All') {
            result = result.filter(movie => movie.year === activeYear);
        }
        if (match !== 'All') {
            result = result.filter(movie => movie.match === match);
        }
        setFilteredMovies(result);
    }

  return (
    <div className='container'>
        <h2 className='text-white'>Filter</h2>
        <div className='filter-props h-50 bg-dark border rounded-3 p-3 m-3 ms-0 me-0 text-white'>
            <div className='mb-3 genre-filter'>
                <h4 className='m-3 ms-0 title bg-dark'>Genres</h4>
                <span  className={`m-3 ms-0 ${activeGenre === 'All' ? 'active' : ''}`} onClick={() => filterByGenre('All')}>All</span>
                {genres.map((genre) => (
                        <span key={genre.id} className={`m-3 ${activeGenre === genre.id ? 'active' : ''}`} onClick={() => filterByGenre(genre.id)}>{genre.name}</span>
                    ))}
            </div>
            <div className='mb-3 year-filter'>
                <h4 className='m-3 ms-0 title bg-dark'>Year</h4>
                <span  className={`m-3 ms-0 ${activeYear === 'All' ? 'active' : ''}`} onClick={() => filterByYear('All')}>All</span>
                {
                [...new Set(movies.map((movie) => movie.year))].map((year) => (
                    year &&
                    <span key={year} className={`m-3 ${activeYear === year ? 'active' : ''}`} onClick={() => {filterByYear(year)}}>{year}</span>
                ))}
            </div>
            <div className='mb-1 match-filter'>
                <h4 className='m-3 ms-0 title bg-dark'>Match</h4>
                <span  className={`m-3 ms-0 ${activeMatch === 'All' ? 'active' : ''}`} onClick={() => filterByMatch('All')}>All</span>
                {[...new Set(movies.map((movie) => movie.match))].sort((a, b) => b - a).map((match) => (
                    <span key={match} className={`m-3 ${activeMatch === match ? 'active' : ''}`} onClick={() => {filterByMatch(match)}}>{match}</span>
                ))}
            </div>
        </div>
        <MovieList filteredMovies={filteredMovies}></MovieList>
    </div>
  )
}

export default Filter;