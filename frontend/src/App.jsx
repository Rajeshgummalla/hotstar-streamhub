import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Browse from './pages/Browse.jsx'
import Detail from './pages/Detail.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Subscribe from './pages/Subscribe.jsx'
import Account from './pages/Account.jsx'
import Admin from './pages/Admin.jsx'
import VideoPlayer from './components/VideoPlayer.jsx'
import Toast from './components/Toast.jsx'
import Chatbot from './components/Chatbot.jsx'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user } = useAuth()
  return user?.isAdmin ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Toast />
      <Chatbot />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/browse/:type" element={<Browse />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subscribe" element={<PrivateRoute><Subscribe /></PrivateRoute>} />
        <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/watch/:id" element={<PrivateRoute><VideoPlayer /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
