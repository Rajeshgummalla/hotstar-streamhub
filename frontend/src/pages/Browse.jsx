import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ContentCard from '../components/ContentCard.jsx'
import { useContent } from '../context/ContentContext.jsx'
import Footer from '../components/Footer.jsx'

const BROWSE_CONFIG = {
  movies: { title: 'Movies', emoji: '🎬', type: 'movie', genres: ['Action','Comedy','Drama','Romance','Sci-Fi','Animation','Horror','Thriller'] },
  shows: { title: 'TV Shows', emoji: '📺', type: 'show', genres: ['Drama','Comedy','Crime','Fantasy','Sci-Fi','Reality','Documentary'] },
  sports: { title: 'Live Sports', emoji: '🏆', type: 'sport', genres: ['Cricket','Football','Tennis','Basketball','Formula 1','Kabaddi'] },
  trending: { title: 'Trending Now', emoji: '🔥', type: null, genres: [] },
  watchlist: { title: 'My List', emoji: '❤️', type: null, genres: [] },
}

export default function Browse() {
  const { type } = useParams()
  const navigate = useNavigate()
  const { watchlist, fetchWatchlist } = useContent()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState('All')
  const config = BROWSE_CONFIG[type] || BROWSE_CONFIG.movies

  useEffect(() => {
    setLoading(true)
    setActiveGenre('All')
    if (type === 'watchlist') {
      fetchWatchlist().then(() => setLoading(false))
    } else {
      const params = {}
      if (config.type) params.type = config.type
      if (type === 'trending') params.category = 'trending'
      params.limit = 50
      axios.get('/api/content', { params })
        .then(r => setItems(r.data.content))
        .finally(() => setLoading(false))
    }
  }, [type])

  const displayItems = type === 'watchlist' ? watchlist : items
  const filtered = activeGenre === 'All'
    ? displayItems
    : displayItems.filter(i => (Array.isArray(i.genre) ? i.genre : [i.genre]).includes(activeGenre))

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1 className="browse-title">{config.emoji} {config.title}</h1>
        <p className="browse-subtitle">
          {filtered.length} title{filtered.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {config.genres.length > 0 && (
        <div className="browse-filters">
          {['All', ...config.genres].map(g => (
            <button
              key={g}
              className={`filter-btn ${activeGenre === g ? 'active' : ''}`}
              onClick={() => setActiveGenre(g)}
            >{g}</button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎭</div>
          <h3 style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>
            {type === 'watchlist' ? 'Your list is empty' : 'No content found'}
          </h3>
          <p style={{ fontSize: '0.875rem' }}>
            {type === 'watchlist' ? 'Add movies and shows to watch later' : 'Try a different filter'}
          </p>
          {type === 'watchlist' && (
            <button className="btn-primary" style={{ width: 'auto', marginTop: '20px', padding: '12px 28px' }} onClick={() => navigate('/')}>
              Browse Content
            </button>
          )}
        </div>
      ) : (
        <div className="browse-grid">
          {filtered.map(item => (
            <ContentCard key={item._id} item={item} wide />
          ))}
        </div>
      )}
      <Footer />
    </div>
  )
}
