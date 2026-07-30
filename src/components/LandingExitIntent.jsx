import { useEffect, useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { hasLandingDraft } from '../lib/landingDraft.js'
import { trackLandingExitIntent } from '../lib/landingAnalytics.js'

const SESSION_KEY = 'sidus_exit_intent_shown'

export function LandingExitIntent({ enabled = false, onContinue }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const close = useCallback(() => {
    setOpen(false)
    trackLandingExitIntent('dismiss')
  }, [])

  const handleContinue = useCallback(() => {
    trackLandingExitIntent('continue')
    setOpen(false)
    onContinue?.()
  }, [onContinue])

  useEffect(() => {
    if (!enabled) return undefined
    if (sessionStorage.getItem(SESSION_KEY)) return undefined

    const onLeave = (e) => {
      if (e.clientY > 24) return
      if (!hasLandingDraft()) return
      sessionStorage.setItem(SESSION_KEY, '1')
      setOpen(true)
      trackLandingExitIntent('shown')
    }

    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [enabled])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  if (!open) return null

  return (
    <div
      className="landing-exit-intent"
      role="dialog"
      aria-modal="true"
      aria-label={t('auth.portal.exitIntent.ariaLabel')}
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div className="landing-exit-intent__panel landing-glass">
        <button type="button" className="landing-exit-intent__close" onClick={close} aria-label={t('common.close')}>
          <X size={18} />
        </button>
        <p className="landing-exit-intent__eyebrow">{t('auth.portal.exitIntent.eyebrow')}</p>
        <h2 className="landing-exit-intent__title">{t('auth.portal.exitIntent.title')}</h2>
        <p className="landing-exit-intent__lead">{t('auth.portal.exitIntent.lead')}</p>
        <button type="button" className="landing-exit-intent__cta" onClick={handleContinue}>
          {t('auth.portal.exitIntent.cta')}
        </button>
        <button type="button" className="landing-exit-intent__skip" onClick={close}>
          {t('auth.portal.exitIntent.skip')}
        </button>
      </div>
    </div>
  )
}
