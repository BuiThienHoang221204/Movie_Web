const bcrypt = require("bcrypt")
const User = require("../module/user.module")
const { generateAccessToken, generateRefreshToken, publicKey } = require("../utils/generates")
const jwt = require('jsonwebtoken')
const ROLES = require("../config/role.config")
const cookieOptions = require("../config/cookie")

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
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });
    } catch (error) {
        if (error.name === 'MongoServerError') {
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

const logout = async (req, res) => {
    try {
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
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

const updateUser = async (req, res) => {
    try {
        const { email, name, avatar } = req.body;

        // Kiểm tra nếu thiếu email hoặc thông tin quan trọng khác
        if (!email || !name || !avatar) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Cập nhật thông tin người dùng theo email
        const result = await User.updateOne(
            { email: email },
            { $set: { name: name, avatar: avatar }}
        );

        // Kiểm tra nếu không có thay đổi (modifiedCount = 0 có thể có nếu dữ liệu không thay đổi)
        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "No user found or no changes were made" });
        }

        // Trả về kết quả cập nhật thành công
        return res.status(200).json({
            message: "User updated successfully",
            result,
        });
    } catch (error) {
        // Xử lý lỗi từ MongoDB (ví dụ trùng email)
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({
                message: "Email already exists",
                details: error.message,
            });
        }

        // Các lỗi khác (internal server error)
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
module.exports = { signup, login, logout, getAuthStatus, updateUser}
