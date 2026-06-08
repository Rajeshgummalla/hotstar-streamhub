import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useContent } from '../context/ContentContext.jsx'

export default function ContentCard({ item, wide = false }) {
  const navigate = useNavigate()
  const { user, showToast } = useAuth()
  const { toggleWatchlist, isInWatchlist } = useContent()

  const inList = isInWatchlist(item._id)
  const isPremiumLocked = item.isPremium && (!user?.subscription?.isActive)

  const handlePlay = (e) => {
    e.stopPropagation()
    if (isPremiumLocked) {
      showToast('Subscribe to watch premium content ⭐', 'info')
      navigate('/subscribe')
      return
    }
    navigate(`/watch/${item._id}`)
  }

  const handleWatchlist = async (e) => {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    const res = await toggleWatchlist(item._id)
    showToast(res.added ? '✅ Added to My List' : 'Removed from My List')
  }

  return (
    <div
      className={`content-card ${wide ? 'browse-card' : ''}`}
      style={wide ? { width: '100%' } : {}}
      onClick={() => navigate(`/detail/${item._id}`)}
    >
      <img
        className="content-card__img"
        src={item.poster}
        alt={item.title}
        loading="lazy"
        onError={e => { e.target.src = `https://via.placeholder.com/200x300/12122a/1a6fff?text=${encodeURIComponent(item.title)}` }}
      />

      {/* Badges */}
      {item.isPremium && (
        <div className="premium-badge">⭐ PREMIUM</div>
      )}
      {item.isLive && (
        <div className="live-badge"><span className="live-dot" /> LIVE</div>
      )}

      {/* Premium Lock */}
      {isPremiumLocked && (
        <div className="premium-lock-overlay">
          <div className="premium-lock-icon">🔒</div>
          <div className="premium-lock-text">PREMIUM</div>
        </div>
      )}

      {/* Hover Overlay */}
      <div className="content-card__overlay">
        <div className="content-card__title">{item.title}</div>
        <div className="content-card__meta">
          {item.year} · {Array.isArray(item.genre) ? item.genre[0] : item.genre}
          {item.rating && ` · ⭐ ${item.rating}`}
        </div>
        <div className="content-card__actions">
          <button className="card-btn card-btn-play" onClick={handlePlay}>▶ Play</button>
          <button className="card-btn card-btn-add" onClick={handleWatchlist}>
            {inList ? '✓' : '+'} List
          </button>
        </div>
      </div>
    </div>
  )
}
