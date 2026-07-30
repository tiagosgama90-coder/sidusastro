import { Loader2, Sparkles } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { SIGNOS } from '../lib/astrologia.js'
import { translateSigno } from '../lib/i18n/astro.js'
import { prepInSign } from '../lib/i18n/langUtil.js'

function signGlyph(nome) {
  return SIGNOS.find((s) => s.nome === nome)?.simbolo || '✦'
}

function MysticPillar({ kind, simbolo, label, nome, lang, pulse = false }) {
  if (!nome) return null
  const signo = translateSigno(nome, lang)
  const prep = prepInSign(lang)
  const glyph = signGlyph(nome)

  return (
    <li className={`landing-mystic-preview__pillar landing-mystic-preview__pillar--${kind}${pulse ? ' landing-mystic-preview__pillar--pulse' : ''}`}>
      <div className="landing-mystic-preview__orb" aria-hidden>
        <span className="landing-mystic-preview__ring landing-mystic-preview__ring--outer" />
        <span className="landing-mystic-preview__ring landing-mystic-preview__ring--inner" />
        <span className="landing-mystic-preview__glyph">{glyph}</span>
      </div>
      <p className="landing-mystic-preview__kind">
        <span className="landing-mystic-preview__kind-sym" aria-hidden>{simbolo}</span>
        {label}
      </p>
      <p className="landing-mystic-preview__sign">
        {prep} <strong>{signo}</strong>
      </p>
    </li>
  )
}

/** Preview místico Sol · Lua · Ascendente — form + modal de registo. */
export function LandingNatalPreview({
  mapa,
  carregando = false,
  className = '',
  variant = 'mystic',
  nomeUtilizador = '',
}) {
  const { lang, t } = useLanguage()
  const mystic = variant === 'mystic'

  const pillars = [
    { kind: 'sol', simbolo: '☉', label: t('mapa.sunSign'), nome: mapa?.solar?.nome },
    { kind: 'lua', simbolo: '☽', label: t('mapa.moonSign'), nome: mapa?.lunar?.nome },
    { kind: 'asc', simbolo: '↑', label: t('mapa.ascendant'), nome: mapa?.ascendente?.nome, pulse: true },
  ]

  const hasPillars = pillars.some((p) => p.nome)
  if (!hasPillars && !carregando) return null

  const rootClass = [
    mystic ? 'landing-mystic-preview' : 'landing-natal-preview',
    carregando ? 'landing-mystic-preview--loading' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={rootClass} aria-label={t('landing.funnel.signsAria')} aria-busy={carregando}>
      <div className="landing-mystic-preview__glow" aria-hidden />
      <div className="landing-mystic-preview__sparkles" aria-hidden>
        <span /><span /><span /><span />
      </div>

      <header className="landing-mystic-preview__head">
        <p className="landing-mystic-preview__eyebrow">
          <Sparkles size={13} aria-hidden />
          {t('landing.funnel.previewEyebrow')}
        </p>
        <h3 className="landing-mystic-preview__title">
          {nomeUtilizador
            ? t('landing.funnel.previewTitleNamed', { nome: nomeUtilizador })
            : t('landing.funnel.signsLabel')}
        </h3>
      </header>

      {carregando && !hasPillars ? (
        <div className="landing-mystic-preview__calculating" role="status">
          <div className="landing-mystic-preview__calculating-orb">
            <Loader2 size={28} className="spin-icon" aria-hidden />
          </div>
          <p className="landing-mystic-preview__calculating-text">{t('landing.funnel.signsLoading')}</p>
        </div>
      ) : (
        <ul className="landing-mystic-preview__list">
          {pillars.map(({ kind, simbolo, label, nome, pulse }) => (
            <MysticPillar
              key={kind}
              kind={kind}
              simbolo={simbolo}
              label={label}
              nome={nome}
              lang={lang}
              pulse={pulse}
            />
          ))}
        </ul>
      )}

      {carregando && hasPillars ? (
        <p className="landing-mystic-preview__refining">
          <Loader2 size={12} className="spin-icon" aria-hidden />
          {t('landing.funnel.signsRefining')}
        </p>
      ) : null}

      <p className="landing-mystic-preview__footnote">{t('landing.funnel.previewFootnote')}</p>
    </div>
  )
}
