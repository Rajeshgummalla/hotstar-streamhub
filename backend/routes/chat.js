const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// Simulated AI Bot Logic
async function generateBotResponse(message) {
  const lowerMsg = message.toLowerCase();
  
  // Greeting
  if (lowerMsg.match(/\b(hi|hello|hey|greetings)\b/)) {
    return "Hi there! 👋 I'm the Hotstar AI assistant. I can help you find movies, understand subscriptions, or answer support questions. How can I help you today?";
  }

  // Subscription questions
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('subscribe') || lowerMsg.includes('plan')) {
    return "We offer two great plans:\n⭐ **Super Plan**: ₹299/month (Full HD, 2 screens)\n⭐ **Premium Plan**: ₹1499/year (4K UHD, 4 screens, Ad-free sports).\n\nYou can upgrade anytime from the '/subscribe' page!";
  }

  // Cancellation
  if (lowerMsg.includes('cancel')) {
    return "You can cancel your subscription anytime by navigating to the **Account** page and clicking 'Cancel Subscription'. You will retain access until the end of your billing cycle.";
  }

  // Content Recommendations (Dynamic)
  if (lowerMsg.includes('recommend') || lowerMsg.includes('suggest') || lowerMsg.includes('watch')) {
    try {
      const topContent = await Content.find({ isPremium: true }).sort({ rating: -1 }).limit(3);
      let response = "Here are some top-rated premium picks for you! 🍿\n\n";
      topContent.forEach(item => {
        response += `🎬 **${item.title}** (⭐ ${item.rating}) - ${item.genre.join(', ')}\n`;
      });
      return response;
    } catch (e) {
      return "I recommend checking out our 'Trending Now' row on the home page!";
    }
  }

  // Sports
  if (lowerMsg.includes('sport') || lowerMsg.includes('cricket') || lowerMsg.includes('football')) {
    return "We have extensive live sports coverage including the ICC T20 World Cup, Premier League, and Wimbledon! Head over to the **Live Sports** tab to see what's streaming right now. 🏆";
  }

  // Password / Login issues
  if (lowerMsg.includes('password') || lowerMsg.includes('login')) {
    return "If you're having trouble logging in, please ensure you are using the correct email. As this is a demo, you can always create a new account via the Register page if you forget your password!";
  }

  // Default catch-all
  return "I'm not exactly sure how to answer that, but I'm learning every day! Try asking me for movie recommendations, subscription prices, or how to cancel your plan. 🤖";
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simulate network delay to feel like "thinking"
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reply = await generateBotResponse(message);
    res.json({ reply });

  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Chatbot encountered an error' });
  }
});

module.exports = router;
