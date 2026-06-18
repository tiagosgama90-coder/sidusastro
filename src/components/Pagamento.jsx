import { useState } from 'react'

const CORES = {
  fundo: '#0B071E', dourado: '#DFB76C', douradoEscuro: '#B8944F',
  branco: '#FFFFFF', brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)', vidro: 'rgba(255,255,255,0.06)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

const METODOS_STRIPE = [
  { icone: '💳', nome: 'Cartão', desc: 'Visa, Mastercard, Amex' },
  { icone: '📱', nome: 'MB Way', desc: 'Portugal — pagamento instantâneo' },
  { icone: '🏧', nome: 'Multibanco', desc: 'Portugal — referência ou ATM' },
  { icone: '🅿️', nome: 'PayPal', desc: 'Conta PayPal internacional' },
  { icone: '💚', nome: 'PIX', desc: 'Brasil — quando disponível na tua região' },
  { icone: '🔗', nome: 'Link / Apple Pay / Google Pay', desc: 'Checkout rápido Stripe' },
]

function productTypeFromValor(valor, descricao) {
  if (valor >= 4.99 || /vip|premium|subscri/i.test(descricao || '')) return 'premium'
  return 'tarot'
}

async function criarSessaoStripe({ valor, descricao, userId, userEmail, productType }) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor, descricao, userId, userEmail, productType }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Não foi possível iniciar o pagamento')
  if (!data.url) throw new Error('URL de pagamento inválida')
  return data
}

export function ModalPagamento({ valor, descricao, userId, userEmail, onSucesso, onFechar }) {
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState(null)

  const productType = productTypeFromValor(valor, descricao)
  const isSubscription = productType === 'premium'

  const iniciarStripe = async () => {
    if (!userId) {
      setErro('Precisas de iniciar sessão antes de pagar.')
      return
    }
    setErro(null)
    setProcessando(true)
    try {
      sessionStorage.setItem('sidus_payment_pending', JSON.stringify({
        productType,
        descricao,
        ts: Date.now(),
      }))
      const { url } = await criarSessaoStripe({ valor, descricao, userId, userEmail, productType })
      if (onSucesso) {
        sessionStorage.setItem('sidus_payment_callback', '1')
      }
      window.location.href = url
    } catch (e) {
      setErro(e.message || 'Erro ao ligar ao Stripe')
      setProcessando(false)
    }
  }

  return (
    <Overlay onFechar={onFechar}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, color: CORES.dourado, fontSize: 18 }}>Pagamento seguro</h3>
          <p style={{ margin: 0, color: CORES.brancoMuted, fontSize: 13 }}>{descricao}</p>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: CORES.dourado }}>
          {valor.toFixed(2)} €{isSubscription ? <span style={{ fontSize: 12, fontWeight: 400 }}>/mês</span> : null}
        </div>
      </div>

      <div style={{
        background: 'rgba(99,91,255,0.1)', border: '1px solid rgba(99,91,255,0.35)',
        borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>🔒</span>
        <p style={{ margin: 0, fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.5 }}>
          Processado por <strong style={{ color: CORES.branco }}>Stripe</strong>.
          {isSubscription ? ' Subscrição mensal cancelável a qualquer momento.' : ' Pagamento único.'}
        </p>
      </div>

      <p style={{ fontSize: 11, color: CORES.brancoMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Métodos disponíveis (conforme região)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {METODOS_STRIPE.map(m => (
          <div key={m.nome} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '10px 12px',
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icone}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: CORES.branco }}>{m.nome}</div>
            <div style={{ fontSize: 10, color: CORES.brancoMuted, lineHeight: 1.4 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      {erro && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', fontSize: 13, color: '#F87171' }}>
          {erro}
        </div>
      )}

      <button type="button" disabled={processando} onClick={iniciarStripe} style={{
        width: '100%',
        background: processando ? 'rgba(99,91,255,0.4)' : 'linear-gradient(135deg, #635BFF, #4F46E5)',
        border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 700,
        padding: '15px', cursor: processando ? 'default' : 'pointer',
      }}>
        {processando ? '⏳ A redirecionar para Stripe…' : `Pagar ${valor.toFixed(2)} € — Stripe Checkout`}
      </button>

      <p style={{ textAlign: 'center', fontSize: 10, color: CORES.brancoMuted, marginTop: 12, lineHeight: 1.5 }}>
        MB Way, Multibanco, PayPal e PIX aparecem automaticamente se estiverem activos na tua conta Stripe e disponíveis para o teu país.
      </p>
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

/** Verifica sessão Stripe após redirect de sucesso */
export async function verificarSessaoPagamento(sessionId, userId) {
  const res = await fetch('/api/verify-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, userId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro na verificação')
  return data
}
