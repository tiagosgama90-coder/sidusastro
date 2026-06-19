import { createPortal } from 'react-dom'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

function SwitcherButtons({ lang, setLang }) {
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
          gap: 3,
          padding: '3px 6px',
          borderRadius: 6,
          border: `1px solid ${active ? CORES.dourado : CORES.vidroBorda}`,
          background: active ? 'rgba(223,183,108,0.18)' : 'rgba(255,255,255,0.04)',
          color: active ? CORES.dourado : CORES.brancoMuted,
          fontSize: 9,
          fontWeight: active ? 700 : 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          lineHeight: 1,
        }}
      >
        <span style={{ fontSize: 11, lineHeight: 1 }}>{flag}</span>
        <span>{code.toUpperCase()}</span>
      </button>
    )
  }

  return (
    <div
      className={undefined}
      style={{
        display: 'flex',
        gap: 4,
        padding: 3,
        borderRadius: 8,
        background: 'rgba(11,7,30,0.94)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${CORES.vidroBorda}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.45)',
        flexShrink: 0,
      }}
    >
      {btn('pt', '🇵🇹', 'Português')}
      {btn('en', '🇬🇧', 'English')}
    </div>
  )
}

/** variant=fixed: canto superior (mobile / páginas sem navbar). variant=inline: ao lado do logo desktop. */
export function LanguageSwitcher({ variant = 'fixed' }) {
  const { lang, setLang } = useLanguage()
  const inner = <SwitcherButtons lang={lang} setLang={setLang} />

  if (variant === 'inline') {
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
