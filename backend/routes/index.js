const express = require('express');
const router = express.Router();
const filmRoutes = require('./film.routes');
const userRoutes = require('./user.routes');
const accessRoutes = require('./access.routes');
const commentRoutes = require('./comment.routes');

// API version prefix
const API_VERSION = '/api/v1';

// Mount routes
router.use(`${API_VERSION}/films`, filmRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/auth`, accessRoutes);
router.use(`${API_VERSION}/comments`, commentRoutes);

module.exports = router; 