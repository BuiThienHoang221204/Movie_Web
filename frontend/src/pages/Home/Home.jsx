import React, { useState, useEffect } from 'react';
import './Home.css';
import images from '../../assets/img';
import MovieListWithPag from '../components/MovieListWithPag';
import movieService from '../../services/movieService';

function Home() {
  const [RecommentMovies, setRecommentMovies] = useState([]);
  const [TrendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const fetchRecommentMovies = async () => {
      try {
        const data = await movieService.getRecommendMovies();
        console.log("Dữ liệu phim từ API:", data);
        if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
          setRecommentMovies(data);
        } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
          setRecommentMovies(fallbackMovies);
        }
      } catch (err) {
        console.error('Lỗi khi lấy phim đề xuất (frontend):', err);
        // Khi có lỗi, sử dụng dữ liệu mẫu
        setRecommentMovies(fallbackMovies);
      }
    }

    fetchRecommentMovies();
  }, []);

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const data = await movieService.getNewMovies();
        console.log("Dữ liệu phim từ API:", data);
        if (data && data.length > 0) { // Nếu có dữ liệu API, sử dụng nó
          setTrendingMovies(data);
        } else {// Nếu không có dữ liệu từ API, sử dụng dữ liệu mẫu
          setTrendingMovies(fallbackMovies);
        }
      } catch (err) {
        console.error('Lỗi khi lấy phim đề xuất (frontend):', err);
        // Khi có lỗi, sử dụng dữ liệu mẫu
        setTrendingMovies(fallbackMovies);
      }
    }

    fetchTrendingMovies();
  }, []);

  const fallbackMovies = [
    {
      id: 1, title: "Avengers: Endgame", year: "2019",
      genre: "Hành động, Khoa học viễn tưởng", rating: 4.9, match: 98,
      image: images.ImgMovie
    },
    {
      id: 2, title: "Joker", year: "2019",
      genre: "Tâm lý, Tội phạm", rating: 4.7, match: 95,
      image: images.banner2
    },

  ];

  return (
    <>
      <div className='home pt-2 pb-5'>
        <MovieListWithPag title={'Top Trending'} movies={TrendingMovies.sort((a, b) => b.rating - a.rating)}></MovieListWithPag>
        <MovieListWithPag title={'Top Rating'} movies={RecommentMovies.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))}></MovieListWithPag>
        <MovieListWithPag title={'You May Like✨'} movies={RecommentMovies.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))}></MovieListWithPag>
      </div>
    </>
  )
}
export default Home