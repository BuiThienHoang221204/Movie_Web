import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPlay } from 'react-icons/fa';

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
            Khám phá thế giới điện ảnh với những bộ phim mới nhất và hay nhất. Trải nghiệm xem phim tuyệt vời với chất lượng cao và đa dạng thể loại.
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
              <span>123 Đường Phim, Quận 1, TP.HCM</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section categories">
          <h3 className="footer-heading">Thể loại</h3>
          <ul className="footer-links">
            <li><Link to="/">Hành động</Link></li>
            <li><Link to="/">Tình cảm</Link></li>
            <li><Link to="/">Kinh dị</Link></li>
            <li><Link to="/">Khoa học viễn tưởng</Link></li>
            <li><Link to="/">Hoạt hình</Link></li>
            <li><Link to="/">Phiêu lưu</Link></li>
            <li><Link to="/">Gia Đình</Link></li>
          </ul>
        </div>
        
        <div className="footer-section quick-links">
          <h3 className="footer-heading">Liên kết nhanh</h3>
          <ul className="footer-links">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/">Phim mới</Link></li>
            <li><Link to="/">Phim hot</Link></li>
            <li><Link to="/">Lịch chiếu</Link></li>
            <li><Link to="/">Tin tức</Link></li>
            <li><Link to="/">Liên hệ</Link></li>
            <li><Link to="/">Giới thiệu</Link></li>
          </ul>
        </div>
        
        <div className="footer-section newsletter">
          <h3 className="footer-heading">Đăng ký nhận tin</h3>
          <p>Nhận thông báo về phim mới và ưu đãi đặc biệt</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Email của bạn" />
            <button className="subscribe-btn">Đăng ký</button>
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
          &copy; {currentYear} CINEMA. Tất cả quyền được bảo lưu.
        </div>
        <div className="footer-bottom-links">
          <Link to="/">Điều khoản sử dụng</Link>
          <Link to="/">Chính sách bảo mật</Link>
          <Link to="/">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;