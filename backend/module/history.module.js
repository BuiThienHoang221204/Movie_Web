const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
  _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
      },
  userId: { type: String, ref: 'users', required: true},
  movieId: {type: Number, ref: 'movies', required: true},
  progress: { type: Number, default: 0 },
  lastWatched: { type: Date, default: Date.now }
});

const watchHistories = mongoose.model('watchhistories', watchHistorySchema);

module.exports = watchHistories;