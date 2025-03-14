const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// Cấu hình cho Google OAuth
const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/google/callback'
};

// Cấu hình cho Facebook OAuth
const facebookConfig = {
  clientId: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:5000/auth/facebook/callback'
};

// Tạo JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Tạo token
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Kiểm tra mật khẩu
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Tạo token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getGoogleAuthURL = (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleConfig.clientId}&redirect_uri=${googleConfig.callbackURL}&response_type=code&scope=profile email`;
  res.json({ url });
};

exports.getFacebookAuthURL = (req, res) => {
  const url = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${facebookConfig.clientId}&redirect_uri=${facebookConfig.callbackURL}&scope=email`;
  res.json({ url });
};

exports.googleCallback = async (req, res) => {
  try {
    // Lấy thông tin user từ Google profile
    const { id, emails, displayName } = req.user;
    
    // Tìm hoặc tạo user
    let user = await User.findOne({ email: emails[0].value });
    
    if (!user) {
      user = await User.create({
        name: displayName,
        email: emails[0].value,
        googleId: id
      });
    }

    // Tạo token
    const token = generateToken(user);

    // Chuyển hướng về frontend với token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

exports.facebookCallback = async (req, res) => {
  try {
    // Lấy thông tin user từ Facebook profile
    const { id, emails, displayName } = req.user;
    
    // Tìm hoặc tạo user
    let user = await User.findOne({ email: emails[0].value });
    
    if (!user) {
      user = await User.create({
        name: displayName,
        email: emails[0].value,
        facebookId: id
      });
    }

    // Tạo token
    const token = generateToken(user);

    // Chuyển hướng về frontend với token
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
}; 