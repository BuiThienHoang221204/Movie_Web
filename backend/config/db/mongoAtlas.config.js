const mongoose = require("mongoose")
require("dotenv").config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Connected to MongoDB Atlas")
    } catch (error) {
        console.error("MongoDB connection error:", error)
        process.exit(1)
    }
}

module.exports = connectDB
