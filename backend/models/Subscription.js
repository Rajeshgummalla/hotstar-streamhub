const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, enum: ['super', 'premium'], required: true },
  price: Number,
  currency: { type: String, default: 'INR' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
  paymentMethod: { type: String, default: 'card' },
  transactionId: String
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
