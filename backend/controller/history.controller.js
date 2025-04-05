const mongoose = require('mongoose');
const watchHistories = require('../module/history.module'); // Import watch history model

// Get all watch histories
const getAllWatchHistories = async (req, res) => {
  try {
    const watch = await watchHistories.find();
    res.status(200).json(watch);
  } catch (err) {
    console.error("Error getting watch histories:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get watch history for a specific user by email
const getWatchHistory = async (req, res) => {
  try {
    const { email } = req.params; // Assuming email is passed as a route parameter
    const watchHistory = await watchHistories.find({ email });
    res.status(200).json(watchHistory);
  } catch (err) {
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
  } catch (err) {
    console.error("Error adding watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update watch history
const updateWatchHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body; // Assuming progress is the only field to update
    const updatedHistory = await watchHistories.findByIdAndUpdate(
      id,
      { progress, lastWatched: Date.now() }, // Update progress and lastWatched timestamp
      { new: true } // Return the updated document
    );
    if (!updatedHistory) {
      return res.status(404).json({ message: "Watch history not found" });
    }
    res.status(200).json(updatedHistory);
  } catch (err) {
    console.error("Error updating watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete watch history
const deleteWatchHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHistory = await watchHistories.findByIdAndDelete(id);
    if (!deletedHistory) {
      return res.status(404).json({ message: "Watch history not found" });
    }
    res.status(200).json({ message: "Watch history deleted" });
  } catch (err) {
    console.error("Error deleting watch history:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllWatchHistories,
  getWatchHistory,
  addWatchHistory,
  updateWatchHistory,
  deleteWatchHistory,
};