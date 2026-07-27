/**
 * Capa VIP v7 — cinematográfica: PDF gigante em perspectiva real, zero template.
 */
import { writeFileSync, mkdtempSync, rmSync, readFileSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import sharp from 'sharp'
import { createCanvas, loadImage } from '@napi-rs/canvas'
import { Body, Ecliptic, GeoVector, MakeTime } from 'astronomy-engine'
import { criarDataUTCporLocal } from '../src/lib/datetime.js'
import { calcularAngulosCasas } from '../src/lib/natalHouses.js'
import { longitudeParaSigno } from '../src/lib/astrologia.js'
import { atribuirCasasPlanetas } from '../src/lib/casasPlacidus.js'
import { gerarPdfMapaAstral } from '../src/components/PdfMapa.jsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const APPLY = process.argv.includes('--apply')
const OUT_PROD = join(root, 'public/brand/sidus-pdf-vip-commercial-cover.png')
const OUT_PREVIEW = '/opt/cursor/artifacts/sidus-pdf-vip-commercial-cover-v7.png'
const LOGO = join(root, 'public/brand/sidus-logo-stacked-1024.png')

const W = 1080
const H = 1920

const PLANETAS = [
  { key: 'sol', nome: 'Sol', corpo: Body.Sun, simbolo: '☉' },
  { key: 'lua', nome: 'Lua', corpo: Body.Moon, simbolo: '☽' },
  { key: 'mercurio', nome: 'Mercúrio', corpo: Body.Mercury, simbolo: '☿' },
  { key: 'venus', nome: 'Vénus', corpo: Body.Venus, simbolo: '♀' },
  { key: 'marte', nome: 'Marte', corpo: Body.Mars, simbolo: '♂' },
  { key: 'jupiter', nome: 'Júpiter', corpo: Body.Jupiter, simbolo: '♃' },
  { key: 'saturno', nome: 'Saturno', corpo: Body.Saturn, simbolo: '♄' },
  { key: 'urano', nome: 'Urano', corpo: Body.Uranus, simbolo: '♅' },
  { key: 'netuno', nome: 'Neptuno', corpo: Body.Neptune, simbolo: '♆' },
  { key: 'plutao', nome: 'Plutão', corpo: Body.Pluto, simbolo: '♇' },
]

const DADOS_DEMO = {
  nome: 'Mapa Astral VIP',
  data: '1990-03-15',
  hora: '14:30',
  cidade: 'Lisboa, Portugal',
  localizacao: { lat: 38.7223, lon: -9.1393 },
  fuso: 0,
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

function calcularMapaDemo(dados) {
  const dataUTC = criarDataUTCporLocal(dados.data, dados.hora, dados.fuso)
  const angulos = calcularAngulosCasas(null, dataUTC, dados.localizacao.lat, dados.localizacao.lon)
  const time = MakeTime(dataUTC)
  return {
    solar: longitudeParaSigno(Ecliptic(GeoVector(Body.Sun, time, true)).elon),
    lunar: longitudeParaSigno(Ecliptic(GeoVector(Body.Moon, time, true)).elon),
    ascendente: longitudeParaSigno(angulos.ascendant),
    mc: longitudeParaSigno(angulos.mc),
    cusps: angulos.cusps,
  }
}

function calcularPlanetasDemo(dataUTC) {
  const time = MakeTime(dataUTC)
  return PLANETAS.map((p) => ({
    ...p,
    longitude: Ecliptic(GeoVector(p.corpo, time, true)).elon,
    signo: longitudeParaSigno(Ecliptic(GeoVector(p.corpo, time, true)).elon),
    retrograde: false,
  }))
}

function renderPdfPage1(buf, dpi = 360) {
  const tmp = mkdtempSync(join(tmpdir(), 'sidus-pdf-'))
  const pdfPath = join(tmp, 'm.pdf')
  const prefix = join(tmp, 'p')
  try {
    writeFileSync(pdfPath, Buffer.from(buf))
    execFileSync('pdftoppm', ['-png', '-f', '1', '-l', '1', '-r', String(dpi), '-singlefile', pdfPath, prefix], {
      stdio: 'pipe',
    })
    return readFileSync(`${prefix}.png`)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

/** Zoom extremo — cabeçalho + Quatro Pilares + início interpretação. */
async function preparePdfHero(pngBuf) {
  const meta = await sharp(pngBuf).metadata()
  const cropH = Math.round(meta.height * 0.58)
  return sharp(pngBuf)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .resize(1040, null, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.5, m1: 0.9, m2: 0.6 })
    .png()
    .toBuffer()
}

/** Perspectiva por scanlines — trapézio estável. */
async function warpPerspective(pngBuf, quad) {
  const img = await loadImage(pngBuf)
  const sw = img.width
  const sh = img.height
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, W, H)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  const { tl, tr, br, bl } = quad
  const rows = 900

  for (let row = 0; row < rows; row += 1) {
    const t = row / (rows - 1)
    const y = lerp(tl.y, bl.y, t)
    const lx = lerp(tl.x, bl.x, t)
    const rx = lerp(tr.x, br.x, t)
    const destW = rx - lx
    if (destW < 2) continue

    const sy = Math.min(sh - 1, Math.floor(t * (sh - 1)))
    const srcH = Math.max(1, Math.ceil(sh / rows) + 1)

    ctx.drawImage(img, 0, sy, sw, srcH, lx, y, destW, 1.35)
  }

  ctx.strokeStyle = 'rgba(223,183,108,0.55)'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(tl.x, tl.y)
  ctx.lineTo(tr.x, tr.y)
  ctx.lineTo(br.x, br.y)
  ctx.lineTo(bl.x, bl.y)
  ctx.closePath()
  ctx.stroke()

  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.stroke()

  return canvas.toBuffer('image/png')
}

function cosmosBase() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="bg" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stop-color="#1a0a3a"/>
        <stop offset="45%" stop-color="#08041a"/>
        <stop offset="100%" stop-color="#010006"/>
      </radialGradient>
      <radialGradient id="n1" cx="20%" cy="15%" r="55%">
        <stop offset="0%" stop-color="#a855f7" stop-opacity=".75"/>
        <stop offset="100%" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="n2" cx="85%" cy="20%" r="50%">
        <stop offset="0%" stop-color="#ec4899" stop-opacity=".55"/>
        <stop offset="100%" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="n3" cx="50%" cy="88%" r="60%">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity=".5"/>
        <stop offset="100%" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="gold" cx="50%" cy="42%" r="35%">
        <stop offset="0%" stop-color="#DFB76C" stop-opacity=".22"/>
        <stop offset="100%" stop-opacity="0"/>
      </radialGradient>
      <filter id="blur90"><feGaussianBlur stdDeviation="90"/></filter>
      <filter id="blur50"><feGaussianBlur stdDeviation="50"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <rect width="100%" height="100%" fill="url(#n1)"/>
    <rect width="100%" height="100%" fill="url(#n2)"/>
    <rect width="100%" height="100%" fill="url(#n3)"/>
    <rect width="100%" height="100%" fill="url(#gold)"/>
    <ellipse cx="120" cy="260" rx="400" ry="280" fill="#7c3aed" opacity=".32" filter="url(#blur90)"/>
    <ellipse cx="960" cy="200" rx="420" ry="300" fill="#db2777" opacity=".26" filter="url(#blur90)"/>
    <ellipse cx="540" cy="1500" rx="550" ry="340" fill="#2563eb" opacity=".24" filter="url(#blur90)"/>
    <ellipse cx="540" cy="680" rx="380" ry="240" fill="#DFB76C" opacity=".12" filter="url(#blur50)"/>
  </svg>`)
}

function starsSvg() {
  let dots = ''
  for (let i = 0; i < 160; i++) {
    const x = (Math.random() * W).toFixed(0)
    const y = (Math.random() * H).toFixed(0)
    const r = (Math.random() * 1.6 + 0.3).toFixed(2)
    const o = (Math.random() * 0.6 + 0.15).toFixed(2)
    dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${o}"/>`
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${dots}</svg>`)
}

function overlaySvg(totalPages, mapa) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#010006" stop-opacity=".92"/>
        <stop offset="100%" stop-color="#010006" stop-opacity="0"/>
      </linearGradient>
      <linearGradient id="bot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#010006" stop-opacity="0"/>
        <stop offset="55%" stop-color="#010006" stop-opacity=".88"/>
        <stop offset="100%" stop-color="#010006"/>
      </linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <rect width="100%" height="320" fill="url(#top)"/>
    <rect y="${H - 520}" width="100%" height="520" fill="url(#bot)"/>

    <text x="540" y="118" text-anchor="middle" font-family="Georgia,serif" font-size="28" font-weight="700" fill="#F0D08A" filter="url(#glow)">Relatório PDF Profissional</text>
    <text x="540" y="148" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="13" font-weight="500" letter-spacing="3" fill="rgba(255,255,255,0.55)">PROFESSIONAL PDF REPORT</text>
    <text x="540" y="178" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="11" font-weight="600" letter-spacing="2" fill="rgba(223,183,108,0.7)">MAPA ASTRAL COMPLETO VIP · COMPLETE VIP NATAL CHART</text>

    <rect x="60" y="1580" width="960" height="72" rx="16" fill="rgba(11,7,30,0.85)" stroke="rgba(223,183,108,0.35)" stroke-width="1.5"/>
    <text x="540" y="1608" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="13" font-weight="600" fill="#fff">☉ ${mapa.solar.nome} · ☽ ${mapa.lunar.nome} · ASC ${mapa.ascendente.nome} · MC ${mapa.mc.nome} · 10 planetas · Casas Placidus</text>
    <text x="540" y="1632" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="11" font-weight="500" fill="rgba(255,255,255,0.55)">☉ ${mapa.solar.nome} · ☽ ${mapa.lunar.nome} · ASC ${mapa.ascendente.nome} · MC ${mapa.mc.nome} · 10 planets · Placidus houses</text>

    <text x="540" y="1688" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="10" font-weight="700" letter-spacing="2.5" fill="rgba(223,183,108,0.55)">${totalPages} PÁGINAS · PRÉ-VISUALIZAÇÃO FIEL DO PDF ORIGINAL</text>
    <text x="540" y="1710" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="9" font-weight="500" letter-spacing="2" fill="rgba(255,255,255,0.35)">${totalPages} PAGES · FAITHFUL PREVIEW OF YOUR PURCHASE</text>

    <g transform="translate(880,340)">
      <rect x="0" y="0" width="118" height="34" rx="17" fill="url(#vip)" stroke="#DFB76C" stroke-width="1"/>
      <defs><linearGradient id="vip" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFF3D6"/><stop offset="100%" stop-color="#C9A55A"/></linearGradient></defs>
      <text x="59" y="15" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="9" font-weight="800" fill="#0B071E" letter-spacing="2">SIDUS VIP</text>
      <text x="59" y="27" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="7" font-weight="600" fill="#0B071E" letter-spacing="1">PREMIUM</text>
    </g>
  </svg>`)
}

async function docShadow(quad) {
  const { tl, tr, br, bl } = quad
  const pad = 30
  const minX = Math.max(0, Math.min(tl.x, tr.x, br.x, bl.x) - pad)
  const maxX = Math.min(W, Math.max(tl.x, tr.x, br.x, bl.x) + pad)
  const minY = Math.max(0, Math.min(tl.y, tr.y, br.y, bl.y) - pad)
  const maxY = Math.min(H, Math.max(tl.y, tr.y, br.y, bl.y) + pad)
  const sw = Math.max(1, Math.ceil(maxX - minX))
  const sh = Math.max(1, Math.ceil(maxY - minY))
  const buf = await sharp({
    create: { width: sw, height: sh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0.6 } },
  }).blur(32).png().toBuffer()
  return { buf, left: Math.round(minX), top: Math.round(minY + 24) }
}

async function compose({ pdfHero, logoBuf, totalPages, mapa }) {
  const quad = {
    tl: { x: 60, y: 310 },
    tr: { x: 1000, y: 250 },
    br: { x: 1040, y: 1510 },
    bl: { x: 30, y: 1550 },
  }

  const warped = await warpPerspective(pdfHero, quad)
  const shadow = await docShadow(quad)
  const logo = await sharp(logoBuf).resize(88, 88, { fit: 'contain' }).png().toBuffer()

  const glowBehind = await sharp({
    create: { width: 700, height: 900, channels: 4, background: { r: 223, g: 183, b: 108, alpha: 0.18 } },
  }).blur(60).png().toBuffer()

  const spine = await sharp(pdfHero)
    .extract({
      left: Math.max(0, (await sharp(pdfHero).metadata()).width - 10),
      top: 0,
      width: 10,
      height: Math.min(700, (await sharp(pdfHero).metadata()).height),
    })
    .resize(24, 700)
    .modulate({ brightness: 0.35 })
    .png()
    .toBuffer()

  return sharp(await sharp(cosmosBase()).png().toBuffer())
    .composite([
      { input: await sharp(starsSvg()).png().toBuffer(), top: 0, left: 0 },
      { input: glowBehind, top: 480, left: 190 },
      { input: shadow.buf, top: shadow.top, left: shadow.left },
      { input: spine, top: 310, left: 968, blend: 'over' },
      { input: warped, top: 0, left: 0 },
      { input: logo, top: 28, left: Math.round((W - 88) / 2) },
      { input: await sharp(overlaySvg(totalPages, mapa)).png().toBuffer(), top: 0, left: 0 },
    ])
    .png({ compressionLevel: 4 })
    .toBuffer()
}

async function main() {
  const mapa = calcularMapaDemo(DADOS_DEMO)
  const utc = criarDataUTCporLocal(DADOS_DEMO.data, DADOS_DEMO.hora, DADOS_DEMO.fuso)
  const planetas = atribuirCasasPlanetas(calcularPlanetasDemo(utc), mapa.cusps)
  const doc = await gerarPdfMapaAstral(mapa, DADOS_DEMO, planetas, null, 'pt', { returnDoc: true })
  const total = doc.getNumberOfPages()

  console.log('PDF 360dpi · zoom extremo…')
  const pdfHero = await preparePdfHero(renderPdfPage1(doc.output('arraybuffer'), 360))

  console.log('Perspectiva 3D real + cosmos cinematográfico…')
  const png = await compose({ pdfHero, logoBuf: readFileSync(LOGO), totalPages: total, mapa })

  mkdirSync('/opt/cursor/artifacts', { recursive: true })
  writeFileSync(OUT_PREVIEW, png)
  console.log('Preview:', OUT_PREVIEW)
  if (APPLY) {
    writeFileSync(OUT_PROD, png)
    console.log('Applied:', OUT_PROD)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
