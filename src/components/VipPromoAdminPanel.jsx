import { useCallback, useEffect, useState } from 'react'
import { Check, Crown, ExternalLink, Loader2, Mail, X } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { emailTemPremiumPrivilegiado } from '../lib/premiumAccess.js'

const PLATFORM_LABEL = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
  twitter: 'X',
  blog: 'Blog',
  outro: 'Outro',
}

const ERROR_KEYS = {
  activation_failed: 'adminErrorActivation',
  verify_failed: 'adminErrorActivation',
  user_not_found: 'adminErrorUserNotFound',
  email_invalid: 'adminErrorEmail',
  write_failed: 'adminErrorActivation',
  no_db_or_uid: 'adminErrorActivation',
  unauthorized: 'adminErrorAuth',
  already_reviewed: 'adminErrorReviewed',
  not_found: 'adminErrorNotFound',
}

export function VipPromoAdminPanel({ user, obterIdToken }) {
  const { t } = useLanguage()
  const [pending, setPending] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [accao, setAccao] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [emailManual, setEmailManual] = useState('')
  const [aDarVip, setADarVip] = useState(false)

  const isAdmin = emailTemPremiumPrivilegiado(user)

  const carregar = useCallback(async () => {
    if (!isAdmin || !obterIdToken) return
    setCarregando(true)
    try {
      const token = await obterIdToken()
      if (!token) return
      const res = await fetch('/api/vip-promo-admin', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setPending(data.pending || [])
    } catch {
      setPending([])
    } finally {
      setCarregando(false)
    }
  }, [isAdmin, obterIdToken])

  useEffect(() { carregar() }, [carregar])

  const chamarAdmin = useCallback(async (payload) => {
    const token = await obterIdToken?.()
    if (!token) {
      setFeedback({ tipo: 'erro', texto: t('vipPromo.adminErrorAuth') })
      return null
    }
    const res = await fetch('/api/vip-promo-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    return { res, data }
  }, [obterIdToken, t])

  const moderar = useCallback(async (requestId, action) => {
    setAccao(requestId)
    setFeedback(null)
    try {
      const { res, data } = await chamarAdmin({ requestId, action }) || {}
      if (!res?.ok) {
        const key = ERROR_KEYS[data?.error] || 'adminErrorActivation'
        setFeedback({ tipo: 'erro', texto: t(`vipPromo.${key}`) })
        return
      }
      if (action === 'approve') {
        setFeedback({
          tipo: 'sucesso',
          texto: t('vipPromo.adminSuccess', { email: data.email || '' }),
        })
      }
      await carregar()
    } finally {
      setAccao(null)
    }
  }, [chamarAdmin, carregar, t])

  const darVipPorEmail = useCallback(async (e) => {
    e.preventDefault()
    const email = emailManual.trim().toLowerCase()
    if (!email) return
    setADarVip(true)
    setFeedback(null)
    try {
      const { res, data } = await chamarAdmin({ action: 'grant_email', email }) || {}
      if (!res?.ok) {
        const key = ERROR_KEYS[data?.error] || 'adminErrorActivation'
        setFeedback({ tipo: 'erro', texto: t(`vipPromo.${key}`) })
        return
      }
      setFeedback({
        tipo: 'sucesso',
        texto: t('vipPromo.adminGrantSuccess', { email }),
      })
      setEmailManual('')
      await carregar()
    } finally {
      setADarVip(false)
    }
  }, [chamarAdmin, emailManual, carregar, t])

  if (!isAdmin) return null

  return (
    <div className="vip-promo-admin-panel">
      <h3 className="vip-promo-admin-title">{t('vipPromo.adminTitle')}</h3>
      <p className="vip-promo-admin-hint">{t('vipPromo.adminHint')}</p>

      <form className="vip-promo-grant-form" onSubmit={darVipPorEmail}>
        <label>
          <Crown size={14} /> {t('vipPromo.adminGrantTitle')}
          <input
            type="email"
            value={emailManual}
            onChange={(e) => setEmailManual(e.target.value)}
            placeholder={t('vipPromo.adminGrantPlaceholder')}
            required
          />
        </label>
        <button type="submit" className="vip-promo-grant-btn" disabled={aDarVip}>
          {aDarVip ? <><Loader2 size={14} className="spin-icon" /> {t('vipPromo.adminGrantSending')}</> : <><Mail size={14} /> {t('vipPromo.adminGrantCta')}</>}
        </button>
        <p className="vip-promo-grant-hint">{t('vipPromo.adminGrantHint')}</p>
      </form>

      {feedback && (
        <p className={`vip-promo-admin-feedback ${feedback.tipo}`}>
          {feedback.texto}
        </p>
      )}

      {carregando ? (
        <p className="vip-promo-admin-empty"><Loader2 size={16} className="spin-icon" /> {t('common.loading')}</p>
      ) : pending.length === 0 ? (
        <p className="vip-promo-admin-empty">{t('vipPromo.adminEmpty')}</p>
      ) : (
        <ul className="vip-promo-admin-list">
          {pending.map((r) => (
            <li key={r.id} className="vip-promo-admin-item">
              <div className="vip-promo-admin-meta">
                <strong>{r.name || r.email}</strong>
                <span>{PLATFORM_LABEL[r.platform] || r.platform} · {r.handle}</span>
                {r.followers != null && <span>{r.followers.toLocaleString()} seg.</span>}
                {r.createdAt && <span>{new Date(r.createdAt).toLocaleDateString()}</span>}
              </div>
              <p className="vip-promo-admin-email">{r.email}</p>
              <p className="vip-promo-admin-text">{r.message}</p>
              <a href={r.postUrl} target="_blank" rel="noopener noreferrer" className="vip-promo-admin-link">
                {t('vipPromo.adminViewPost')} <ExternalLink size={12} />
              </a>
              <div className="vip-promo-admin-actions">
                <button type="button" disabled={accao === r.id} onClick={() => moderar(r.id, 'approve')}>
                  <Check size={14} /> {t('vipPromo.adminApprove')}
                </button>
                <button type="button" className="danger" disabled={accao === r.id} onClick={() => moderar(r.id, 'reject')}>
                  <X size={14} /> {t('vipPromo.adminReject')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
