import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import movieService from "../../services/movieService";
import "./WatchMovie.css";
import { FaStar, FaCalendarAlt, FaUsers, FaPlayCircle } from "react-icons/fa";
import images from "../../assets/img";
import axiosInstance from "../../config/axios";
import RelatedMovies from "../components/RelatedMovies";

function WatchMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getGenreName = (genreId) => {
    const genre = genres.find(g => g.id === genreId);
    return genre ? genre.name : "Updating";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieData, genresData] = await Promise.all([
          movieService.getMovieDetail(id),
          movieService.getGenres()
        ]);

        setMovie(movieData);
        setGenres(genresData);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải thông tin phim.");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!movie || !movie.title) return;

    const fetchVideo = async () => {
      try {
        const response = await axiosInstance.get(`/api/drive/films/${movie.title}`);

        if (response.data.success) {//Kiểm tra xem API trả về dữ liệu thành công hay không
          setMovie(prevMovie => ({
            ...prevMovie,
            video_url: response.data.data[0].webViewLink.replace("view?usp=drivesdk", "preview"),
          }));
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.warn(`Không tìm thấy video cho phim: ${movie.title}`);
        } else {
          console.error("Lỗi khi tải video:", err);
        }
      }
    };

    fetchVideo();
  }, [movie]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading movie...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!movie) {
    return <div className="not-found">Movie not found</div>;
  }

  return (
    <div className="watch-movie-container">
      <div className="movie-content">

      
        {/* Phần xem phim */}
        <div className="movie-player-section">
          <div className="section-header">
            <h2>Watch Movie</h2>
          </div>

          <div className="movie-player">
            {movie.video_url ?
            (
              <iframe
                src={movie.video_url}
                title={movie.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="no-video">
                <FaPlayCircle className="no-video-icon" />
                <p>Movie will be updated soon</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Phần thông tin phim */}
        <div className="movie-info-section">
          {/* Phần poster và thông tin */}
          <div className="movie-details-container">
            <div className="movie-poster-wrapper">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
                onError={(e) => {
                  e.target.src = images.ImgMovie;
                }}
              />
            </div>

            <div className="movie-details">
              <div className="movie-meta-info">
                <h1 className="movie-titledhau">{movie.title}</h1>

                <span
                  className="movie-badge quality-badge"
                  style={{ width: "50px" }}
                >
                  HD
                </span>

                <div className="meta-item">
                  <FaCalendarAlt className="meta-icon" />
                  <span>Release date: {movie.release_date}</span>
                </div>
                <div className="meta-item">
                  <FaStar className="meta-icon star-icon" />
                  <span>Rating: {movie.vote_average?.toFixed(1)}/10</span>
                </div>
                <div className="meta-item">
                  <FaUsers className="meta-icon" />
                  <span>{movie.vote_count} votes</span>
                </div>
              </div>

              {/* Chỉ hiển thị thể loại khi có genre_ids và có ít nhất một thể loại */}
              {movie.genre_ids && movie.genre_ids.length > 0 && (
                <div className="movie-genres">
                  <h3>Genres:</h3>
                  <div className="genre-tags">
                    {movie.genre_ids.map((genreId, index) => {
                      const genreName = getGenreName(genreId);
                      // Chỉ hiển thị thể loại nếu tìm thấy tên
                      if (genreName !== "Không xác định") {
                        return (
                          <span key={index} className="genre-tag">
                            {genreName}
                          </span>
                        );
                      }
                      return null;
                    }).filter(Boolean)} {/* Lọc bỏ các giá trị null */}
                  </div>
                </div>
              )}

              <div className="movie-description">
                <h3>Overview:</h3>
                <p>{movie.overview || "No description available for this movie."}</p>
              </div>
            </div>
          </div>
        </div>

        <RelatedMovies/>
      </div>
    </div>
  );
}

export default WatchMovie;
