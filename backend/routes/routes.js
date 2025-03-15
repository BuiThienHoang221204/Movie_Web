const express = require("express")
const googleAuthController = require("../controller/google.controller")
const facebookAuthController = require("../controller/facebook.controller")
const {signup} = require("../controller/access.controller")
const passport = require("../config/passport.config")
const router = express()

router.use(passport)

router.get("/auth/google", googleAuthController.login)
router.get("/auth/google/account", googleAuthController.failureRedirect, googleAuthController.callback)

router.get("/auth/facebook", facebookAuthController.login)
router.get("/auth/facebook/account", facebookAuthController.failureRedirect, facebookAuthController.callback)

router.post("/auth/signup", signup)
module.exports = router
