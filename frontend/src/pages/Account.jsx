import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import { useContent } from '../context/ContentContext.jsx'
import ContentCard from '../components/ContentCard.jsx'
import Footer from '../components/Footer.jsx'

export default function Account() {
  const { user, logout, refreshUser, showToast } = useAuth()
  const { watchlist, fetchWatchlist } = useContent()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchWatchlist()
    if (user) {
      setName(user.name)
    }
  }, [user])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.put('/api/auth/profile', { name })
      await refreshUser()
      showToast('Profile updated successfully ✅')
    } catch {
      showToast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelSub = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return
    setCancelling(true)
    try {
      await axios.post('/api/subscription/cancel')
      await refreshUser()
      showToast('Subscription cancelled successfully')
    } catch {
      showToast('Failed to cancel subscription', 'error')
    } finally {
      setCancelling(false)
    }
  }

  const isPremium = user?.subscription?.isActive
  const plan = user?.subscription?.plan

  const TABS = ['profile', 'subscription', 'watchlist']

  return (
    <div className="account-page">
      {/* Header */}
      <div className="account-header">
        <div className="account-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div>
          <div className="account-name">{user?.name}</div>
          <div className="account-email">{user?.email}</div>
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {isPremium
              ? <span style={{ padding: '4px 14px', borderRadius: '50px', background: 'var(--gradient-premium)', color: '#000', fontSize: '0.72rem', fontWeight: 800 }}>⭐ {plan?.toUpperCase()} MEMBER</span>
              : <span style={{ padding: '4px 14px', borderRadius: '50px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 700 }}>FREE PLAN</span>
            }
            {user?.isAdmin && <span style={{ padding: '4px 14px', borderRadius: '50px', background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.4)', color: 'var(--hotstar-gold)', fontSize: '0.72rem', fontWeight: 800 }}>⚙️ ADMIN</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '4px', width: 'fit-content', border: '1px solid var(--border-glass)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 20px', borderRadius: 'var(--radius-sm)', textTransform: 'capitalize',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', border: 'none', transition: 'var(--transition)',
            background: activeTab === t ? 'var(--hotstar-blue)' : 'transparent',
            color: activeTab === t ? '#fff' : 'var(--text-muted)'
          }}>{t === 'watchlist' ? `My List (${watchlist.length})` : t}</button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="account-grid">
          <div className="account-card">
            <h3>👤 Edit Profile</h3>
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={user?.email} disabled style={{ opacity: 0.5 }} />
              </div>
              <button className="btn-primary" type="submit" disabled={saving} style={{ marginTop: '8px' }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="account-card">
            <h3>🔐 Security</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Password</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>••••••••••••</div>
              </div>
              <div style={{ padding: '14px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Member since</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <button onClick={() => { logout(); navigate('/') }} style={{
                padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(229,9,20,0.1)',
                border: '1px solid rgba(229,9,20,0.3)', color: 'var(--hotstar-red)',
                fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', transition: 'var(--transition)'
              }}>
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div style={{ maxWidth: '600px' }}>
          <div className="account-card" style={{ marginBottom: '20px' }}>
            <h3>⭐ Subscription Status</h3>
            <div className="subscription-status">
              <span style={{ fontSize: '1.5rem' }}>{isPremium ? '⭐' : '🔓'}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{isPremium ? `${plan?.toUpperCase()} Plan` : 'Free Plan'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {isPremium ? `Active until ${new Date(user?.subscription?.endDate).toLocaleDateString('en-IN')}` : 'Limited access to content'}
                </div>
              </div>
              <span className={`sub-plan-badge ${!isPremium ? 'sub-plan-free' : ''}`}>
                {isPremium ? plan?.toUpperCase() : 'FREE'}
              </span>
            </div>
            {isPremium ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--hotstar-green)' }}>
                  ✅ You have full access to all premium content, live sports and downloads.
                </div>
                <button onClick={handleCancelSub} disabled={cancelling} style={{
                  padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(229,9,20,0.08)',
                  border: '1px solid rgba(229,9,20,0.25)', color: 'var(--hotstar-red)',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                }}>
                  {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'var(--hotstar-gold)' }}>
                  ⭐ Upgrade to unlock 4K streaming, ad-free live sports, and all premium content.
                </div>
                <Link to="/subscribe" className="btn-primary" style={{ textAlign: 'center', textDecoration: 'none' }}>
                  Upgrade to Premium
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Watchlist Tab */}
      {activeTab === 'watchlist' && (
        <div>
          {watchlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>❤️</div>
              <h3 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Your list is empty</h3>
              <p style={{ fontSize: '0.875rem', marginBottom: '20px' }}>Save movies and shows to watch them later</p>
              <Link to="/" className="btn-primary" style={{ width: 'auto', textDecoration: 'none', padding: '12px 28px', display: 'inline-block' }}>Browse Content</Link>
            </div>
          ) : (
            <div className="browse-grid">
              {watchlist.map(item => <ContentCard key={item._id} item={item} wide />)}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  )
}
