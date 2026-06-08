const express = require('express');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { protect } = require('../middleware/auth');
const router = express.Router();

const PLANS = {
  super: { price: 299, duration: 30, label: 'Disney+ Hotstar Super' },
  premium: { price: 1499, duration: 365, label: 'Disney+ Hotstar Premium' }
};

// Get subscription status
router.get('/', protect, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id, status: 'active' }).sort({ createdAt: -1 });
    res.json({ subscription: sub, user: req.user.subscription });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Subscribe (simulated payment)
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { plan, cardNumber, cardName, expiry, cvv } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });
    if (!cardNumber || !cardName || !expiry || !cvv) return res.status(400).json({ message: 'Payment details required' });

    // Simulate payment processing
    await new Promise(r => setTimeout(r, 1500));

    // Random failure sim (5%)
    if (Math.random() < 0.05) return res.status(402).json({ message: 'Payment declined. Please try again.' });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + PLANS[plan].duration);

    // Cancel old subscriptions
    await Subscription.updateMany({ user: req.user._id, status: 'active' }, { status: 'cancelled' });

    const subscription = await Subscription.create({
      user: req.user._id,
      plan,
      price: PLANS[plan].price,
      endDate,
      transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    });

    await User.findByIdAndUpdate(req.user._id, {
      subscription: { plan, startDate: new Date(), endDate, isActive: true }
    });

    res.json({ success: true, subscription, message: `Successfully subscribed to ${PLANS[plan].label}!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel subscription
router.post('/cancel', protect, async (req, res) => {
  try {
    await Subscription.updateMany({ user: req.user._id, status: 'active' }, { status: 'cancelled' });
    await User.findByIdAndUpdate(req.user._id, { 'subscription.isActive': false, 'subscription.plan': 'free' });
    res.json({ message: 'Subscription cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
