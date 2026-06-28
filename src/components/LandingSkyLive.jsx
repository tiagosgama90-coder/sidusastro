import { useMemo } from 'react'
import { Radio } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { calcularResumoCeuAgora } from '../lib/ceuAoVivo.js'

export function LandingSkyLive() {
  const { lang, t, ts, tp } = useLanguage()

  const hoje = new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-PT', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const ceuAgora = useMemo(() => calcularResumoCeuAgora(new Date(), lang), [lang])

  const tickerItems = useMemo(() => ceuAgora.planetas.map((p) => ({
    key: p.key,
    label: t('auth.portal.skyPlanetLine', {
      symbol: p.simbolo,
      planet: tp(p.nome),
      sign: `${ts(p.signo.nome)} ${p.signo.simbolo}`,
    }),
  })), [ceuAgora.planetas, lang, t, ts, tp])

  return (
    <div className="landing-sky-band" aria-label={t('auth.portal.skyLive')}>
      <div className="landing-portal-sky-live landing-portal-sky-live--band">
        <div className="landing-portal-sky-stars" aria-hidden />
        <div className="landing-sky-band-layout">
          <div className="landing-sky-band-meta">
            <div className="landing-portal-sky-live-head">
              <Radio size={13} color="#34D399" className="landing-portal-pulse-icon" />
              <span className="landing-portal-sky-live-badge">{t('auth.portal.skyLive')}</span>
              <span className="landing-portal-sky-live-date">· {hoje}</span>
            </div>
            <div className="landing-portal-sky-live-body">
              <span className="landing-portal-sky-moon-emoji">{ceuAgora.faseLua.emoji}</span>
              <div>
                <div className="landing-portal-sky-moon-name">{ceuAgora.faseLua.nome}</div>
                <div className="landing-portal-sky-moon-pct">
                  {t('home.illuminated', { pct: ceuAgora.faseLua.iluminacao, angle: ceuAgora.faseLua.angulo })}
                </div>
              </div>
            </div>
          </div>

          <div className="landing-portal-sky-ticker" aria-label={t('auth.portal.skyTickerLabel')}>
            <span className="landing-portal-sky-ticker-label">{t('auth.portal.skyTickerLabel')}</span>
            <div className="landing-portal-sky-ticker-viewport">
              <div className="landing-portal-sky-ticker-track">
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={`${item.key}-${i}`} className="landing-portal-sky-ticker-item">
                    <span className="landing-portal-sky-ticker-dot" aria-hidden>✦</span>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
