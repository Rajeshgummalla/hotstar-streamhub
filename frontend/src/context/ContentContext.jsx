import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

const ContentContext = createContext()

export function ContentProvider({ children }) {
  const [content, setContent] = useState([])
  const [featuredContent, setFeaturedContent] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchContent = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const res = await axios.get('/api/content', { params })
      setContent(res.data.content)
      return res.data
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchFeatured = useCallback(async () => {
    const res = await axios.get('/api/content', { params: { featured: true, limit: 5 } })
    setFeaturedContent(res.data.content)
    return res.data.content
  }, [])

  const search = useCallback(async (query) => {
    if (!query.trim()) { setSearchResults([]); return }
    const res = await axios.get('/api/content', { params: { search: query, limit: 10 } })
    setSearchResults(res.data.content)
  }, [])

  const fetchWatchlist = useCallback(async () => {
    try {
      const res = await axios.get('/api/watchlist')
      setWatchlist(res.data)
    } catch {}
  }, [])

  const toggleWatchlist = useCallback(async (contentId) => {
    const res = await axios.post(`/api/watchlist/toggle/${contentId}`)
    await fetchWatchlist()
    return res.data
  }, [fetchWatchlist])

  const isInWatchlist = (contentId) => watchlist.some(w => w._id === contentId)

  return (
    <ContentContext.Provider value={{
      content, featuredContent, searchResults, watchlist,
      loading, fetchContent, fetchFeatured, search,
      fetchWatchlist, toggleWatchlist, isInWatchlist
    }}>
      {children}
    </ContentContext.Provider>
  )
}

export const useContent = () => useContext(ContentContext)
