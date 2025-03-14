const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');

// Local authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Google authentication routes
router.get('/google/url', authController.getGoogleAuthURL);
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/login',
    session: false 
  }),
  authController.googleCallback
);

// Facebook authentication routes
router.get('/facebook/url', authController.getFacebookAuthURL);
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false
  }),
  authController.facebookCallback
);

module.exports = router; 