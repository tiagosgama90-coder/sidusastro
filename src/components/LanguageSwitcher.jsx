import { createPortal } from 'react-dom'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { passoFromPath, pathFromPasso } from '../lib/routes.js'
import PT from 'country-flag-icons/react/3x2/PT'
import GB from 'country-flag-icons/react/3x2/GB'
import ES from 'country-flag-icons/react/3x2/ES'
import IT from 'country-flag-icons/react/3x2/IT'
import DE from 'country-flag-icons/react/3x2/DE'
import FR from 'country-flag-icons/react/3x2/FR'

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

const FLAG_COMPONENTS = { pt: PT, en: GB, es: ES, it: IT, de: DE, fr: FR }
const TITLES = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  de: 'Deutsch',
  fr: 'Français',
}
const LANG_ORDER = ['pt', 'en', 'es', 'it', 'de', 'fr']

function FlagIcon({ code, width }) {
  const Flag = FLAG_COMPONENTS[code]
  if (!Flag) return null
  return (
    <Flag
      aria-hidden
      style={{
        width,
        height: 'auto',
        display: 'block',
        borderRadius: 2,
        boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
      }}
    />
  )
}

function SwitcherButtons({ lang, setLang, size = 'fixed' }) {
  const [open, setOpen] = useState(false)
  const compact = size === 'compact'
  const flagW = compact ? 18 : 20
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
        aria-label={TITLES[code]}
        onClick={() => changeLang(code)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: compact ? 4 : 5,
          borderRadius: 5,
          border: `1px solid ${active ? CORES.dourado : CORES.vidroBorda}`,
          background: active ? 'rgba(223,183,108,0.18)' : 'rgba(255,255,255,0.04)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          lineHeight: 0,
        }}
      >
        <FlagIcon code={code} width={flagW} />
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
        aria-label={`${TITLES[lang]} - change language`}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          padding: compact ? '3px 5px' : '4px 6px',
          borderRadius: compact ? 4 : 5,
          border: `1px solid ${CORES.vidroBorda}`,
          background: 'rgba(255,255,255,0.04)',
          color: CORES.dourado,
          cursor: 'pointer',
          lineHeight: 0,
        }}
      >
        <FlagIcon code={lang} width={flagW} />
        <span style={{ fontSize: compact ? 7 : 8, opacity: 0.8, lineHeight: 1 }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: compact ? 28 : 32,
            right: 0,
            width: compact ? 34 : 38,
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
