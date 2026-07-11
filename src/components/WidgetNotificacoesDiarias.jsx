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

export function WidgetNotificacoesDiarias({ user, isPremium }) {
  const { permission, subscription, loading, inscreverNotificacoes, cancelarNotificacoes, verificarStatus } = useNotificacoesDiarias(user, isPremium)
  const [ativo, setAtivo] = useState(false)
  const [verificado, setVerificado] = useState(false)

  useEffect(() => {
    verificarStatus().then(setVerificado)
  }, [verificarStatus])

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
        background: CORES.fundo,
        border: `1px solid ${CORES.vidroBorda}`,
        borderRadius: 16,
        padding: '20px 24px',
        backdropFilter: 'blur(10px)',
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
          }}>
            ✧
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: CORES.branco }}>
              Notificações Diárias
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: CORES.brancoMuted }}>
              Disponível apenas para Premium
            </p>
          </div>
        </div>
        <p style={{ fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.6 }}>
          Ative o Premium para receber horóscopos personalizados todos os dias no seu telemóvel.
        </p>
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