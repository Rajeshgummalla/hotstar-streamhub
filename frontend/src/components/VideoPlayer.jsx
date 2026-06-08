import { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function VideoPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const videoRef = useRef()
  const [content, setContent] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const hideTimer = useRef()

  useEffect(() => {
    axios.get(`/api/content/${id}`).then(r => setContent(r.data)).catch(() => navigate('/'))
  }, [id, navigate])

  const resetHideTimer = () => {
    setShowControls(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setShowControls(false), 3000)
  }

  useEffect(() => { resetHideTimer(); return () => clearTimeout(hideTimer.current) }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (playing) { videoRef.current.pause() } else { videoRef.current.play() }
    setPlaying(!playing)
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    setCurrentTime(v.currentTime)
    setProgress((v.currentTime / v.duration) * 100 || 0)
  }

  const handleSeek = (e) => {
    const v = videoRef.current
    if (!v) return
    const val = Number(e.target.value)
    v.currentTime = (val / 100) * v.duration
    setProgress(val)
  }

  const handleVolume = (e) => {
    const val = Number(e.target.value)
    setVolume(val)
    if (videoRef.current) videoRef.current.volume = val
    setMuted(val === 0)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !muted
    setMuted(!muted)
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }

  const skip = (sec) => {
    if (videoRef.current) videoRef.current.currentTime += sec
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); togglePlay() }
      if (e.code === 'ArrowRight') skip(10)
      if (e.code === 'ArrowLeft') skip(-10)
      if (e.code === 'KeyF') toggleFullscreen()
      if (e.code === 'KeyM') toggleMute()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [playing, muted])

  if (!content) return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  return (
    <div className="video-player-page" onMouseMove={resetHideTimer}>
      {/* Back button */}
      {showControls && (
        <button className="video-back" onClick={() => navigate(-1)}>← Back</button>
      )}

      <div className="video-wrapper" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={content.videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
          onEnded={() => setPlaying(false)}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />

        {/* Center Play/Pause */}
        {!playing && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            background: 'rgba(0,0,0,0.6)', borderRadius: '50%',
            width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', pointerEvents: 'none'
          }}>▶</div>
        )}

        {/* Controls */}
        <div className="video-controls" style={{ opacity: showControls ? 1 : 0 }}>
          {/* Progress */}
          <div className="video-progress">
            <input
              type="range" min="0" max="100" value={progress}
              onChange={handleSeek} onClick={e => e.stopPropagation()}
              style={{ width: '100%' }}
            />
          </div>

          <div className="video-bottom-controls" onClick={e => e.stopPropagation()}>
            <button className="video-btn" onClick={togglePlay}>{playing ? '⏸' : '▶'}</button>
            <button className="video-btn" onClick={() => skip(-10)}>⏮ 10s</button>
            <button className="video-btn" onClick={() => skip(10)}>10s ⏭</button>
            <button className="video-btn" onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>
            <input
              type="range" className="volume-slider" min="0" max="1" step="0.05"
              value={muted ? 0 : volume} onChange={handleVolume}
            />
            <span className="video-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <div className="video-title" style={{ textAlign: 'center' }}>{content.title}</div>
            <button className="video-btn" onClick={toggleFullscreen}>{fullscreen ? '⤓' : '⤢'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
