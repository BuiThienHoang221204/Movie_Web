import { createContext, useContext, useState } from "react";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // phim đề xuất
  const [RecommentMovies, setRecommentMovies] = useState([]);
  // thể loại phim
  const [genres, setGenres] = useState([]);
  return (
    <MovieContext.Provider value={{ RecommentMovies, setRecommentMovies, genres, setGenres }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
