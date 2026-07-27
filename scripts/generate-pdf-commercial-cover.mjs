/**
 * Capa VIP v4 — zoom PDF, nebulosa densa, profundidade 3D (sharp only).
 */
import { writeFileSync, mkdtempSync, rmSync, readFileSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import sharp from 'sharp'
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
const OUT_PREVIEW = '/opt/cursor/artifacts/sidus-pdf-vip-commercial-cover-v4.png'
const LOGO = join(root, 'public/brand/sidus-logo-stacked-1024.png')

const W = 1080
const H = 1500
const DOC_W = 940

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

function calcularMapaDemo(dados) {
  const dataUTC = criarDataUTCporLocal(dados.data, dados.hora, dados.fuso)
  const angulos = calcularAngulosCasas(null, dataUTC, dados.localizacao.lat, dados.localizacao.lon)
  const time = MakeTime(dataUTC)
  return {
    solar: longitudeParaSigno(Ecliptic(GeoVector(Body.Sun, time, true)).elon),
    lunar: longitudeParaSigno(Ecliptic(GeoVector(Body.Moon, time, true)).elon),
    ascendente: longitudeParaSigno(angulos.ascendant),
    descendente: longitudeParaSigno(angulos.descendente),
    mc: longitudeParaSigno(angulos.mc),
    ic: longitudeParaSigno(angulos.ic),
    cusps: angulos.cusps,
    sistema: angulos.sistema,
    instanteUTC: dataUTC.toISOString(),
    lat: dados.localizacao.lat,
    lon: dados.localizacao.lon,
    fuso: dados.fuso,
    motor: 'astronomy-engine + Meeus',
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

function renderPdfPage1(buf, dpi = 350) {
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

/** Crop agressivo no topo (mais zoom) + nitidez para texto legível. */
async function preparePdfZoom(pngBuf) {
  const meta = await sharp(pngBuf).metadata()
  const cropH = Math.round(meta.height * 0.52)
  return sharp(pngBuf)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .resize(DOC_W, null, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.35, m1: 0.85, m2: 0.55 })
    .png()
    .toBuffer()
}

function nebulaBg() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="g1" cx="18%" cy="8%" r="58%"><stop offset="0%" stop-color="#a78bfa" stop-opacity=".62"/><stop offset="100%" stop-opacity="0"/></radialGradient>
      <radialGradient id="g2" cx="88%" cy="18%" r="52%"><stop offset="0%" stop-color="#f472b6" stop-opacity=".48"/><stop offset="100%" stop-opacity="0"/></radialGradient>
      <radialGradient id="g3" cx="48%" cy="92%" r="68%"><stop offset="0%" stop-color="#38bdf8" stop-opacity=".42"/><stop offset="100%" stop-opacity="0"/></radialGradient>
      <radialGradient id="g4" cx="50%" cy="42%" r="48%"><stop offset="0%" stop-color="#DFB76C" stop-opacity=".14"/><stop offset="100%" stop-opacity="0"/></radialGradient>
      <filter id="b"><feGaussianBlur stdDeviation="42"/></filter>
      <filter id="b2"><feGaussianBlur stdDeviation="72"/></filter>
      <filter id="b3"><feGaussianBlur stdDeviation="110"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="#000004"/>
    <rect width="100%" height="100%" fill="url(#g1)"/><rect width="100%" height="100%" fill="url(#g2)"/>
    <rect width="100%" height="100%" fill="url(#g3)"/><rect width="100%" height="100%" fill="url(#g4)"/>
    <ellipse cx="140" cy="280" rx="340" ry="240" fill="#9333ea" opacity=".28" filter="url(#b3)"/>
    <ellipse cx="940" cy="220" rx="380" ry="260" fill="#db2777" opacity=".22" filter="url(#b3)"/>
    <ellipse cx="520" cy="1120" rx="520" ry="300" fill="#2563eb" opacity=".2" filter="url(#b3)"/>
    <ellipse cx="300" cy="780" rx="280" ry="190" fill="#c084fc" opacity=".16" filter="url(#b2)"/>
    <ellipse cx="780" cy="700" rx="240" ry="160" fill="#DFB76C" opacity=".1" filter="url(#b2)"/>
    <ellipse cx="540" cy="520" rx="360" ry="220" fill="#7c3aed" opacity=".08" filter="url(#b)"/>
  </svg>`)
}

function starsLayer() {
  let s = ''
  for (let i = 0; i < 110; i++) {
    const x = Math.round(Math.random() * W)
    const y = Math.round(Math.random() * H)
    const r = (Math.random() * 1.4 + 0.35).toFixed(1)
    const o = (Math.random() * 0.55 + 0.18).toFixed(2)
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity="${o}"/>`
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${s}</svg>`)
}

function fogLayer() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><filter id="f"><feGaussianBlur stdDeviation="36"/></filter></defs>
    <ellipse cx="0" cy="${H}" rx="480" ry="360" fill="#6b21a8" opacity=".28" filter="url(#f)"/>
    <ellipse cx="${W}" cy="0" rx="420" ry="320" fill="#1d4ed8" opacity=".2" filter="url(#f)"/>
    <ellipse cx="${W / 2}" cy="${H * 0.55}" rx="560" ry="400" fill="#7c3aed" opacity=".1" filter="url(#f)"/>
    <ellipse cx="${W / 2}" cy="${H * 0.3}" rx="400" ry="280" fill="#fdf4ff" opacity=".04" filter="url(#f)"/>
  </svg>`)
}

function frameSvg(pw, ph) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${pw + 8}" height="${ph + 8}">
    <rect x="2" y="2" width="${pw + 4}" height="${ph + 4}" rx="10" ry="10" fill="none" stroke="#DFB76C" stroke-width="2.5" opacity=".7"/>
    <rect x="0" y="0" width="${pw + 8}" height="${ph + 8}" rx="12" ry="12" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  </svg>`)
}

function vipBadge() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="132" height="42">
    <rect x="1" y="1" width="130" height="40" rx="10" fill="url(#g)" stroke="#DFB76C" stroke-width="1"/>
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F5E6B8"/><stop offset="100%" stop-color="#C9A55A"/></linearGradient></defs>
    <text x="66" y="27" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="12" font-weight="800" fill="#0B071E" letter-spacing="3">SIDUS VIP</text>
  </svg>`)
}

function footerSvg(totalPages) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="220">
    <defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#000004" stop-opacity="0"/><stop offset="30%" stop-color="#000004" stop-opacity=".92"/><stop offset="100%" stop-color="#000004"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#fade)"/>
    <text x="540" y="52" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="17" font-weight="700" fill="#DFB76C">Relatório PDF profissional</text>
    <text x="540" y="78" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="14" font-weight="500" fill="rgba(255,255,255,0.78)">Sol, Lua, Ascendente e 10 planetas</text>
    <rect x="90" y="96" width="900" height="52" rx="14" fill="rgba(11,7,30,0.9)" stroke="rgba(223,183,108,0.42)" stroke-width="1.5"/>
    <text x="540" y="128" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="15" font-weight="600" fill="#fff">☉ Sol  ·  ☽ Lua  ·  ASC  ·  MC  ·  10 planetas  ·  Casas Placidus</text>
    <text x="540" y="182" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="10" font-weight="600" letter-spacing="2.5" fill="rgba(223,183,108,0.48)">${totalPages} PÁGINAS · PRÉ-VISUALIZAÇÃO FIEL DO PDF ORIGINAL</text>
  </svg>`)
}

/** Borda esquerda escura + faixa direita = efeito folha em profundidade. */
async function buildPage3D(pdfBuf) {
  const meta = await sharp(pdfBuf).metadata()
  const pw = meta.width
  const ph = meta.height

  const spine = await sharp(pdfBuf)
    .extract({ left: Math.max(0, pw - 6), top: 0, width: 6, height: ph })
    .resize(18, ph)
    .modulate({ brightness: 0.35, saturation: 0.6 })
    .png()
    .toBuffer()

  const edgeHighlight = await sharp({
    create: { width: 3, height: ph, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0.12 } },
  }).png().toBuffer()

  const thickness = await sharp({
    create: { width: 22, height: ph, channels: 4, background: { r: 18, g: 10, b: 42, alpha: 255 } },
  })
    .composite([{
      input: await sharp(pdfBuf)
        .extract({ left: Math.max(0, pw - 4), top: 0, width: 4, height: ph })
        .resize(22, ph)
        .modulate({ brightness: 0.5 })
        .png()
        .toBuffer(),
      top: 0, left: 0,
    }])
    .png()
    .toBuffer()

  const pageW = pw + 18 + 22
  return sharp({
    create: { width: pageW, height: ph, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: spine, top: 0, left: 0 },
      { input: pdfBuf, top: 0, left: 18 },
      { input: edgeHighlight, top: 0, left: 18 },
      { input: thickness, top: 0, left: pw + 18 },
    ])
    .png()
    .toBuffer()
}

async function compose(pdfBuf, logoBuf, totalPages) {
  const page3d = await buildPage3D(pdfBuf)
  const pageMeta = await sharp(page3d).metadata()
  const pw = pageMeta.width
  const ph = pageMeta.height
  const docTop = 100
  const docLeft = Math.round((W - pw) / 2)

  const shadowDeep = await sharp({
    create: { width: Math.min(pw - 40, W - 80), height: 90, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0.6 } },
  }).blur(40).png().toBuffer()

  const shadowSoft = await sharp({
    create: { width: Math.min(pw - 10, W - 40), height: 55, channels: 4, background: { r: 139, g: 92, b: 246, alpha: 0.18 } },
  }).blur(45).png().toBuffer()

  const glowW = Math.min(pw + 50, W - 20)
  const glowH = Math.min(ph + 50, H - docTop - 180)
  const glow = await sharp({
    create: { width: glowW, height: glowH, channels: 4, background: { r: 223, g: 183, b: 108, alpha: 0.14 } },
  }).blur(28).png().toBuffer()

  const logo = await sharp(logoBuf).resize(72, 72, { fit: 'contain' }).png().toBuffer()
  const frame = await sharp(frameSvg(pw, ph)).png().toBuffer()
  const badge = await sharp(vipBadge()).png().toBuffer()
  const footer = await sharp(footerSvg(totalPages)).png().toBuffer()

  const glowLeft = Math.max(0, docLeft - 25)
  const glowTop = Math.max(0, docTop - 25)

  return sharp(await sharp(nebulaBg()).png().toBuffer())
    .composite([
      { input: await sharp(starsLayer()).png().toBuffer(), top: 0, left: 0 },
      { input: await sharp(fogLayer()).png().toBuffer(), top: 0, left: 0 },
      { input: glow, top: glowTop, left: glowLeft },
      { input: shadowDeep, top: docTop + ph - 25, left: docLeft + 35 },
      { input: shadowSoft, top: docTop + ph - 8, left: docLeft + 15 },
      { input: page3d, top: docTop, left: docLeft },
      { input: frame, top: docTop - 4, left: docLeft - 4 },
      { input: badge, top: docTop + 18, left: Math.min(docLeft + pw - 142, W - 142) },
      { input: logo, top: 22, left: Math.round((W - 72) / 2) },
      { input: footer, top: H - 210, left: 0 },
    ])
    .png({ compressionLevel: 6 })
    .toBuffer()
}

async function main() {
  const mapa = calcularMapaDemo(DADOS_DEMO)
  const utc = criarDataUTCporLocal(DADOS_DEMO.data, DADOS_DEMO.hora, DADOS_DEMO.fuso)
  const planetas = atribuirCasasPlanetas(calcularPlanetasDemo(utc), mapa.cusps)
  const doc = await gerarPdfMapaAstral(mapa, DADOS_DEMO, planetas, null, 'pt', { returnDoc: true })
  const total = doc.getNumberOfPages()

  console.log('PDF 350dpi · zoom agressivo · sharpen…')
  const pdfZoom = await preparePdfZoom(renderPdfPage1(doc.output('arraybuffer'), 350))

  console.log('Nebulosa densa + profundidade 3D…')
  const png = await compose(pdfZoom, readFileSync(LOGO), total)

  mkdirSync('/opt/cursor/artifacts', { recursive: true })
  writeFileSync(OUT_PREVIEW, png)
  console.log('Preview:', OUT_PREVIEW)
  if (APPLY) {
    writeFileSync(OUT_PROD, png)
    console.log('Applied:', OUT_PROD)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
