/**
 * Exporta a capa comercial = página 1 do PDF REAL, pixel a pixel.
 * Sem mockups, sem logos inventados, sem badges — igual ao download do site.
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

/** Renderiza página 1 do PDF com pdftoppm — fiel ao ficheiro gerado. */
function renderPdfPage1(pdfArrayBuffer, dpi = 200) {
  const tmp = mkdtempSync(join(tmpdir(), 'sidus-pdf-'))
  const pdfPath = join(tmp, 'mapa.pdf')
  const outPrefix = join(tmp, 'page')
  try {
    writeFileSync(pdfPath, Buffer.from(pdfArrayBuffer))
    execFileSync(
      'pdftoppm',
      ['-png', '-f', '1', '-l', '1', '-r', String(dpi), '-singlefile', pdfPath, outPrefix],
      { stdio: 'pipe' },
    )
    return readFileSync(`${outPrefix}.png`)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

async function main() {
  console.log('A calcular mapa demo…')
  const mapaNatal = calcularMapaDemo(DADOS_DEMO)
  const dataUTC = criarDataUTCporLocal(DADOS_DEMO.data, DADOS_DEMO.hora, DADOS_DEMO.fuso)
  const planetas = atribuirCasasPlanetas(calcularPlanetasDemo(dataUTC), mapaNatal.cusps)

  console.log('A gerar PDF real (PdfMapa.jsx) — mesmo código do site…')
  const doc = await gerarPdfMapaAstral(mapaNatal, DADOS_DEMO, planetas, null, 'pt', { returnDoc: true })
  const pdfArrayBuffer = doc.output('arraybuffer')
  console.log(`PDF: ${(pdfArrayBuffer.byteLength / 1024).toFixed(1)} KB, ${doc.getNumberOfPages()} páginas`)

  console.log('A exportar página 1 sem alterações…')
  const pagePng = renderPdfPage1(pdfArrayBuffer, 200)

  // Guardar tal como sai — proporção A4 exacta, sem crop, sem overlays
  await sharp(pagePng).png({ compressionLevel: 9 }).toFile(OUT)

  const meta = await sharp(OUT).metadata()
  console.log(`Wrote ${OUT} (${meta.width}×${meta.height})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
