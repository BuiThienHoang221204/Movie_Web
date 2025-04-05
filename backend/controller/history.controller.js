const mongoose = require('mongoose');
const watchHistories = require('../module/history.module'); // Import watch history model

// Get all
const getAllWatchHistories = async (req, res) => {
  try {
    const watch = await watchHistories.find();
    res.status(200).json(watch);
  }
  catch (err) {
    console.error("Error getting watch histories:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get watch history for a specific user
const getWatchHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const watchHistory = await watchHistories.find({ userId: userId });
    console.log(watchHistory);
    res.status(200).json(watchHistory);
  }
  catch (err) {
    console.error("Error getting watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Add a new watch history
const addWatchHistory = async (req, res) => {
  try {
    const { email, movieId, progress } = req.body;
    const newWatchHistory = new watchHistories({ email, movieId, progress });
    await newWatchHistory.save();
    res.status(201).json(newWatchHistory);
  }
  catch (err) {
    console.error("Error adding watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update watch history
const updateWatchHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    await watchHistories.findByIdAndUpdate(id, { progress });
    res.status(200).json({ message: "Watch history updated" });
  }
  catch (err) {
    console.error("Error updating watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Delete watch history
const deleteWatchHistory = async (req, res) => {
  try {
    const { id } = req.params;
    await watchHistories.findByIdAndDelete(id);
    res.status(200).json({ message: "Watch history deleted" });
  }
  catch (err) {
    console.error("Error deleting watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getWatchHistory,
  addWatchHistory,
  updateWatchHistory,
  deleteWatchHistory,
  getAllWatchHistories
};