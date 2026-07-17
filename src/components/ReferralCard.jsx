import { useState, useCallback } from 'react'
import { Gift, Copy, Check, Share2, Sparkles } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { buildReferralLink } from '../lib/referral.js'

export function ReferralCard({ referralCode, bonusLeituras = 0, compact = false }) {
  const { t } = useLanguage()
  const [copiado, setCopiado] = useState(false)

  const link = referralCode ? buildReferralLink(referralCode) : ''

  const copiar = useCallback(async () => {
    if (!link) return
    try {
      await navigator.clipboard.writeText(link)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2200)
    } catch {
      /* fallback silencioso */
    }
  }, [link])

  const partilhar = useCallback(async () => {
    if (!link || !referralCode) return
    const text = t('referral.shareText', { link })
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Sidusastro', text, url: link })
        return
      }
    } catch { /* cancelado */ }
    copiar()
  }, [link, referralCode, t, copiar])

  if (!referralCode) return null

  return (
    <section
      className={`referral-card landing-glass${compact ? ' referral-card--compact' : ''}`}
      aria-label={t('referral.ariaLabel')}
    >
      <div className="referral-card-glow" aria-hidden="true" />
      <div className="referral-card-header">
        <div className="referral-card-icon" aria-hidden="true">
          <Gift size={20} color="#DFB76C" />
        </div>
        <div>
          <h3 className="referral-card-title">{t('referral.title')}</h3>
          <p className="referral-card-lead">{t('referral.lead')}</p>
        </div>
      </div>

      {bonusLeituras > 0 && (
        <div className="referral-card-bonus">
          <Sparkles size={14} color="#34D399" />
          <span>{t('referral.bonusActive', { n: bonusLeituras })}</span>
        </div>
      )}

      <div className="referral-card-link-row notranslate" translate="no">
        <code className="referral-card-link">{link}</code>
        <button type="button" className="referral-card-copy" onClick={copiar} aria-label={t('referral.copy')}>
          {copiado ? <Check size={16} color="#34D399" /> : <Copy size={16} />}
        </button>
      </div>

      <div className="referral-card-actions">
        <button type="button" className="referral-card-btn referral-card-btn--primary" onClick={partilhar}>
          <Share2 size={16} />
          {t('referral.share')}
        </button>
        <button type="button" className="referral-card-btn" onClick={copiar}>
          {copiado ? t('referral.copied') : t('referral.copyLink')}
        </button>
      </div>

      <p className="referral-card-foot">{t('referral.foot')}</p>
    </section>
  )
}
