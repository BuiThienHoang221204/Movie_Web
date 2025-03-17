const bcrypt = require("bcrypt")
const User = require("../module/user.module")
const { generateAccessToken, generateRefreshToken, publicKey } = require("../utils/generates")
const jwt = require('jsonwebtoken')
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
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Error signing up user:", error);
        console.error("Error details:", {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Invalid input data", 
                details: error.message 
            });
        }
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: "Email already exists" 
            });
        }
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message 
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (user.provider !== "local") {
            return res.status(400).json({ 
                message: `This account uses ${user.provider} authentication. Please login with ${user.provider}.`
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate tokens with user data
        const tokenData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        const accessToken = generateAccessToken(tokenData);
        const refreshToken = generateRefreshToken(tokenData);

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

        // Send response
        return res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({ 
                message: "Email already exists",
                details: error.message
            });
        }
        
        return res.status(500).json({ 
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
        
    }
};

const getAuthStatus = async (req, res) => {
    try {
        const accessToken = req.cookies.accessToken;
        
        if (!accessToken) {
            return res.status(401).json({ message: "No access token found" });
        }

        try {
            // Verify the token using the public key from generates.js
            const decoded = jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] });
            
            // Find user in database
            const user = await User.findOne({ email: decoded.email });

            // Send response
            return res.status(200).json({
                accessToken,
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({ 
                message: jwtError.name === 'TokenExpiredError' 
                    ? "Token has expired" 
                    : "Invalid token"
            });
        }
    } catch (error) {
        console.error('Auth status error:', error);
        return res.status(500).json({ 
            message: "Internal Server Error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = { signup, login, getAuthStatus }
