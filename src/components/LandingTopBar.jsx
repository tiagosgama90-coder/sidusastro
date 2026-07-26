import { SidusLogo } from './SidusLogo.jsx'
import { LanguageSwitcher } from './LanguageSwitcher.jsx'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function LandingTopBar({ onCta }) {
  const { t } = useLanguage()

  return (
    <header className="landing-top-bar notranslate" translate="no">
      <SidusLogo variant="horizontal" markSize={36} glow />
      <div className="landing-top-bar__actions">
        <LanguageSwitcher variant="landing-bar" />
        <button type="button" className="landing-top-bar__cta" onClick={onCta}>
          {t('auth.portal.topCta')}
        </button>
      </div>
    </header>
  )
}
