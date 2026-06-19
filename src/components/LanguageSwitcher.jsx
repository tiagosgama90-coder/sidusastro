import { createPortal } from 'react-dom'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

function SwitcherButtons({ lang, setLang, compact = false }) {
  const btn = (code, flag, label) => {
    const active = lang === code
    return (
      <button
        type="button"
        title={label}
        onClick={() => setLang(code)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: compact ? 2 : 3,
          padding: compact ? '2px 4px' : '3px 6px',
          borderRadius: compact ? 4 : 6,
          border: `1px solid ${active ? CORES.dourado : CORES.vidroBorda}`,
          background: active ? 'rgba(223,183,108,0.18)' : 'rgba(255,255,255,0.04)',
          color: active ? CORES.dourado : CORES.brancoMuted,
          fontSize: compact ? 7 : 9,
          fontWeight: active ? 700 : 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          lineHeight: 1,
        }}
      >
        <span style={{ fontSize: compact ? 9 : 11, lineHeight: 1 }}>{flag}</span>
        <span>{code.toUpperCase()}</span>
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
      {btn('pt', '🇵🇹', 'Português')}
      {btn('en', '🇬🇧', 'English')}
    </div>
  )
}

/** variant=fixed: canto superior (login). variant=inline|compact: na barra ao lado do logo. */
export function LanguageSwitcher({ variant = 'fixed' }) {
  const { lang, setLang } = useLanguage()
  const compact = variant === 'compact' || variant === 'inline'
  const inner = <SwitcherButtons lang={lang} setLang={setLang} compact={compact} />

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
