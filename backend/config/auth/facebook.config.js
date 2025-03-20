const passport = require("passport")
const FacebookStrategy = require("passport-facebook").Strategy
require("dotenv").config()
const ROLES = require('../../config/role.config')

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            profileFields: ['id', 'emails', 'name','photos']
        },
        (accessToken, refreshToken, profile, done) => {
            const user = {
                name: profile.name.familyName + " " + profile.name.givenName,
                email: profile.emails[0].value,
                provider: "facebook",
                avatar: profile.photos[0].value,
                timeStamp: {
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
            return done(null, user)
        }
    )
)

passport.serializeUser((user, done) => {done(null, user)})
passport.deserializeUser((obj, done) => {done(null, obj)})

module.exports = passport