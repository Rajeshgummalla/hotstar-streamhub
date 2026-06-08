import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useContent } from '../context/ContentContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { search, searchResults } = useContent()
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef()
  const profileRef = useRef()
  const searchTimeout = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearch(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (val) => {
    setSearchQuery(val)
    setShowSearch(true)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => search(val), 300)
  }

  const goToDetail = (id) => {
    setShowSearch(false)
    setSearchQuery('')
    navigate(`/detail/${id}`)
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const isPremium = user?.subscription?.isActive

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar__logo">
        <svg viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="url(#grad)"/>
          <path d="M12 14l8-4 8 4v8l-8 6-8-6V14z" fill="white" opacity="0.9"/>
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#1a6fff"/>
              <stop offset="50%" stopColor="#7b2ff7"/>
              <stop offset="100%" stopColor="#f5a623"/>
            </linearGradient>
          </defs>
        </svg>
        Disney+ Hotstar
      </Link>

      <div className="navbar__links">
        <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/browse/movies" className={`navbar__link ${isActive('/browse/movies') ? 'active' : ''}`}>Movies</Link>
        <Link to="/browse/shows" className={`navbar__link ${isActive('/browse/shows') ? 'active' : ''}`}>TV Shows</Link>
        <Link to="/browse/sports" className={`navbar__link ${isActive('/browse/sports') ? 'active' : ''}`}>Live Sports</Link>
        {user && <Link to="/browse/watchlist" className={`navbar__link ${isActive('/browse/watchlist') ? 'active' : ''}`}>My List</Link>}
        {user?.isAdmin && <Link to="/admin" className={`navbar__link ${isActive('/admin') ? 'active' : ''}`} style={{color:'var(--hotstar-gold)'}}>Admin</Link>}
      </div>

      <div className="navbar__right">
        {/* Search */}
        <div className="navbar__search" ref={searchRef}>
          <span className="navbar__search-icon">🔍</span>
          <input
            className="navbar__search-input"
            placeholder="Search movies, shows..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSearch(true)}
          />
          {showSearch && searchQuery && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map(item => (
                <div key={item._id} className="search-item" onClick={() => goToDetail(item._id)}>
                  <img src={item.poster} alt={item.title} onError={e => e.target.style.display='none'} />
                  <div className="search-item-info">
                    <h4>{item.title}</h4>
                    <span>{item.type} · {item.year} {item.isPremium ? '⭐ Premium' : '· Free'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showSearch && searchQuery && searchResults.length === 0 && (
            <div className="search-dropdown">
              <div className="search-item" style={{justifyContent:'center', color:'var(--text-muted)', padding: '20px'}}>No results found</div>
            </div>
          )}
        </div>

        {/* Subscribe Button */}
        {(!user || !isPremium) && (
          <Link to="/subscribe" className="btn-subscribe">
            ⭐ Subscribe
          </Link>
        )}

        {/* Auth / Profile */}
        {user ? (
          <div className="navbar__profile" ref={profileRef}>
            <div className="profile-avatar" onClick={() => setShowProfile(!showProfile)}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {showProfile && (
              <div className="profile-dropdown">
                <div style={{padding:'10px 12px 6px'}}>
                  <div style={{fontWeight:700, fontSize:'0.9rem'}}>{user.name}</div>
                  <div style={{fontSize:'0.75rem', color:'var(--text-muted)'}}>{user.email}</div>
                </div>
                <div className="profile-dropdown-divider" />
                {isPremium && <div className="profile-dropdown-item"><span>⭐</span> Premium Active <span className="profile-plan-badge">{user.subscription.plan?.toUpperCase()}</span></div>}
                <div className="profile-dropdown-item" onClick={() => { navigate('/account'); setShowProfile(false) }}>
                  <span>👤</span> My Account
                </div>
                {!isPremium && (
                  <div className="profile-dropdown-item" onClick={() => { navigate('/subscribe'); setShowProfile(false) }}>
                    <span>⭐</span> Subscribe Now
                  </div>
                )}
                <div className="profile-dropdown-divider" />
                <div className="profile-dropdown-item danger" onClick={() => { logout(); setShowProfile(false) }}>
                  <span>🚪</span> Sign Out
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" style={{padding:'9px 20px', borderRadius:'50px', border:'1px solid var(--border-glass)', fontSize:'0.875rem', fontWeight:600, transition:'var(--transition)', background:'var(--bg-glass)'}}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
