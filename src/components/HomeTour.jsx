import { useState, useEffect, useCallback } from 'react'
import { X, ChevronRight } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const STORAGE_KEY = 'sidus_home_tour_done'

const STEPS = [
  { target: '[data-tour="horoscope"]', key: 'horoscope' },
  { target: '[data-tour="tarot"]', key: 'tarot' },
  { target: '[data-tour="oracle"]', key: 'oracle' },
]

export function HomeTour() {
  const { t } = useLanguage()
  const [ativo, setAtivo] = useState(false)
  const [passo, setPasso] = useState(0)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return
      const timer = setTimeout(() => setAtivo(true), 6000)
      return () => clearTimeout(timer)
    } catch {
      /* private mode */
    }
    return undefined
  }, [])

  const fechar = useCallback(() => {
    setAtivo(false)
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
  }, [])

  const avancar = useCallback(() => {
    if (passo >= STEPS.length - 1) {
      fechar()
      return
    }
    setPasso((p) => p + 1)
  }, [passo, fechar])

  if (!ativo) return null

  const step = STEPS[passo]
  const rect = typeof document !== 'undefined'
    ? document.querySelector(step.target)?.getBoundingClientRect()
    : null

  return (
    <div className="home-tour-overlay" role="dialog" aria-modal="true" aria-label={t('tour.ariaLabel')}>
      <div className="home-tour-backdrop" onClick={fechar} aria-hidden="true" />
      {rect && (
        <div
          className="home-tour-spotlight"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
        />
      )}
      <div
        className="home-tour-card"
        style={rect ? {
          top: Math.min(rect.bottom + 16, window.innerHeight - 200),
          left: Math.max(16, Math.min(rect.left, window.innerWidth - 320)),
        } : { top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <button type="button" className="home-tour-close" onClick={fechar} aria-label={t('common.close')}>
          <X size={18} />
        </button>
        <p className="home-tour-step">{t('tour.step', { current: passo + 1, total: STEPS.length })}</p>
        <h3 className="home-tour-title">{t(`tour.${step.key}Title`)}</h3>
        <p className="home-tour-text">{t(`tour.${step.key}Text`)}</p>
        <div className="home-tour-actions">
          <button type="button" className="home-tour-skip" onClick={fechar}>{t('tour.skip')}</button>
          <button type="button" className="home-tour-next" onClick={avancar}>
            {passo >= STEPS.length - 1 ? t('tour.finish') : t('tour.next')}
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
