const express = require("express")
const googleAuthController = require("../controller/google.controller")
const facebookAuthController = require("../controller/facebook.controller")
const {signup, login, getAuthStatus, logout} = require("../controller/access.controller")
const passport = require("../config/passport.config")
const router = express()

router.use(passport)

router.get("/auth/google", googleAuthController.login)
router.get("/auth/google/account", googleAuthController.failureRedirect, googleAuthController.callback)

router.get("/auth/facebook", facebookAuthController.login)
router.get("/auth/facebook/account", facebookAuthController.failureRedirect, facebookAuthController.callback)

router.post("/auth/signup", signup)
router.post("/auth/login", login)
router.post("/auth/logout", logout)
router.get("/auth/status", getAuthStatus)

// const filmRoutes = require('./film.routes');
// const userRoutes = require('./user.routes');
// const accessRoutes = require('./access.routes');
// const commentRoutes = require('./comment.routes');
//import moviecontroller
const movieController = require('../controller/movie.controller')
const historyController = require('../controller/history.controller')

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
router.get(`${API_VERSION}/genres`, movieController.getAllGenres)
router.get(`${API_VERSION}/movies/:id`, movieController.getMovieDetail)
router.get(`${API_VERSION}/movies`, movieController.getAllMovies)

router.get(`${API_VERSION}/movieHistories/:userId`, historyController.getWatchHistory)
router.get(`${API_VERSION}/movieHistories`, historyController.getAllWatchHistories)

router.post(`${API_VERSION}/movieHistories`, historyController.addWatchHistory)
router.put(`${API_VERSION}/movieHistories/:id`, historyController.updateWatchHistory)
router.delete(`${API_VERSION}/movieHistories/:id`, historyController.deleteWatchHistory)

module.exports = router
