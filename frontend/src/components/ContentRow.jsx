import { Link } from 'react-router-dom'
import ContentCard from './ContentCard.jsx'

export default function ContentRow({ title, items = [], browseLink, emoji = '🎬' }) {
  if (!items.length) return null
  return (
    <section className="section">
      <div className="section__header">
        <h2 className="section__title">
          <span className="section__title-accent" />
          {emoji} {title}
        </h2>
        {browseLink && <Link to={browseLink} className="section__link">See All →</Link>}
      </div>
      <div className="content-row">
        {items.map(item => (
          <ContentCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  )
}
