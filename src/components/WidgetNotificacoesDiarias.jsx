import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useNotificacoesDiarias } from '../hooks/useNotificacoesDiarias.js'
import { emailTemPremiumPrivilegiado } from '../lib/premiumAccess.js'
import { normalizeSignoNome } from '../lib/i18n/astro.js'

const CORES = {
  dourado: '#DFB76C',
  roxo: '#8B5CF6',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.7)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
  fundo: 'rgba(11, 7, 30, 0.6)',
}

export function WidgetNotificacoesDiarias({ user, mapaNatal, isPremium, onUpgrade }) {
  const { t, lang } = useLanguage()
  const signoSolar = normalizeSignoNome(mapaNatal?.solar?.nome) || null
  const isCriador = emailTemPremiumPrivilegiado(user)

  const {
    permission, loading, erro,
    inscreverNotificacoes, cancelarNotificacoes,
    verificarStatus, testarNotificacao,
  } = useNotificacoesDiarias({ user, signoSolar, lang, isPremium })

  const [ativo, setAtivo] = useState(false)
  const [jaVerificado, setJaVerificado] = useState(false)
  const [aTestar, setATestar] = useState(false)

  // Verificar estado ao montar, quando muda de utilizador ou quando o signo solar fica disponível
  useEffect(() => {
    let cancelado = false
    verificarStatus().then((status) => {
      if (!cancelado) {
        setAtivo(status)
        setJaVerificado(true)
      }
    })
    return () => { cancelado = true }
  }, [user?.uid, signoSolar, verificarStatus])

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined
    const onControllerChange = () => {
      if (ativo) verificarStatus()
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
  }, [ativo, verificarStatus])

  const handleToggle = useCallback(async () => {
    if (loading) return
    if (ativo) {
      await cancelarNotificacoes()
      setAtivo(false)
    } else {
      const ok = await inscreverNotificacoes()
      if (ok) setAtivo(true)
    }
  }, [ativo, loading, cancelarNotificacoes, inscreverNotificacoes])

  const handleTestar = useCallback(async () => {
    setATestar(true)
    const ok = await testarNotificacao()
    if (!ok) {
      // erro já tratado no hook via setErro indirectamente — mostrar inline
    }
    setATestar(false)
  }, [testarNotificacao])

  if (!isPremium) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(223, 183, 108, 0.05) 100%)',
        border: '1px solid rgba(223, 183, 108, 0.3)',
        borderRadius: 20,
        padding: '24px 28px',
        backdropFilter: 'blur(12px)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 120, height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `linear-gradient(135deg, ${CORES.roxo} 0%, ${CORES.dourado} 100%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          }}>✧</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: CORES.branco }}>{t('notificacoes.title')}</h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: CORES.dourado, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {t('notificacoes.premiumBadge')}
            </p>
          </div>
        </div>
        <p style={{ fontSize: 14, color: CORES.brancoMuted, lineHeight: 1.7, marginBottom: 12 }}>{t('notificacoes.desc')}</p>
        <button type="button" onClick={onUpgrade} style={{
          width: '100%', padding: '14px 20px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(223, 183, 108, 0.2) 100%)',
          border: '1px solid rgba(223, 183, 108, 0.5)', borderRadius: 14,
          color: CORES.branco, fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          ✧ {t('notificacoes.unlockCta')} ✧
        </button>
      </div>
    )
  }

  const statusTexto = loading
    ? t('notificacoes.processing')
    : ativo
      ? t('notificacoes.statusOn')
      : jaVerificado
        ? t('notificacoes.statusOff')
        : t('notificacoes.statusIdle')

  return (
    <div style={{
      background: CORES.fundo,
      border: `1px solid ${CORES.vidroBorda}`,
      borderRadius: 16,
      padding: '20px 24px',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: `linear-gradient(135deg, ${CORES.roxo} 0%, ${CORES.dourado} 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>✧</div>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: CORES.branco }}>{t('notificacoes.title')}</h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: CORES.brancoMuted }}>{statusTexto}</p>
        </div>
      </div>

      <p style={{ fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.6, marginBottom: 10 }}>{t('notificacoes.desc')}</p>
      <p style={{ fontSize: 11, color: CORES.dourado, lineHeight: 1.55, marginBottom: 16 }}>{t('notificacoes.howTo')}</p>

      {signoSolar ? (
        <p style={{ fontSize: 11, color: CORES.brancoMuted, marginBottom: 12 }}>
          {t('notificacoes.signoLabel', { signo: signoSolar })}
        </p>
      ) : (
        <p style={{ fontSize: 11, color: 'rgba(248, 113, 113, 0.8)', marginBottom: 12, lineHeight: 1.5 }}>
          {t('home.horoscopeNoMap')}
        </p>
      )}

      <button
        type="button"
        onClick={handleToggle}
        disabled={loading || (!ativo && !signoSolar)}
        style={{
          width: '100%', padding: '12px 20px',
          background: ativo
            ? 'linear-gradient(135deg, rgba(248, 113, 113, 0.2) 0%, rgba(248, 113, 113, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(223, 183, 108, 0.1) 100%)',
          border: `1px solid ${ativo ? 'rgba(248, 113, 113, 0.4)' : CORES.vidroBorda}`,
          borderRadius: 12, color: CORES.branco, fontSize: 14, fontWeight: 600,
          cursor: loading || (!ativo && !signoSolar) ? 'not-allowed' : 'pointer',
          opacity: loading || (!ativo && !signoSolar) ? 0.6 : 1,
        }}
      >
        {loading ? t('notificacoes.processing') : ativo ? t('notificacoes.deactivate') : t('notificacoes.activate')}
      </button>

      {ativo && (
        <button
          type="button"
          onClick={handleTestar}
          disabled={aTestar || loading}
          style={{
            width: '100%', padding: '10px 20px', marginTop: 8,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${CORES.vidroBorda}`,
            borderRadius: 12, color: CORES.dourado, fontSize: 13, fontWeight: 600,
            cursor: aTestar ? 'not-allowed' : 'pointer', opacity: aTestar ? 0.6 : 1,
          }}
        >
          {aTestar ? t('notificacoes.testing') : t('notificacoes.testNow')}
        </button>
      )}

      {isCriador && ativo && (
        <p style={{ fontSize: 10, color: 'rgba(223,183,108,0.5)', marginTop: 8, lineHeight: 1.5 }}>
          {t('notificacoes.creatorHint')}
        </p>
      )}

      {permission === 'denied' && !ativo && (
        <p style={{ fontSize: 11, color: 'rgba(248, 113, 113, 0.8)', marginTop: 10, lineHeight: 1.5 }}>
          {t('notificacoes.blocked')}
        </p>
      )}

      {erro && (
        <p style={{ fontSize: 11, color: 'rgba(248, 113, 113, 0.8)', marginTop: 10, lineHeight: 1.5 }}>
          ⚠ {erro}
        </p>
      )}
    </div>
  )
}
