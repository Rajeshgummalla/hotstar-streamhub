const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const watchlistRoutes = require('./routes/watchlist');
const subscriptionRoutes = require('./routes/subscription');
const chatRoutes = require('./routes/chat');

const app = express();

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/chat', chatRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Hotstar API running 🎬' }));

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    let mongoUri = process.env.MONGO_URI;

    // If no real Atlas URI, use in-memory MongoDB for instant demo
    if (!mongoUri || mongoUri.includes('hotstarDemo')) {
      console.log('🔧 Starting MongoDB Memory Server for demo...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      console.log('✅ In-memory MongoDB started');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected');

    // Auto-seed with demo data
    const Content = require('./models/Content');
    const User = require('./models/User');
    const count = await Content.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding demo data...');
      await seedData();
      console.log('✅ Demo data seeded!');
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Hotstar API: http://localhost:${PORT}`);
      console.log(`📺 Frontend:    http://localhost:5173\n`);
    });
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}

async function seedData() {
  const Content = require('./models/Content');
  const User = require('./models/User');

  const contents = [
    {
      title: 'House of the Dragon', type: 'show', category: 'trending', genre: ['Fantasy', 'Drama'],
      year: 2024, duration: '2 Seasons', rating: '9.0', isPremium: true, featured: true, language: 'English',
      description: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.',
      poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      cast: [{ name: 'Paddy Considine', role: 'King Viserys I' }, { name: 'Matt Smith', role: 'Daemon Targaryen' }]
    },
    {
      title: 'Shōgun', type: 'show', category: 'trending', genre: ['Drama', 'History', 'War'],
      year: 2024, duration: '1 Season', rating: '9.2', isPremium: true, featured: true, language: 'English',
      description: 'When a mysterious English ship is found marooned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets that could tip the scales of power.',
      poster: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      cast: [{ name: 'Hiroyuki Sanada', role: 'Yoshii Toranaga' }]
    },
    {
      title: 'Loki', type: 'show', category: 'trending', genre: ['Action', 'Sci-Fi', 'Fantasy'],
      year: 2023, duration: '2 Seasons', rating: '8.7', isPremium: true, featured: true, language: 'English',
      description: 'The mercurial villain Loki resumes his role as the God of Mischief in a new series after the events of Avengers: Endgame.',
      poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      title: 'Avengers: Endgame', type: 'movie', category: 'popular-movies', genre: ['Action', 'Adventure', 'Sci-Fi'],
      year: 2019, duration: '3h 2m', rating: '8.4', isPremium: true, featured: true, language: 'English',
      description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. The Avengers assemble once more to reverse Thanos\'s actions.',
      poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      director: 'Anthony & Joe Russo'
    },
    {
      title: 'The Lion King', type: 'movie', category: 'popular-movies', genre: ['Animation', 'Family', 'Drama'],
      year: 1994, duration: '1h 28m', rating: '8.5', isPremium: false, featured: false, language: 'English',
      description: 'Lion prince Simba and his father are targeted by his bitter uncle Scar, who wants to ascend the throne himself.',
      poster: 'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      director: 'Roger Allers, Rob Minkoff'
    },
    {
      title: 'Avatar: The Way of Water', type: 'movie', category: 'popular-movies', genre: ['Sci-Fi', 'Adventure'],
      year: 2022, duration: '3h 12m', rating: '7.6', isPremium: true, featured: false, language: 'English',
      description: 'Jake Sully lives with his newfound family on Pandora. A familiar threat returns to finish what was previously started.',
      poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      director: 'James Cameron'
    },
    {
      title: 'Toy Story 4', type: 'movie', category: 'popular-movies', genre: ['Animation', 'Comedy', 'Family'],
      year: 2019, duration: '1h 40m', rating: '7.7', isPremium: false, featured: false, language: 'English',
      description: 'When a new toy called Forky joins Woody and the gang, a road trip reveals how big the world can be for a toy.',
      poster: 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
    },
    {
      title: 'Black Panther: Wakanda Forever', type: 'movie', category: 'popular-movies', genre: ['Action', 'Sci-Fi', 'Drama'],
      year: 2022, duration: '2h 41m', rating: '7.3', isPremium: true, featured: false, language: 'English',
      description: 'The people of Wakanda fight to protect their home from intervening world powers as they mourn the death of King T\'Challa.',
      poster: 'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      title: 'The Mandalorian', type: 'show', category: 'must-watch-shows', genre: ['Sci-Fi', 'Action', 'Adventure'],
      year: 2019, duration: '3 Seasons', rating: '8.7', isPremium: true, featured: false, language: 'English',
      description: 'The travels of a lone bounty hunter in the outer reaches of the galaxy, far from the authority of the New Republic.',
      poster: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4'
    },
    {
      title: 'Modern Family', type: 'show', category: 'must-watch-shows', genre: ['Comedy', 'Romance', 'Family'],
      year: 2009, duration: '11 Seasons', rating: '8.5', isPremium: false, featured: false, language: 'English',
      description: 'Three different but related families face trials and tribulations in their own uniquely hilarious ways.',
      poster: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    {
      title: 'Grey\'s Anatomy', type: 'show', category: 'must-watch-shows', genre: ['Drama', 'Romance', 'Medical'],
      year: 2005, duration: '20 Seasons', rating: '7.6', isPremium: true, featured: false, language: 'English',
      description: 'A drama centered on the personal and professional lives of five surgical interns and their supervisors.',
      poster: 'https://images.unsplash.com/photo-1584515901387-a7f11b22974e?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
    },
    {
      title: 'The Bear', type: 'show', category: 'must-watch-shows', genre: ['Drama', 'Comedy'],
      year: 2022, duration: '3 Seasons', rating: '8.9', isPremium: true, featured: true, language: 'English',
      description: 'A young chef from the fine dining world comes home to run his family\'s sandwich shop in Chicago.',
      poster: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      title: 'ICC T20 World Cup: IND vs PAK', type: 'sport', category: 'live-sports', genre: ['Cricket', 'T20'],
      year: 2026, duration: 'LIVE NOW', rating: 'LIVE', isPremium: false, isLive: true, language: 'Hindi',
      description: 'The ultimate clash in cricket — India takes on Pakistan live in the ICC T20 World Cup group stage.',
      poster: 'https://images.unsplash.com/photo-1540747737956-37872ba68c5a?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4'
    },
    {
      title: 'Premier League: Chelsea vs Arsenal', type: 'sport', category: 'live-sports', genre: ['Football', 'Soccer'],
      year: 2026, duration: 'LIVE NOW', rating: 'LIVE', isPremium: true, isLive: true, language: 'English',
      description: 'London Derby at Stamford Bridge — Chelsea host rivals Arsenal in a vital Premier League encounter.',
      poster: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    },
    {
      title: 'Wimbledon Men\'s Singles Final', type: 'sport', category: 'live-sports', genre: ['Tennis', 'Grand Slam'],
      year: 2025, duration: '3h 45m', rating: '9.1', isPremium: true, featured: false, language: 'English',
      description: 'Relive the historic men\'s singles final at the All England Club with intense rallies and premium tennis.',
      poster: 'https://images.unsplash.com/photo-1592709823125-a191f07a2a5e?w=400&q=80',
      backdrop: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=1600&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  ];

  await Content.insertMany(contents);

  await User.create({
    name: 'Admin User',
    email: 'admin@hotstar.com',
    password: 'Admin@123',
    isAdmin: true,
    subscription: { plan: 'premium', isActive: true, startDate: new Date(), endDate: new Date(Date.now() + 365*24*60*60*1000) }
  });

  await User.create({
    name: 'Demo User',
    email: 'demo@hotstar.com',
    password: 'Demo@123',
    subscription: { plan: 'free', isActive: false }
  });
}

startServer();
