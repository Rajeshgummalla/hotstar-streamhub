import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ContentProvider } from './context/ContentContext.jsx'
import './styles/index.css'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </AuthProvider>
  </BrowserRouter>
)
