const express = require('express');
const Content = require('../models/Content');
const { protect, adminOnly } = require('../middleware/auth');
const router = express.Router();

// Get all content with filters
router.get('/', async (req, res) => {
  try {
    const { type, category, genre, search, featured, limit = 50, page = 1 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (genre) query.genre = { $in: [genre] };
    if (featured) query.featured = true;
    if (search) query.$text = { $search: search };
    const skip = (page - 1) * limit;
    const content = await Content.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    const total = await Content.countDocuments(query);
    res.json({ content, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single content
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });
    await Content.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json(content);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create content (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const content = await Content.create(req.body);
    res.status(201).json(content);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update content (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(content);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete content (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users (Admin)
router.get('/admin/users', protect, adminOnly, async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
