import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import config from '../../config';
import Banner from '../../pages/component/Banner';
import { useSelector } from 'react-redux';

function Header() {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (accessToken) {
      console.log(accessToken);
    }
  }, [accessToken]);

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
        <div className="logo">CINEMA</div>
        <nav className="nav-links">
          <Link to={config.home}>Schedule</Link>
          <Link to={config.home}>Trend</Link>
          <Link to={config.home}>Blog</Link>
        </nav>
        <div className="search-signin">
          <input type="text" placeholder="Search" className="search-bar" />
          <Link className="signin-btn" to={config.login}>Sign In</Link>
        </div>
      </header>
      <Banner />
    </>
  );
}

export default Header;
