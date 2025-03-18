import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import Banner from '../../pages/component/Banner';
import { useSelector } from 'react-redux';
import images from '../../assets/img';
import { FaSearch } from 'react-icons/fa'

function Header() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [search, setSearch] = useState('');
  const [movieList, setMovieList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      console.log(accessToken);
    }
  }, [accessToken]);

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
  useEffect(() => {
    if(!search) {
      setMovieList([]);
      return;
    }
    const filteredMovies = movies.filter(movie => 
      movie.title.toLowerCase().trim().includes(search.trim().toLowerCase())
    );
    setMovieList(filteredMovies);
  }, [search]);

  const handleMovieClick = (movieId) => {
    navigate(`/watch/${movieId}`);
    setSearch('');
  };

  return (
    <>
      <header className="header">
        <Link className="logo" to={config.home}>CINEMA</Link>
        <nav className="nav-links">
          <Link to={config.filter}>Schedule</Link>
          <Link to={config.home}>Trend</Link>
          <Link to={config.home}>Blog</Link>
        </nav>
        <div className="search-signin">
          <div className='search-bar'>
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search" className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className={'movie-list ' + (search ? '' : 'd-none')}>
            {movieList.length > 0 ? (
                movieList.map(movie => (
                  <div key={movie.id} className='movie' onClick={() => handleMovieClick(movie.id)}> 
                    <img src={movie.image} alt={movie.title} className='movie-img' />
                    <div className='movie-info'>
                      <h5>{movie.title}</h5>
                      <p><span>{movie.year}</span></p>
                    </div>
                  </div>
                ))
              ) : (
                search && <center>No results</center>
              )}
          </div>
          <Link className="signin-btn" to={config.login}>Sign In</Link>
        </div>
      </header>
      <Banner />
    </>
  );
}

export default Header;
