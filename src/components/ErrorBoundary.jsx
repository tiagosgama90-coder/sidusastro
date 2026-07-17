import { Component } from 'react'

const CORES = {
  fundo: '#0B071E',
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoMuted: 'rgba(255, 255, 255, 0.55)',
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[Sidus] Erro na interface:', error?.message, info?.componentStack)
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: null })
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
    this.props.onRetry?.()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    const isTranslateCrash = /insertBefore|removeChild|not a child of this node/i.test(this.state.error?.message || '')

    return (
      <div style={{
        minHeight: this.props.compact ? '40vh' : '100svh',
        background: this.props.compact ? 'transparent' : `radial-gradient(ellipse at 20% 0%, rgba(88, 28, 135, 0.35) 0%, transparent 55%),
          radial-gradient(ellipse at 80% 100%, rgba(67, 56, 202, 0.2) 0%, transparent 50%),
          ${CORES.fundo}`,
        color: CORES.branco,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        boxSizing: 'border-box',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}>
        <div style={{
          maxWidth: 420,
          width: '100%',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(223,183,108,0.22)',
          borderRadius: 16,
          padding: '28px 24px',
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
          <h1 style={{ margin: '0 0 12px', fontSize: 20, fontWeight: 600, color: CORES.dourado }}>
            Algo correu mal
          </h1>
          <p style={{ margin: '0 0 20px', fontSize: 14, lineHeight: 1.6, color: CORES.brancoMuted }}>
            A interface encontrou um erro inesperado. Podes tentar de novo ou recarregar a página.
          </p>
          {isTranslateCrash && (
            <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.55, color: 'rgba(223,183,108,0.9)' }}>
              Se estás a usar o Google Tradutor, desactiva a tradução desta página — ela interfere com os formulários de nascimento.
            </p>
          )}
          {this.state.error?.message && (
            <p style={{
              margin: '0 0 20px', fontSize: 11, lineHeight: 1.5, color: 'rgba(248,113,113,0.9)',
              wordBreak: 'break-word', fontFamily: 'monospace', textAlign: 'left',
            }}>
              {this.state.error.message}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={this.handleRetry}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(223,183,108,0.35)',
                borderRadius: 12,
                color: CORES.branco,
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 20px',
                cursor: 'pointer',
              }}
            >
              Tentar de novo
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg,#DFB76C,#B8944F)',
                border: 'none',
                borderRadius: 12,
                color: CORES.fundo,
                fontSize: 14,
                fontWeight: 700,
                padding: '12px 20px',
                cursor: 'pointer',
              }}
            >
              Recarregar página
            </button>
          </div>
        </div>
      </div>
    )
  }
}
