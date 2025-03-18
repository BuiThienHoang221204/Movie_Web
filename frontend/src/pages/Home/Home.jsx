import React, { useEffect, useState } from 'react'
import { RecommentMovie } from '../components'
import MoiveUpdate from '../components/MovieUpdate'
import movieService from '../../services/movieService'
import './Home.css'

function Home() {
  const [trailer, setTrailer] = useState([]);
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const data = await movieService.getNewMovies();
        console.log("Dữ liệu phim từ API:", data);
        if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
          //lấy 3 phim đầu tiên
          setTrailer(data.slice(0, 3));
        } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
          setTrailer(upcomingMovies);
        }
      } catch (err) {
        console.error('Lỗi khi lấy phim đề xuất (frontend):', err);
        // Khi có lỗi, sử dụng dữ liệu mẫu
        setTrailer(upcomingMovies);
      }
    }

    fetchTrailer();
  }, []);
  // Sample upcoming movies data
  const upcomingMovies = [
    { id: 1, title: "Spider-Man 4: Brand New Day", year: "May 2026" },
    { id: 2, title: "The Batman", year: "March 2022" },
    { id: 3, title: "The Dark Knight", year: "July 2008" },
  ]
  return (
    <div>
      <RecommentMovie />
      <MoiveUpdate />
      <div className="trailer-section container">
        <h1 className='title-trailer'>Trailer phim hot</h1>
        <div className="trailer-content">
          <div className="trailer-main">
            <iframe width="100%" height="100%"
              src="https://www.youtube.com/embed/ksls6lIiSPg?autoplay=1&mute=1"
              title="PANDA PLAN Official Trailer (2024) Jackie Chan"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            >
            </iframe>
          </div>
          <div className="trailer-sidebar">
            <div className="trailer-info">
              <h3>PANDA PLAN Official Trailer (2024)</h3>
              <p className="release-date">Coming in 2026</p>
              <p className="movie-description">
                Huyền thoại võ thuật Jackie Chan trở lại trong PANDA PLAN, một bộ phim hành động - phiêu lưu đầy hấp dẫn!
                Khi một tổ chức tội phạm quốc tế nhắm vào loài gấu trúc quý hiếm, một cựu đặc vụ (Jackie Chan) buộc phải tái xuất để bảo vệ chúng
              </p>
              <button className="add-watchlist-btn">
                <i className="fa fa-plus"></i> Add to Watchlist
              </button>
            </div>
            <div className="upcoming-movies">
              <h3>Coming Soon</h3>
              <ul className="upcoming-list">
                {trailer.map(movie => (
                  <li key={movie.id} className="upcoming-item">
                    <span className="upcoming-title">{movie.title}</span>
                    <span className="upcoming-date">{movie.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home