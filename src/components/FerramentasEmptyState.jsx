import { MapPin } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function FerramentasEmptyState({ onCompletarMapa }) {
  const { t } = useLanguage()

  return (
    <div className="ferramentas-empty-state">
      <MapPin size={28} color="#DFB76C" aria-hidden />
      <h3>{t('ferramentas.emptyTitle')}</h3>
      <p>{t('ferramentas.emptyText')}</p>
      {onCompletarMapa && (
        <button type="button" className="ferramentas-empty-state__cta" onClick={onCompletarMapa}>
          {t('ferramentas.emptyCta')}
        </button>
      )}
    </div>
  )
}
