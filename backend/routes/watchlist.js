const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// Get watchlist
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('watchlist');
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle watchlist
router.post('/toggle/:contentId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { contentId } = req.params;
    const idx = user.watchlist.indexOf(contentId);
    if (idx > -1) {
      user.watchlist.splice(idx, 1);
      await user.save();
      return res.json({ added: false, message: 'Removed from watchlist' });
    }
    user.watchlist.push(contentId);
    await user.save();
    res.json({ added: true, message: 'Added to watchlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Save watch progress
router.post('/history/:contentId', protect, async (req, res) => {
  try {
    const { progress } = req.body;
    const user = await User.findById(req.user._id);
    const existing = user.watchHistory.find(h => h.content.toString() === req.params.contentId);
    if (existing) {
      existing.progress = progress;
      existing.watchedAt = new Date();
    } else {
      user.watchHistory.push({ content: req.params.contentId, progress });
    }
    await user.save();
    res.json({ message: 'Progress saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
