import { Sparkles, LogIn } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

/** Convite visível para login/registo no topo da landing. */
export function LandingAuthGateway({ onLogin, onRegister }) {
  const { t } = useLanguage()

  return (
    <section className="landing-auth-gateway" aria-label={t('auth.portal.authGateway.ariaLabel')}>
      <p className="landing-auth-gateway__magic">{t('auth.portal.authGateway.magic')}</p>
      <div className="landing-auth-gateway__actions">
        <button
          type="button"
          className="landing-auth-gateway__btn landing-auth-gateway__btn--primary"
          onClick={onRegister}
        >
          <Sparkles size={18} aria-hidden />
          {t('auth.portal.authGateway.register')}
        </button>
        <button
          type="button"
          className="landing-auth-gateway__btn landing-auth-gateway__btn--secondary"
          onClick={onLogin}
        >
          <LogIn size={17} aria-hidden />
          {t('auth.portal.authGateway.login')}
        </button>
      </div>
      <p className="landing-auth-gateway__hint">{t('auth.portal.authGateway.hint')}</p>
    </section>
  )
}
