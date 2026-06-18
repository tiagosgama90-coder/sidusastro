import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

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
          gap: 5,
          padding: '6px 10px',
          borderRadius: 8,
          border: `1px solid ${active ? CORES.dourado : CORES.vidroBorda}`,
          background: active ? 'rgba(223,183,108,0.18)' : 'rgba(255,255,255,0.04)',
          color: active ? CORES.dourado : CORES.brancoMuted,
          fontSize: 12,
          fontWeight: active ? 700 : 500,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{flag}</span>
        <span>{code.toUpperCase()}</span>
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 12,
        right: 12,
        zIndex: 500,
        display: 'flex',
        gap: 6,
        padding: 4,
        borderRadius: 12,
        background: 'rgba(11,7,30,0.85)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${CORES.vidroBorda}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      }}
    >
      {btn('pt', '🇵🇹', 'Português')}
      {btn('en', '🇬🇧', 'English')}
    </div>
  )
}
