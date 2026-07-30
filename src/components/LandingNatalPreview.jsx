import { Loader2 } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { translateSigno } from '../lib/i18n/astro.js'
import { prepInSign } from '../lib/i18n/langUtil.js'

function Pillar({ simbolo, label, nome, lang, destacado = false }) {
  if (!nome) return null
  const signo = translateSigno(nome, lang)
  const prep = prepInSign(lang)
  return (
    <li className={`landing-natal-preview__pillar${destacado ? ' landing-natal-preview__pillar--highlight' : ''}`}>
      <span className="landing-natal-preview__sym" aria-hidden>{simbolo}</span>
      <span className="landing-natal-preview__label">{label}</span>
      <span className="landing-natal-preview__sign">{prep} {signo}</span>
    </li>
  )
}

/** Sol, Lua e Ascendente — visível no formulário e no modal de registo. */
export function LandingNatalPreview({ mapa, carregando = false, className = '', compact = false }) {
  const { lang, t } = useLanguage()

  if (!mapa && !carregando) return null

  const pillars = [
    { key: 'sol', simbolo: '☉', label: t('mapa.sunSign'), nome: mapa?.solar?.nome },
    { key: 'lua', simbolo: '☽', label: t('mapa.moonSign'), nome: mapa?.lunar?.nome },
    { key: 'asc', simbolo: '↑', label: t('mapa.ascendant'), nome: mapa?.ascendente?.nome, destacado: true },
  ].filter((p) => p.nome)

  return (
    <div
      className={`landing-natal-preview${compact ? ' landing-natal-preview--compact' : ''}${className ? ` ${className}` : ''}`}
      aria-label={t('landing.funnel.signsAria')}
      aria-busy={carregando}
    >
      <p className="landing-natal-preview__title">{t('landing.funnel.signsLabel')}</p>
      {carregando && pillars.length < 3 ? (
        <p className="landing-natal-preview__loading">
          <Loader2 size={16} className="spin-icon" aria-hidden />
          {t('landing.funnel.signsLoading')}
        </p>
      ) : null}
      {pillars.length > 0 ? (
        <ul className="landing-natal-preview__list">
          {pillars.map(({ key, simbolo, label, nome, destacado }) => (
            <Pillar key={key} simbolo={simbolo} label={label} nome={nome} lang={lang} destacado={destacado} />
          ))}
        </ul>
      ) : null}
    </div>
  )
}
