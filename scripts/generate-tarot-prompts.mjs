#!/usr/bin/env node
/**
 * Lista prompts e estado das imagens do baralho Mystic (78 cartas).
 * Uso: node scripts/generate-tarot-prompts.mjs
 *      node scripts/generate-tarot-prompts.mjs --missing
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { listarSlugsBaralho } from '../src/lib/tarot/images.js'
import { MAJOR_ARCANA } from '../src/lib/tarot/majors.js'
import { MINOR_ARCANA } from '../src/lib/tarot/minors.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../public/tarot/mystic')

const STYLE = 'Professional mystical tarot card illustration, Ciro Marchetti inspired, ornate golden art nouveau border, deep cosmic indigo and violet atmosphere, rich painterly detail, vertical tarot card 2:3 ratio, no text, no watermark'

const MAJOR_SCENES = {
  '00-louco': 'The Fool stepping toward a cliff edge with a white dog, sunrise, bundle on staff, innocent wanderer',
  '01-mago': 'The Magician at altar with wand, cup, sword, pentacle, infinity symbol above head, roses and lilies',
  '02-papisa': 'The High Priestess seated between pillars Boaz and Jachin, crescent moon at feet, sacred scroll, veil of pomegranates',
  '03-imperatriz': 'The Empress on throne in lush garden, wheat, flowing gown, Venus symbol, abundance and fertility',
  '04-imperador': 'The Emperor on stone throne with ram heads, mountains, armor, orb and scepter, authority',
  '05-hierofante': 'The Hierophant on throne, two acolytes, papal keys, sacred temple, spiritual teaching',
  '06-amantes': 'The Lovers, angel Raphael above, man and woman, tree of knowledge and tree of life, sacred choice',
  '07-carro': 'The Chariot, sphinxes black and white, starry canopy, armored charioteer, triumph',
  '08-forca': 'Strength, woman gently closing lion jaws, infinity above, flowers, inner courage',
  '09-eremita': 'The Hermit on mountain peak, lantern with six-pointed star, staff, solitary wisdom',
  '10-roda-fortuna': 'Wheel of Fortune, sphinx, Anubis, Typhon, alchemical symbols, cycles of destiny',
  '11-justica': 'Justice seated, scales and upright sword, balanced judgment, purple veil',
  '12-enforcado': 'The Hanged Man suspended by one foot, halo, serene surrender, tree of life',
  '13-morte': 'Death on white horse, banner with white rose, king child bishop, transformation not horror',
  '14-temperanca': 'Temperance angel pouring water between cups, one foot in water one on land, iris path',
  '15-diabo': 'The Devil, Baphomet on pedestal, chained lovers, torch inverted, shadow and bondage',
  '16-torre': 'The Tower struck by lightning, crown falling, figures leaping, divine revelation through ruin',
  '17-estrela': 'The Star, naked figure pouring water on land and pool, eight-pointed star, hope and healing',
  '18-lua': 'The Moon, crayfish from pool, wolf and dog howling, twin towers, mysterious path',
  '19-sol': 'The Sun, child on white horse, sunflowers, wall banner, joy and clarity',
  '20-julgamento': 'Judgement, angel with trumpet, risen figures, mountains, spiritual awakening',
  '21-mundo': 'The World, dancer in laurel wreath, four corner creatures, completion and integration',
}

function promptForSlug(slug) {
  if (slug === 'verso') {
    return `${STYLE}, ornate tarot card back design, symmetrical mandala, gold celestial patterns on deep purple, mystical Sidus branding feel`
  }
  if (MAJOR_SCENES[slug]) {
    return `${STYLE}, ${MAJOR_SCENES[slug]}`
  }
  const minor = MINOR_ARCANA.find((c) => c.slug === slug)
  if (minor) {
    const suitEn = { paus: 'Wands', copas: 'Cups', espadas: 'Swords', ouros: 'Pentacles' }[minor.naipe]
    const rankEn = { as: 'Ace', valete: 'Page', cavaleiro: 'Knight', rainha: 'Queen', rei: 'King' }[minor.rank]
      || minor.rank.replace('0', '')
    const label = minor.rank.match(/^\d/) ? `${rankEn} of ${suitEn}` : `${rankEn} of ${suitEn}`
    return `${STYLE}, ${label} tarot minor arcana, ${minor.elemento} element, symbolic ${suitEn.toLowerCase()} imagery, ${minor.palavras.join(', ')}`
  }
  return `${STYLE}, tarot card ${slug}`
}

const slugs = listarSlugsBaralho()
const missingOnly = process.argv.includes('--missing')

const rows = slugs.map((slug) => {
  const file = path.join(OUT_DIR, `${slug}.png`)
  const exists = fs.existsSync(file)
  return { slug, file, exists, prompt: promptForSlug(slug) }
})

const filtered = missingOnly ? rows.filter((r) => !r.exists) : rows

console.log(`# Tarot Mystic - ${filtered.length} cartas${missingOnly ? ' em falta' : ''}\n`)
for (const r of filtered) {
  console.log(`## ${r.slug}${r.exists ? ' ✓' : ''}`)
  console.log(r.prompt)
  console.log(`→ public/tarot/mystic/${r.slug}.png\n`)
}

if (missingOnly) {
  console.log(`Total em falta: ${filtered.length} / ${slugs.length}`)
}
