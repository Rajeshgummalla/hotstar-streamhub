import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'
import Footer from '../components/Footer.jsx'

const EMPTY_FORM = {
  title: '', type: 'movie', category: 'popular-movies', genre: '',
  year: '', duration: '', rating: '', description: '',
  poster: '', backdrop: '', videoUrl: '', language: 'English',
  isPremium: false, isLive: false, featured: false, director: ''
}

export default function Admin() {
  const { showToast } = useAuth()
  const [content, setContent] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editId, setEditId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [submitting, setSubmitting] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [c, u] = await Promise.all([
        axios.get('/api/content', { params: { limit: 100 } }),
        axios.get('/api/content/admin/users')
      ])
      setContent(c.data.content)
      setUsers(u.data)
    } catch (e) {
      showToast('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { ...form, genre: form.genre.split(',').map(g => g.trim()).filter(Boolean), year: Number(form.year) }
      if (editId) {
        await axios.put(`/api/content/${editId}`, payload)
        showToast('Content updated ✅')
      } else {
        await axios.post('/api/content', payload)
        showToast('Content added ✅')
      }
      setForm(EMPTY_FORM)
      setEditId(null)
      setShowForm(false)
      fetchAll()
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving content', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (item) => {
    setForm({ ...item, genre: Array.isArray(item.genre) ? item.genre.join(', ') : item.genre || '' })
    setEditId(item._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return
    try {
      await axios.delete(`/api/content/${id}`)
      showToast('Content deleted')
      fetchAll()
    } catch { showToast('Delete failed', 'error') }
  }

  const stats = {
    total: content.length,
    premium: content.filter(c => c.isPremium).length,
    free: content.filter(c => !c.isPremium).length,
    live: content.filter(c => c.isLive).length,
    users: users.length,
    subscribers: users.filter(u => u.subscription?.isActive).length,
  }

  const F = ({ label, field, type = 'text', opts }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {opts ? (
        <select className="form-input" value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}>
          {opts.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
        </select>
      ) : type === 'checkbox' ? (
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '8px' }}>
          <input type="checkbox" checked={form[field]} onChange={e => setForm({ ...form, [field]: e.target.checked })}
            style={{ width: '18px', height: '18px', accentColor: 'var(--hotstar-blue)' }} />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</span>
        </label>
      ) : (
        <input className="form-input" type={type} value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })} />
      )}
    </div>
  )

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Manage content, users and subscriptions</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {[
          { label: 'Total Content', value: stats.total, icon: '🎬' },
          { label: 'Premium Titles', value: stats.premium, icon: '⭐' },
          { label: 'Total Users', value: stats.users, icon: '👥' },
          { label: 'Subscribers', value: stats.subscribers, icon: '💎' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{s.icon}</div>
            <h2>{s.value}</h2>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', padding: '4px', width: 'fit-content', border: '1px solid var(--border-glass)' }}>
        {['content', 'users'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 24px', borderRadius: 'var(--radius-sm)', textTransform: 'capitalize',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', border: 'none', transition: 'var(--transition)',
            background: activeTab === t ? 'var(--hotstar-blue)' : 'transparent',
            color: activeTab === t ? '#fff' : 'var(--text-muted)'
          }}>{t === 'content' ? `Content (${stats.total})` : `Users (${stats.users})`}</button>
        ))}
      </div>

      {activeTab === 'content' && (
        <>
          {/* Add/Edit Form */}
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>{editId ? '✏️ Edit Content' : '➕ Add New Content'}</h2>
              <button onClick={() => { setShowForm(!showForm); setForm(EMPTY_FORM); setEditId(null) }}
                className="btn-add-content" style={{ marginTop: 0, background: showForm ? 'rgba(229,9,20,0.2)' : 'var(--gradient-blue)', color: showForm ? 'var(--hotstar-red)' : '#fff' }}>
                {showForm ? '✕ Cancel' : '+ Add Content'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="add-content-form">
                <div className="form-grid">
                  <F label="Title *" field="title" />
                  <F label="Type" field="type" opts={[{value:'movie',label:'Movie'},{value:'show',label:'TV Show'},{value:'sport',label:'Sport'},{value:'original',label:'Original'}]} />
                  <F label="Category" field="category" opts={[
                    {value:'trending',label:'Trending'},{value:'popular-movies',label:'Popular Movies'},
                    {value:'must-watch-shows',label:'Must-Watch Shows'},{value:'live-sports',label:'Live Sports'}
                  ]} />
                  <F label="Genre (comma separated)" field="genre" />
                  <F label="Year" field="year" type="number" />
                  <F label="Duration (e.g. 2h 15m)" field="duration" />
                  <F label="Rating (e.g. 8.5)" field="rating" />
                  <F label="Language" field="language" />
                  <F label="Director" field="director" />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    style={{ resize: 'vertical', minHeight: '80px' }} />
                </div>
                <div className="form-grid">
                  <F label="Poster URL" field="poster" />
                  <F label="Backdrop URL" field="backdrop" />
                  <F label="Video URL" field="videoUrl" />
                </div>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '8px' }}>
                  <F label="Premium" field="isPremium" type="checkbox" />
                  <F label="Live" field="isLive" type="checkbox" />
                  <F label="Featured (Hero Banner)" field="featured" type="checkbox" />
                </div>
                <button type="submit" className="btn-add-content" disabled={submitting}>
                  {submitting ? 'Saving...' : editId ? '💾 Update Content' : '➕ Add Content'}
                </button>
              </form>
            )}
          </div>

          {/* Content Table */}
          <div className="admin-section">
            <h2>📋 All Content</h2>
            {loading ? <div className="spinner" /> : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Poster</th>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Year</th>
                      <th>Rating</th>
                      <th>Access</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {content.map(item => (
                      <tr key={item._id}>
                        <td><img src={item.poster} alt={item.title} onError={e => e.target.style.display='none'} /></td>
                        <td style={{ fontWeight: 600, maxWidth: '200px' }}>{item.title}</td>
                        <td style={{ textTransform: 'capitalize' }}>{item.type}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.category}</td>
                        <td>{item.year}</td>
                        <td style={{ color: 'var(--hotstar-gold)' }}>⭐ {item.rating}</td>
                        <td>
                          <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: item.isPremium ? 'rgba(245,166,35,0.15)' : 'rgba(29,185,84,0.15)', color: item.isPremium ? 'var(--hotstar-gold)' : 'var(--hotstar-green)' }}>
                            {item.isPremium ? '⭐ Premium' : '✅ Free'}
                          </span>
                        </td>
                        <td>{item.featured ? '✅' : '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="btn-sm btn-edit" onClick={() => handleEdit(item)}>✏️ Edit</button>
                            <button className="btn-sm btn-danger" onClick={() => handleDelete(item._id, item.title)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>👥 All Users</h2>
          {loading ? <div className="spinner" /> : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Subscription</th>
                    <th>Watchlist</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: u.isAdmin ? 'rgba(245,166,35,0.15)' : 'var(--bg-glass)', color: u.isAdmin ? 'var(--hotstar-gold)' : 'var(--text-muted)' }}>
                          {u.isAdmin ? '⚙️ Admin' : 'User'}
                        </span>
                      </td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700, background: u.subscription?.isActive ? 'rgba(245,166,35,0.15)' : 'var(--bg-glass)', color: u.subscription?.isActive ? 'var(--hotstar-gold)' : 'var(--text-muted)' }}>
                          {u.subscription?.isActive ? `⭐ ${u.subscription.plan?.toUpperCase()}` : 'Free'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.watchlist?.length || 0} items</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {new Date(u.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  )
}
