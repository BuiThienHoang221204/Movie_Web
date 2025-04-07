import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import {
  FaFacebookF, FaTwitter, FaInstagram, FaYoutube,
  FaTiktok, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPlay
} from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section about">
          <div className="footer-logo">
            <span className="logo-text">CINEMA</span>
            <FaPlay className="logo-icon" />
          </div>
          <p className="footer-description">
            Discover the world of cinema with the latest and greatest movies. Enjoy an amazing movie-watching experience with high quality and diverse genres.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+84 123 456 789</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>contact@cinema.com</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>123 Cinema Street, District 1, Ho Chi Minh City</span>
            </div>
          </div>
        </div>

        <div className="footer-section categories">
          <h3 className="footer-heading">Genres</h3>
          <ul className="footer-links">
            <li><Link to="/">Action</Link></li>
            <li><Link to="/">Romance</Link></li>
            <li><Link to="/">Horror</Link></li>
            <li><Link to="/">Sci-Fi</Link></li>
            <li><Link to="/">Animation</Link></li>
            <li><Link to="/">Adventure</Link></li>
            <li><Link to="/">Family</Link></li>
          </ul>
        </div>

        <div className="footer-section quick-links">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/">New Releases</Link></li>
            <li><Link to="/">Trending Movies</Link></li>
            <li><Link to="/">Showtimes</Link></li>
            <li><Link to="/">News</Link></li>
            <li><Link to="/">Contact</Link></li>
            <li><Link to="/">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-section newsletter">
          <h3 className="footer-heading">Subscribe to Our Newsletter</h3>
          <p>Get updates on new movies and special offers</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button className="subscribe-btn">Subscribe</button>
          </div>
          <div className="social-media">
            <a href="#" className="social-icon"><FaFacebookF /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaYoutube /></a>
            <a href="#" className="social-icon"><FaTiktok /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="copyright">
          &copy; {currentYear} CINEMA. All rights reserved.
        </div>
        <div className="footer-bottom-links">
          <Link to="/">Terms of Use</Link>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
