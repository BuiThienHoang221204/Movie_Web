const express = require('express');//tạo server
const mongoose = require('mongoose');//tạo database
const cors = require('cors');//cho phép các nguồn khác nhau truy cập vào server
const routes = require('./routes');//tạo các route cho server
// Thêm dotenv để đọc biến môi trường từ file .env
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', //chỉ cho phép chạy ở bên 5173 phía frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //cho phép frontend gọi API với các phương thức HTTP get post put options
    allowedHeaders: ['Content-Type', 'Authorization'] //cho phép frontend gửi header Authorization với các phương thức HTTP
}));
app.use(express.json()); //sử dụng để express có thể đọc đc kiểu json nếu không có thì sẽ không hiểu và bị undefined 

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

// Connect to MongoDB Atlas thay vì MongoDB local
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('MongoDB Atlas connection error:', err));

//tạo port cho server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {//lắng nghe các yêu cầu từ port đã tạo và khởi chạy server
    console.log(`Server is running on port ${PORT}`);
}); 