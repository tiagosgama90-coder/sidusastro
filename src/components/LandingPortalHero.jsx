import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function LandingPortalHero() {
  const { t } = useLanguage()

  return (
    <header className="landing-auth-hero">
      <p className="landing-portal-eyebrow">
        {t('auth.portal.eyebrow')}{' '}
        <span className="landing-portal-brand">{t('auth.portal.eyebrowBrand')}</span>
      </p>
      <h1 className="landing-portal-title">{t('auth.portal.title')}</h1>
      <p className="landing-portal-subtitle">{t('auth.portal.subtitle')}</p>
    </header>
  )
}
