const passport = require("../config/auth/google.config")
const User = require("../module/user.module")
const { generateAccessToken, generateRefreshToken } = require("../utils/generates") 

const googleAuthController = {
    login: passport.authenticate("google", {
        scope: ["profile", "email"],
        accessType: "offline",
        prompt: "consent"
    }),

    callback: (req, res) => {
        const {name, email, role} = req.user

        const accessToken = generateAccessToken({name, email, role})
        const refreshToken = generateRefreshToken({name, email, role})

        res.cookie("refreshToken", refreshToken, {
            sameSite: "Strict",
            maxAge: 10 * 60 * 1000,
            secure: true,
            httpOnly: true
        })

        res.cookie("accessToken", accessToken, {
            sameSite: "Strict",
            maxAge: 10 * 60 * 1000,
            secure: true,
            httpOnly: true
        })

        res.redirect(`${process.env.CLIENT_URL}`);
    },

    failureRedirect: passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` })
}

module.exports = googleAuthController
