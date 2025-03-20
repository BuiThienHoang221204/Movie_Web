const passport = require("../config/auth/facebook.config")
const { generateAccessToken, generateRefreshToken } = require("../utils/generates")
const User = require("../module/user.module")
const cookieOptions = require("../config/cookie")

const facebookAuthController = {
    login: passport.authenticate("facebook", {
        scope: ["email", "public_profile"],
        accessType: "offline",
        prompt: "consent"
    }),

    callback: async (req, res) => {
        const user = req.user

        if(!await User.findOne({email: user.email})){
            const newUser = new User({...user, status: true, role: "user"})
            await newUser.save()
        }

        const accessToken = generateAccessToken({name: user.name, email: user.email, role: user.role})
        const refreshToken = generateRefreshToken({name: user.name, email: user.email, role: user.role})

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

    failureRedirect: passport.authenticate("facebook", { failureRedirect: `${process.env.CLIENT_URL}/login` })
}

module.exports = facebookAuthController
