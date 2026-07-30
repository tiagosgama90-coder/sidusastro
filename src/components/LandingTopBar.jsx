import { SidusLogo } from './SidusLogo.jsx'
import { LanguageSwitcher } from './LanguageSwitcher.jsx'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function LandingTopBar({ onLogin, onStart }) {
  const { t } = useLanguage()

  const handleLogin = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onLogin?.()
  }

  return (
    <header className="landing-top-bar notranslate" translate="no">
      <SidusLogo variant="horizontal" markSize={42} glow className="sidus-logo--landing-bar" />
      <div className="landing-top-bar__actions">
        <LanguageSwitcher variant="landing-bar" />
        <button type="button" className="landing-top-bar__login" onClick={handleLogin}>
          {t('auth.login')}
        </button>
        {onStart && (
          <button type="button" className="landing-top-bar__cta" onClick={onStart}>
            {t('auth.portal.topCtaShort')}
          </button>
        )}
      </div>
    </header>
  )
}
