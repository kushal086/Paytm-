import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { PaymentsProvider } from './context/PaymentsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PaymentsProvider>
        <App />
      </PaymentsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
