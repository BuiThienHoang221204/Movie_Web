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

        // Set cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            path: "/",
        };

        // Set cookies with appropriate expiry
        res.cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 10 * 60 * 1000 // 10 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        
        res.redirect(`${process.env.CLIENT_URL}`);
    },

    failureRedirect: passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` })
}

module.exports = googleAuthController
