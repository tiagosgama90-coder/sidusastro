import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function LandingFaq() {
  const { t } = useLanguage()
  const items = ['q1', 'q2', 'q3', 'q4']

  return (
    <section className="landing-faq" aria-label={t('auth.portal.faq.ariaLabel')}>
      <h2 className="landing-faq-title">{t('auth.portal.faq.title')}</h2>
      <dl className="landing-faq-list">
        {items.map((key) => (
          <div key={key} className="landing-faq-item">
            <dt className="landing-faq-question">{t(`auth.portal.faq.${key}`)}</dt>
            <dd className="landing-faq-answer">{t(`auth.portal.faq.a${key.slice(1)}`)}</dd>
          </div>
        ))}
      </dl>
      <p className="landing-faq-pricing">{t('auth.portal.faq.pricingLine')}</p>
    </section>
  )
}
