import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter } from 'react-router' ;
import { AuthProvider } from './components/auth/AuthProvider.jsx';
import ScrollToTop from './components/newUp/Scroll.jsx';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
          <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
