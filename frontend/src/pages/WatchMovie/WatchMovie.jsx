import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import movieService from "../../services/movieService";
import "./WatchMovie.css";
import { FaStar, FaCalendarAlt, FaUsers, FaPlayCircle } from "react-icons/fa";
import images from "../../assets/img";
import axiosInstance from "../../config/axios";
import MovieUpdate from "../components/MovieUpdate";

function WatchMovie() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const moviePlayerRef = useRef(null); // Tạo một ref cho phần xem phim
  const initialRender = useRef(true); // Xác định lần render đầu tiên

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

        if (response.data.success) {
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

  // Cuộn đến phần xem phim khi component được mount hoặc dữ liệu phim được tải
  useEffect(() => {
    // Chỉ cuộn khi phim đã được tải và đây là lần render đầu tiên sau khi tải phim
    if (moviePlayerRef.current && !loading && movie && initialRender.current) {
      moviePlayerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      initialRender.current = false;
    }
  }, [loading, movie]); // Kích hoạt khi dữ liệu phim có sẵn và khi hết loading

  // Reset initialRender khi id thay đổi (tức là khi chọn phim khác)
  useEffect(() => {
    initialRender.current = true;
    // aaa
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading movie</p>
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

        {/* Phần xem phim với ref */}
        <div className="movie-player-section" ref={moviePlayerRef}>
          <div className="movie-player">
            {movie.video_url ? (
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
                  <span>{movie.vote_count} votes </span>
                </div>
              </div>

              {/* Chỉ hiển thị thể loại khi có genre_ids và có ít nhất một thể loại */}
              {movie.genre_ids && movie.genre_ids.length > 0 && (
                <div className="movie-genres">
                  <h3>Genres:</h3>
                  <div className="genre-tags">
                    {movie.genre_ids.map((genreId, index) => {
                      const genreName = getGenreName(genreId);
                      if (genreName !== "Updating") {
                        return (
                          <span key={index} className="genre-tag">
                            {genreName}
                          </span>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
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

        <MovieUpdate />
      </div>
    </div>
  );
}

export default WatchMovie;