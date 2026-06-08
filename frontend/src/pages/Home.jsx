import { useEffect, useState } from 'react'
import { useContent } from '../context/ContentContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import ContentRow from '../components/ContentRow.jsx'
import Footer from '../components/Footer.jsx'
import { Link } from 'react-router-dom'
import axios from 'axios'

export default function Home() {
  const { fetchFeatured, fetchContent } = useContent()
  const { user } = useAuth()
  const [featured, setFeatured] = useState([])
  const [trending, setTrending] = useState([])
  const [movies, setMovies] = useState([])
  const [shows, setShows] = useState([])
  const [sports, setSports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [feat, trend, mov, sh, sp] = await Promise.all([
          axios.get('/api/content', { params: { featured: true, limit: 5 } }),
          axios.get('/api/content', { params: { category: 'trending', limit: 10 } }),
          axios.get('/api/content', { params: { category: 'popular-movies', limit: 10 } }),
          axios.get('/api/content', { params: { category: 'must-watch-shows', limit: 10 } }),
          axios.get('/api/content', { params: { category: 'live-sports', limit: 10 } }),
        ])
        setFeatured(feat.data.content)
        setTrending(trend.data.content)
        setMovies(mov.data.content)
        setShows(sh.data.content)
        setSports(sp.data.content)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-logo">Disney+ Hotstar</div>
      <div className="loading-bar"><div className="loading-bar-fill" /></div>
    </div>
  )

  return (
    <div className="home">
      <HeroBanner items={featured} />

      {/* Premium Banner */}
      {!user?.subscription?.isActive && (
        <div style={{
          margin: '0 60px 10px',
          background: 'linear-gradient(135deg, rgba(123,47,247,0.15), rgba(245,166,35,0.15))',
          border: '1px solid rgba(245,166,35,0.3)',
          borderRadius: 'var(--radius-lg)', padding: '20px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px'
        }}>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 800, marginBottom: '4px' }}>
              ⭐ Unlock Premium Content
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Subscribe to watch exclusive movies, shows and live sports — ad-free.
            </div>
          </div>
          <Link to="/subscribe" className="btn-subscribe" style={{ textDecoration: 'none' }}>
            Subscribe Now
          </Link>
        </div>
      )}

      <ContentRow title="Trending Now" items={trending} browseLink="/browse/trending" emoji="🔥" />
      <ContentRow title="Popular Movies" items={movies} browseLink="/browse/movies" emoji="🎬" />
      <ContentRow title="Must-Watch Shows" items={shows} browseLink="/browse/shows" emoji="📺" />

      {/* Sports Banner */}
      <div style={{ margin: '20px 60px', position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0a1628, #1a3a6b)',
          border: '1px solid rgba(26,111,255,0.2)',
          padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--hotstar-live)', marginBottom: '8px', letterSpacing: '0.1em' }}>🔴 LIVE SPORTS</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}>Watch Live Cricket, Football & more</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Stream ICC World Cup, Premier League, Wimbledon and more — LIVE</div>
          </div>
          <Link to="/browse/sports" style={{
            padding: '12px 28px', borderRadius: '50px',
            background: 'var(--hotstar-live)', color: '#fff',
            fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', whiteSpace: 'nowrap',
            boxShadow: '0 0 24px rgba(255,59,59,0.4)'
          }}>Watch Live →</Link>
        </div>
      </div>

      <ContentRow title="Live Sports" items={sports} browseLink="/browse/sports" emoji="🏆" />

      {/* Why Subscribe */}
      {!user?.subscription?.isActive && (
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2rem', fontWeight: 800, marginBottom: '12px', background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Why Subscribe?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
            Enjoy unlimited entertainment with a Disney+ Hotstar subscription
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '900px', margin: '0 auto 36px' }}>
            {[
              { icon: '🎬', title: 'Unlimited Movies', desc: 'Hollywood, Bollywood & more in HD' },
              { icon: '📺', title: 'Binge-Worthy Shows', desc: 'Marvel, Disney, Star originals' },
              { icon: '🏏', title: 'Live Sports', desc: 'Cricket, Football, Tennis & more' },
              { icon: '📱', title: 'Watch Anywhere', desc: 'TV, mobile, tablet, laptop' },
            ].map(f => (
              <div key={f.title} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)', padding: '24px', transition: 'var(--transition)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>{f.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <Link to="/subscribe" className="btn-subscribe" style={{ textDecoration: 'none', padding: '14px 40px', fontSize: '1rem' }}>
            Get Started — ₹299/month
          </Link>
        </div>
      )}

      <Footer />
    </div>
  )
}
