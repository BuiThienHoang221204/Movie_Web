const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    if (!process.env.MONGO_URL) {
        console.error("MONGO_URL is not defined in environment variables");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })
        console.log("Connected to MongoDB Atlas")
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
        process.exit(1)
    }
}

connectDB()

module.exports = connectDB
