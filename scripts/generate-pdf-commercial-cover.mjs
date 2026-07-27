/**
 * Gera a capa comercial da landing a partir do PDF REAL (PdfMapa.jsx).
 * Uso: npx vite-node scripts/generate-pdf-commercial-cover.mjs
 */
import { writeFileSync, mkdtempSync, rmSync, readFileSync } from 'fs'
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
const OUT = join(root, 'public/brand/sidus-pdf-vip-commercial-cover.png')
const LOGO_STACKED = join(root, 'public/brand/sidus-logo-stacked-1024.png')

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
  if (!dataUTC) throw new Error('Data inválida para demo')
  const angulos = calcularAngulosCasas(null, dataUTC, dados.localizacao.lat, dados.localizacao.lon)
  if (!angulos) throw new Error('Casas não calculadas')
  const time = MakeTime(dataUTC)
  const lonSol = Ecliptic(GeoVector(Body.Sun, time, true)).elon
  const lonLua = Ecliptic(GeoVector(Body.Moon, time, true)).elon
  return {
    solar: longitudeParaSigno(lonSol),
    lunar: longitudeParaSigno(lonLua),
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
  return PLANETAS.map((p) => {
    const lon = Ecliptic(GeoVector(p.corpo, time, true)).elon
    const signo = longitudeParaSigno(lon)
    return { ...p, longitude: lon, signo, retrograde: false }
  })
}

function renderPdfPagePng(pdfArrayBuffer, scale = 2.2) {
  const tmp = mkdtempSync(join(tmpdir(), 'sidus-pdf-'))
  const pdfPath = join(tmp, 'mapa.pdf')
  const outPrefix = join(tmp, 'page')
  try {
    writeFileSync(pdfPath, Buffer.from(pdfArrayBuffer))
    const dpi = Math.round(72 * scale)
    execFileSync('pdftoppm', ['-png', '-f', '1', '-l', '1', '-r', String(dpi), '-singlefile', pdfPath, outPrefix], {
      stdio: 'pipe',
    })
    return readFileSync(`${outPrefix}.png`)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

async function composeCommercialCover(pdfPngBuffer) {
  const W = 1040
  const H = 1386
  const pad = 36
  const innerW = W - pad * 2
  const innerH = H - pad * 2

  const pdfResized = await sharp(pdfPngBuffer)
    .resize(innerW, innerH, { fit: 'cover', position: 'top' })
    .png()
    .toBuffer()

  const bg = await sharp({
    create: {
      width: W,
      height: H,
      channels: 4,
      background: { r: 5, g: 3, b: 8, alpha: 1 },
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="g" cx="50%" cy="18%" r="72%">
                <stop offset="0%" stop-color="#1C103A" stop-opacity="0.95"/>
                <stop offset="55%" stop-color="#0B071E" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#050308" stop-opacity="1"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#g)"/>
          </svg>`,
        ),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toBuffer()

  const logoSize = 120
  const logo = await sharp(LOGO_STACKED)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  const badgeSvg = Buffer.from(`<svg width="160" height="44" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="158" height="42" rx="8" fill="rgba(11,7,30,0.82)" stroke="#DFB76C" stroke-width="1.2"/>
    <text x="80" y="28" text-anchor="middle" font-family="Helvetica,Arial,sans-serif" font-size="15" font-weight="700" fill="#DFB76C" letter-spacing="3">SIDUS VIP</text>
  </svg>`)

  const frameSvg = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="18" width="${W - 36}" height="${H - 36}" rx="18" fill="none" stroke="#DFB76C" stroke-opacity="0.42" stroke-width="2"/>
  </svg>`)

  return sharp(bg)
    .composite([
      { input: pdfResized, top: pad, left: pad },
      { input: frameSvg, top: 0, left: 0 },
      { input: logo, top: 36, left: 36 },
      { input: badgeSvg, top: 40, left: W - 196 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function main() {
  console.log('A calcular mapa demo…')
  const mapaNatal = calcularMapaDemo(DADOS_DEMO)
  const dataUTC = criarDataUTCporLocal(DADOS_DEMO.data, DADOS_DEMO.hora, DADOS_DEMO.fuso)
  const planetas = atribuirCasasPlanetas(calcularPlanetasDemo(dataUTC), mapaNatal.cusps)

  console.log('A gerar PDF real (PdfMapa.jsx)…')
  const doc = await gerarPdfMapaAstral(mapaNatal, DADOS_DEMO, planetas, null, 'pt', { returnDoc: true })
  const pdfArrayBuffer = doc.output('arraybuffer')
  console.log(`PDF gerado: ${(pdfArrayBuffer.byteLength / 1024).toFixed(1)} KB, ${doc.getNumberOfPages()} páginas`)

  console.log('A renderizar página 1 do PDF…')
  const pdfPng = renderPdfPagePng(pdfArrayBuffer)

  console.log('A compor capa comercial…')
  const finalPng = await composeCommercialCover(pdfPng)
  writeFileSync(OUT, finalPng)
  console.log('Wrote', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
