import { useState } from 'react'
import { Code2, KeyRound, Sparkles, Zap, Check, Copy, ExternalLink } from 'lucide-react'

const CORES = {
  dourado: '#DFB76C',
  branco: '#F4F3EC',
  brancoMuted: 'rgba(255,255,255,0.65)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '€0',
    period: '/mês',
    limit: '100 requests/dia',
    features: ['Horóscopo diário (12 signos)', 'Numerologia básica', '6 idiomas (em breve)', 'Ideal para testar o teu bot'],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '€19',
    period: '/mês',
    limit: '500 requests/dia',
    features: ['Tudo do Free', 'Suporte por email', 'Prioridade na fila', 'Para bots e newsletters'],
    highlight: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '€49',
    period: '/mês',
    limit: '3 000 requests/dia',
    features: ['Tudo do Starter', 'Sinastria + mapa (breve)', 'Interpretação IA (breve)', 'Para apps e agências'],
  },
]

export function DevelopersPage({ isDesktop, onVoltar }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [useCase, setUseCase] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/developers/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, useCase }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error || 'Erro ao criar API key')
      setResult(data)
    } catch (err) {
      setError(err.message || 'Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  const copyKey = async () => {
    if (!result?.apiKey) return
    try {
      await navigator.clipboard.writeText(result.apiKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  return (
    <div style={{
      maxWidth: isDesktop ? 920 : '100%',
      margin: '0 auto',
      padding: isDesktop ? '32px 24px 48px' : '20px 16px 40px',
    }}>
      <div className="sidus-glass" style={{ padding: isDesktop ? '28px 32px' : '20px 18px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Code2 size={22} color={CORES.dourado} />
          <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: CORES.dourado }}>
            Sidus Astro API
          </span>
        </div>
        <h1 style={{ margin: '0 0 10px', fontSize: isDesktop ? 28 : 22, color: CORES.branco, fontWeight: 500 }}>
          API de Astrologia para bots, apps e criadores
        </h1>
        <p style={{ margin: 0, color: CORES.brancoMuted, lineHeight: 1.6, fontSize: 14 }}>
          Horóscopo diário, numerologia e mais — em JSON, com Swiss Ephemeris e conteúdo em português e inglês.
          Perfeito para o teu bot de vídeos, newsletter ou app.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr', gap: 12, marginBottom: 20 }}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className="sidus-glass"
            style={{
              padding: '18px 16px',
              border: plan.highlight ? `1px solid ${CORES.dourado}` : undefined,
              boxShadow: plan.highlight ? '0 0 24px rgba(223,183,108,0.12)' : undefined,
            }}
          >
            {plan.highlight && (
              <div style={{ fontSize: 10, color: CORES.dourado, letterSpacing: '0.1em', marginBottom: 6, fontWeight: 700 }}>
                RECOMENDADO
              </div>
            )}
            <div style={{ fontSize: 18, fontWeight: 600, color: CORES.branco }}>{plan.name}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: CORES.dourado, margin: '6px 0 2px' }}>
              {plan.price}
              <span style={{ fontSize: 12, color: CORES.brancoMuted, fontWeight: 400 }}>{plan.period}</span>
            </div>
            <div style={{ fontSize: 12, color: CORES.brancoMuted, marginBottom: 12 }}>{plan.limit}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {plan.features.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: CORES.brancoMuted, marginBottom: 6 }}>
                  <Check size={14} color={CORES.dourado} style={{ flexShrink: 0, marginTop: 1 }} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 16 }}>
        <div className="sidus-glass" style={{ padding: '20px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <KeyRound size={18} color={CORES.dourado} />
            <h2 style={{ margin: 0, fontSize: 16, color: CORES.branco }}>Obter API key grátis</h2>
          </div>

          {result?.apiKey ? (
            <div>
              <p style={{ color: CORES.brancoMuted, fontSize: 13, lineHeight: 1.5 }}>
                {result.message}
              </p>
              <div style={{
                marginTop: 12, padding: '12px 14px', borderRadius: 10,
                background: 'rgba(0,0,0,0.35)', border: `1px solid ${CORES.vidroBorda}`,
                fontFamily: 'monospace', fontSize: 11, wordBreak: 'break-all', color: CORES.dourado,
              }}>
                {result.apiKey}
              </div>
              <button
                type="button"
                onClick={copyKey}
                style={{
                  marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(223,183,108,0.15)', border: `1px solid ${CORES.dourado}`,
                  color: CORES.dourado, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 12,
                }}
              >
                <Copy size={14} />
                {copied ? 'Copiado!' : 'Copiar API key'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSignup}>
              <label style={{ display: 'block', fontSize: 12, color: CORES.brancoMuted, marginBottom: 6 }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teu@email.com"
                style={inputStyle}
              />
              <label style={{ display: 'block', fontSize: 12, color: CORES.brancoMuted, margin: '12px 0 6px' }}>Nome / Projecto</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Meu Bot de Astrologia"
                style={inputStyle}
              />
              <label style={{ display: 'block', fontSize: 12, color: CORES.brancoMuted, margin: '12px 0 6px' }}>Para que vais usar?</label>
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="Bot TikTok, newsletter, app…"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
              {error && <p style={{ color: '#f87171', fontSize: 12, margin: '10px 0 0' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 14, width: '100%', padding: '12px 16px', borderRadius: 10, border: 'none',
                  background: CORES.dourado, color: '#0B071E', fontWeight: 700, fontSize: 14, cursor: loading ? 'wait' : 'pointer',
                }}
              >
                {loading ? 'A criar…' : 'Criar API key grátis'}
              </button>
              <p style={{ fontSize: 11, color: CORES.brancoMuted, marginTop: 10, lineHeight: 1.45 }}>
                100 requests/dia no plano Free. Planos pagos: contacta{' '}
                <a href="mailto:suporte@sidusastro.com" style={{ color: CORES.dourado }}>suporte@sidusastro.com</a>
              </p>
            </form>
          )}
        </div>

        <div className="sidus-glass" style={{ padding: '20px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Zap size={18} color={CORES.dourado} />
            <h2 style={{ margin: 0, fontSize: 16, color: CORES.branco }}>Documentação rápida</h2>
          </div>

          <p style={{ fontSize: 12, color: CORES.brancoMuted, margin: '0 0 10px' }}>
            Envia o header <code style={{ color: CORES.dourado }}>X-API-Key: sk_sidus_…</code> em todos os pedidos.
          </p>

          <DocBlock
            title="Horóscopo diário (1 signo)"
            code={`curl "https://sidusastro.com/api/v1/horoscope/daily?sign=aries&lang=pt" \\
  -H "X-API-Key: SUA_CHAVE"`}
          />
          <DocBlock
            title="Todos os signos do dia"
            code={`curl "https://sidusastro.com/api/v1/horoscope/daily?lang=pt" \\
  -H "X-API-Key: SUA_CHAVE"`}
          />
          <DocBlock
            title="Numerologia"
            code={`curl -X POST https://sidusastro.com/api/v1/numerology \\
  -H "X-API-Key: SUA_CHAVE" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Maria Silva","birthDate":"1990-05-15","lang":"pt"}'`}
          />

          <a
            href="https://rapidapi.com/hub"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 14,
              fontSize: 12, color: CORES.dourado, textDecoration: 'none',
            }}
          >
            <ExternalLink size={14} />
            Também disponível em breve no RapidAPI
          </a>
        </div>
      </div>

      <div className="sidus-glass" style={{ padding: '16px 18px', marginTop: 16, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Sparkles size={18} color={CORES.dourado} style={{ flexShrink: 0, marginTop: 2 }} />
        <p style={{ margin: 0, fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.55 }}>
          <strong style={{ color: CORES.branco }}>Para o teu bot de vídeos:</strong> chama o endpoint de horóscopo,
          usa o texto no vídeo e coloca o link sidusastro.com na bio. Tu és o primeiro cliente da tua API.
        </p>
      </div>

      {onVoltar && (
        <button
          type="button"
          onClick={onVoltar}
          style={{
            marginTop: 20, background: 'transparent', border: `1px solid ${CORES.vidroBorda}`,
            color: CORES.brancoMuted, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontSize: 12,
          }}
        >
          ← Voltar ao site
        </button>
      )}
    </div>
  )
}

function DocBlock({ title, code }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: '#DFB76C', marginBottom: 6, fontWeight: 600 }}>{title}</div>
      <pre style={{
        margin: 0, padding: '10px 12px', borderRadius: 8, overflowX: 'auto',
        background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(223,183,108,0.15)',
        fontSize: 10, lineHeight: 1.45, color: 'rgba(255,255,255,0.8)',
      }}>
        {code}
      </pre>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid rgba(223, 183, 108, 0.22)',
  background: 'rgba(255,255,255,0.04)',
  color: '#F4F3EC',
  fontSize: 14,
}
