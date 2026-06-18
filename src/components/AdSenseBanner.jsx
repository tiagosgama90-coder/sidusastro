import { useEffect, useRef } from 'react'
import { adsenseEnabled } from '../lib/adsense'

const CORES = { brancoMuted: 'rgba(255,255,255,0.35)' }

/** Anúncio discreto — só renderiza se env configurado e utilizador não Premium. */
export function AdSenseBanner({ isPremium }) {
  const ref = useRef(null)
  const client = import.meta.env.VITE_ADSENSE_CLIENT
  const slot = import.meta.env.VITE_ADSENSE_SLOT

  useEffect(() => {
    if (!adsenseEnabled() || isPremium || !ref.current) return
    try {
      // eslint-disable-next-line no-undef
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* bloqueador de anúncios */
    }
  }, [isPremium, client, slot])

  if (!adsenseEnabled() || isPremium) return null

  return (
    <div style={{ maxWidth: 728, margin: '0 auto 12px', padding: '0 16px', boxSizing: 'border-box' }}>
      <p style={{ fontSize: 9, color: CORES.brancoMuted, textAlign: 'center', margin: '0 0 4px', letterSpacing: '0.08em' }}>
        PUBLICIDADE
      </p>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 90, maxHeight: 120, overflow: 'hidden' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
