/**
 * Gera sidus-cosmic-mandala.svg — símbolo dourado com geometria sagrada + 12 signos, fundo transparente.
 */
import { writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

const SIZE = 512
const CX = SIZE / 2
const CY = SIZE / 2

function pt(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}

function dodecagramLines(cx, cy, outerR) {
  const verts = Array.from({ length: 12 }, (_, i) => pt(cx, cy, outerR, i * 30))
  return Array.from({ length: 12 }, (_, i) => {
    const j = (i + 5) % 12
    const [x1, y1] = verts[i]
    const [x2, y2] = verts[j]
    return `M ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)}`
  })
}

function polygon(cx, cy, r, sides, rot = 0) {
  const pts = Array.from({ length: sides }, (_, i) => {
    const [x, y] = pt(cx, cy, r, (360 / sides) * i + rot)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  return pts.join(' ')
}

const starLines = dodecagramLines(CX, CY, 122)
const starVerts = Array.from({ length: 12 }, (_, i) => pt(CX, CY, 122, i * 30))
const innerHex = polygon(CX, CY, 38, 6, 0)
const innerTri1 = `M ${pt(CX, CY, 52, 0).map((n) => n.toFixed(2)).join(' ')} L ${pt(CX, CY, 52, 120).map((n) => n.toFixed(2)).join(' ')} L ${pt(CX, CY, 52, 240).map((n) => n.toFixed(2)).join(' ')} Z`
const innerTri2 = `M ${pt(CX, CY, 52, 60).map((n) => n.toFixed(2)).join(' ')} L ${pt(CX, CY, 52, 180).map((n) => n.toFixed(2)).join(' ')} L ${pt(CX, CY, 52, 300).map((n) => n.toFixed(2)).join(' ')} Z`

const zodiacGlyphs = ZODIAC.map((sym, i) => {
  const [x, y] = pt(CX, CY, 178, i * 30)
  return `<text x="${x.toFixed(2)}" y="${(y + 1).toFixed(2)}" text-anchor="middle" dominant-baseline="middle" fill="rgba(240,208,138,0.96)" font-size="26" font-family="Segoe UI Symbol, Noto Sans Symbols2, Apple Symbols, sans-serif" filter="url(#mandala-glow)">${sym}</text>`
}).join('\n      ')

const nodeDots = starVerts
  .map(([x, y]) => `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="2.8" fill="#F0D08A" opacity="0.92" filter="url(#mandala-glow)"/>`)
  .join('\n      ')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" fill="none" role="img" aria-label="Cosmic mandala">
  <defs>
    <filter id="mandala-glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="2.2" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="mandala-star-glow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge>
        <feMergeNode in="b"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <radialGradient id="mandala-core" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="35%" stop-color="#FFF8E7"/>
      <stop offset="100%" stop-color="#DFB76C"/>
    </radialGradient>
  </defs>

  <circle cx="${CX}" cy="${CY}" r="198" fill="none" stroke="rgba(223,183,108,0.38)" stroke-width="2.2" filter="url(#mandala-glow)"/>
  <circle cx="${CX}" cy="${CY}" r="162" fill="none" stroke="rgba(223,183,108,0.28)" stroke-width="1.6"/>
  <circle cx="${CX}" cy="${CY}" r="54" fill="none" stroke="rgba(223,183,108,0.22)" stroke-width="1.2"/>

  ${starLines.map((d) => `<path d="${d}" stroke="rgba(223,183,108,0.52)" stroke-width="1.15" stroke-linecap="round" filter="url(#mandala-glow)"/>`).join('\n  ')}
  <polygon points="${innerHex}" fill="none" stroke="rgba(223,183,108,0.35)" stroke-width="0.9"/>
  <path d="${innerTri1}" fill="none" stroke="rgba(223,183,108,0.3)" stroke-width="0.85"/>
  <path d="${innerTri2}" fill="none" stroke="rgba(223,183,108,0.3)" stroke-width="0.85"/>

  ${nodeDots}

  ${zodiacGlyphs}

  <g filter="url(#mandala-star-glow)">
    <line x1="${CX}" y1="${CY - 28}" x2="${CX}" y2="${CY + 28}" stroke="url(#mandala-core)" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="${CX - 28}" y1="${CY}" x2="${CX + 28}" y2="${CY}" stroke="url(#mandala-core)" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="${CX - 20}" y1="${CY - 20}" x2="${CX + 20}" y2="${CY + 20}" stroke="rgba(255,248,231,0.55)" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="${CX + 20}" y1="${CY - 20}" x2="${CX - 20}" y2="${CY + 20}" stroke="rgba(255,248,231,0.55)" stroke-width="1.2" stroke-linecap="round"/>
    <circle cx="${CX}" cy="${CY}" r="11" fill="url(#mandala-core)"/>
    <circle cx="${CX}" cy="${CY}" r="5.5" fill="#FFFFFF" opacity="0.95"/>
  </g>
</svg>
`

const out = join(root, 'public/brand/sidus-cosmic-mandala.svg')
writeFileSync(out, svg)
console.log('Wrote', out)
