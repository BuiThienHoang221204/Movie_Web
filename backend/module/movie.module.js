const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    backdrop_path: {
        type: String,
        required: true,
    },
    genre_ids: {
        type: Array,
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    original_language: {
        type: String,
        required: true,
    },
    overview: {
        type: String,
        required: true,
    },
    popularity: {
        type: Number,
    },
    poster_path: {
        type: String,
    },
    release_date: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    vote_average: {
        type: Number,
    },
    vote_count: {
        type: Number,
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

const movies = mongoose.model("movies", movieSchema);

module.exports = movies;
