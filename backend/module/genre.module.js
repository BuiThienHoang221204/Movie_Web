const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    timeStamp: {
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }
})

const Genre = mongoose.model("genres", genreSchema);

module.exports = Genre;
