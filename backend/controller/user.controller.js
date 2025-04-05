const User = require('../module/user.module'); // Import user model
const mongoose = require('mongoose'); // For database interaction

// Get current user information
const getUser = async (req, res) => {
    try {
        // Assuming the user email is available in req.user (set by authentication middleware)
        const userEmail = req.user?.gmail; // Adjust based on your authentication setup
        if (!userEmail) {
            return res.status(401).json({ message: "Không tìm thấy người dùng. Vui lòng đăng nhập." });
        }

        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy thông tin người dùng." });
        }

        // Format user data for frontend
        const formattedUser = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar || null,
            role: user.role || 'user',
        };

        res.status(200).json(formattedUser);
    } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Update user information
const updateUser = async (req, res) => {
    try {
        // Assuming the user email is available in req.user (set by authentication middleware)
        const userEmail = req.user?.gmail;
        if (!userEmail) {
            return res.status(401).json({ message: "Không tìm thấy người dùng. Vui lòng đăng nhập." });
        }

        const { name, avatar } = req.body;
        if (!name && !avatar) {
            return res.status(400).json({ message: "Vui lòng cung cấp ít nhất một trường để cập nhật (name hoặc avatar)." });
        }

        // Find and update the user by email
        const updatedUser = await User.findOneAndUpdate(
            { email: userEmail },
            { name, avatar },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật." });
        }

        // Format updated user data for frontend
        const formattedUser = {
            id: updatedUser._id.toString(),
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar || null,
            role: updatedUser.role || 'user',
        };

        res.status(200).json(formattedUser);
    } catch (err) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const userEmail = req.user?.gmail;
        if (!userEmail) {
            return res.status(401).json({ message: "Không tìm thấy người dùng. Vui lòng đăng nhập." });
        }

        const deletedUser = await User.findOneAndDelete({ email: userEmail });
        if (!deletedUser) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để xóa." });
        }

        res.status(200).json({ message: "Người dùng đã được xóa thành công." });
    } catch (err) {
        console.error("Lỗi khi xóa người dùng:", err);
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
};

module.exports = {
    getUser,
    updateUser,
    deleteUser,
};