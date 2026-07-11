import { useState, useEffect } from 'react'
import { useNotificacoesDiarias } from '../hooks/useNotificacoesDiarias.js'

const CORES = {
  dourado: '#DFB76C',
  roxo: '#8B5CF6',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255,255,255,0.7)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
  fundo: 'rgba(11, 7, 30, 0.6)',
}

export function WidgetNotificacoesDiarias({ user, isPremium, onUpgrade }) {
  const { permission, subscription, loading, inscreverNotificacoes, cancelarNotificacoes, verificarStatus } = useNotificacoesDiarias(user, isPremium)
  const [ativo, setAtivo] = useState(false)
  const [verificado, setVerificado] = useState(false)
  const [brilho, setBrilho] = useState(false)

  useEffect(() => {
    verificarStatus().then(setVerificado)
  }, [verificarStatus])

  // Animação de brilho místico
  useEffect(() => {
    if (!isPremium) return
    const interval = setInterval(() => {
      setBrilho(v => !v)
    }, 3000)
    return () => clearInterval(interval)
  }, [isPremium])

  const handleToggle = async () => {
    if (ativo) {
      await cancelarNotificacoes()
      setAtivo(false)
    } else {
      const sucesso = await inscreverNotificacoes()
      setAtivo(sucesso)
    }
  }

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
        {/* Efeito de brilho místico */}
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          animation: 'pulse 3s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, position: 'relative' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${CORES.roxo} 0%, ${CORES.dourado} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
            animation: 'glow 2s ease-in-out infinite',
          }}>
            ✧
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: CORES.branco, letterSpacing: '0.02em' }}>
              Notificações Diárias Místicas
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: CORES.dourado, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ✦ Recurso Premium ✦
            </p>
          </div>
        </div>
        
        <p style={{ fontSize: 14, color: CORES.brancoMuted, lineHeight: 1.7, marginBottom: 18 }}>
          Receba horóscopos personalizados todos os dias no seu telemóvel. 
          Baseado em trânsitos planetários reais e sua carta natal.
        </p>

        <button
          onClick={onUpgrade}
          style={{
            width: '100%',
            padding: '14px 20px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(223, 183, 108, 0.2) 100%)',
            border: '1px solid rgba(223, 183, 108, 0.5)',
            borderRadius: 14,
            color: CORES.branco,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.2)'
          }}
        >
          ✧ Ativar Premium para Desbloquear ✧
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: CORES.fundo,
      border: `1px solid ${CORES.vidroBorda}`,
      borderRadius: 16,
      padding: '20px 24px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${CORES.roxo} 0%, ${CORES.dourado} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
        }}>
          ✧
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: CORES.branco }}>
            Notificações Diárias
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: CORES.brancoMuted }}>
            {ativo ? 'Ativado' : verificado ? 'Desativado' : 'Clique para ativar'}
          </p>
        </div>
      </div>

      <p style={{ fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.6, marginBottom: 16 }}>
        Receba horóscopos personalizados todos os dias no seu telemóvel. 
        Baseado em trânsitos planetários reais e sua carta natal.
      </p>

      <button
        onClick={handleToggle}
        disabled={loading}
        style={{
          width: '100%',
          padding: '12px 20px',
          background: ativo 
            ? 'linear-gradient(135deg, rgba(248, 113, 113, 0.2) 0%, rgba(248, 113, 113, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(223, 183, 108, 0.1) 100%)',
          border: `1px solid ${ativo ? 'rgba(248, 113, 113, 0.4)' : CORES.vidroBorda}`,
          borderRadius: 12,
          color: CORES.branco,
          fontSize: 14,
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.3s ease',
        }}
      >
        {loading ? 'Processando...' : ativo ? 'Desativar Notificações' : 'Ativar Notificações Diárias'}
      </button>

      {permission === 'denied' && (
        <p style={{ 
          fontSize: 11, 
          color: 'rgba(248, 113, 113, 0.8)', 
          marginTop: 10,
          lineHeight: 1.5,
        }}>
          Notificações bloqueadas. Ative nas configurações do navegador.
        </p>
      )}
    </div>
  )
}