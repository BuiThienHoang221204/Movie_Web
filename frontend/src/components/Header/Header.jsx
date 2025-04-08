import React, { useEffect, useState } from 'react';
import './Header.css';
import images from '../../assets/img';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import config from '../../config';
import { Banner } from '../../pages/components';
import { useSelector } from 'react-redux';
import User from '../User/User';
import { FaSearch, FaFilter, FaList } from 'react-icons/fa';
import movieService from '../../services/movieService';
import { useMovies } from '../../pages/components/MovieContext';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const [search, setSearch] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [searchMovies, setSearchMovies] = useState([]);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { genres } = useMovies();

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        // console.log("Dữ liệu phim từ API:", data);
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


  const fallbackMovies = [
    {
      id: 1,
      title: "Ape vs Mecha",
      year: "2023",
      duration: "2h 45min",
      genres: "Action, Thriller, Sci-Fi",
      rating: "9.5",
      ageRating: "14+",
      description: "In a world where technology clashes with primal instinct, an ape must face its greatest challenge: a mechanized version of itself. A battle for the future of both species begins.",
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
      description: "A brave team of astronauts explores a mysterious black hole, leading them to a new dimension full of dangers and wonders. Will they find their way back home?",
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
      description: "When a family moves into an old, mysterious house, they begin to experience terrifying supernatural phenomena. The dark secret of the house slowly comes to light.",
      image: images.banner3
    },
  ];

  const [genreMapping, setGenreMapping] = useState({
    'hành động': 'action',
    'phiêu lưu': 'adventure',
    'hoạt hình': 'animation',
    'hài': 'comedy',
    'hài hước': 'comedy',
    'tội phạm': 'crime',
    'tài liệu': 'documentary',
    'chính kịch': 'drama',
    'gia đình': 'family',
    'giả tưởng': 'fantasy',
    'lịch sử': 'history',
    'kinh dị': 'horror',
    'nhạc': 'music',
    'âm nhạc': 'music',
    'bí ẩn': 'mystery',
    'lãng mạn': 'romance',
    'tình cảm': 'romance',
    'khoa học viễn tưởng': 'science fiction',
    'viễn tưởng': 'science fiction',
    'khoa học': 'science fiction',
    'tv movie': 'tv movie',
    'kinh điển': 'thriller',
    'chiến tranh': 'war',
    'cao bồi': 'western'
  });

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

  useEffect(() => {
    if (!search) {
      setSearchMovies([]);
      return;
    }

    const searchTerm = search.toLowerCase().trim();

    // Tìm kiếm kết hợp thể loại và năm
    const yearMatch = searchTerm.match(/(\d{4})/);
    const year = yearMatch ? yearMatch[1] : null;
    
    // Tách các từ khóa tìm kiếm
    const searchWords = searchTerm.split(' ').filter(word => word !== year);
    
    // Tìm kiếm theo thể loại
    const genreMatches = Object.entries(genreMapping).filter(([viet, eng]) => {
      return searchWords.some(word => viet.includes(word) || eng.includes(word));
    });

    const filteredMovies = movieList.filter(movie => {
      let matches = true;

      // Kiểm tra năm nếu có
      if (year) {
        matches = matches && movie.year === year;
      }

      // Kiểm tra thể loại nếu có
      if (genreMatches.length > 0) {
        matches = matches && movie.genre.some(genreId => {
          const genre = genres.find(g => g.id === genreId);
          if (!genre) return false;
          
          const genreName = genre.name.toLowerCase();
          return genreMatches.some(([viet, eng]) => 
            genreName.includes(eng) || viet.includes(genreName)
          );
        });
      }

      // Kiểm tra tên phim nếu không có năm và thể loại
      if (!year && genreMatches.length === 0) {
        matches = movie.title.toLowerCase().trim().includes(searchTerm);
      }

      return matches;
    });
    
    setSearchMovies(filteredMovies);
  }, [search, movieList, genres, genreMapping]);

  const handleMovieClick = (movieId, e) => {
    e.preventDefault();
    navigate(`/watch/${movieId}`);
    setSearch('');
  };


  const handleToggleMenu = () => {
    setSearch('');
    setShowMenu(!showMenu);
  }

  window.addEventListener('scroll', () => {
    if (showMenu) {
      setShowMenu(false);
    }
  });

  window.addEventListener('resize', () => {
    if (showMenu) {
      setShowMenu(false);
    }
  });

  //setSearch('') khi click vào các link
  window.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      setSearch('');
    }
  });


  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <Link to={config.home} className="logo text-decoration-none" onClick={() => setShowMenu(false)}>HMOVIE</Link>
        <nav className="nav-links">
          <Link to={config.home} className={location.pathname === config.home ? 'active' : ''}>Home</Link>
          <Link to={config.allRecomment} className={location.pathname === config.allRecomment ? 'active' : ''}>Trend</Link>
          <Link to={config.blog} className={location.pathname === config.blog ? 'active' : ''}>Blog</Link>
        </nav>
        <div className="search-signin">
          <Link to={config.filter} title='Filter'><FaFilter className='filter-icon me-2 border rounded-2 p-2 fs-2 cursor-pointer text-white' onClick={() => { setShowMenu(false); setSearch('') }} /></Link>
          <div className='search-bar'>
            <FaSearch className="search-ic" />
            <input type="text" placeholder="Search" className="search-input" value={search} onFocus={() => setShowMenu(false)} onChange={(e) => setSearch(e.target.value)} />
            <div className={'movie-list ' + (search ? '' : 'd-none')}>
              {movieList.length > 0 ? (
                searchMovies.sort((a, b) => b.year - a.year).map(movie => (
                  <Link to={`/watch/${movie.id}`} key={movie.id} className='s-movie' onClick={(e) => handleMovieClick(movie.id, e)}>
                    <img src={movie.image} alt={movie.title} className='movie-img' />
                    <div className='s-movie-info'>
                      <h5>{movie.title}</h5>
                      <p><span>{movie.year}</span></p>
                    </div>
                  </Link>
                ))
              ) : (
                search && <center>No results</center>
              )}
            </div>
          </div>

          {!user ? (
            <Link className="signin-btn" to={config.login}>Sign In</Link>
          ) : (
            <User />
          )}
        </div>
        <FaList className='toggle-icon' onClick={() => handleToggleMenu()}></FaList>
        <div className={"toggle-menu" + (showMenu ? ' d-block' : '')}>
          <nav className="nav-links">
            <Link to={config.home} className={location.pathname === config.home ? 'active' : ''} onClick={() => setShowMenu(false)}>Home</Link>
            <Link to={config.allRecomment} className={location.pathname === config.allRecomment ? 'active' : ''} onClick={() => setShowMenu(false)}>Trend</Link>
            <Link to={config.blog} className={location.pathname === config.blog ? 'active' : ''} onClick={() => setShowMenu(false)}>Blog</Link>
          </nav>
          {!user ? (
            <Link className="signin-btn" to={config.login}>Sign In</Link>
          ) : (
            <div className='user'>
              <User />
            </div>
          )}
        </div>

      </header>
      {isHomePage && <Banner />}
    </>
  );
}

export default Header;
