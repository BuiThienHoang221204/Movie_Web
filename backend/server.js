require('dotenv').config()
const connectDB = require('./config/db/mongoAtlas.config')
const morgan = require('morgan')

const express = require('express')
const cors = require('cors')
const router = require('./index')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(morgan('tiny'))
connectDB()

app.use(router)

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))