import { useEffect, useRef } from 'react'
import { adsenseEnabled, getAdsenseClient, getAdsenseSlot } from '../lib/adsense'
import { allowsAds } from '../lib/cookieConsent'

const CORES = { brancoMuted: 'rgba(255,255,255,0.35)' }

/** Anúncio manual — só utilizadores grátis com consentimento cookies. */
export function AdSenseBanner({ isPremium = false }) {
  const ref = useRef(null)
  const client = getAdsenseClient()
  const slot = getAdsenseSlot()

  useEffect(() => {
    if (isPremium || !allowsAds() || !adsenseEnabled(isPremium) || !ref.current) return
    try {
      // eslint-disable-next-line no-undef
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      /* bloqueador de anúncios */
    }
  }, [client, slot, isPremium])

  if (isPremium || !adsenseEnabled(isPremium)) return null

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
