import { useEffect, useState, useCallback, useMemo } from 'react'
import { Star, Send, Loader2 } from 'lucide-react'
import { RecaptchaCheckbox } from './Recaptcha.jsx'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { LANDING_SEED_REVIEWS } from '../lib/landingSeedReviews.js'

export function LandingReviews({ variant = 'default' }) {
  const { t } = useLanguage()
  const [reviews, setReviews] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [texto, setTexto] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [recaptchaOk, setRecaptchaOk] = useState(false)
  const [recaptchaKey, setRecaptchaKey] = useState(0)
  const [enviando, setEnviando] = useState(false)
  const [estado, setEstado] = useState('idle')
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let cancelado = false
    fetch('/api/reviews-list')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelado) setReviews(d.reviews || [])
      })
      .catch(() => {})
      .finally(() => { if (!cancelado) setCarregando(false) })
    return () => { cancelado = true }
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!recaptchaOk || enviando) return
    setEnviando(true)
    setErro(null)
    try {
      const res = await fetch('/api/reviews-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, email, text: texto, honeypot }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErro(t(`reviews.errors.${data.error}`) || t('reviews.errors.generic'))
        setRecaptchaKey((k) => k + 1)
        setRecaptchaOk(false)
        return
      }
      setEstado('done')
      setNome('')
      setEmail('')
      setTexto('')
      setRecaptchaKey((k) => k + 1)
      setRecaptchaOk(false)
    } catch {
      setErro(t('reviews.errors.generic'))
    } finally {
      setEnviando(false)
    }
  }, [recaptchaOk, enviando, nome, email, texto, honeypot, t])

  const reviewsVisiveis = useMemo(
    () => (reviews.length > 0 ? reviews : LANDING_SEED_REVIEWS),
    [reviews],
  )

  const carouselItems = useMemo(
    () => [...reviewsVisiveis, ...reviewsVisiveis],
    [reviewsVisiveis],
  )

  const sectionClass = [
    'landing-testimonials',
    variant === 'paywall' ? 'landing-testimonials--paywall' : '',
  ].filter(Boolean).join(' ')

  return (
    <section className={sectionClass} aria-label={t('reviews.ariaLabel')}>
      <h2 className="landing-testimonials-title">{t('reviews.title')}</h2>
      <p className="landing-testimonials-subtitle">{t('reviews.subtitle')}</p>

      <div className="landing-reviews-carousel" aria-live="polite">
        {carregando ? (
          <p className="landing-review-empty">{t('reviews.loading')}</p>
        ) : (
          <div className="landing-reviews-carousel__viewport">
            <div className="landing-reviews-carousel__track">
              {carouselItems.map((r, i) => (
                <blockquote
                  key={`${r.id}-${i}`}
                  className="landing-testimonial-card landing-glass landing-reviews-carousel__card"
                >
                  <div className="landing-review-stars" aria-hidden="true">
                    {Array.from({ length: r.rating || 5 }).map((_, j) => (
                      <Star key={j} size={12} fill="#DFB76C" color="#DFB76C" />
                    ))}
                  </div>
                  <p className="landing-testimonial-text">&ldquo;{r.text}&rdquo;</p>
                  <footer className="landing-testimonial-author">
                    <span className="landing-testimonial-name">{r.name}</span>
                    {r.meta && <span className="landing-testimonial-meta">{r.meta}</span>}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        )}
      </div>

      <form className="landing-review-form landing-glass" onSubmit={handleSubmit}>
        <h3 className="landing-review-form-title">{t('reviews.formTitle')}</h3>
        <p className="landing-review-form-hint">{t('reviews.formHint')}</p>
        <input
          type="text"
          name="company"
          value={honeypot}
          onChange={(ev) => setHoneypot(ev.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="landing-review-honeypot"
        />
        <input
          type="text"
          value={nome}
          onChange={(ev) => setNome(ev.target.value)}
          placeholder={t('reviews.namePlaceholder')}
          maxLength={40}
          required
          className="landing-review-input"
        />
        <input
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder={t('reviews.emailPlaceholder')}
          required
          className="landing-review-input"
        />
        <textarea
          value={texto}
          onChange={(ev) => setTexto(ev.target.value)}
          placeholder={t('reviews.textPlaceholder')}
          minLength={20}
          maxLength={500}
          required
          rows={3}
          className="landing-review-textarea"
        />
        <RecaptchaCheckbox onChange={setRecaptchaOk} resetKey={recaptchaKey} />
        {erro && <p className="landing-review-error">{erro}</p>}
        {estado === 'done' && <p className="landing-review-success">{t('reviews.success')}</p>}
        <button type="submit" disabled={!recaptchaOk || enviando} className="landing-review-submit">
          {enviando ? <Loader2 size={16} className="spin-icon" /> : <Send size={16} />}
          {enviando ? t('reviews.sending') : t('reviews.submit')}
        </button>
      </form>
    </section>
  )
}
