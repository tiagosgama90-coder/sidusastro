import { useEffect, useRef, useState, useCallback } from 'react'

const TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || TEST_KEY

const CORES = {
  dourado: '#DFB76C',
  brancoMuted: 'rgba(255,255,255,0.55)',
  branco: '#FFFFFF',
}

function hostnameLocal() {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1'
}

/** Chave de teste Google só funciona em localhost — em produção exige chave real no Netlify. */
function deveUsarGoogleRecaptcha() {
  if (!SITE_KEY) return false
  if (SITE_KEY === TEST_KEY && !hostnameLocal()) return false
  return true
}

let scriptPromise = null

function aguardarGrecaptcha() {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'))
  if (window.grecaptcha?.render) {
    return new Promise((resolve) => {
      window.grecaptcha.ready(() => resolve(window.grecaptcha))
    })
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existente = document.querySelector('script[src*="recaptcha/api.js"]')
      if (existente) {
        const poll = () => {
          if (window.grecaptcha?.render) {
            window.grecaptcha.ready(() => resolve(window.grecaptcha))
          } else {
            setTimeout(poll, 50)
          }
        }
        poll()
        setTimeout(() => reject(new Error('Timeout reCAPTCHA')), 15000)
        return
      }

      window.__sidusRecaptchaOnload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => resolve(window.grecaptcha))
        } else {
          reject(new Error('grecaptcha indisponível'))
        }
      }

      const script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js?onload=__sidusRecaptchaOnload&render=explicit'
      script.async = true
      script.defer = true
      script.onerror = () => reject(new Error('Falha ao carregar script reCAPTCHA'))
      document.head.appendChild(script)

      setTimeout(() => reject(new Error('Timeout reCAPTCHA')), 15000)
    })
  }

  return scriptPromise
}

/** Checkbox nativo — funciona sempre (produção sem chave Google registada). */
function VerificacaoHumana({ onChange }) {
  const [marcado, setMarcado] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  useEffect(() => {
    onChange?.(marcado && honeypot === '')
  }, [marcado, honeypot, onChange])

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      userSelect: 'none',
    }}>
      {/* Honeypot — bots preenchem, humanos não vêem */}
      <input
        type="text"
        name="company"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
      />
      <input
        id="sidus-nao-robot"
        type="checkbox"
        checked={marcado}
        onChange={(e) => setMarcado(e.target.checked)}
        style={{ width: 18, height: 18, accentColor: CORES.dourado, cursor: 'pointer' }}
      />
      <label htmlFor="sidus-nao-robot" style={{ fontSize: 13, color: CORES.branco, cursor: 'pointer', flex: 1 }}>
        Não sou um robot
      </label>
      <span style={{ fontSize: 10, color: CORES.brancoMuted }}>✓ Verificação</span>
    </div>
  )
}

function GoogleRecaptcha({ onChange, resetKey }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const renderWidget = useCallback(async () => {
    const grecaptcha = await aguardarGrecaptcha()
    if (!containerRef.current) return

    if (widgetIdRef.current != null) {
      try {
        grecaptcha.reset(widgetIdRef.current)
      } catch { /* widget removido */ }
      widgetIdRef.current = null
    }

    containerRef.current.innerHTML = ''
    widgetIdRef.current = grecaptcha.render(containerRef.current, {
      sitekey: SITE_KEY,
      theme: 'dark',
      callback: () => onChangeRef.current?.(true),
      'expired-callback': () => onChangeRef.current?.(false),
      'error-callback': () => onChangeRef.current?.(false),
    })
  }, [])

  useEffect(() => {
    onChangeRef.current?.(false)
    let cancelado = false

    renderWidget().catch((e) => {
      console.warn('[Sidus reCAPTCHA]', e?.message)
      if (!cancelado) onChangeRef.current?.(false)
    })

    return () => {
      cancelado = true
      onChangeRef.current?.(false)
    }
  }, [resetKey, renderWidget])

  return (
    <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', minHeight: 78 }} />
  )
}

export function RecaptchaCheckbox({ onChange, resetKey = 0 }) {
  const [modo, setModo] = useState(() => (deveUsarGoogleRecaptcha() ? 'google' : 'humano'))
  const [googleFalhou, setGoogleFalhou] = useState(false)

  useEffect(() => {
    if (!deveUsarGoogleRecaptcha()) {
      setModo('humano')
      return
    }
    setModo('google')
    setGoogleFalhou(false)

    aguardarGrecaptcha()
      .then(() => setModo('google'))
      .catch(() => {
        setGoogleFalhou(true)
        setModo('humano')
      })
  }, [resetKey])

  if (modo === 'humano') {
    return (
      <div>
        {googleFalhou && deveUsarGoogleRecaptcha() && (
          <p style={{ fontSize: 11, color: CORES.brancoMuted, marginBottom: 8, lineHeight: 1.4 }}>
            reCAPTCHA Google indisponível neste domínio — usa a verificação abaixo.
          </p>
        )}
        <VerificacaoHumana onChange={onChange} key={resetKey} />
      </div>
    )
  }

  return <GoogleRecaptcha onChange={onChange} resetKey={resetKey} />
}
