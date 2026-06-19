import { useEffect, useRef } from 'react'
import { adsenseEnabled, getAdsenseClient, getAdsenseSlot } from '../lib/adsense'

const CORES = { brancoMuted: 'rgba(255,255,255,0.35)' }

/** Anúncio — todos os utilizadores (incl. Premium) quando VITE_ADSENSE_SLOT está no build. */
export function AdSenseBanner() {
  const ref = useRef(null)
  const client = getAdsenseClient()
  const slot = getAdsenseSlot()

  useEffect(() => {
    if (!adsenseEnabled() || !ref.current) return
    try {
      // eslint-disable-next-line no-undef
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* bloqueador de anúncios */
    }
  }, [client, slot])

  if (!adsenseEnabled()) return null

  return (
    <div
      style={{
        maxWidth: 728,
        margin: '0 auto',
        padding: '12px 16px 20px',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <p style={{ fontSize: 9, color: CORES.brancoMuted, textAlign: 'center', margin: '0 0 4px', letterSpacing: '0.08em' }}>
        PUBLICIDADE
      </p>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 90, maxHeight: 120, overflow: 'hidden' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
    </div>
  )
}
