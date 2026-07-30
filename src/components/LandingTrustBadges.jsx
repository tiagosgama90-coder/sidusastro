import { Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { useGeoCountry } from '../hooks/useGeoCountry.js'

export function LandingTrustBadges({ compact = false }) {
  const { t } = useLanguage()
  const { isBrasil } = useGeoCountry()

  const badges = [
    { icon: Sparkles, label: t('auth.portal.trustBadges.swiss') },
    { icon: Lock, label: t('auth.portal.trustBadges.firebase') },
    isBrasil
      ? { icon: ShieldCheck, label: t('auth.portal.trustBadges.pix') }
      : { icon: ShieldCheck, label: t('auth.portal.trustBadges.payment') },
  ]

  return (
    <ul className={`landing-trust-badges${compact ? ' landing-trust-badges--compact' : ''}`}>
      {badges.map(({ icon: Icon, label }) => (
        <li key={label} className="landing-trust-badges__item">
          <Icon size={14} aria-hidden="true" />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}
