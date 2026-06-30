import { createPortal } from 'react-dom'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Languages } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { passoFromPath, pathFromPasso } from '../lib/routes.js'

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

const LABELS = { pt: 'PT', en: 'EN', es: 'ES', it: 'IT', de: 'DE' }
const TITLES = {
  pt: '🇵🇹 Português',
  en: '🇬🇧 English',
  es: '🇪🇸 Español',
  it: '🇮🇹 Italiano',
  de: '🇩🇪 Deutsch',
}
const LANG_ORDER = ['pt', 'en', 'es', 'it', 'de']

function SwitcherButtons({ lang, setLang, size = 'fixed' }) {
  const [open, setOpen] = useState(false)
  const compact = size === 'compact'
  const inline = size === 'inline'
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

  const item = (code, title) => {
    const active = lang === code
    return (
      <button
        type="button"
        title={title}
        onClick={() => changeLang(code)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '6px 8px',
          borderRadius: 6,
          border: `1px solid ${active ? CORES.dourado : CORES.vidroBorda}`,
          background: active ? 'rgba(223,183,108,0.18)' : 'rgba(255,255,255,0.04)',
          color: active ? CORES.dourado : CORES.brancoMuted,
          fontSize: 11,
          fontWeight: active ? 700 : 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          lineHeight: 1,
          letterSpacing: '0.04em',
          gap: 8,
        }}
      >
        <span>{title}</span>
        <span>{LABELS[code]}</span>
      </button>
    )
  }

  return (
    <div
      className={undefined}
      style={{
        display: 'flex',
        gap: compact ? 2 : 4,
        padding: compact ? 2 : 3,
        borderRadius: compact ? 6 : 8,
        background: compact ? 'transparent' : 'rgba(11,7,30,0.94)',
        backdropFilter: compact ? 'none' : 'blur(8px)',
        WebkitBackdropFilter: compact ? 'none' : 'blur(8px)',
        border: compact ? 'none' : `1px solid ${CORES.vidroBorda}`,
        boxShadow: compact ? 'none' : '0 2px 12px rgba(0,0,0,0.45)',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <button
        type="button"
        title="Change language"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: compact ? 2 : 5,
          padding: compact ? '2px 6px' : inline ? '3px 8px' : '3px 8px',
          borderRadius: compact ? 4 : 6,
          border: `1px solid ${CORES.vidroBorda}`,
          background: 'rgba(255,255,255,0.04)',
          color: CORES.dourado,
          fontSize: compact ? 8 : 10,
          fontWeight: 700,
          cursor: 'pointer',
          lineHeight: 1,
          letterSpacing: '0.04em',
          minWidth: compact ? 42 : 52,
        }}
      >
        <Languages size={compact ? 12 : 13} />
        {!compact && <span>{lang.toUpperCase()} ▾</span>}
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: compact ? 28 : 34,
            right: 0,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            padding: 6,
            borderRadius: 8,
            background: 'rgba(11,7,30,0.98)',
            border: `1px solid ${CORES.vidroBorda}`,
            boxShadow: '0 10px 28px rgba(0,0,0,0.45)',
            zIndex: 180,
          }}
        >
          {LANG_ORDER.map((code) => item(code, TITLES[code]))}
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
