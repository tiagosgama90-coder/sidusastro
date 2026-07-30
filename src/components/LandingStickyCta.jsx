import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function LandingStickyCta({ onCta, targetRef }) {
  const { t } = useLanguage()
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const alvo = targetRef?.current
    if (!alvo) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setVisivel(!entry.isIntersecting),
      { threshold: 0.05, rootMargin: '-40px 0px 0px 0px' },
    )
    observer.observe(alvo)
    return () => observer.disconnect()
  }, [targetRef])

  if (!visivel) return null

  return (
    <div className="landing-sticky-cta" role="region" aria-label={t('landing.stickyCtaAria')}>
      <button type="button" className="landing-sticky-cta__btn" onClick={onCta}>
        {t('landing.stickyCtaStart')}
      </button>
    </div>
  )
}
