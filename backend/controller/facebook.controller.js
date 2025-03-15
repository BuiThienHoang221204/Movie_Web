const passport = require("../config/auth/facebook.config")
const { generateAccessToken, generateRefreshToken } = require("../utils/generates")
const User = require("../module/user.module")

const facebookAuthController = {
    login: passport.authenticate("facebook", {
        scope: ["email", "public_profile"],
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
            httpOnly: true,
            path: "/"
        })

        res.cookie("accessToken", accessToken, {
            sameSite: "Strict",
            maxAge: 10 * 60 * 1000,
            secure: true,
            httpOnly: true,
            path: "/"
        })
        
        res.redirect(`${process.env.CLIENT_URL}`);
    },

    failureRedirect: passport.authenticate("facebook", { failureRedirect: `${process.env.CLIENT_URL}/login` })
}

module.exports = facebookAuthController
