const express = require('express')
const routes = require('./routes/routes')

const router = express()

router.use(routes)

module.exports = router