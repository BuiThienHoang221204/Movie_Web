const express = require('express');
const router = express.Router();
// const filmRoutes = require('./film.routes');
// const userRoutes = require('./user.routes');
// const accessRoutes = require('./access.routes');
// const commentRoutes = require('./comment.routes');
//import moviecontroller
const movieController = require('../controller/movie.controller')

// API version prefix
const API_VERSION = '/api/v1';//định nghĩa phiên bản API

// định nghĩa route cho các phim
// router.use(`${API_VERSION}/films`, filmRoutes);//định nghĩa route cho films
// router.use(`${API_VERSION}/users`, userRoutes);//định nghĩa route cho users
// router.use(`${API_VERSION}/auth`, accessRoutes);//định nghĩa route cho auth
// router.use(`${API_VERSION}/comments`, commentRoutes);//định nghĩa route cho comments

// Sửa lại route để phù hợp với đường dẫn frontend đang gọi
router.get(`${API_VERSION}/movies/recommend`, movieController.getAllMoviesRecommend)
router.get(`${API_VERSION}/movies/new`, movieController.getAllMoviesUpdate)
router.get(`${API_VERSION}/movies/:id`, movieController.getMovieDetail)
module.exports = router; //export router để sử dụng trong app.js