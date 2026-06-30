import { createPortal } from 'react-dom'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { passoFromPath, pathFromPasso } from '../lib/routes.js'

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

const FLAGS = { pt: '🇵🇹', en: '🇬🇧', es: '🇪🇸', it: '🇮🇹', de: '🇩🇪' }
const LABELS = { pt: 'PT', en: 'EN', es: 'ES', it: 'IT', de: 'DE' }
const TITLES = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  de: 'Deutsch',
}
const LANG_ORDER = ['pt', 'en', 'es', 'it', 'de']

function SwitcherButtons({ lang, setLang, size = 'fixed' }) {
  const [open, setOpen] = useState(false)
  const compact = size === 'compact'
  const navigate = useNavigate()
  const location = useLocation()

  const changeLang = (code) => {
    if (code === lang) return
    setLang(code)
    const passo = passoFromPath(location.pathname)
    const newPath = pathFromPasso(passo, code)
    navigate(`${newPath}${location.search}${location.hash}`, { replace: true })
    setOpen(false)
  }

  const item = (code) => {
    const active = lang === code
    return (
      <button
        type="button"
        title={TITLES[code]}
        onClick={() => changeLang(code)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          width: '100%',
          padding: compact ? '4px 5px' : '5px 6px',
          borderRadius: 5,
          border: `1px solid ${active ? CORES.dourado : CORES.vidroBorda}`,
          background: active ? 'rgba(223,183,108,0.18)' : 'rgba(255,255,255,0.04)',
          color: active ? CORES.dourado : CORES.brancoMuted,
          fontSize: compact ? 9 : 10,
          fontWeight: active ? 700 : 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          lineHeight: 1,
          letterSpacing: '0.03em',
        }}
      >
        <span aria-hidden style={{ fontSize: compact ? 12 : 13, lineHeight: 1 }}>{FLAGS[code]}</span>
        <span>{LABELS[code]}</span>
      </button>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        padding: compact ? 0 : 2,
        borderRadius: compact ? 5 : 6,
        background: compact ? 'transparent' : 'rgba(11,7,30,0.94)',
        backdropFilter: compact ? 'none' : 'blur(8px)',
        WebkitBackdropFilter: compact ? 'none' : 'blur(8px)',
        border: compact ? 'none' : `1px solid ${CORES.vidroBorda}`,
        boxShadow: compact ? 'none' : '0 2px 10px rgba(0,0,0,0.4)',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <button
        type="button"
        title={TITLES[lang]}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          padding: compact ? '2px 5px' : '3px 6px',
          borderRadius: compact ? 4 : 5,
          border: `1px solid ${CORES.vidroBorda}`,
          background: 'rgba(255,255,255,0.04)',
          color: CORES.dourado,
          fontSize: compact ? 9 : 10,
          fontWeight: 700,
          cursor: 'pointer',
          lineHeight: 1,
          letterSpacing: '0.03em',
          minWidth: compact ? 38 : 44,
        }}
      >
        <span aria-hidden style={{ fontSize: compact ? 12 : 14, lineHeight: 1 }}>{FLAGS[lang]}</span>
        <span>{LABELS[lang]}</span>
        <span style={{ fontSize: compact ? 7 : 8, opacity: 0.75 }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: compact ? 24 : 28,
            right: 0,
            width: compact ? 58 : 64,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            padding: 4,
            borderRadius: 6,
            background: 'rgba(11,7,30,0.98)',
            border: `1px solid ${CORES.vidroBorda}`,
            boxShadow: '0 8px 22px rgba(0,0,0,0.45)',
            zIndex: 180,
          }}
        >
          {LANG_ORDER.map((code) => item(code))}
        </div>
      )}
    </div>
  )
}

/** variant=fixed: canto superior (login). variant=inline|compact: na barra ao lado do logo. */
export function LanguageSwitcher({ variant = 'fixed' }) {
  const { lang, setLang } = useLanguage()
  const size = variant === 'compact' ? 'compact' : variant === 'inline' ? 'inline' : 'fixed'
  const inner = <SwitcherButtons lang={lang} setLang={setLang} size={size} />

  if (variant === 'inline' || variant === 'compact') {
    return inner
  }

  if (variant === 'landing-bar') {
    return (
      <div className="landing-lang-bar-inner">
        {inner}
      </div>
    )
  }

  const el = (
    <div className="lang-switcher-root">
      {inner}
    </div>
  )

  if (typeof document === 'undefined') return el
  return createPortal(el, document.body)
}
