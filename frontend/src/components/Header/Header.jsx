import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import config from '../../config';
import { Banner } from '../../pages/components';
import { useSelector } from 'react-redux';
import User from '../User/User';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

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

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <Link to={config.home} className="logo text-decoration-none">CINEMA</Link>
        <nav className="nav-links">
          <Link to={config.home} className={location.pathname === config.home ? 'active': ''}>Home</Link>
          <Link to={config.allRecomment} className={location.pathname === config.allRecomment ? 'active': ''}>Trend</Link>
          <Link to={config.blog} className={location.pathname === config.blog ? 'active': ''}>Blog</Link>
        </nav>
        <div className="search-signin">
          <input type="text" placeholder="Search" className="search-bar" />
          {!user ? (
            <Link className="signin-btn" to={config.login}>Sign In</Link>
          ) : (
            <User />
          )}
        </div>
      </header>
      {isHomePage && <Banner />}
    </>
  );
}

export default Header;
