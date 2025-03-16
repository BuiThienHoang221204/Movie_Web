require('dotenv').config() //tạo biến môi trường từ file .env
const connectDB = require('./config/db/mongoAtlas.config') //tạo kết nối đến database
const morgan = require('morgan') //tạo logger để theo dõi các yêu cầu HTTP
//Morgan là một middleware, xử lý mỗi request trước khi nó đi đến route handler

const express = require('express')
const cors = require('cors')
const router = require('./index')

const app = express()
const port = process.env.PORT

//cấu hình middleware
app.use(express.json()) //xử lý dữ liệu JSON
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})) //cho phép các nguồn khác nhau truy cập vào server
app.use(morgan('tiny')) //tạo logger để theo dõi các yêu cầu HTTP
connectDB() //kết nối đến database
app.use(router) //sử dụng các route được định nghĩa trong file routes.js

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))//lắng nghe các yêu cầu từ port đã tạo và khởi chạy server 