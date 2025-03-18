import React from 'react'
import images from '../../assets/img';
import './Home.css';
import MovieListWithPag from '../component/MovieListWithPag';

function Home() {
  const movies = [
    {
        id: 1,
        title: "Ape vs Mecha",
        year: "2023",
        duration: "2h 45min",
        genres: "Action, Thriller, Sci-Fi",
        rating: "9.5",
        ageRating: "14+",
        description: "Trong một thế giới mà công nghệ gặp bản năng nguyên thủy, một con vượn phải đối mặt với thách thức lớn nhất của mình: một phiên bản cơ giới hóa của chính mình. Một trận chiến cho tương lai của cả hai loài bắt đầu.",
        image: images.banner
    },
    {
        id: 2,
        title: "Cosmic Journey",
        year: "2023",
        duration: "2h 30min",
        genres: "Sci-Fi, Adventure",
        rating: "9.2",
        ageRating: "12+",
        description: "Một nhóm phi hành gia dũng cảm khám phá một lỗ đen bí ẩn, dẫn họ đến một chiều không gian mới đầy nguy hiểm và kỳ diệu. Liệu họ có thể tìm đường về nhà?",
        image: images.banner2
    },
    {
        id: 3,
        title: "Phantom Shadows",
        year: "2023",
        duration: "2h 15min",
        genres: "Horror, Mystery",
        rating: "8.7",
        ageRating: "18+",
        description: "Khi một gia đình chuyển đến một ngôi nhà cổ bí ẩn, họ bắt đầu trải nghiệm những hiện tượng siêu nhiên đáng sợ. Bí mật đen tối của ngôi nhà dần dần được hé lộ.",
        image: images.banner3
    },
    {
      id: 4,
      title: "Ape vs Mecha",
      year: "2023",
      duration: "2h 45min",
      genres: "Action, Thriller, Sci-Fi",
      rating: "9.5",
      ageRating: "14+",
      description: "Trong một thế giới mà công nghệ gặp bản năng nguyên thủy, một con vượn phải đối mặt với thách thức lớn nhất của mình: một phiên bản cơ giới hóa của chính mình. Một trận chiến cho tương lai của cả hai loài bắt đầu.",
      image: images.banner
  },
  {
      id: 5,
      title: "Cosmic Journey",
      year: "2023",
      duration: "2h 30min",
      genres: "Sci-Fi, Adventure",
      rating: "9.2",
      ageRating: "12+",
      description: "Một nhóm phi hành gia dũng cảm khám phá một lỗ đen bí ẩn, dẫn họ đến một chiều không gian mới đầy nguy hiểm và kỳ diệu. Liệu họ có thể tìm đường về nhà?",
      image: images.banner2
  },
  {
      id: 6,
      title: "Phantom Shadows",
      year: "2023",
      duration: "2h 15min",
      genres: "Horror, Mystery",
      rating: "8.7",
      ageRating: "18+",
      description: "Khi một gia đình chuyển đến một ngôi nhà cổ bí ẩn, họ bắt đầu trải nghiệm những hiện tượng siêu nhiên đáng sợ. Bí mật đen tối của ngôi nhà dần dần được hé lộ.",
      image: images.banner3
  },
  {
    id: 7,
    title: "Ape vs Mecha",
    year: "2023",
    duration: "2h 45min",
    genres: "Action, Thriller, Sci-Fi",
    rating: "9.5",
    ageRating: "14+",
    description: "Trong một thế giới mà công nghệ gặp bản năng nguyên thủy, một con vượn phải đối mặt với thách thức lớn nhất của mình: một phiên bản cơ giới hóa của chính mình. Một trận chiến cho tương lai của cả hai loài bắt đầu.",
    image: images.banner
  },
  {
      id: 8,
      title: "Cosmic Journey",
      year: "2023",
      duration: "2h 30min",
      genres: "Sci-Fi, Adventure",
      rating: "9.2",
      ageRating: "12+",
      description: "Một nhóm phi hành gia dũng cảm khám phá một lỗ đen bí ẩn, dẫn họ đến một chiều không gian mới đầy nguy hiểm và kỳ diệu. Liệu họ có thể tìm đường về nhà?",
      image: images.banner2
  },
  {
      id: 9,
      title: "Phantom Shadows",
      year: "2023",
      duration: "2h 15min",
      genres: "Horror, Mystery",
      rating: "8.7",
      ageRating: "18+",
      description: "Khi một gia đình chuyển đến một ngôi nhà cổ bí ẩn, họ bắt đầu trải nghiệm những hiện tượng siêu nhiên đáng sợ. Bí mật đen tối của ngôi nhà dần dần được hé lộ.",
      image: images.banner3
  }
  ];

  return (
    <>
      <div className='home pt-2 pb-5'>
        <MovieListWithPag title={'Top Trending'} movies={movies.sort((a, b) => parseInt(b.year) - parseInt(a.year))}></MovieListWithPag>
        <MovieListWithPag title={'Top Rating'} movies={movies.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))}></MovieListWithPag>
        <MovieListWithPag title={'You May Like✨'} movies={movies.sort((a, b) => a.ageRating.localeCompare(b.ageRating))}></MovieListWithPag>
      </div>
    </>
  )
}
export default Home