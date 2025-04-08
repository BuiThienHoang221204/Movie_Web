import { createContext, useContext, useEffect, useState } from "react";
import movieService from "../../services/movieService";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // phim đề xuất
  const [RecommentMovies, setRecommentMovies] = useState([]);
  // thể loại phim
  const [genres, setGenres] = useState([]);

  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await movieService.getGenres();
        // console.log("Dữ liệu thể loại từ API:", data);
        if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
          setGenres(data);
        } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
        }
      } catch (err) {
        console.error('Lỗi khi lấy thể loại (frontend):', err);
        // Khi có lỗi, sử dụng dữ liệu mẫu
      }
    }

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getAllMovies();
        // console.log("Dữ liệu thể loại từ API:", data);
        if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
          setMovies(data);
        } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
        }
      } catch (err) {
        console.error('Lỗi khi lấy thể loại (frontend):', err);
        // Khi có lỗi, sử dụng dữ liệu mẫu
      }
    }

    fetchMovies();
  }, []);

  return (
    <MovieContext.Provider value={{ RecommentMovies, setRecommentMovies, genres, movies }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
