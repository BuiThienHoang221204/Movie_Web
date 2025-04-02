require('dotenv').config() //tạo biến môi trường từ file .env
require('./config/db/mongoAtlas.config') // kết nối đến database
const morgan = require('morgan') //tạo logger để theo dõi các yêu cầu HTTP
//Morgan là một middleware, xử lý mỗi request trước khi nó đi đến route handler

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./index')

const app = express()
const port = process.env.PORT || 5000



// Middleware order is important
app.use(morgan('tiny')) // Logging first
app.use(express.json()) // Parse JSON before cookies
app.use(cookieParser()) // Parse cookies

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
}))

// Routes
app.use(router)

// Route cơ bản để tránh 404 (health check)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend is running' });
  });
  
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(port, '0.0.0.0',() => {
    console.log(`Server running on http://localhost:${port}`);
    console.log('CORS origin:', process.env.CLIENT_URL || 'http://localhost:5173');
}) 