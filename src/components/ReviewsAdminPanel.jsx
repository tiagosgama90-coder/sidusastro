import { useEffect, useState, useCallback } from 'react'
import { Check, Trash2, Loader2 } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { emailTemPremiumPrivilegiado } from '../lib/premiumAccess.js'

export function ReviewsAdminPanel({ user, obterIdToken }) {
  const { t } = useLanguage()
  const [pending, setPending] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [accao, setAccao] = useState(null)

  const isAdmin = emailTemPremiumPrivilegiado(user)

  const carregar = useCallback(async () => {
    if (!isAdmin || !obterIdToken) return
    setCarregando(true)
    try {
      const token = await obterIdToken()
      if (!token) return
      const res = await fetch('/api/reviews-admin', {
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

  useEffect(() => { carregar() }, [carregar])

  const moderar = useCallback(async (reviewId, action) => {
    setAccao(reviewId)
    try {
      const token = await obterIdToken?.()
      if (!token) return
      await fetch('/api/reviews-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewId, action }),
      })
      await carregar()
    } finally {
      setAccao(null)
    }
  }, [obterIdToken, carregar])

  if (!isAdmin) return null

  return (
    <div className="reviews-admin-panel">
      <h3 className="reviews-admin-title">{t('reviews.adminTitle')}</h3>
      <p className="reviews-admin-hint">{t('reviews.adminHint')}</p>
      {carregando ? (
        <p className="reviews-admin-empty"><Loader2 size={16} className="spin-icon" /> {t('reviews.loading')}</p>
      ) : pending.length === 0 ? (
        <p className="reviews-admin-empty">{t('reviews.adminEmpty')}</p>
      ) : (
        <ul className="reviews-admin-list">
          {pending.map((r) => (
            <li key={r.id} className="reviews-admin-item">
              <div className="reviews-admin-meta">
                <strong>{r.name}</strong>
                {r.createdAt && <span>{new Date(r.createdAt).toLocaleDateString()}</span>}
              </div>
              <p className="reviews-admin-text">"{r.text}"</p>
              <div className="reviews-admin-actions">
                <button type="button" disabled={accao === r.id} onClick={() => moderar(r.id, 'approve')}>
                  <Check size={14} /> {t('reviews.approve')}
                </button>
                <button type="button" className="danger" disabled={accao === r.id} onClick={() => moderar(r.id, 'delete')}>
                  <Trash2 size={14} /> {t('reviews.delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
