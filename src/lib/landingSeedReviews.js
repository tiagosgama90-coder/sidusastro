/** Comentários iniciais no landing — misturados com avaliações reais no ticker. */
export const LANDING_SEED_REVIEWS = [
  {
    id: 'seed-maria-sp',
    text: 'Finalmente entendi meu ascendente',
    name: 'Maria',
    meta: 'SP',
    rating: 5,
  },
  {
    id: 'seed-sarah-uk',
    text: 'Finally understood my Moon sign — the Oracle feels surprisingly personal',
    name: 'Sarah',
    meta: 'UK',
    rating: 5,
  },
  {
    id: 'seed-lucas-bh',
    text: 'Mt bom o mapa, super preciso msm. O oráculo tbm ajuda dms!',
    name: 'Lucas',
    meta: 'BH',
    rating: 5,
  },
  {
    id: 'seed-ana-pr',
    text: 'A sinastria com meu namorado ficou incrível, recomendo demais',
    name: 'Ana',
    meta: 'PR',
    rating: 5,
  },
]

export function mergeLandingReviews(realReviews = []) {
  const seen = new Set()
  const merged = []

  for (const review of [...LANDING_SEED_REVIEWS, ...realReviews]) {
    const key = `${review.name}|${review.text}`.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(review)
  }

  return merged
}
