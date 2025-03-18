import React, {useState} from 'react'
import images from '../../assets/img';
import './Filter.css';
import MovieList from '../component/MovieList';

const Filter = () => {
    const movies = [
        {
            id: 1,
            title: "Ape vs Mecha",
            year: "2023",
            duration: "2h 45min",
            genres: "Action, Thriller, Sci-Fi",
            rating: "9.5",
            ageRating: "14+",
            description: "Trong một thế giới mà công nghệ gặp bản năng nguyên thủy, một con vượn phải đối mặt với thách thức lớn nhất của mình: một phiên bản cơ giới hóa của chính mình. Một trận chiến cho tương lai của cả hai loài bắt đầu.",
            image: images.banner
        },
        {
            id: 2,
            title: "Cosmic Journey",
            year: "2023",
            duration: "2h 30min",
            genres: "Sci-Fi, Adventure",
            rating: "9.2",
            ageRating: "12+",
            description: "Một nhóm phi hành gia dũng cảm khám phá một lỗ đen bí ẩn, dẫn họ đến một chiều không gian mới đầy nguy hiểm và kỳ diệu. Liệu họ có thể tìm đường về nhà?",
            image: images.banner2
        },
        {
            id: 3,
            title: "Phantom Shadows",
            year: "2023",
            duration: "2h 15min",
            genres: "Horror, Mystery",
            rating: "8.7",
            ageRating: "18+",
            description: "Khi một gia đình chuyển đến một ngôi nhà cổ bí ẩn, họ bắt đầu trải nghiệm những hiện tượng siêu nhiên đáng sợ. Bí mật đen tối của ngôi nhà dần dần được hé lộ.",
            image: images.banner3
        }
    ];

    const [filteredMovies, setFilteredMovies] = useState(movies);
    const [activeGenre, setActiveGenre] = useState('');
    const [activeYear, setActiveYear] = useState('All');
    const [activeAgeRating, setActiveAgeRating] = useState('All');

    const filterByGenres = (genre) => {
        let result = movies;
        setActiveGenre(genre);
        if (genre !== '') {
            result = result.filter(movie => movie.genres.includes(genre));
        }
        if (activeYear !== 'All') {
            result = result.filter(movie => movie.year === activeYear);
        }
        if (activeAgeRating !== 'All') {
            result = result.filter(movie => movie.ageRating === activeAgeRating);
        }
        setFilteredMovies(result);
    }

    const filterByYear = (year) => {
        let result = movies;
        setActiveYear(year);
        if (activeGenre !== '') {
            result = result.filter(movie => movie.genres.includes(activeGenre));
        }
        if (year !== 'All') {
            result = result.filter(movie => movie.year === year);
        }
        if (activeAgeRating !== 'All') {
            result = result.filter(movie => movie.ageRating === activeAgeRating);
        }
        setFilteredMovies(result);
    }

    const filterByAgeRating = (ageRating) => {
        let result = movies;
        setActiveAgeRating(ageRating);
        if (activeGenre !== '') {
            result = result.filter(movie => movie.genres.includes(activeGenre));
        }
        if (activeYear !== 'All') {
            result = result.filter(movie => movie.year === activeYear);
        }
        if (ageRating !== 'All') {
            result = result.filter(movie => movie.ageRating === ageRating);
        }
        setFilteredMovies(result);
    }

  return (
    <div className='container'>
        <h2>Filter</h2>
        <div className='filter w-100 h-50 bg-dark border rounded-3 p-3 m-3 ms-0 me-0 text-white'>
            <div className='mb-3'>
                Genres
                {[...new Set(
                    movies.flatMap(movie => 
                        movie.genres.split(',').map(genre => genre.trim())
                    )
                )].map((genre) => (
                        <span key={genre} className={`m-3 ${activeGenre === genre ? 'active' : ''}`} onClick={() => filterByGenres(genre)}>{genre}</span>
                    ))}
            </div>
            <div className='mb-3'>
                <span  className={`m-3 ms-0 ${activeYear === 'All' ? 'active' : ''}`} onClick={() => filterByYear('All')}>All</span>
                {
                [...new Set(movies.map((movie) => movie.year))].map((year) => (
                    year &&
                    <span key={year} className={`m-3 ${activeYear === year ? 'active' : ''}`} onClick={() => {filterByYear(year)}}>{year}</span>
                ))}
            </div>
            <div className='mb-1'>
                <span  className={`m-3 ms-0 ${activeAgeRating === 'All' ? 'active' : ''}`} onClick={() => filterByAgeRating('All')}>All</span>
                {[...new Set(movies.map((movie) => movie.ageRating))].map((ageRating) => (
                    <span key={ageRating} className={`m-3 ${activeAgeRating === ageRating ? 'active' : ''}`} onClick={() => {filterByAgeRating(ageRating)}}>{ageRating}</span>
                ))}
            </div>
        </div>
        <MovieList filteredMovies={filteredMovies}></MovieList>
    </div>
  )
}

export default Filter;