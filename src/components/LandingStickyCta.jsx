import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function LandingStickyCta({ onCta, targetRef, hideWhenRef, ctaLabel, enabled = true }) {
  const { t } = useLanguage()
  const label = ctaLabel || t('landing.stickyCtaStart')
  const [visivel, setVisivel] = useState(false)
  const [formVisivel, setFormVisivel] = useState(false)

  useEffect(() => {
    if (!enabled) {
      setVisivel(false)
      return undefined
    }
    const alvo = targetRef?.current
    if (!alvo) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setVisivel(!entry.isIntersecting),
      { threshold: 0.05, rootMargin: '-40px 0px 0px 0px' },
    )
    observer.observe(alvo)
    return () => observer.disconnect()
  }, [targetRef, enabled])

  useEffect(() => {
    if (!enabled) {
      setFormVisivel(false)
      return undefined
    }
    const form = hideWhenRef?.current ?? document.getElementById('landing-birth-portal')
    if (!form) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setFormVisivel(entry.isIntersecting),
      { threshold: 0.12, rootMargin: '0px 0px -72px 0px' },
    )
    observer.observe(form)
    return () => observer.disconnect()
  }, [hideWhenRef, enabled])

  if (!enabled || !visivel || formVisivel) return null

  return (
    <div className="landing-sticky-cta" role="region" aria-label={t('landing.stickyCtaAria')}>
      <button type="button" className="landing-sticky-cta__btn" onClick={onCta}>
        {label}
      </button>
    </div>
  )
}
