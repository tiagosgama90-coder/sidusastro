import { Calendar, Crown, Map } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const STEPS = [
  { icon: Calendar, titleKey: 'auth.portal.steps.s1Title', descKey: 'auth.portal.steps.s1Desc' },
  { icon: Map, titleKey: 'auth.portal.steps.s2Title', descKey: 'auth.portal.steps.s2Desc' },
  { icon: Crown, titleKey: 'auth.portal.steps.s3Title', descKey: 'auth.portal.steps.s3Desc' },
]

export function LandingHowItWorks() {
  const { t } = useLanguage()

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
