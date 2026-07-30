import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const STEP_KEYS = [
  'landing.funnel.loadingStep1',
  'landing.funnel.loadingStep2',
  'landing.funnel.loadingStep3',
]

export function LandingFunnelLoading() {
  const { t } = useLanguage()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((prev) => (prev + 1) % STEP_KEYS.length)
    }, 700)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="landing-funnel-loading" role="status" aria-live="polite">
      <div className="landing-funnel-loading__inner">
        <Loader2 size={32} className="landing-funnel-loading__spin" aria-hidden />
        <p className="landing-funnel-loading__text" key={step}>
          {t(STEP_KEYS[step])}
        </p>
      </div>
    </div>
  )
}
