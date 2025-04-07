const movies = require('../module/genre.module') //import model movie
const mongoose = require('mongoose')

// lấy tất cả thể loại phim
const getAllGenres = async (req, res) => {
    try {
        const genres = await movies.find({})
        console.log("Dữ liệu lấy từ MongoDB:", genres);
        
        if (!genres || genres.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy thể loại nào" })
        }

        console.log("Dữ liệu thể loại phim:", genres);
        const formatGenres = genres.map(genre => ({
            id: genre.id,
            name: genre.name
        }));
        res.status(200).json(formatGenres)
    } catch (err) {
        console.error("Lỗi khi lấy thể loại phim:", err)
        res.status(500).json({ message: "Lỗi server", error: err.message })
    }
}

module.exports = { getAllGenres }