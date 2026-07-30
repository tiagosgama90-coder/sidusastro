import { forwardRef } from 'react'
import { Crown, Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'
import { getPremiumPriceLabels } from '../lib/premiumPricingLabels.js'
import { RecaptchaCheckbox } from './Recaptcha.jsx'

const MANDALA_SRC = '/brand/sidus-natal-guide-wheels.png?v=1'

const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
  fundo: '#0B071E',
}

const labelStyle = {
  display: 'block',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: CORES.dourado,
  marginBottom: 8,
}

const inputStyle = {
  width: '100%',
  padding: '13px 14px',
  background: 'rgba(255, 255, 255, 0.04)',
  border: `1px solid ${CORES.vidroBorda}`,
  borderRadius: 12,
  color: CORES.branco,
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
}

export const LandingPremiumPaywall = forwardRef(function LandingPremiumPaywall({
  firebaseOk = true,
  email,
  setEmail,
  senha,
  setSenha,
  verSenha,
  setVerSenha,
  erro,
  info,
  recaptchaOk,
  setRecaptchaOk,
  recaptchaKey,
  carregando,
  onSubmit,
  onGoogleSignup,
  onLogin,
}, ref) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()
  const prices = getPremiumPriceLabels(isBrasil, t)

  return (
    <section
      ref={ref}
      id="desbloquear-premium"
      className="landing-premium-paywall"
      aria-label={t('landing.funnel.paywallAria')}
    >
      <div className="landing-premium-paywall__layout">
        <div className="landing-premium-paywall__preview" aria-hidden="true">
          <div className="landing-premium-paywall__preview-lock">
            <Crown size={28} />
            <span>{t('landing.funnel.previewLocked')}</span>
          </div>
          <img
            src={MANDALA_SRC}
            alt=""
            className="landing-premium-paywall__mandala"
            width={280}
            height={280}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="landing-premium-paywall__unlock landing-glass">
          <p className="landing-premium-paywall__eyebrow">{t('landing.funnel.paywallEyebrow')}</p>
          <h2 className="landing-premium-paywall__title">{t('landing.funnel.paywallTitle')}</h2>
          <p className="landing-premium-paywall__subtitle">{t('landing.funnel.paywallSubtitle')}</p>

          <div className="landing-premium-paywall__price">
            <p className="landing-premium-paywall__price-main">
              {t('landing.funnel.priceMain', { precoBrl: prices.precoBrl, precoEur: prices.precoEur })}
            </p>
            <p className="landing-premium-paywall__price-sub">{t('landing.funnel.priceSub')}</p>
          </div>

          <p className="landing-premium-paywall__account-lead">{t('landing.funnel.accountLead')}</p>

          {!firebaseOk && (
            <div className="landing-auth-modal__alert landing-auth-modal__alert--warn">
              {t('auth.firebaseNotConfigured')}
            </div>
          )}

          <div className="landing-auth-field">
            <label style={labelStyle}>{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              className="landing-auth-input"
              style={inputStyle}
              autoComplete="email"
              onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            />
          </div>

          <div className="landing-auth-field landing-auth-password-block">
            <label style={labelStyle}>{t('auth.password')}</label>
            <div className="landing-auth-password-input">
              <Lock size={15} color={CORES.brancoMuted} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
              <input
                type={verSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="landing-auth-input"
                style={{ ...inputStyle, paddingLeft: 40, paddingRight: 44 }}
                autoComplete="new-password"
                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
              />
              <button
                type="button"
                className="landing-auth-modal__eye"
                onClick={() => setVerSenha((v) => !v)}
                aria-label={verSenha ? 'Hide password' : 'Show password'}
              >
                {verSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {erro && (
            <div className="landing-auth-modal__alert landing-auth-modal__alert--error">{erro}</div>
          )}
          {info && (
            <div className="landing-auth-modal__alert landing-auth-modal__alert--ok">{info}</div>
          )}

          <div className="landing-premium-paywall__recaptcha">
            <RecaptchaCheckbox onChange={setRecaptchaOk} resetKey={recaptchaKey} />
          </div>

          <button
            type="button"
            className="landing-premium-paywall__cta"
            disabled={carregando || !recaptchaOk}
            onClick={onSubmit}
          >
            {carregando
              ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              : t('landing.funnel.ctaUnlock')}
          </button>

          <div className="landing-premium-paywall__divider">
            <span>{t('auth.or')}</span>
          </div>

          <button
            type="button"
            className="landing-auth-modal__google"
            disabled={carregando || !recaptchaOk}
            onClick={onGoogleSignup}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.5 35.7 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C40.9 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z"/>
            </svg>
            {t('auth.google')}
          </button>

          <p className="landing-auth-register-switch">
            {t('auth.hasAccount')}{' '}
            <button type="button" onClick={onLogin}>
              {t('auth.loginHere')}
            </button>
          </p>
        </div>
      </div>
    </section>
  )
})
