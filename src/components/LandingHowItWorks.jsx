import { Calendar, Crown, Map } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const STEPS = [
  { icon: Calendar, titleKey: 'auth.portal.steps.s1Title', descKey: 'auth.portal.steps.s1Desc' },
  { icon: Map, titleKey: 'auth.portal.steps.s2Title', descKey: 'auth.portal.steps.s2Desc' },
  { icon: Crown, titleKey: 'auth.portal.steps.s3Title', descKey: 'auth.portal.steps.s3Desc' },
]

export function LandingHowItWorks({ variant = 'default' }) {
  const { t } = useLanguage()

  if (variant === 'strip') {
    return (
      <section
        className="landing-how-it-works landing-how-it-works--strip"
        aria-label={t('auth.portal.steps.ariaLabel')}
      >
        <ol className="landing-how-it-works__strip">
          {STEPS.map(({ icon: Icon, titleKey }, index) => (
            <li key={titleKey} className="landing-how-it-works__strip-item">
              <span className="landing-how-it-works__strip-num" aria-hidden>{index + 1}</span>
              <span className="landing-how-it-works__strip-icon" aria-hidden>
                <Icon size={17} strokeWidth={1.75} />
              </span>
              <span className="landing-how-it-works__strip-label">{t(titleKey)}</span>
            </li>
          ))}
        </ol>
      </section>
    )
  }

  return (
    <section className="landing-how-it-works" aria-label={t('auth.portal.steps.ariaLabel')}>
      <h2 className="landing-how-it-works__title">{t('auth.portal.steps.title')}</h2>
      <ol className="landing-how-it-works__list">
        {STEPS.map(({ icon: Icon, titleKey, descKey }, index) => (
          <li key={titleKey} className="landing-how-it-works__item">
            <span className="landing-how-it-works__num">{index + 1}</span>
            <div className="landing-how-it-works__icon" aria-hidden="true">
              <Icon size={20} strokeWidth={1.75} />
            </div>
            <div className="landing-how-it-works__body">
              <h3 className="landing-how-it-works__item-title">{t(titleKey)}</h3>
              <p className="landing-how-it-works__item-desc">{t(descKey)}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
