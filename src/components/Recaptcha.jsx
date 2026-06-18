import { useEffect, useRef, useState, useCallback } from 'react'

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

let scriptLoading = null

function loadRecaptchaScript() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.grecaptcha) return Promise.resolve()
  if (scriptLoading) return scriptLoading
  scriptLoading = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-sidus-recaptcha]')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('reCAPTCHA')))
      return
    }
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.sidusRecaptcha = '1'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Não foi possível carregar o reCAPTCHA'))
    document.head.appendChild(script)
  })
  return scriptLoading
}

export function RecaptchaCheckbox({ onChange, resetKey = 0 }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const [erro, setErro] = useState(null)

  const reset = useCallback(() => {
    if (window.grecaptcha && widgetIdRef.current != null) {
      try { window.grecaptcha.reset(widgetIdRef.current) } catch { /* ignore */ }
    }
    onChange?.(false)
  }, [onChange])

  useEffect(() => {
    let cancelled = false
    onChange?.(false)

    loadRecaptchaScript()
      .then(() => {
        if (cancelled || !containerRef.current) return
        if (widgetIdRef.current != null) {
          try { window.grecaptcha.reset(widgetIdRef.current) } catch { /* ignore */ }
          return
        }
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: 'dark',
          callback: () => onChange?.(true),
          'expired-callback': () => onChange?.(false),
          'error-callback': () => onChange?.(false),
        })
      })
      .catch((e) => {
        if (!cancelled) setErro(e.message)
      })

    return () => { cancelled = true }
  }, [resetKey, onChange])

  useEffect(() => {
    reset()
  }, [resetKey, reset])

  if (erro) {
    return (
      <p style={{ fontSize: 12, color: '#F87171', margin: '8px 0 0' }}>
        reCAPTCHA indisponível. Recarrega a página e tenta outra vez.
      </p>
    )
  }

  return <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }} />
}
