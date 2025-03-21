const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        (accessToken, refreshToken, profile, done) => {
            const user = {
                name: profile.displayName,
                email: profile.emails[0].value,
                provider: "google",
                avatar: profile.photos[0].value,
                timeStamp: {
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            }
            return done(null, user);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
