const bcrypt = require("bcrypt")
const User = require("../module/user.module")
const { generateAccessToken, generateRefreshToken } = require("../utils/generates")
const ROLES = require("../config/role.config")

const signup = async (req, res) => {
    try {
        const { name, password, email } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            password: passwordHash,
            email,
            provider: "local",
            status: true,
            role: ROLES.USER,
            avatar: "",
            timeStamp: {
                createdAt: new Date(),
                updatedAt: new Date()
            }
        })

        res.status(201).json({
            accessToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })

        res.redirect(process.env.CLIENT_URL)
    } catch (error) {
        console.error("Error signing up user:", error)
        res.status(500).json({ message: "Internal Server Error", error })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        // Check if user was created with social login
        if (user.provider !== "local") {
            return res.status(400).json({ 
                message: `This account uses ${user.provider} authentication. Please login with ${user.provider}.`
            })
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            name: user.name,
            email: user.email,
            role: user.role
        })
        const refreshToken = generateRefreshToken({
            name: user.name,
            email: user.email,
            role: user.role
        })

        // Set cookies
        res.cookie("refreshToken", refreshToken, {
            sameSite: "Strict",
            maxAge: 10 * 60 * 1000, // 10 minutes
            secure: true,
            httpOnly: true,
            path: "/"
        })

        res.cookie("accessToken", accessToken, {
            sameSite: "Strict", 
            maxAge: 10 * 60 * 1000, // 10 minutes
            secure: true,
            httpOnly: true,
            path: "/"
        })

        // Send response
        res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        })

        res.redirect(process.env.CLIENT_URL)
    } catch (error) {
        console.error("Error logging in user:", error)
        res.status(500).json({ message: "Internal Server Error", error })
    }
}

module.exports = { signup, login }
