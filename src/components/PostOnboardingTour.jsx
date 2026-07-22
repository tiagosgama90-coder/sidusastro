import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const STORAGE_KEY = 'sidus_tour_done_v1'

export function tourJaVisto() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function marcarTourVisto() {
  try {
    localStorage.setItem(STORAGE_KEY, '1')
  } catch { /* ignore */ }
}

const PASSOS = [
  { titleKey: 'tour.horoscopeTitle', textKey: 'tour.horoscopeText' },
  { titleKey: 'tour.tarotTitle', textKey: 'tour.tarotText' },
  { titleKey: 'tour.oracleTitle', textKey: 'tour.oracleText' },
]

export function PostOnboardingTour({ onIrTarot, onIrOraculo, onFechar }) {
  const { t } = useLanguage()
  const [passo, setPasso] = useState(0)
  const [aberto, setAberto] = useState(() => !tourJaVisto())

  useEffect(() => {
    if (!aberto) onFechar?.()
  }, [aberto, onFechar])

  if (!aberto) return null

  const actual = PASSOS[passo]
  const ultimo = passo >= PASSOS.length - 1

  const fechar = () => {
    marcarTourVisto()
    setAberto(false)
  }

  const avancar = () => {
    if (passo === 1) onIrTarot?.()
    if (passo === 2) onIrOraculo?.()
    if (ultimo) {
      fechar()
      return
    }
    setPasso((p) => p + 1)
  }

  return (
    <div className="post-tour-overlay" role="dialog" aria-modal="true" aria-label={t('tour.ariaLabel')}>
      <div className="post-tour-card">
        <p className="post-tour-step">{t('tour.step', { current: passo + 1, total: PASSOS.length })}</p>
        <h3 className="post-tour-title">{t(actual.titleKey)}</h3>
        <p className="post-tour-text">{t(actual.textKey)}</p>
        <div className="post-tour-actions">
          <button type="button" className="post-tour-skip" onClick={fechar}>{t('tour.skip')}</button>
          <button type="button" className="post-tour-next" onClick={avancar}>
            {ultimo ? t('tour.finish') : t('tour.next')}
          </button>
        </div>
      </div>
    </div>
  )
}
