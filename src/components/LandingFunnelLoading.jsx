import { Loader2 } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function LandingFunnelLoading() {
  const { t } = useLanguage()

  return (
    <div className="landing-funnel-loading" role="status" aria-live="polite">
      <div className="landing-funnel-loading__inner">
        <Loader2 size={32} className="landing-funnel-loading__spin" aria-hidden />
        <p className="landing-funnel-loading__text">{t('landing.funnel.aligningStars')}</p>
      </div>
    </div>
  )
}
