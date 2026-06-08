import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'

const PLANS = [
  {
    id: 'super',
    name: 'Disney+ Hotstar Super',
    price: 299,
    period: '/month',
    color: 'var(--hotstar-blue)',
    glow: 'var(--shadow-glow-blue)',
    features: [
      'Full HD streaming (1080p)',
      'Watch on 2 screens',
      'Hindi, English & 7 more languages',
      'Live Sports (ads supported)',
      'Unlimited movies & shows',
      'Download for offline viewing',
    ],
    popular: false,
  },
  {
    id: 'premium',
    name: 'Disney+ Hotstar Premium',
    price: 1499,
    period: '/year',
    color: 'var(--hotstar-gold)',
    glow: 'var(--shadow-glow-gold)',
    features: [
      '4K Ultra HD + Dolby Atmos',
      'Watch on 4 screens simultaneously',
      'All languages supported',
      'Live Sports — completely ad-free',
      'Unlimited movies, shows & originals',
      'Download on 5 devices',
      'Early access to new releases',
      'Priority customer support',
    ],
    popular: true,
  },
]

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: ['#1a6fff','#7b2ff7','#f5a623','#1db954','#ff3b3b'][i % 5],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    size: `${Math.random() * 10 + 6}px`,
  }))
  return (
    <>
      {pieces.map(p => (
        <div key={p.id} className="confetti-piece" style={{
          left: p.left, top: '-20px', background: p.color,
          width: p.size, height: p.size, borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          animationDelay: p.delay,
        }} />
      ))}
    </>
  )
}

export default function Subscribe() {
  const { user, refreshUser, showToast } = useAuth()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('premium')
  const [step, setStep] = useState('plans') // plans | checkout | success
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [txnId, setTxnId] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
  const formatExpiry = (val) => {
    const v = val.replace(/\D/g, '')
    return v.length >= 2 ? `${v.slice(0,2)}/${v.slice(2,4)}` : v
  }

  const handleCheckout = async (e) => {
    e.preventDefault()
    setError('')
    if (card.number.replace(/\s/g,'').length < 16) { setError('Enter a valid 16-digit card number'); return }
    if (!card.name.trim()) { setError('Enter cardholder name'); return }
    if (card.expiry.length < 5) { setError('Enter valid expiry date (MM/YY)'); return }
    if (card.cvv.length < 3) { setError('Enter valid CVV'); return }

    setLoading(true)
    try {
      const res = await axios.post('/api/subscription/subscribe', {
        plan: selectedPlan,
        cardNumber: card.number,
        cardName: card.name,
        expiry: card.expiry,
        cvv: card.cvv,
      })
      setTxnId(res.data.subscription.transactionId)
      await refreshUser()
      setStep('success')
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const plan = PLANS.find(p => p.id === selectedPlan)

  if (step === 'success') return (
    <div className="subscribe-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Confetti />
      <div className="checkout-card" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
        <div className="payment-success">
          <div className="success-icon">🎉</div>
          <h2 className="success-title">You're all set!</h2>
          <p className="success-subtitle">
            Welcome to <strong>{plan?.name}</strong>!<br />
            Enjoy unlimited streaming, ad-free sports & exclusive content.
          </p>
          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Transaction ID: <strong style={{ color: 'var(--text-primary)' }}>{txnId}</strong>
          </div>
          <button className="btn-primary" onClick={() => navigate('/')}>
            🎬 Start Watching
          </button>
        </div>
      </div>
    </div>
  )

  if (step === 'checkout') return (
    <div className="subscribe-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '100px' }}>
      <div className="checkout-card">
        <button onClick={() => setStep('plans')} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          ← Back to Plans
        </button>
        <h2>Complete Payment</h2>

        {/* Order Summary */}
        <div className="checkout-summary">
          <div className="checkout-summary-row">
            <span style={{ color: 'var(--text-muted)' }}>Plan</span>
            <span style={{ fontWeight: 600 }}>{plan?.name}</span>
          </div>
          <div className="checkout-summary-row">
            <span style={{ color: 'var(--text-muted)' }}>Duration</span>
            <span>{selectedPlan === 'super' ? '1 Month' : '1 Year'}</span>
          </div>
          <div className="checkout-summary-row checkout-summary-total">
            <span>Total</span>
            <span style={{ color: plan?.color }}>₹{plan?.price}</span>
          </div>
        </div>

        {error && <div className="form-error">⚠️ {error}</div>}

        <form onSubmit={handleCheckout}>
          <div className="form-group">
            <label className="form-label">Card Number</label>
            <input className="form-input" placeholder="1234 5678 9012 3456" maxLength={19}
              value={card.number} onChange={e => setCard({ ...card, number: formatCard(e.target.value) })} />
          </div>
          <div className="form-group">
            <label className="form-label">Cardholder Name</label>
            <input className="form-input" placeholder="Name on card"
              value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} />
          </div>
          <div className="card-input-row">
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input className="form-input" placeholder="MM/YY" maxLength={5}
                value={card.expiry} onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">CVV</label>
              <input className="form-input" placeholder="•••" maxLength={4} type="password"
                value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g,'') })} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '16px 0', padding: '10px 14px', background: 'rgba(29,185,84,0.08)', border: '1px solid rgba(29,185,84,0.2)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--hotstar-green)' }}>
            🔒 Secure 256-bit SSL encrypted payment (Demo — no real charge)
          </div>

          <button className="btn-primary" type="submit" disabled={loading} style={{ background: loading ? 'var(--bg-glass)' : plan?.id === 'premium' ? 'var(--gradient-premium)' : 'var(--gradient-blue)', color: plan?.id === 'premium' ? '#000' : '#fff' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                <span style={{ width: '18px', height: '18px', border: '2px solid #fff3', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                Processing...
              </span>
            ) : `Pay ₹${plan?.price}`}
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="subscribe-page">
      <div className="subscribe-header">
        <h1>Choose Your Plan</h1>
        <p>Stream movies, shows, live sports and more. Cancel anytime.</p>
      </div>

      <div className="plans-grid">
        {PLANS.map(p => (
          <div
            key={p.id}
            className={`plan-card ${p.popular ? 'popular' : ''} ${selectedPlan === p.id ? 'selected' : ''}`}
            onClick={() => setSelectedPlan(p.id)}
            style={{ cursor: 'pointer' }}
          >
            {p.popular && <div className="plan-popular-badge">⭐ MOST POPULAR</div>}
            <div className="plan-name" style={{ color: p.color }}>{p.name}</div>
            <div className="plan-price" style={{ color: p.color }}>
              <sup>₹</sup>{p.price.toLocaleString()}
            </div>
            <div className="plan-period">{p.period} · Cancel anytime</div>
            <ul className="plan-features">
              {p.features.map(f => (
                <li key={f} className="plan-feature">
                  <span className="check">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '14px 48px', fontSize: '1rem', background: selectedPlan === 'premium' ? 'var(--gradient-premium)' : 'var(--gradient-blue)', color: selectedPlan === 'premium' ? '#000' : '#fff', boxShadow: plan?.glow }}
          onClick={() => setStep('checkout')}
        >
          Continue with {plan?.name} — ₹{plan?.price}
        </button>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '12px' }}>
          🔒 Secure payment · No hidden charges · Cancel anytime
        </p>
      </div>

      {/* Feature Comparison */}
      <div style={{ maxWidth: '700px', margin: '0 auto', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem' }}>Feature</th>
              <th style={{ padding: '16px', textAlign: 'center', color: 'var(--hotstar-blue)', fontWeight: 700 }}>Super</th>
              <th style={{ padding: '16px', textAlign: 'center', color: 'var(--hotstar-gold)', fontWeight: 700 }}>Premium</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Video Quality', 'Full HD', '4K UHD'],
              ['Simultaneous Screens', '2', '4'],
              ['Ad-Free Sports', '❌', '✅'],
              ['Offline Downloads', '✅', '✅'],
              ['Disney+ Content', '✅', '✅'],
              ['Early Access', '❌', '✅'],
            ].map(([feature, super_, premium]) => (
              <tr key={feature} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <td style={{ padding: '14px 20px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{feature}</td>
                <td style={{ padding: '14px', textAlign: 'center', fontSize: '0.875rem' }}>{super_}</td>
                <td style={{ padding: '14px', textAlign: 'center', fontSize: '0.875rem' }}>{premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
