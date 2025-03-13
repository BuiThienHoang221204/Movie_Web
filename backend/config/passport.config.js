const GGpassport = require("../config/auth/google.config")
const FBpassport = require("../config/auth/facebook.config")
const session = require("../config/session.config")
const express = require("express")

const router = express()

router.use(session)
router.use(GGpassport.initialize())
router.use(GGpassport.session())
router.use(FBpassport.initialize())
router.use(FBpassport.session())

module.exports = router