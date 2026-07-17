import { useCallback, useEffect, useState } from 'react'
import { Check, ChevronLeft, Crown, ExternalLink, Globe, Loader2, Send, Sparkles } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { getBeneficiosVip } from '../lib/i18n/ferramentasData.js'
import { SIDUS_SOCIAL_LIST } from '../lib/sidusSocial.js'
import { LanguageSwitcher } from './LanguageSwitcher.jsx'

const CORES = {
  fundo: '#0B071E',
  dourado: '#DFB76C',
  douradoEscuro: '#B8944F',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

const PLATFORM_IDS = ['instagram', 'tiktok', 'youtube', 'facebook', 'blog', 'outro']

const POST_URL_PLACEHOLDER = {
  instagram: 'https://www.instagram.com/p/...',
  tiktok: 'https://www.tiktok.com/@teu_perfil/video/...',
  youtube: 'https://www.youtube.com/watch?v=...',
  facebook: 'https://www.facebook.com/...',
  blog: 'https://...',
  outro: 'https://...',
}

export function VipPromoPage({
  user,
  isPremium,
  isDesktop,
  obterIdToken,
  onVoltar,
  onLogin,
}) {
  const { t, lang } = useLanguage()
  const beneficios = getBeneficiosVip(lang)

  const [platform, setPlatform] = useState('instagram')
  const [handle, setHandle] = useState('')
  const [followers, setFollowers] = useState('')
  const [postUrl, setPostUrl] = useState('')
  const [message, setMessage] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)
  const [estado, setEstado] = useState('idle')
  const [pedidoStatus, setPedidoStatus] = useState(null)
  const [carregandoStatus, setCarregandoStatus] = useState(true)

  const carregarStatus = useCallback(async () => {
    if (!user || !obterIdToken) {
      setCarregandoStatus(false)
      return
    }
    setCarregandoStatus(true)
    try {
      const token = await obterIdToken()
      if (!token) return
      const res = await fetch('/api/vip-promo-status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setPedidoStatus(data.status || 'none')
    } catch {
      setPedidoStatus('none')
    } finally {
      setCarregandoStatus(false)
    }
  }, [user, obterIdToken])

  useEffect(() => { carregarStatus() }, [carregarStatus])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!user || enviando || isPremium) return
    setEnviando(true)
    setErro(null)
    try {
      const token = await obterIdToken?.()
      if (!token) {
        setErro(t('vipPromo.errors.unauthorized'))
        return
      }
      const res = await fetch('/api/vip-promo-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          platform,
          handle,
          followers: followers ? Number(followers) : null,
          postUrl,
          message,
          name: user.displayName || '',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErro(t(`vipPromo.errors.${data.error}`) || t('vipPromo.errors.generic'))
        return
      }
      setEstado('done')
      setPedidoStatus('pending')
    } catch {
      setErro(t('vipPromo.errors.generic'))
    } finally {
      setEnviando(false)
    }
  }, [user, enviando, isPremium, obterIdToken, platform, handle, followers, postUrl, message, t])

  const padding = isDesktop ? '24px 32px 120px' : '20px 18px 110px'
  const maxW = isDesktop ? 720 : '100%'

  return (
    <div style={{ padding, maxWidth: maxW, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <button
          type="button"
          onClick={onVoltar}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: CORES.dourado, cursor: 'pointer' }}
        >
          <ChevronLeft size={20} /> {t('common.back')}
        </button>
        <LanguageSwitcher variant="compact" />
      </div>

      <header style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(223,183,108,0.12)', border: `1px solid ${CORES.vidroBorda}`,
          borderRadius: 999, padding: '6px 14px', marginBottom: 14,
          fontSize: 12, color: CORES.dourado, fontWeight: 600,
        }}>
          <Crown size={14} /> {t('vipPromo.badge')}
        </div>
        <h1 style={{ margin: '0 0 10px', fontSize: isDesktop ? 30 : 24, color: CORES.branco, fontWeight: 700 }}>
          {t('vipPromo.title')}
        </h1>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: CORES.brancoMuted, maxWidth: 560, marginInline: 'auto' }}>
          {t('vipPromo.lead')}
        </p>
      </header>

      <section className="vip-promo-guarantees" aria-label={t('vipPromo.guaranteesTitle')}>
        <h2>{t('vipPromo.guaranteesTitle')}</h2>
        <ul>
          {['g1', 'g2', 'g3', 'g4'].map((key) => (
            <li key={key}>
              <Check size={16} color={CORES.dourado} />
              <span>{t(`vipPromo.guarantees.${key}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="vip-promo-benefits">
        <h2>{t('vipPromo.benefitsTitle')}</h2>
        <div className="vip-promo-benefits-grid">
          {beneficios.slice(0, 6).map((b) => (
            <div key={b} className="vip-promo-benefit-item">
              <Sparkles size={14} color={CORES.dourado} />
              <span>{b}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="vip-promo-how">
        <h2>{t('vipPromo.howTitle')}</h2>
        <ol>
          {[1, 2, 3, 4].map((n) => (
            <li key={n}>
              <span className="vip-promo-step-num">{n}</span>
              <div>
                <strong>{t(`vipPromo.steps.s${n}Title`)}</strong>
                <p>{t(`vipPromo.steps.s${n}Text`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="vip-promo-official" aria-label={t('vipPromo.officialTitle')}>
        <h2>{t('vipPromo.officialTitle')}</h2>
        <p className="vip-promo-official-lead">{t('vipPromo.officialLead')}</p>
        <ul className="vip-promo-official-list">
          {SIDUS_SOCIAL_LIST.map((conta) => (
            <li key={conta.id}>
              <a href={conta.url} target="_blank" rel="noopener noreferrer" className="vip-promo-official-link">
                <strong>{conta.label}</strong>
                <span>{conta.handle}</span>
                <ExternalLink size={14} />
              </a>
            </li>
          ))}
        </ul>
        <p className="vip-promo-official-note">{t('vipPromo.officialNote')}</p>
      </section>

      {!user ? (
        <div className="vip-promo-card vip-promo-login">
          <p>{t('vipPromo.loginRequired')}</p>
          <button type="button" onClick={onLogin} className="vip-promo-submit">
            {t('vipPromo.loginCta')}
          </button>
        </div>
      ) : isPremium ? (
        <div className="vip-promo-card vip-promo-done">
          <Crown size={28} color={CORES.dourado} />
          <p>{t('vipPromo.alreadyVip')}</p>
        </div>
      ) : carregandoStatus ? (
        <p className="vip-promo-loading"><Loader2 size={18} className="spin-icon" /> {t('common.loading')}</p>
      ) : pedidoStatus === 'pending' || estado === 'done' ? (
        <div className="vip-promo-card vip-promo-done">
          <Check size={28} color="#34D399" />
          <p>{t('vipPromo.pending')}</p>
        </div>
      ) : pedidoStatus === 'approved' ? (
        <div className="vip-promo-card vip-promo-done">
          <Crown size={28} color={CORES.dourado} />
          <p>{t('vipPromo.approved')}</p>
        </div>
      ) : pedidoStatus === 'rejected' ? (
        <div className="vip-promo-card vip-promo-rejected">
          <p>{t('vipPromo.rejected')}</p>
          <button type="button" className="vip-promo-link-btn" onClick={() => { setPedidoStatus('none'); setEstado('idle') }}>
            {t('vipPromo.tryAgain')}
          </button>
        </div>
      ) : (
        <form className="vip-promo-card vip-promo-form" onSubmit={handleSubmit}>
          <h2>{t('vipPromo.formTitle')}</h2>

          <div className="vip-promo-form-notice" role="note">
            <Globe size={20} aria-hidden />
            <div>
              <strong>{t('vipPromo.formNoticeTitle')}</strong>
              <p>{t('vipPromo.formNoticeText')}</p>
            </div>
          </div>

          <p className="vip-promo-form-hint">{t('vipPromo.formHint')}</p>

          <h3 className="vip-promo-form-section">{t('vipPromo.formSectionYourPost')}</h3>

          <label>
            {t('vipPromo.platform')}
            <select value={platform} onChange={(e) => setPlatform(e.target.value)} required>
              {PLATFORM_IDS.map((id) => (
                <option key={id} value={id}>{t(`vipPromo.platforms.${id}`)}</option>
              ))}
            </select>
          </label>

          <label>
            {t('vipPromo.handle')}
            <span className="vip-promo-field-hint">{t('vipPromo.handleHint')}</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder={t('vipPromo.handlePlaceholder')}
              required
              maxLength={80}
            />
          </label>

          <label>
            {t('vipPromo.followers')}
            <input
              type="number"
              min="0"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              placeholder={t('vipPromo.followersPlaceholder')}
            />
          </label>

          <label>
            {t('vipPromo.postUrl')}
            <span className="vip-promo-field-hint">{t('vipPromo.postUrlHint')}</span>
            <input
              type="url"
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder={POST_URL_PLACEHOLDER[platform] || 'https://...'}
              required
            />
          </label>

          <label>
            {t('vipPromo.message')}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('vipPromo.messagePlaceholder')}
              required
              minLength={40}
              maxLength={1200}
              rows={5}
            />
          </label>

          {erro && <p className="vip-promo-error">{erro}</p>}

          <button type="submit" className="vip-promo-submit" disabled={enviando}>
            {enviando ? <><Loader2 size={16} className="spin-icon" /> {t('vipPromo.sending')}</> : <><Send size={16} /> {t('vipPromo.submit')}</>}
          </button>

          <p className="vip-promo-legal">{t('vipPromo.legal')}</p>
        </form>
      )}

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: CORES.brancoMuted }}>
        <a href="https://sidusastro.com" style={{ color: CORES.dourado, textDecoration: 'none' }}>
          sidusastro.com <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
        </a>
      </p>
    </div>
  )
}
