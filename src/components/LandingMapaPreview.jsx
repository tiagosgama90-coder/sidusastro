import { useCallback, useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const PDF_COVER_SRC = '/brand/sidus-pdf-vip-commercial-cover.png?v=13'
const GUIDE_WHEELS_SRC = '/brand/sidus-natal-guide-wheels.png?v=1'
const I18N_PREFIX = 'auth.portal.pdfShowcase'

export function LandingMapaPreview({ variant = 'compact' }) {
  const { t } = useLanguage()
  const isShowcase = variant === 'showcase'
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])
  const openLightbox = useCallback(() => setOpen(true), [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  return (
    <>
      <div className={`landing-testimonial-preview${isShowcase ? ' landing-testimonial-preview--showcase' : ''}`}>
        <button
          type="button"
          className={`natal-chart-premium natal-chart-premium--cover landing-pdf-cover-btn${isShowcase ? ' natal-chart-premium--showcase' : ''}`}
          onClick={openLightbox}
          aria-label={t(`${I18N_PREFIX}.expandCoverAria`)}
        >
          <div className="natal-chart-premium__frame natal-chart-premium__frame--photo">
            <img
              className="natal-chart-premium__photo natal-chart-premium__photo--cover"
              src={PDF_COVER_SRC}
              alt={t(`${I18N_PREFIX}.expandCoverAria`)}
              width={1080}
              height={1400}
              decoding="async"
              draggable={false}
            />
            <span className="landing-pdf-cover-hint" aria-hidden="true">
              <span className="landing-pdf-cover-hint__pt">{t(`${I18N_PREFIX}.expandCover`)}</span>
              <span className="landing-pdf-cover-hint__en">{t(`${I18N_PREFIX}.expandCoverEn`)}</span>
            </span>
          </div>
        </button>
      </div>

      {open && (
        <div
          className="landing-pdf-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t(`${I18N_PREFIX}.expandCoverAria`)}
          onClick={close}
        >
          <button
            type="button"
            className="landing-pdf-lightbox__close"
            onClick={close}
            aria-label={t('common.close')}
          >
            ×
          </button>
          <div className="landing-pdf-lightbox__scroll" onClick={(e) => e.stopPropagation()}>
            <img
              className="landing-pdf-lightbox__img"
              src={PDF_COVER_SRC}
              alt={t(`${I18N_PREFIX}.expandCoverAria`)}
              width={1080}
              height={1400}
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  )
}

export function LandingMapaGuideArt({ className = '' }) {
  return (
    <div className={`natal-chart-premium natal-chart-premium--guide ${className}`.trim()} aria-hidden>
      <img
        className="natal-chart-premium__photo natal-chart-premium__photo--guide"
        src={GUIDE_WHEELS_SRC}
        alt=""
        width={640}
        height={128}
        decoding="async"
        draggable={false}
      />
    </div>
  )
}
