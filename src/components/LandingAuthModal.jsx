import { useState, useEffect, useCallback } from 'react'
import { Eye, EyeOff, Loader2, X } from 'lucide-react'
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  reload,
} from 'firebase/auth'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { auth } from '../lib/firebase'
import { enviarEmailRecuperacaoSenha, traduzirErroEmail } from '../lib/authEmail'
import { traduzirErroAuth } from '../lib/i18n/authErrors.js'
import { flushLandingDraft } from '../lib/landingDraft.js'
import { RecaptchaCheckbox } from './Recaptcha.jsx'

const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
  fundo: '#0B071E',
}

const estilos = {
  label: {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: CORES.dourado,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '13px 14px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: `1px solid ${CORES.vidroBorda}`,
    borderRadius: 12,
    color: CORES.branco,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  },
  botaoDourado: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, #DFB76C 0%, #B8944F 100%)',
    color: CORES.fundo,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
}

export function LandingAuthModal({ open, onClose, onRegister, firebaseOk = true }) {
  const { lang, t } = useLanguage()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [verSenha, setVerSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [info, setInfo] = useState(null)
  const [emRecuperacao, setEmRecuperacao] = useState(false)

  const traduzirErro = useCallback((code) => traduzirErroAuth(code, lang), [lang])

  useEffect(() => {
    if (!open) return undefined
    setErro(null)
    setInfo(null)
    setEmRecuperacao(false)
    const scrollY = window.scrollY
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = '0'
    document.body.style.right = '0'
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const handleRecuperarSenha = async () => {
    setErro(null)
    setInfo(null)
    if (!email?.trim()) { setErro(t('auth.errors.auth/missing-email')); return }
    if (!auth) { setErro(t('auth.firebaseMissing')); return }
    setCarregando(true)
    try {
      const addr = await enviarEmailRecuperacaoSenha(email)
      setInfo(`${t('auth.forgot.sent', { email: addr })}\n\n${t('auth.forgot.checkSpam')}`)
    } catch (e) {
      setErro(traduzirErroEmail(e?.code, e?.message, lang))
    } finally {
      setCarregando(false)
    }
  }

  const handleLogin = async () => {
    if (emRecuperacao) {
      await handleRecuperarSenha()
      return
    }
    setErro(null)
    setInfo(null)
    if (!email || !senha) { setErro(t('auth.fillAll')); return }
    if (!auth) { setErro(t('auth.firebaseMissing')); return }
    flushLandingDraft()
    setCarregando(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha)
      await reload(cred.user)
      await cred.user.getIdToken(true)
      onClose?.()
    } catch (e) {
      setErro(traduzirErro(e.code) + (e.code ? ` [${e.code}]` : ''))
    } finally {
      setCarregando(false)
    }
  }

  const handleGoogle = async () => {
    if (!auth) { setErro(t('auth.firebaseMissing')); return }
    flushLandingDraft()
    setErro(null)
    setInfo(null)
    setCarregando(true)
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
      onClose?.()
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') {
        setErro(traduzirErro(e.code) + ` [${e.code}]`)
      }
    } finally {
      setCarregando(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="landing-auth-modal"
      role="dialog"
      aria-modal="true"
      aria-label={t('auth.portal.loginModal.ariaLabel')}
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="landing-auth-modal__panel">
        <button
          type="button"
          className="landing-auth-modal__close"
          onClick={onClose}
          aria-label={t('common.close')}
        >
          <X size={20} />
        </button>

        <h2 className="landing-auth-modal__title">
          {emRecuperacao ? t('auth.forgot.title') : t('auth.portal.loginModal.title')}
        </h2>

        {emRecuperacao && (
          <p className="landing-auth-modal__intro">{t('auth.forgot.intro')}</p>
        )}

        {!firebaseOk && (
          <div className="landing-auth-modal__alert landing-auth-modal__alert--warn">
            {t('auth.firebaseNotConfigured')}
          </div>
        )}

        <div className="landing-auth-field" style={{ marginBottom: 16 }}>
          <label style={estilos.label}>{t('auth.email')}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
            className="landing-auth-input"
            style={estilos.input}
            autoComplete="email"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {!emRecuperacao && (
          <div className="landing-auth-field landing-auth-password-block" style={{ marginBottom: 20 }}>
            <label style={estilos.label}>{t('auth.password')}</label>
            <div className="landing-auth-password-input">
              <input
                type={verSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="landing-auth-input"
                style={{ ...estilos.input, paddingRight: 44 }}
                autoComplete="current-password"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setVerSenha((v) => !v)}
                className="landing-auth-modal__eye"
                aria-label={verSenha ? 'Hide password' : 'Show password'}
              >
                {verSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="landing-auth-forgot-wrap">
              <button
                type="button"
                className="landing-auth-forgot"
                onClick={() => {
                  setEmRecuperacao(true)
                  setErro(null)
                  setInfo(null)
                }}
              >
                {t('auth.forgotPassword')}
              </button>
            </div>
          </div>
        )}

        {erro && (
          <div className="landing-auth-modal__alert landing-auth-modal__alert--error">{erro}</div>
        )}
        {info && (
          <div className="landing-auth-modal__alert landing-auth-modal__alert--ok">{info}</div>
        )}

        <button
          type="button"
          disabled={carregando}
          onClick={handleLogin}
          style={{ ...estilos.botaoDourado, opacity: carregando ? 0.6 : 1 }}
        >
          {carregando
            ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            : emRecuperacao
              ? t('auth.forgot.submit')
              : t('auth.login')}
        </button>

        {emRecuperacao ? (
          <p className="landing-auth-modal__switch">
            <button
              type="button"
              onClick={() => { setEmRecuperacao(false); setErro(null); setInfo(null) }}
            >
              ← {t('auth.forgot.backToLogin')}
            </button>
          </p>
        ) : (
          <>
            <div className="landing-auth-modal__divider">
              <span>{t('auth.or')}</span>
            </div>
            <button type="button" disabled={carregando} onClick={handleGoogle} className="landing-auth-modal__google">
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1C9.5 35.7 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.2 5.2C40.9 35.6 44 30.2 44 24c0-1.3-.1-2.7-.4-3.9z"/>
              </svg>
              {t('auth.google')}
            </button>
            <p className="landing-auth-modal__switch">
              {t('auth.noAccount')}{' '}
              <button
                type="button"
                onClick={() => {
                  onClose?.()
                  onRegister?.()
                }}
              >
                {t('auth.createHere')}
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
