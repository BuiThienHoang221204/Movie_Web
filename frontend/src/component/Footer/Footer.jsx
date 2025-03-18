import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
        <div className="footer-container">
            <div className="copyright">
                Copyright © 2025 G3 Movie
            </div>
            <div className="footer-links">
                <a href="/about">About Us</a>
                <a href="/feedback" className="active">Feedback</a>
                <a href="/terms">Terms of use</a>
                <a href="/privacy">Privacy Policy</a>
                <a href="/service-agreement">User Service Agreement</a>
                <a href="/cookies">Cookie Policy</a>
            </div>
        </div>
    </footer>
  )
}
export default Footer;