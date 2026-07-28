import { useMemo } from 'react'
import { Radio } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { calcularResumoCeuAgora } from '../lib/ceuAoVivo.js'
import { formatSkyPosition } from '../lib/i18n/astro.js'
import { dateLocale } from '../lib/i18n/langUtil.js'

export function LandingSkyLive({ compact = false }) {
  const { lang, t } = useLanguage()

  const hoje = new Date().toLocaleDateString(dateLocale(lang), {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const ceuAgora = useMemo(() => calcularResumoCeuAgora(new Date(), lang), [lang])

  const tickerItems = useMemo(() => [
    { key: 'sol', label: formatSkyPosition({ key: 'sol', nome: 'Sol', simbolo: '☉', signo: ceuAgora.sol }, lang) },
    { key: 'lua', label: formatSkyPosition({ key: 'lua', nome: 'Lua', simbolo: '☽', signo: ceuAgora.lua }, lang) },
    ...ceuAgora.planetas.map((p) => ({
      key: p.key,
      label: formatSkyPosition(p, lang),
    })),
  ], [ceuAgora, lang])

  return (
    <div className={`landing-sky-top${compact ? ' landing-sky-top--compact' : ''}`} aria-label={t('auth.portal.skyLive')}>
      <div className={`landing-portal-sky-live landing-portal-sky-live--top${compact ? ' landing-portal-sky-live--compact' : ''}`}>
        <div className="landing-portal-sky-stars" aria-hidden />
        <div className="landing-sky-top-inner">
          <div className="landing-sky-top-left">
            <Radio size={12} color="#34D399" className="landing-portal-pulse-icon" />
            <span className="landing-portal-sky-live-badge">{t('auth.portal.skyLive')}</span>
            <span className="landing-portal-sky-live-date">· {hoje}</span>
            <span className="landing-portal-sky-moon-emoji landing-portal-sky-moon-emoji--top">{ceuAgora.faseLua.emoji}</span>
            <span className="landing-portal-sky-moon-name landing-portal-sky-moon-name--top">{ceuAgora.faseLua.nome}</span>
          </div>
          <div className="landing-portal-sky-ticker landing-portal-sky-ticker--top" aria-label={t('auth.portal.skyTickerLabel')}>
            <div className="landing-portal-sky-ticker-viewport">
              <div className="landing-portal-sky-ticker-track">
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={`${item.key}-${i}`} className="landing-portal-sky-ticker-item">
                    <span className="landing-portal-sky-ticker-dot" aria-hidden></span>
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
