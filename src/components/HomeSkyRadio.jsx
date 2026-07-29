import { useMemo } from 'react'
import { Radio } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { calcularResumoCeuAgora } from '../lib/ceuAoVivo.js'
import { formatSkyPosition } from '../lib/i18n/astro.js'

/** Rádio do Céu ao Vivo — exclusivo Premium na home. */
export function HomeSkyRadio() {
  const { lang, t } = useLanguage()
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
    <div className="home-sky-radio" aria-label={t('home.skyRadio')}>
      <div className="home-sky-radio__header">
        <Radio size={14} color="#34D399" className="home-sky-radio__pulse" aria-hidden />
        <span className="home-sky-radio__badge">{t('home.skyRadio')}</span>
        <span className="home-sky-radio__moon">{ceuAgora.faseLua.emoji} {ceuAgora.faseLua.nome}</span>
      </div>
      <div className="home-sky-radio__ticker" aria-hidden>
        <div className="home-sky-radio__track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={`${item.key}-${i}`} className="home-sky-radio__item">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
