const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  subscription: {
    plan: { type: String, enum: ['free', 'super', 'premium'], default: 'free' },
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: false }
  },
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  watchHistory: [{
    content: { type: mongoose.Schema.Types.ObjectId, ref: 'Content' },
    watchedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }
  }]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
