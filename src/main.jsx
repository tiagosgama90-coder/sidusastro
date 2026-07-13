import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './lib/i18n/LanguageContext.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import './index.css'
import App from './App.jsx'

// ─── Service Worker para notificações PWA ───────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.info('[Sidus] Service Worker registado ✓', reg.scope)
    }).catch((err) => {
      console.warn('[Sidus] Service Worker falhou ao registar:', err)
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
)
