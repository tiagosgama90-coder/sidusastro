import { Home, Map, Layers, MessageCircle } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255, 255, 255, 0.55)',
}

const TABS = [
  { id: 'home', labelKey: 'nav.home', icon: Home },
  { id: 'mapa', labelKey: 'nav.mapa', icon: Map },
  { id: 'tarot', labelKey: 'nav.tarot', icon: Layers },
  { id: 'chat', labelKey: 'nav.oraculo', icon: MessageCircle },
]

export function MobileBottomNav({ passo, onNavigate, hidden = false }) {
  const { t } = useLanguage()
  if (hidden) return null

  return (
    <nav className="mobile-bottom-nav" aria-label={t('nav.menu')}>
      {TABS.map((tab) => {
        const Icon = tab.icon
        const ativo = passo === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            className={`mobile-bottom-nav__item${ativo ? ' mobile-bottom-nav__item--active' : ''}`}
            onClick={() => onNavigate(tab.id)}
            aria-current={ativo ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={ativo ? 2.2 : 1.8} />
            <span>{t(tab.labelKey)}</span>
          </button>
        )
      })}
    </nav>
  )
}
