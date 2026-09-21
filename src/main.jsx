import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import { PaymentsProvider } from './context/PaymentsContext'
import './index.css'

// Served from a path we don't control (a static preview host), the browser
// history API can't own the URL, so fall back to hash routing there.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <PaymentsProvider>
        <App />
      </PaymentsProvider>
    </Router>
  </React.StrictMode>,
)
