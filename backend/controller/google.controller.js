const passport = require("../config/auth/google.config")
const User = require("../module/user.module")
const { generateAccessToken, generateRefreshToken } = require("../utils/generates") 
const cookieOptions = require("../config/cookie")

const googleAuthController = {
    login: passport.authenticate("google", {
        scope: ["profile", "email"],
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

    failureRedirect: passport.authenticate("google", { failureRedirect: `${process.env.CLIENT_URL}/login` })
}

module.exports = googleAuthController
