import React, { useEffect } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';
import config from '../../config';
import Banner from '../../pages/component/Banner';
import { useSelector } from 'react-redux';

function Header() {
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    if (accessToken) {
      console.log(accessToken);
    }
  }, [accessToken]);
  return (
    <>
      <header className="header">
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
