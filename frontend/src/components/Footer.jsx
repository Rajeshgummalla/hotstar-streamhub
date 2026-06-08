import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <h3>Disney+ Hotstar</h3>
          <p>India's largest premium streaming platform. Watch unlimited movies, TV shows, live sports and more.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {['📱 App Store', '🤖 Google Play', '📺 Smart TV'].map(l => (
              <span key={l} style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '50px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-secondary)', cursor: 'pointer' }}>{l}</span>
            ))}
          </div>
        </div>
        <div className="footer-col">
          <h4>Browse</h4>
          <Link to="/browse/movies">Movies</Link>
          <Link to="/browse/shows">TV Shows</Link>
          <Link to="/browse/sports">Live Sports</Link>
          <Link to="/subscribe">Subscription</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Press</a>
          <a href="#">Advertise</a>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <a href="#">Help Centre</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 Hotstar Clone. Educational project only.</span>
        <span style={{ display: 'flex', gap: '16px' }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Terms</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Sitemap</a>
        </span>
      </div>
    </footer>
  )
}
