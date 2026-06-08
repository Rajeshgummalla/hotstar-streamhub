import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HeroBanner({ items = [] }) {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  const total = items.length

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total])
  const prev = () => setCurrent(c => (c - 1 + total) % total)

  useEffect(() => {
    if (total === 0) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [next, total])

  if (!items.length) return (
    <div className="hero" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="spinner" />
    </div>
  )

  const item = items[current]

  return (
    <div className="hero">
      {items.map((slide, i) => (
        <div
          key={slide._id}
          className={`hero__slide ${i === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.backdrop})` }}
        />
      ))}
      <div className="hero__overlay" />

      <div className="hero__content">
        <div className="hero__badge">
          {item.isLive
            ? <><span className="hero__badge-dot" />LIVE NOW</>
            : item.isPremium
              ? <>⭐ PREMIUM</>
              : <>✅ FREE</>
          }
        </div>

        <h1 className="hero__title">{item.title}</h1>

        <div className="hero__meta">
          <span className="hero__rating">⭐ {item.rating}</span>
          <span className="hero__meta-item">📅 {item.year}</span>
          {item.duration && <span className="hero__meta-item">⏱ {item.duration}</span>}
          <span className="hero__meta-item" style={{background:'var(--bg-glass)',padding:'3px 10px',borderRadius:'50px',border:'1px solid var(--border-glass)',fontSize:'0.75rem'}}>
            {Array.isArray(item.genre) ? item.genre[0] : item.genre}
          </span>
        </div>

        <p className="hero__desc">{item.description}</p>

        <div className="hero__actions">
          <button className="btn-play" onClick={() => navigate(`/watch/${item._id}`)}>
            ▶ Play Now
          </button>
          <button className="btn-more" onClick={() => navigate(`/detail/${item._id}`)}>
            ℹ More Info
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="hero__nav">
        {items.map((_, i) => (
          <div key={i} className={`hero__dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>

      {/* Arrows */}
      <div className="hero__arrows">
        <button className="hero__arrow" onClick={prev}>‹</button>
        <button className="hero__arrow" onClick={next}>›</button>
      </div>
    </div>
  )
}
