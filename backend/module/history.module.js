const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  movieId: {type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoUrl: { type: String, required: true },
  title: { type: String },
  image: { type: String },
  genre: { type: String },
  rating: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  watchedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WatchHistories', watchHistorySchema);