import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function LandingPortalHero() {
  const { t } = useLanguage()

  return (
    <header className="landing-auth-hero">
      <p className="landing-portal-welcome">{t('auth.portal.eyebrow')}</p>
      <div className="landing-portal-logo-wrap">
        <img
          src="/sidus-logo.png"
          alt={t('auth.portal.logoAlt')}
          className="landing-portal-logo"
          width={220}
          height={48}
          decoding="async"
        />
      </div>
      <h1 className="landing-portal-title">{t('auth.portal.title')}</h1>
    </header>
  )
}
