import { useState, useEffect } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import {
  getCookieConsent, setCookieConsent, applyAdConsentToGoogle, allowsAnalytics,
} from '../lib/cookieConsent.js'
import { initAnalytics, trackPageView } from '../lib/analytics.js'

const CORES = {
  fundo: '#0B071E',
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

export function CookieConsent({ onConsentChange, onPrivacy }) {
  const { t } = useLanguage()
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    setVisivel(!getCookieConsent())
  }, [])

  const escolher = (value) => {
    setCookieConsent(value)
    applyAdConsentToGoogle()
    if (allowsAnalytics()) {
      initAnalytics()
      trackPageView()
    }
    setVisivel(false)
    onConsentChange?.(value)
  }

  if (!visivel) return null

  return (
    <div
      role="dialog"
      aria-label={t('cookies.title')}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        padding: '12px 14px max(12px, env(safe-area-inset-bottom))',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        maxWidth: 520,
        margin: '0 auto',
        pointerEvents: 'auto',
        background: 'rgba(11, 7, 30, 0.98)',
        border: `1px solid ${CORES.vidroBorda}`,
        borderRadius: 16,
        padding: '18px 20px',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: CORES.dourado, marginBottom: 8 }}>
          {t('cookies.title')}
        </div>
        <p style={{ fontSize: 12, color: CORES.brancoSuave, lineHeight: 1.65, margin: '0 0 14px' }}>
          {t('cookies.text')}{' '}
          <button
            type="button"
            onClick={onPrivacy}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: CORES.dourado, textDecoration: 'underline', fontSize: 'inherit',
            }}
          >
            {t('cookies.privacyLink')}
          </button>
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            type="button"
            onClick={() => escolher('all')}
            style={{
              width: '100%', padding: '12px 16px', border: 'none', borderRadius: 10, cursor: 'pointer',
              background: `linear-gradient(135deg, ${CORES.dourado}, #B8944F)`,
              color: CORES.fundo, fontSize: 13, fontWeight: 700,
            }}
          >
            {t('cookies.acceptAll')}
          </button>
          <button
            type="button"
            onClick={() => escolher('essential')}
            style={{
              width: '100%', padding: '11px 16px', borderRadius: 10, cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${CORES.vidroBorda}`,
              color: CORES.brancoSuave, fontSize: 12, fontWeight: 600,
            }}
          >
            {t('cookies.essentialOnly')}
          </button>
        </div>
      </div>
    </div>
  )
}
