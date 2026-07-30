import { Crown, Check } from 'lucide-react'

const CORES = {
  dourado: '#DFB76C',
  douradoEscuro: '#B8944F',
  fundo: '#0B071E',
  brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

/** Paywall inline unificado (mapa, radar, etc.) — mesmo estilo do VipPaywallBody. */
export function ToolInlinePaywall({
  title,
  lead,
  items = [],
  ctaLabel,
  onCta,
  showCta = true,
  className = '',
}) {
  return (
    <div className={`tool-inline-paywall${className ? ` ${className}` : ''}`}>
      <div className="tool-inline-paywall__header">
        <Crown size={22} color={CORES.dourado} aria-hidden />
        <h3 className="tool-inline-paywall__title">{title}</h3>
      </div>
      {lead ? <p className="tool-inline-paywall__lead">{lead}</p> : null}
      {items.length > 0 && (
        <div className="tool-inline-paywall__benefits">
          {items.map((item) => (
            <div key={item} className="tool-inline-paywall__benefit">
              <Check size={14} color={CORES.dourado} aria-hidden />
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
      {showCta && ctaLabel && onCta ? (
        <button type="button" className="tool-inline-paywall__cta" onClick={onCta}>
          {ctaLabel}
        </button>
      ) : null}
    </div>
  )
}
