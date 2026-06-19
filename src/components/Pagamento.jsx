import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { inferProductType } from '../lib/pricing.js'
import { metodosParaProduto } from '../lib/paymentMethods.js'

const CORES = {
  fundo: '#0B071E', dourado: '#DFB76C', douradoEscuro: '#B8944F',
  branco: '#FFFFFF', brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)', vidro: 'rgba(255,255,255,0.06)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

async function criarSessaoStripe({ valor, descricao, userId, userEmail, productType, paymentMethod }) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor, descricao, userId, userEmail, productType, paymentMethod }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'sessionFail')
  if (!data.url) throw new Error('invalidUrl')
  return data
}

/** Redireciona para o Stripe Checkout com o método escolhido. */
export async function iniciarCheckoutStripe({ valor, descricao, userId, userEmail, productType, paymentMethod, onBeforeRedirect }) {
  if (!userId) throw new Error('needLogin')
  if (!paymentMethod) throw new Error('selectMethod')
  const tipo = inferProductType(valor, descricao, productType)
  sessionStorage.setItem('sidus_payment_pending', JSON.stringify({
    productType: tipo,
    descricao,
    paymentMethod,
    ts: Date.now(),
  }))
  onBeforeRedirect?.()
  const { url } = await criarSessaoStripe({ valor, descricao, userId, userEmail, productType: tipo, paymentMethod })
  window.location.assign(url)
}

export function ModalPagamento({ valor, descricao, userId, userEmail, productType: productTypeProp, onSucesso, onFechar }) {
  const { t } = useLanguage()
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState(null)

  const productType = inferProductType(valor, descricao, productTypeProp)
  const isSubscription = productType === 'premium'

  const metodosDisponiveis = useMemo(
    () => metodosParaProduto(isSubscription).map((m) => ({
      ...m,
      nome: t(`pagamento.methods.${m.i18nKey}.nome`),
      desc: t(`pagamento.methods.${m.i18nKey}.desc`),
    })),
    [isSubscription, t],
  )

  const [metodoSelecionado, setMetodoSelecionado] = useState(() => metodosDisponiveis[0]?.stripeType || 'card')

  const metodoActivo = metodosDisponiveis.find((m) => m.stripeType === metodoSelecionado) || metodosDisponiveis[0]

  const msgErro = (code) => {
    const map = {
      sessionFail: t('pagamento.sessionFail'),
      invalidUrl: t('pagamento.invalidUrl'),
      needLogin: t('pagamento.needLogin'),
      selectMethod: t('pagamento.selectMethod'),
      methodNotSubscription: t('pagamento.methodNotSubscription'),
    }
    return map[code] || code || t('pagamento.stripeFail')
  }

  const iniciarStripe = async () => {
    if (!metodoActivo) {
      setErro(t('pagamento.selectMethod'))
      return
    }
    setErro(null)
    setProcessando(true)
    try {
      await iniciarCheckoutStripe({
        valor,
        descricao,
        userId,
        userEmail,
        productType,
        paymentMethod: metodoActivo.stripeType,
        onBeforeRedirect: () => {
          if (onSucesso) sessionStorage.setItem('sidus_payment_callback', '1')
        },
      })
    } catch (e) {
      setErro(msgErro(e.message))
      setProcessando(false)
    }
  }

  const modal = (
    <Overlay onFechar={onFechar}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, color: CORES.dourado, fontSize: 18 }}>{t('pagamento.secureTitle')}</h3>
          <p style={{ margin: 0, color: CORES.brancoMuted, fontSize: 13 }}>{descricao}</p>
        </div>
        <div style={{ fontSize: 24, fontWeight: 700, color: CORES.dourado }}>
          {valor.toFixed(2)} €{isSubscription ? <span style={{ fontSize: 12, fontWeight: 400 }}>{t('common.perMonth')}</span> : null}
        </div>
      </div>

      <div style={{
        background: 'rgba(223,183,108,0.12)', border: '1px solid rgba(223,183,108,0.45)',
        borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 22 }}>🔒</span>
        <p style={{ margin: 0, fontSize: 12, color: CORES.brancoMuted, lineHeight: 1.5 }}>
          {t('pagamento.processedBy')} <strong style={{ color: CORES.branco }}>Stripe</strong>.
          {isSubscription ? t('pagamento.subscriptionNote') : t('pagamento.oneTimeNote')}
        </p>
      </div>

      <p style={{ fontSize: 11, color: CORES.brancoMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {t('pagamento.methodsTitle')}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {metodosDisponiveis.map((m) => {
          const seleccionado = metodoActivo?.stripeType === m.stripeType
          return (
            <button
              key={m.stripeType}
              type="button"
              onClick={() => setMetodoSelecionado(m.stripeType)}
              aria-pressed={seleccionado}
              style={{
                background: seleccionado ? 'rgba(223,183,108,0.14)' : 'rgba(255,255,255,0.03)',
                border: seleccionado ? `2px solid ${CORES.dourado}` : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '10px 12px',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: seleccionado ? '0 0 16px rgba(223,183,108,0.2)' : 'none',
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icone}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: seleccionado ? CORES.dourado : CORES.branco }}>{m.nome}</div>
              <div style={{ fontSize: 10, color: CORES.brancoMuted, lineHeight: 1.4 }}>{m.desc}</div>
            </button>
          )
        })}
      </div>

      {isSubscription && (
        <p style={{ fontSize: 10, color: CORES.brancoMuted, marginBottom: 14, lineHeight: 1.5 }}>
          {t('pagamento.subscriptionMethodsNote')}
        </p>
      )}

      {erro && (
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', fontSize: 13, color: '#F87171' }}>
          {erro}
        </div>
      )}

      <button type="button" disabled={processando || !metodoActivo} onClick={iniciarStripe} style={{
        width: '100%',
        background: processando ? 'rgba(223,183,108,0.4)' : `linear-gradient(135deg, ${CORES.dourado}, ${CORES.douradoEscuro})`,
        border: 'none', borderRadius: 12, color: '#0B071E', fontSize: 15, fontWeight: 700,
        padding: '15px', cursor: processando ? 'default' : 'pointer',
        boxShadow: '0 4px 24px rgba(223, 183, 108, 0.35)',
      }}>
        {processando
          ? t('pagamento.redirecting')
          : t('pagamento.payBtnWithMethod', { valor: valor.toFixed(2), method: metodoActivo?.nome || '' })}
      </button>

      <p style={{ textAlign: 'center', fontSize: 10, color: CORES.brancoMuted, marginTop: 12, lineHeight: 1.5 }}>
        {t('pagamento.methodsFootnote')}
      </p>
    </Overlay>
  )

  return createPortal(modal, document.body)
}

function Overlay({ children, onFechar }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 10000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    }} onClick={onFechar}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 430, background: '#12082A',
        borderTop: `2px solid ${CORES.dourado}`, borderRadius: '20px 20px 0 0',
        padding: 24, paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 -8px 40px rgba(223, 183, 108, 0.2)',
      }}>
        {children}
      </div>
    </div>
  )
}

export async function verificarSessaoPagamento(sessionId, userId) {
  const res = await fetch('/api/verify-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, userId }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'verifyError')
  return data
}
