import { useMemo } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { readLandingDraft } from '../lib/landingDraft.js'
import { calcularMapaNatal } from '../lib/astrologia.js'
import { translateSigno } from '../lib/i18n/astro.js'
import { prepInSign } from '../lib/i18n/langUtil.js'
import { LandingSimpleCtaButton } from './LandingPremiumPriceCard.jsx'

function formatPillar(simbolo, label, signoNome, lang) {
  if (!signoNome) return null
  const sign = translateSigno(signoNome, lang)
  const prep = prepInSign(lang)
  return `${simbolo} ${label} ${prep} ${sign}`
}

/** Pré-visualização grátis do mapa antes do paywall de conta. */
export function LandingFunnelPreview({ onContinue }) {
  const { lang, t } = useLanguage()

  const { nome, mapa } = useMemo(() => {
    const draft = readLandingDraft()
    if (!draft?.data) return { nome: '', mapa: null }
    const m = draft.localizacao && draft.hora
      ? calcularMapaNatal({ data: draft.data, hora: draft.hora, localizacao: draft.localizacao })
      : null
    return { nome: (draft.nome || '').trim(), mapa: m }
  }, [])

  const pillars = useMemo(() => {
    if (!mapa) return []
    return [
      { key: 'sol', line: formatPillar('☉', t('mapa.sunSign'), mapa.solar?.nome, lang) },
      { key: 'lua', line: formatPillar('☽', t('mapa.moonSign'), mapa.lunar?.nome, lang) },
      { key: 'asc', line: formatPillar('↑', t('mapa.ascendant'), mapa.ascendente?.nome, lang) },
    ].filter((p) => p.line)
  }, [mapa, lang, t])

  return (
    <section className="landing-funnel-preview landing-glass" aria-label={t('landing.funnel.previewAria')}>
      <header className="landing-funnel-preview__head">
        <p className="landing-funnel-preview__eyebrow">
          <Sparkles size={14} aria-hidden />
          {t('landing.funnel.previewEyebrow')}
        </p>
        <h2 className="landing-funnel-preview__title">
          {nome
            ? t('landing.funnel.previewTitleNamed', { nome })
            : t('landing.funnel.previewTitle')}
        </h2>
        <p className="landing-funnel-preview__lead">{t('landing.funnel.previewLead')}</p>
      </header>

      {pillars.length > 0 ? (
        <ul className="landing-funnel-preview__pillars">
          {pillars.map(({ key, line }) => (
            <li key={key} className="landing-funnel-preview__pillar">
              {line}
            </li>
          ))}
        </ul>
      ) : (
        <p className="landing-funnel-preview__fallback">{t('landing.funnel.previewFallback')}</p>
      )}

      <p className="landing-funnel-preview__note">{t('landing.funnel.previewNote')}</p>

      <LandingSimpleCtaButton
        className="landing-funnel-preview__cta"
        onClick={onContinue}
        ariaLabel={t('landing.funnel.previewCtaAria')}
        pulse
      >
        {t('landing.funnel.previewCta')}
      </LandingSimpleCtaButton>
    </section>
  )
}
