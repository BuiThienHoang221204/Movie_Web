const movies = require('../module/movie.module') //import model movie
const mongoose = require('mongoose') // giúp tương tác với database

// lấy tất cả phim đề xuất
const getAllMoviesRecommend = async (req, res) => {
    try {
        // lấy phim có lượt đánh giá cao
        const recommentMovie = await movies.find({ vote_average: { $gte: 7.5 } })
            .sort({ popularity: -1 }) //sắp xếp theo lượt xem giảm dần
            .limit(12) //giới hạn 12 phim

        console.log("Dữ liệu lấy từ MongoDB:", recommentMovie);
        
        //kiểm tra xem có phim không
        if (!recommentMovie || recommentMovie.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy phim đề xuất nào" })
        }

        //fomat dữ liệu cho frontend 
        const formatMovie = recommentMovie.map(movie => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.substring(0, 4) : null, //lấy năm phát hành
            genre: movie.genre_ids.join(", "),
            rating: movie.vote_average, //chia 2 để đưa về thang điểm 5
            match: Math.round((movie.vote_average / 10) * 100), //tính toán phần trăm khớp
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}` //lấy ảnh phim

        }));
        res.status(200).json(formatMovie) //trả về dữ liệu cho frontend
    } catch (err) {
        console.error("Lỗi khi lấy phim đề xuất:", err)
        res.status(500).json({ message: "Lỗi server", error: err.message })
    }
}

// getAllMoviesUpdate: Lấy phim đã lên lịch ra mắt
const getAllMoviesUpdate = async (req, res) => {
    try {
        // Lấy tất cả phim có ngày phát hành trong tương lai
        const newMovies = await movies.find({
            release_date: { $gte: "2024-10-01" } // Lấy phim từ tháng 10/2024 trở đi
        })
            .sort({ release_date: 1 }) // Sắp xếp theo ngày phát hành tăng dần (ra mắt sớm trước)
            .limit(12)
            
        console.log("Số lượng phim mới tìm thấy:", newMovies.length);
            
        //kiểm tra xem có phim không
        if (!newMovies || newMovies.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy phim mới nào" })
        }

        //fomat dữ liệu cho frontend 
        const formatMoviesUpdate = newMovies.map(movie => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.substring(0, 4) : null, //lấy năm phát hành
            genre: movie.genre_ids.join(", "),
            rating: movie.vote_average, //chia 2 để đưa về thang điểm 5
            match: Math.round((movie.vote_average / 10) * 100), //tính toán phần trăm khớp
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}` //lấy ảnh phim

        }));
        res.status(200).json(formatMoviesUpdate) //trả về dữ liệu cho frontend
    } catch (err) {
        console.error("Lỗi khi lấy phim mới:", err)
        res.status(500).json({ message: "Lỗi server", error: err.message })
    }
}

const getAllMovies = async (req, res) => {
    try {
        const newMovies = await movies.find({})
            .sort({ release_date: -1 })
            
        console.log("Số lượng phim:", newMovies.length);

        if (!newMovies || newMovies.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy phim" })
        }

        const formatMoviesUpdate = newMovies.map(movie => ({
            id: movie.id,
            title: movie.title,
            year: movie.release_date ? movie.release_date.substring(0, 4) : null, //lấy năm phát hành
            genre: movie.genre_ids.join(", "),
            rating: movie.vote_average, //chia 2 để đưa về thang điểm 5
            match: Math.round((movie.vote_average / 10) * 100), //tính toán phần trăm khớp
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}` //lấy ảnh phim

        }));
        res.status(200).json(formatMoviesUpdate) //trả về dữ liệu cho frontend
    } catch (err) {
        console.error("Lỗi khi lấy phim mới:", err)
        res.status(500).json({ message: "Lỗi server", error: err.message })
    }
}

// lấy chi tiết phim 
const getMovieDetail = async (req, res) => {
    try{
        const movieId = req.params.id;
        const movie = await movies.findOne({ id: parseInt(movieId) });
        
        if(!movie){
            return res.status(404).json({message : "Không tìm thấy chi tiết phim"})
        }
        res.status(200).json(movie)//trả về dữ liệu cho frontend
    }catch(err){
        console.error("Lỗi khi lấy chi tiết phim:", err)
        res.status(500).json({message: "Lỗi server", error: err.message})
    }
}
module.exports = {
    getAllMoviesRecommend,
    getAllMoviesUpdate,
    getAllMovies,
    getMovieDetail
}
