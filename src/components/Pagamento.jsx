import { useState } from 'react'

const CORES = {
  fundo: '#0B071E', dourado: '#DFB76C', douradoEscuro: '#B8944F',
  branco: '#FFFFFF', brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)', vidro: 'rgba(255,255,255,0.06)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

const METODOS = [
  {
    id: 'mbway',
    nome: 'MBWay',
    icone: '📱',
    paises: 'Portugal',
    desc: 'Pagamento instantâneo via app MBWay',
    cor: '#E30000',
  },
  {
    id: 'multibanco',
    nome: 'Multibanco',
    icone: '🏧',
    paises: 'Portugal',
    desc: 'Referência gerada — paga em qualquer ATM',
    cor: '#005B99',
  },
  {
    id: 'pix',
    nome: 'PIX',
    icone: '💚',
    paises: 'Brasil',
    desc: 'Pagamento instantâneo via PIX',
    cor: '#00BDAE',
  },
  {
    id: 'paypal',
    nome: 'PayPal',
    icone: '🅿️',
    paises: 'Internacional',
    desc: 'Paga com a tua conta PayPal',
    cor: '#003087',
  },
]

// Simulação de referência Multibanco (em produção: chamada ao Eupago/ifthenpay)
function gerarRefMultibanco() {
  const entidade = '21364'
  const ref = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('')
    .replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  return { entidade, referencia: ref }
}

// Chave PIX demonstrativa (em produção: chave real do comerciante)
const PIX_CHAVE = 'sidus@astrologia.app'

export function ModalPagamento({ valor, descricao, onSucesso, onFechar }) {
  const [metodo, setMetodo] = useState(null)
  const [fase, setFase] = useState('seleccionar') // seleccionar | detalhes | confirmado
  const [telemovel, setTelemovel] = useState('')
  const [processando, setProcessando] = useState(false)
  const refMB = gerarRefMultibanco()

  const confirmarPagamento = async () => {
    setProcessando(true)
    // Simulação: em produção, aqui chamaríamos a API do gateway de pagamento
    await new Promise(r => setTimeout(r, 2000))
    setProcessando(false)
    setFase('confirmado')
    if (onSucesso) setTimeout(onSucesso, 1500)
  }

  if (fase === 'confirmado') {
    return (
      <Overlay onFechar={onFechar}>
        <div style={{ textAlign: 'center', padding: 8 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h3 style={{ color: '#34D399', fontSize: 20, marginBottom: 8 }}>Pagamento confirmado!</h3>
          <p style={{ color: CORES.brancoMuted, fontSize: 14 }}>A tua leitura está a ser desbloqueada...</p>
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay onFechar={onFechar}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, color: CORES.dourado, fontSize: 18 }}>Pagamento</h3>
          <p style={{ margin: 0, color: CORES.brancoMuted, fontSize: 13 }}>{descricao}</p>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: CORES.dourado }}>{valor.toFixed(2)} €</div>
      </div>

      {fase === 'seleccionar' && (
        <>
          <p style={{ fontSize: 12, color: CORES.brancoMuted, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Escolhe o método
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {METODOS.map(m => (
              <button key={m.id} type="button" onClick={() => { setMetodo(m); setFase('detalhes') }} style={{
                background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 28 }}>{m.icone}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: CORES.branco }}>{m.nome}</div>
                  <div style={{ fontSize: 11, color: CORES.brancoMuted }}>{m.desc}</div>
                </div>
                <span style={{ fontSize: 10, color: CORES.brancoMuted, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '2px 6px' }}>{m.paises}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {fase === 'detalhes' && metodo?.id === 'mbway' && (
        <div>
          <button type="button" onClick={() => setFase('seleccionar')} style={{ background: 'none', border: 'none', color: CORES.brancoMuted, cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0 }}>← Voltar</button>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: CORES.dourado, display: 'block', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Número de telemóvel
            </label>
            <input
              type="tel" placeholder="9XX XXX XXX" value={telemovel}
              onChange={e => setTelemovel(e.target.value)}
              style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: `1px solid ${CORES.vidroBorda}`, borderRadius: 10, color: CORES.branco, fontSize: 16, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ background: 'rgba(227,0,0,0.1)', border: '1px solid rgba(227,0,0,0.3)', borderRadius: 10, padding: 12, fontSize: 12, color: CORES.brancoMuted, marginBottom: 16 }}>
            📱 Vais receber uma notificação no MBWay para confirmar o pagamento de <b style={{ color: CORES.branco }}>{valor.toFixed(2)} €</b>.
          </div>
          <BotaoConfirmar processando={processando} onClick={confirmarPagamento} />
        </div>
      )}

      {fase === 'detalhes' && metodo?.id === 'multibanco' && (
        <div>
          <button type="button" onClick={() => setFase('seleccionar')} style={{ background: 'none', border: 'none', color: CORES.brancoMuted, cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0 }}>← Voltar</button>
          <div style={{ background: 'rgba(0,91,153,0.12)', border: '1px solid rgba(0,91,153,0.4)', borderRadius: 14, padding: 20, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: CORES.brancoMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Referência Multibanco</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
              <div>
                <div style={{ fontSize: 10, color: CORES.brancoMuted }}>Entidade</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: CORES.branco, letterSpacing: '0.1em' }}>{refMB.entidade}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: CORES.brancoMuted }}>Referência</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: CORES.branco, letterSpacing: '0.1em' }}>{refMB.referencia}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: CORES.brancoMuted }}>Montante</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: CORES.dourado }}>{valor.toFixed(2)} €</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: CORES.brancoMuted }}>Validade</div>
                <div style={{ fontSize: 14, color: CORES.branco }}>48 horas</div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: CORES.brancoMuted, marginBottom: 16, textAlign: 'center' }}>
            ⚠️ <em>Atenção: referência demonstrativa. A integração real requer backend Eupago/ifthenpay.</em>
          </p>
          <BotaoConfirmar processando={processando} onClick={confirmarPagamento} label="Já paguei — Confirmar" />
        </div>
      )}

      {fase === 'detalhes' && metodo?.id === 'pix' && (
        <div>
          <button type="button" onClick={() => setFase('seleccionar')} style={{ background: 'none', border: 'none', color: CORES.brancoMuted, cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0 }}>← Voltar</button>
          <div style={{ background: 'rgba(0,189,174,0.1)', border: '1px solid rgba(0,189,174,0.35)', borderRadius: 14, padding: 20, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: CORES.brancoMuted, marginBottom: 10 }}>Chave PIX</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#00BDAE', marginBottom: 14, wordBreak: 'break-all' }}>{PIX_CHAVE}</div>
            <div style={{ width: 120, height: 120, background: 'white', margin: '0 auto', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
              🟩
            </div>
            <p style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 10 }}>Escaneia com o teu banco ou copia a chave PIX</p>
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(0,189,174,0.1)', borderRadius: 8, fontSize: 14, color: CORES.branco }}>
              Valor: <b>{valor.toFixed(2)} €</b>
            </div>
          </div>
          <BotaoConfirmar processando={processando} onClick={confirmarPagamento} label="Já transferi — Confirmar" />
        </div>
      )}

      {fase === 'detalhes' && metodo?.id === 'paypal' && (
        <div>
          <button type="button" onClick={() => setFase('seleccionar')} style={{ background: 'none', border: 'none', color: CORES.brancoMuted, cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0 }}>← Voltar</button>
          <div style={{ background: 'rgba(0,48,135,0.15)', border: '1px solid rgba(0,48,135,0.4)', borderRadius: 14, padding: 20, marginBottom: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🅿️</div>
            <p style={{ color: CORES.brancoMuted, fontSize: 13, marginBottom: 16 }}>
              Serás redireccionado para o PayPal para pagar <b style={{ color: CORES.branco }}>{valor.toFixed(2)} €</b>.
            </p>
            <button type="button" onClick={() => window.open('https://www.paypal.com/paypalme/sidusapp', '_blank')} style={{
              background: '#0070BA', border: 'none', borderRadius: 10, color: '#fff',
              fontSize: 14, fontWeight: 700, padding: '12px 28px', cursor: 'pointer',
            }}>
              Pagar com PayPal
            </button>
          </div>
          <BotaoConfirmar processando={processando} onClick={confirmarPagamento} label="Já paguei — Confirmar" />
        </div>
      )}
    </Overlay>
  )
}

function Overlay({ children, onFechar }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onFechar}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 430, background: '#12082A',
        borderTop: `1px solid rgba(223,183,108,0.3)`, borderRadius: '20px 20px 0 0',
        padding: 24, paddingBottom: 40, maxHeight: '85vh', overflowY: 'auto',
      }}>
        {children}
      </div>
    </div>
  )
}

function BotaoConfirmar({ processando, onClick, label = 'Confirmar pagamento' }) {
  return (
    <button type="button" disabled={processando} onClick={onClick} style={{
      width: '100%', background: processando ? 'rgba(223,183,108,0.3)' : `linear-gradient(135deg, #DFB76C, #B8944F)`,
      border: 'none', borderRadius: 12, color: '#0B071E', fontSize: 15, fontWeight: 700,
      padding: '14px', cursor: processando ? 'default' : 'pointer',
    }}>
      {processando ? '⏳ A processar...' : label}
    </button>
  )
}
