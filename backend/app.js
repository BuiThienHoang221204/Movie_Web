const express = require('express');//tạo server
const mongoose = require('mongoose');//tạo database
const cors = require('cors');//cho phép các nguồn khác nhau truy cập vào server
const routes = require('./routes');//tạo các route cho server

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/', routes); //sử dụng các route được định nghĩa trong file routes.js

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/movie_db')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

//tạo port cho server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {//lắng nghe các yêu cầu từ port đã tạo và khởi chạy server
    console.log(`Server is running on port ${PORT}`);
}); 