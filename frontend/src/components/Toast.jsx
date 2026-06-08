import { useAuth } from '../context/AuthContext.jsx'

export default function Toast() {
  const { toast } = useAuth()
  if (!toast) return null
  const icons = { success: '✅', error: '❌', info: 'ℹ️' }
  return (
    <div className="toast-container">
      <div className={`toast ${toast.type || 'success'}`}>
        <span className="toast-icon">{icons[toast.type] || '✅'}</span>
        <span className="toast-msg">{toast.message}</span>
      </div>
    </div>
  )
}
