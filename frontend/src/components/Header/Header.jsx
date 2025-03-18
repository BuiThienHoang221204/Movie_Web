import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import { Banner } from '../../pages/components';
import { useSelector } from 'react-redux';
import User from '../User/User';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import images from '../../assets/img';
import movieService from '../../services/movieService';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [search, setSearch] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [searchMovies, setSearchMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        console.log("Dữ liệu phim từ API:", data);
        if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
          setMovieList(data);
        } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
          setMovieList(fallbackMovies);
        }
      } catch (err) {
        console.error('Lỗi khi lấy phim đề xuất (frontend):', err);
        // Khi có lỗi, sử dụng dữ liệu mẫu
        setMovieList(fallbackMovies);
      }
    }

    fetchAllMovies();
  }, []);

  // Thêm effect để theo dõi sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      // Kiểm tra vị trí cuộn, nếu > 50px thì thêm class scrolled
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Thêm event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fallbackMovies = [
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
    },
  ];

  useEffect(() => {
    if(!search) {
      setSearchMovies([]);
      return;
    }
    const filteredMovies = movieList.filter(movie => 
      movie.title.toLowerCase().trim().includes(search.trim().toLowerCase())
    );
    setSearchMovies(filteredMovies);
  }, [search]);

  const handleMovieClick = (movieId) => {
    navigate(`/watch/${movieId}`);
    window.location.reload();
    setSearch('');
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <Link to={config.home} className="logo">CINEMA</Link>
        <nav className="nav-links">
          <Link to={config.home}>Home</Link>
          <Link to={config.home}>Trend</Link>
          <Link to={config.home}>Blog</Link>
        </nav>
        <div className="search-signin">
          <Link to={config.filter} title='Filter'><FaFilter className='filter-icon me-2 border rounded-2 p-2 fs-2 cursor-pointer text-white' /></Link>
          <div className='search-bar'>
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search" className="search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
            
          </div>
          <div className={'movie-list ' + (search ? '' : 'd-none')}>
            {movieList.length > 0 ? (
                searchMovies.map(movie => (
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
          {!user ? (
            <Link className="signin-btn" to={config.login}>Sign In</Link>
          ) : (
            <User />
          )}
        </div>
      </header>
      <Banner />
    </>
  );
}

export default Header;
