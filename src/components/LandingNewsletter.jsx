import { useState, useCallback } from 'react'
import { Mail, Loader2, Check, Sparkles } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

export function LandingNewsletter() {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [estado, setEstado] = useState('idle')
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (enviando) return
    setEnviando(true)
    setErro(null)
    try {
      const res = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, honeypot, source: 'landing' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErro(t('newsletter.error'))
        return
      }
      setEstado(data.already ? 'already' : 'done')
      if (!data.already) setEmail('')
    } catch {
      setErro(t('newsletter.error'))
    } finally {
      setEnviando(false)
    }
  }, [email, honeypot, enviando, t])

  return (
    <section className="landing-newsletter" aria-label={t('newsletter.ariaLabel')}>
      <div className="landing-newsletter-inner landing-glass">
        <div className="landing-newsletter-icon" aria-hidden="true">
          <Sparkles size={22} color="#DFB76C" />
        </div>
        <h2 className="landing-newsletter-title">{t('newsletter.title')}</h2>
        <p className="landing-newsletter-lead">{t('newsletter.lead')}</p>
        <form className="landing-newsletter-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="landing-review-honeypot"
          />
          <div className="landing-newsletter-row">
            <Mail size={18} color="rgba(223,183,108,0.7)" className="landing-newsletter-mail-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('newsletter.placeholder')}
              required
              className="landing-newsletter-input"
            />
            <button type="submit" disabled={enviando} className="landing-newsletter-btn">
              {enviando ? <Loader2 size={16} className="spin-icon" /> : estado === 'done' ? <Check size={16} /> : null}
              {enviando ? t('newsletter.sending') : estado === 'done' ? t('newsletter.done') : t('newsletter.cta')}
            </button>
          </div>
        </form>
        {estado === 'already' && <p className="landing-newsletter-msg">{t('newsletter.already')}</p>}
        {estado === 'done' && <p className="landing-newsletter-msg landing-newsletter-msg--ok">{t('newsletter.success')}</p>}
        {erro && <p className="landing-review-error">{erro}</p>}
        <p className="landing-newsletter-foot">{t('newsletter.privacy')}</p>
      </div>
    </section>
  )
}
