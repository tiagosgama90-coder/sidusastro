/** Secções Premium do mapa astral (títulos dourados partilhados landing + paywall). */
export const MAPA_PREMIUM_SECTION_KEYS = [
  'mandalaTitle',
  'interpTitle',
  'positions',
  'aspects',
  'lifeSpheres',
  'export',
]

export function getMapaPremiumSections(t) {
  return MAPA_PREMIUM_SECTION_KEYS.map((key) => ({
    key,
    title: t(`mapa.${key}`),
    desc: t(`mapa.premiumSectionDesc.${key}`),
  }))
}
