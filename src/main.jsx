import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './lib/i18n/LanguageContext.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { captureLandingAdsAttribution } from './lib/landingAdsContext.js'
import { clearChunkReloadFlag, isChunkLoadError, reloadForStaleChunks } from './lib/lazyWithRetry.js'
import './index.css'
import App from './App.jsx'

captureLandingAdsAttribution()

if (sessionStorage.getItem('sidus_sw_reload')) {
  sessionStorage.removeItem('sidus_sw_reload')
}
clearChunkReloadFlag()

window.addEventListener('unhandledrejection', (event) => {
  if (!isChunkLoadError(event.reason)) return
  event.preventDefault()
  reloadForStaleChunks()
})

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

  const pedirReloadPorUpdateSW = () => {
    if (sessionStorage.getItem('sidus_sw_reload')) return
    sessionStorage.setItem('sidus_sw_reload', '1')
    window.location.reload()
  }

  let swUpdatePendente = false

  const activarNovoServiceWorker = (worker) => {
    if (!worker || !navigator.serviceWorker.controller) return
    swUpdatePendente = true
    worker.postMessage({ type: 'SKIP_WAITING' })
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      console.info('[Sidus] Service Worker registado ✓', reg.scope)
      syncNotifPrefsComSW()

      if (reg.waiting && navigator.serviceWorker.controller) {
        activarNovoServiceWorker(reg.waiting)
      }

      reg.addEventListener('updatefound', () => {
        const novo = reg.installing
        if (!novo) return
        novo.addEventListener('statechange', () => {
          if (novo.state === 'installed' && navigator.serviceWorker.controller) {
            activarNovoServiceWorker(novo)
          }
        })
      })

      setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000)
      reg.update().catch(() => {})
    }).catch((err) => {
      console.warn('[Sidus] Service Worker falhou ao registar:', err)
    })
  })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    syncNotifPrefsComSW()
    if (!swUpdatePendente) return
    swUpdatePendente = false
    pedirReloadPorUpdateSW()
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
