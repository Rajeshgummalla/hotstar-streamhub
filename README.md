# 🎬 Disney+ Hotstar Clone — Full Stack

A production-grade full-stack clone of **Disney+ Hotstar** built with React + Node.js + MongoDB.

---

## 🚀 Quick Start

### Terminal 1 — Backend
```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 🔑 Demo Credentials

| Role  | Email | Password |
|-------|-------|----------|
| 👤 Demo User | demo@hotstar.com | Demo@123 |
| ⚙️ Admin | admin@hotstar.com | Admin@123 |

> **Note:** The backend uses an in-memory MongoDB — no external database setup needed! Data resets on each server restart.

---

## ✨ Features

- 🎬 **Hero Banner** — Auto-sliding carousel with featured content
- 🔍 **Live Search** — Debounced real-time search with dropdown
- 📺 **Browse Pages** — Movies, TV Shows, Sports with genre filters
- 🎞 **Detail Page** — Full metadata, cast, related content
- ▶️ **Custom Video Player** — Progress, volume, skip, fullscreen, keyboard shortcuts
- ⭐ **Subscriptions** — Super (₹299/mo) & Premium (₹1499/yr) plans
- 💳 **Simulated Checkout** — Card payment with real-time formatting + confetti success
- ❤️ **Watchlist** — Add/remove with one click
- 👤 **Account Page** — Profile editing, subscription management
- ⚙️ **Admin Dashboard** — Add/edit/delete content, manage users, view stats
- 🔐 **JWT Auth** — Login, register, refresh, protected routes

---

## 🏗 Project Structure

```
hotstar-clone/
├── backend/
│   ├── models/       (User, Content, Subscription)
│   ├── routes/       (auth, content, watchlist, subscription)
│   ├── middleware/   (JWT auth, admin guard)
│   └── server.js     (Express + auto-seed)
└── frontend/
    └── src/
        ├── components/ (Navbar, HeroBanner, ContentCard, VideoPlayer, Toast, Footer)
        ├── pages/      (Home, Browse, Detail, Login, Register, Subscribe, Account, Admin)
        ├── context/    (AuthContext, ContentContext)
        └── styles/     (index.css — full design system)
```

---

## 🛠 Tech Stack

- **Frontend:** React 18, Vite, React Router v6, Axios
- **Backend:** Node.js, Express.js, JWT, bcrypt
- **Database:** MongoDB (in-memory for demo, swap with Atlas URI in .env)
- **Styling:** Vanilla CSS with glassmorphism, gradients, animations
