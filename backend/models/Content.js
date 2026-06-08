const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['movie', 'show', 'sport', 'original'], required: true },
  category: { type: String, required: true },
  genre: [{ type: String }],
  year: Number,
  duration: String,
  rating: String,
  description: String,
  poster: String,
  backdrop: String,
  videoUrl: String,
  trailerUrl: String,
  isPremium: { type: Boolean, default: false },
  isLive: { type: Boolean, default: false },
  language: { type: String, default: 'English' },
  cast: [{ name: String, role: String, image: String }],
  director: String,
  tags: [String],
  views: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

contentSchema.index({ title: 'text', description: 'text', genre: 'text' });

module.exports = mongoose.model('Content', contentSchema);
