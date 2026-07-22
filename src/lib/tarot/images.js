/** Slugs e caminhos das ilustrações do baralho Mystic (estilo Marchetti). */

const MAJOR_SLUGS = [
  '00-louco', '01-mago', '02-papisa', '03-imperatriz', '04-imperador',
  '05-hierofante', '06-amantes', '07-carro', '08-forca', '09-eremita',
  '10-roda-fortuna', '11-justica', '12-enforcado', '13-morte', '14-temperanca',
  '15-diabo', '16-torre', '17-estrela', '18-lua', '19-sol',
  '20-julgamento', '21-mundo',
]

const NAIPES = ['paus', 'copas', 'espadas', 'ouros']
const RANKS = ['as', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'valete', 'cavaleiro', 'rainha', 'rei']

export function slugForCarta(carta) {
  if (!carta) return null
  if (carta.tipo === 'lenormand') return carta.slug ?? `lenormand-${String(carta.id).padStart(2, '0')}`
  if (carta.slug) return carta.slug
  if (carta.tipo === 'major' || carta.id <= 21) return MAJOR_SLUGS[carta.id] ?? null
  if (carta.naipe && carta.rank) return `${String(carta.id).padStart(2, '0')}-${carta.naipe}-${carta.rank}`
  return null
}

export function imagemCartaUrl(carta) {
  const slug = slugForCarta(carta)
  if (!slug) return null
  if (carta.tipo === 'lenormand') return `/tarot/lenormand/${slug}.png`
  return `/tarot/mystic/${slug}.png`
}

export function imagemVersoUrl(deck = 'tarot') {
  if (deck === 'lenormand') return '/tarot/lenormand/verso.png'
  return '/tarot/mystic/verso.png'
}

export function listarSlugsBaralho() {
  const minors = []
  let id = 22
  for (const naipe of NAIPES) {
    for (const rank of RANKS) {
      minors.push(`${String(id).padStart(2, '0')}-${naipe}-${rank}`)
      id += 1
    }
  }
  return [...MAJOR_SLUGS, ...minors]
}

export { MAJOR_SLUGS, NAIPES, RANKS }
