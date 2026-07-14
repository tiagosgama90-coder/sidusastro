import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './lib/i18n/LanguageContext.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import './index.css'
import App from './App.jsx'

// ─── Service Worker para notificações PWA ───────────────────────────────────
if ('serviceWorker' in navigator) {
  const syncNotifPrefsComSW = () => {
    try {
      const raw = localStorage.getItem('sidus_notif_prefs')
      if (!raw) return
      const prefs = JSON.parse(raw)
      if (!prefs?.ativo) return
      const payload = { type: 'SET_LOCAL_TIMER', enabled: true, signo: prefs.signo, lang: prefs.lang || 'pt' }
      const sw = navigator.serviceWorker.controller
      if (sw) sw.postMessage(payload)
    } catch { /* ignore */ }
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.info('[Sidus] Service Worker registado ✓', reg.scope)
      syncNotifPrefsComSW()
    }).catch((err) => {
      console.warn('[Sidus] Service Worker falhou ao registar:', err)
    })
  })

  navigator.serviceWorker.addEventListener('controllerchange', syncNotifPrefsComSW)
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
