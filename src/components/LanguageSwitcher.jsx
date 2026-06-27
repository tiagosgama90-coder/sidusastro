import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { passoFromPath, pathFromPasso } from '../lib/routes.js'

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

const LABELS = { pt: 'PT', en: 'ENG' }

function SwitcherButtons({ lang, setLang, size = 'fixed' }) {
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
  }

  const btn = (code, title) => {
    const active = lang === code
    return (
      <button
        type="button"
        title={title}
        onClick={() => changeLang(code)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: compact ? '2px 5px' : inline ? '3px 7px' : '3px 7px',
          borderRadius: compact ? 4 : 6,
          border: `1px solid ${active ? CORES.dourado : CORES.vidroBorda}`,
          background: active ? 'rgba(223,183,108,0.18)' : 'rgba(255,255,255,0.04)',
          color: active ? CORES.dourado : CORES.brancoMuted,
          fontSize: compact ? 8 : inline ? 10 : 9,
          fontWeight: active ? 700 : 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          lineHeight: 1,
          letterSpacing: '0.04em',
        }}
      >
        {LABELS[code]}
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
      }}
    >
      {btn('pt', 'Português')}
      {btn('en', 'English')}
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

  const el = (
    <div className="lang-switcher-root">
      {inner}
    </div>
  )

  if (typeof document === 'undefined') return el
  return createPortal(el, document.body)
}
