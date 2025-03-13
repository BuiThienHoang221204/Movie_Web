const bcrypt = require("bcrypt")
const User = require("../module/user.module")
const { generateAccessToken, generateRefreshToken } = require("../utils/generates")
const ROLES = require("../config/role.config")

const signin = async (req, res) => {
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

        const accessToken = generateAccessToken({name, email, role})
        const refreshToken = generateRefreshToken({name, email, role})

        res.cookie("refreshToken", refreshToken, {
            sameSite: "Strict",
            maxAge: 10 * 60 * 1000,
            secure: true,
            httpOnly: true
        })

        res.status(201).json({
            message: "User registered successfully",
            accessToken,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (error) {
        console.error("Error signing up user:", error)
        res.status(500).json({ message: "Internal Server Error", error })
    }
}

module.exports = { signin }
