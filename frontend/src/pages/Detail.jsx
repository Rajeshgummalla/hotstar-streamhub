import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import { useContent } from '../context/ContentContext.jsx'
import ContentCard from '../components/ContentCard.jsx'
import Footer from '../components/Footer.jsx'

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, showToast } = useAuth()
  const { toggleWatchlist, isInWatchlist, fetchWatchlist } = useContent()
  const [content, setContent] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [inList, setInList] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`/api/content/${id}`)
      .then(async r => {
        setContent(r.data)
        if (user) {
          await fetchWatchlist()
          setInList(isInWatchlist(id))
        }
        const related = await axios.get('/api/content', { params: { type: r.data.type, limit: 6 } })
        setRelated(related.data.content.filter(c => c._id !== id))
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { setInList(isInWatchlist(id)) }, [id, isInWatchlist])

  const handlePlay = () => {
    if (content.isPremium && !user?.subscription?.isActive) {
      showToast('Subscribe to watch premium content ⭐', 'info')
      navigate('/subscribe')
      return
    }
    navigate(`/watch/${id}`)
  }

  const handleWatchlist = async () => {
    if (!user) { navigate('/login'); return }
    const res = await toggleWatchlist(id)
    setInList(res.added)
    showToast(res.added ? '✅ Added to My List' : 'Removed from My List')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div className="spinner" />
    </div>
  )
  if (!content) return null

  const isPremiumLocked = content.isPremium && !user?.subscription?.isActive

  return (
    <div className="detail-page">
      {/* Hero */}
      <div className="detail-hero">
        <div className="detail-hero__bg" style={{ backgroundImage: `url(${content.backdrop || content.poster})` }} />
        <div className="detail-hero__overlay" />
        <div className="detail-hero__content">
          {content.isPremium && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '50px', background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.4)', color: 'var(--hotstar-gold)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '14px', width: 'fit-content' }}>
              ⭐ PREMIUM
            </div>
          )}
          {content.isLive && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '50px', background: 'rgba(255,59,59,0.15)', border: '1px solid var(--hotstar-live)', color: 'var(--hotstar-live)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '14px', width: 'fit-content' }}>
              🔴 LIVE NOW
            </div>
          )}
          <h1 className="detail-title">{content.title}</h1>
          <div className="detail-meta">
            <span className="detail-meta-badge">⭐ {content.rating}</span>
            <span className="detail-meta-badge">📅 {content.year}</span>
            {content.duration && <span className="detail-meta-badge">⏱ {content.duration}</span>}
            <span className="detail-meta-badge">🌐 {content.language}</span>
            {(Array.isArray(content.genre) ? content.genre : [content.genre]).map(g => (
              <span key={g} className="detail-meta-badge" style={{ color: 'var(--hotstar-blue)', borderColor: 'rgba(26,111,255,0.3)' }}>{g}</span>
            ))}
          </div>
          <p className="detail-desc">{content.description}</p>
          <div className="detail-actions">
            <button className="btn-play" onClick={handlePlay}>
              {isPremiumLocked ? '🔒 Subscribe to Play' : '▶ Play Now'}
            </button>
            <button className={`watchlist-btn ${inList ? 'added' : ''}`} onClick={handleWatchlist}>
              {inList ? '✓ In My List' : '+ My List'}
            </button>
            {isPremiumLocked && (
              <Link to="/subscribe" className="btn-subscribe" style={{ textDecoration: 'none' }}>⭐ Subscribe</Link>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="detail-body">
        <div>
          {/* Cast */}
          {content.cast?.length > 0 && (
            <div className="detail-cast">
              <h3>Cast</h3>
              <div className="cast-grid">
                {content.cast.map((c, i) => (
                  <div key={i} className="cast-item">
                    <div className="cast-avatar">{c.name?.charAt(0)}</div>
                    <span className="cast-name">{c.name}</span>
                    <span className="cast-role">{c.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
                More Like This
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                {related.map(item => <ContentCard key={item._id} item={item} wide />)}
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="detail-info-panel">
          <div className="detail-info-row">
            <span className="detail-info-label">Type</span>
            <span className="detail-info-value" style={{ textTransform: 'capitalize' }}>{content.type}</span>
          </div>
          {content.director && (
            <div className="detail-info-row">
              <span className="detail-info-label">Director</span>
              <span className="detail-info-value">{content.director}</span>
            </div>
          )}
          <div className="detail-info-row">
            <span className="detail-info-label">Genre</span>
            <span className="detail-info-value">{Array.isArray(content.genre) ? content.genre.join(', ') : content.genre}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">Language</span>
            <span className="detail-info-value">{content.language}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">Year</span>
            <span className="detail-info-value">{content.year}</span>
          </div>
          {content.duration && (
            <div className="detail-info-row">
              <span className="detail-info-label">Duration</span>
              <span className="detail-info-value">{content.duration}</span>
            </div>
          )}
          <div className="detail-info-row">
            <span className="detail-info-label">Rating</span>
            <span className="detail-info-value" style={{ color: 'var(--hotstar-gold)' }}>⭐ {content.rating}</span>
          </div>
          <div className="detail-info-row">
            <span className="detail-info-label">Access</span>
            <span className="detail-info-value" style={{ color: content.isPremium ? 'var(--hotstar-gold)' : 'var(--hotstar-green)' }}>
              {content.isPremium ? '⭐ Premium' : '✅ Free'}
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
