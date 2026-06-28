import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { SidusLogoMark } from './SidusLogoMark.jsx'

export function LandingPortalHero() {
  const { t } = useLanguage()

  return (
    <header className="landing-auth-hero">
      <div className="landing-portal-brand-row">
        <span className="landing-portal-welcome-inline">{t('auth.portal.eyebrow')}</span>
        <SidusLogoMark size={21} className="landing-portal-brand-mark" />
        <span className="landing-portal-brand-text">{t('auth.portal.eyebrowBrand')}</span>
      </div>
      <h1 className="landing-portal-title">{t('auth.portal.title')}</h1>
    </header>
  )
}
