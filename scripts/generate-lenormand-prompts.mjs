#!/usr/bin/env node
/**
 * Prompts para ilustrações Lenormand estilo Ciro Marchetti (Gilded Reverie).
 * Uso: node scripts/generate-lenormand-prompts.mjs
 *      node scripts/generate-lenormand-prompts.mjs --missing
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.resolve(__dirname, '../public/tarot/lenormand')

const STYLE = 'Ciro Marchetti Gilded Reverie Lenormand style, ornate golden filigree corner flourishes, large numbered gold circle top-left, lush digital painterly realism, magical glowing atmospheric lighting, deep crimson and gold palette, rich saturated colors, vertical card 2:3 ratio, no text except card number, no watermark'

const SCENES = {
  '01-cavaleiro': 'The Rider, woman in flowing red dress on white horse galloping across vibrant rainbow bridge, starry night sky, news and speed',
  '02-trevo': 'The Clover, lush four-leaf clovers and white blossoms, emerald green, ethereal blue purple glow, lucky charm',
  '03-navio': 'The Ship, ornate steampunk-fantasy sailing vessel with golden details on deep ocean, distant horizon, travel',
  '04-casa': 'The House, whimsical cottage red tiled roof glowing windows, ornate iron gate, home and family',
  '05-arvore': 'The Tree, majestic ancient tree with golden light through branches, health vitality spiritual growth',
  '06-nuvens': 'The Clouds, dramatic sky half dark storm clouds half golden sunlight breaking through, confusion and clarity',
  '07-serpente': 'The Snake, elegant serpent coiled among roses, intelligence and danger, jewel tones',
  '08-caixao': 'The Coffin, ornate Victorian coffin with white lilies, transformation ending, dignified not horror',
  '09-bouquet': 'The Bouquet, lavish flower bouquet roses lilies ribbon, gifts happiness surprise, warm glow',
  '10-foice': 'The Scythe, golden scythe blade gleaming in harvest field, decisive cut, dramatic light',
  '11-chicote': 'The Whip, coiled leather whip and chains, conflict repetition power, fiery background',
  '12-passaros': 'The Birds, colorful finches on ornate wooden birdhouse, communication joy, autumnal warmth',
  '13-crianca': 'The Child, innocent child with butterfly in sunny meadow, new beginnings purity',
  '14-raposa': 'The Fox, clever red fox in moonlit forest, cunning strategy, amber eyes',
  '15-urso': 'The Bear, powerful spirit polar bear in water, crystal ice palace background, strength protection',
  '16-estrelas': 'The Stars, glowing golden eight-pointed star compass in deep blue night sky, zodiac ring, destiny',
  '17-cegonha': 'The Stork, white stork with nest on rooftop chimney, new beginnings change, dawn light',
  '18-cao': 'The Dog, loyal tan white dog with red leash in doorway, fidelity friendship, warm interior light',
  '19-torre': 'The Tower, tall stone lighthouse tower on cliff, isolation institutions spirituality, misty sea',
  '20-jardim': 'The Garden, ornate garden gate opening to social gathering party lights, public life meetings',
  '21-montanha': 'The Mountain, towering snow peaks blocking path, obstacles challenges, epic scale',
  '22-caminho': 'The Crossroads, forked path in mystical forest, two roads choice free will, golden signposts',
  '23-rato': 'The Mice, small mice nibbling cheese and papers, loss stress theft, dim candlelight',
  '24-coracao': 'The Heart, glowing anatomical golden heart with roses, love passion intense feelings',
  '25-anel': 'The Ring, ornate golden wedding ring with diamonds on velvet, alliances contracts marriage',
  '26-livro': 'The Book, ancient leather grimoire with clasp, secrets studies occult knowledge, candle',
  '27-carta': 'The Letter, sealed envelope with wax seal and quill, written news documents messages',
  '28-homem': 'The Man, distinguished gentleman Victorian attire portrait, consulente masculine figure',
  '29-mulher': 'The Woman, elegant lady Victorian dress portrait, consulente feminine figure',
  '30-lirios': 'The Lilies, white lilies in moonlight pond, peace purity maturity, serene blue',
  '31-sol': 'The Sun, radiant golden sun with joyful child figure, success clarity happiness, sunflowers',
  '32-lua': 'The Moon, large silver crescent moon over still lake, intuition dreams illusion, night',
  '33-chave': 'The Key, ornate antique golden key unlocking glowing door, solutions answers',
  '34-peixes': 'The Fish, golden fish swimming in abundance coins water, money finances prosperity',
  '35-ancora': 'The Anchor, heavy golden ship anchor on harbor stones, stability security work',
  '36-cruz': 'The Cross, ornate stone cross on hill at sunset, burden trials destiny victory through suffering',
  verso: 'Lenormand card back, red burgundy diamond checkerboard harlequin pattern, ornate gold filigree corners, central golden medallion sphere, Gilded Reverie style, symmetrical',
}

const slugs = [...Object.keys(SCENES).filter((s) => s !== 'verso').sort(), 'verso']
const missingOnly = process.argv.includes('--missing')

for (const slug of slugs) {
  const svg = path.join(OUT_DIR, `${slug}.svg`)
  const png = path.join(OUT_DIR, `${slug}.png`)
  const exists = fs.existsSync(svg) || fs.existsSync(png)
  if (missingOnly && exists) continue
  console.log(`## ${slug}${exists ? ' ✓' : ''}`)
  console.log(`${STYLE}, ${SCENES[slug]}`)
  console.log(`→ public/tarot/lenormand/${slug}.png\n`)
}
