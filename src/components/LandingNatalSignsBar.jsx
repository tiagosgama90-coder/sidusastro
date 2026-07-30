import { useMemo } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { readLandingDraft } from '../lib/landingDraft.js'
import { calcularMapaNatal } from '../lib/astrologia.js'
import { translateSigno } from '../lib/i18n/astro.js'
import { prepInSign } from '../lib/i18n/langUtil.js'

function signLine(simbolo, label, nome, lang) {
  if (!nome) return null
  return { simbolo, text: `${label} ${prepInSign(lang)} ${translateSigno(nome, lang)}` }
}

/** Sol, Lua e Ascendente calculados — informação relevante compacta. */
export function LandingNatalSignsBar({ className = '' }) {
  const { lang, t } = useLanguage()

  const items = useMemo(() => {
    const draft = readLandingDraft()
    if (!draft?.data || !draft?.hora || !draft?.localizacao) return []
    const mapa = calcularMapaNatal({
      data: draft.data,
      hora: draft.hora,
      localizacao: draft.localizacao,
    })
    if (!mapa) return []
    return [
      signLine('☉', t('mapa.sunSign'), mapa.solar?.nome, lang),
      signLine('☽', t('mapa.moonSign'), mapa.lunar?.nome, lang),
      signLine('↑', t('mapa.ascendant'), mapa.ascendente?.nome, lang),
    ].filter(Boolean)
  }, [lang, t])

  if (items.length === 0) return null

  return (
    <div className={`landing-natal-signs${className ? ` ${className}` : ''}`} aria-label={t('landing.funnel.signsAria')}>
      <p className="landing-natal-signs__label">{t('landing.funnel.signsLabel')}</p>
      <ul className="landing-natal-signs__list">
        {items.map((item) => (
          <li key={item.simbolo} className="landing-natal-signs__item">
            <span className="landing-natal-signs__sym" aria-hidden>{item.simbolo}</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
