const mongoose = require('mongoose');
const watchHistories = require('../module/history.module'); // Import watch history model
const movies = require('../module/movie.module'); // Import movie model

// Get watch history for a specific user
const getWatchHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Fetch watch history for the user
    const userWatchHistory = await watchHistories
      .find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ lastWatched: -1 }); // Sort by most recent first

    if (!userWatchHistory || userWatchHistory.length === 0) {
      return res.status(200).json([]); // Return empty array if no history
    }

    // Enrich watch history with movie details
    const watchHistoryWithMovies = await Promise.all(
      userWatchHistory.map(async (entry) => {
        const movie = await movies.findOne({ _id: entry.movieId });
        return {
          movieId: entry.movieId.toString(),
          userId: entry.userId.toString(),
          videoUrl: movie?.video_url || "https://example.com/video.mp4",
          title: movie?.title || "Unknown Movie",
          progress: entry.progress || 0,
          lastWatched: entry.lastWatched.toISOString(),
          image: movie?.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/350x500",
          genre: movie?.genre_ids?.join(", ") || "Unknown Genre",
          rating: movie?.vote_average || 0,
        };
      })
    );

    res.status(200).json(watchHistoryWithMovies);
  } catch (err) {
    console.error("Error fetching watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add a new watch history entry
const addWatchHistory = async (req, res) => {
  try {
    const { userId, movieId, progress } = req.body;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid user ID or movie ID format" });
    }
    if (typeof progress !== 'number' || progress < 0 || progress > 1) {
      return res.status(400).json({ message: "Progress must be a number between 0 and 1" });
    }

    // Check if movie exists
    const movie = await movies.findOne({ _id: new mongoose.Types.ObjectId(movieId) });
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Check if entry already exists
    const existingEntry = await watchHistories.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      movieId: new mongoose.Types.ObjectId(movieId),
    });

    if (existingEntry) {
      // Update existing entry
      existingEntry.progress = progress;
      existingEntry.lastWatched = new Date();
      await existingEntry.save();
      return res.status(200).json({ message: "Watch history updated", entry: existingEntry });
    }

    // Create new entry
    const newEntry = new watchHistories({
      userId: new mongoose.Types.ObjectId(userId),
      movieId: new mongoose.Types.ObjectId(movieId),
      progress,
      lastWatched: new Date(),
    });
    await newEntry.save();

    res.status(201).json({ message: "Watch history added", entry: newEntry });
  } catch (err) {
    console.error("Error adding watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update watch history progress
const updateWatchHistory = async (req, res) => {
  try {
    const { userId, movieId, progress } = req.body;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid user ID or movie ID format" });
    }
    if (typeof progress !== 'number' || progress < 0 || progress > 1) {
      return res.status(400).json({ message: "Progress must be a number between 0 and 1" });
    }

    // Find and update the entry
    const updatedEntry = await watchHistories.findOneAndUpdate(
      {
        userId: new mongoose.Types.ObjectId(userId),
        movieId: new mongoose.Types.ObjectId(movieId),
      },
      { progress, lastWatched: new Date() },
      { new: true } // Return the updated document
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Watch history entry not found" });
    }

    res.status(200).json({ message: "Watch history updated", entry: updatedEntry });
  } catch (err) {
    console.error("Error updating watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete a watch history entry
const deleteWatchHistory = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({ message: "Invalid user ID or movie ID format" });
    }

    // Delete the entry
    const result = await watchHistories.findOneAndDelete({
      userId: new mongoose.Types.ObjectId(userId),
      movieId: new mongoose.Types.ObjectId(movieId),
    });

    if (!result) {
      return res.status(404).json({ message: "Watch history entry not found" });
    }

    res.status(200).json({ message: "Watch history entry deleted" });
  } catch (err) {
    console.error("Error deleting watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getWatchHistory,
  addWatchHistory,
  updateWatchHistory,
  deleteWatchHistory,
};