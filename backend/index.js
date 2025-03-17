const express = require('express')
const routes = require('./routes/routes') //tạo các route cho server

const router = express()

router.use(routes)

module.exports = router