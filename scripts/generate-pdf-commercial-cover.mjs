/**
 * Capa comercial VIP 3D — PDF real + nebulosa cósmica.
 *   npx vite-node scripts/generate-pdf-commercial-cover.mjs          # preview
 *   npx vite-node scripts/generate-pdf-commercial-cover.mjs --apply  # public/brand
 */
import { writeFileSync, mkdtempSync, rmSync, readFileSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { chromium } from 'playwright'
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
const OUT_PREVIEW = '/opt/cursor/artifacts/sidus-pdf-vip-commercial-cover-preview.png'
const LOGO_STACKED = join(root, 'public/brand/sidus-logo-stacked-1024.png')

const W = 1080
const H = 1440

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
  if (!dataUTC) throw new Error('Data inválida')
  const angulos = calcularAngulosCasas(null, dataUTC, dados.localizacao.lat, dados.localizacao.lon)
  if (!angulos) throw new Error('Casas não calculadas')
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
  return PLANETAS.map((p) => {
    const lon = Ecliptic(GeoVector(p.corpo, time, true)).elon
    return { ...p, longitude: lon, signo: longitudeParaSigno(lon), retrograde: false }
  })
}

function renderPdfPages(pdfArrayBuffer, pages, dpi = 200) {
  const tmp = mkdtempSync(join(tmpdir(), 'sidus-pdf-'))
  const pdfPath = join(tmp, 'mapa.pdf')
  const outPrefix = join(tmp, 'page')
  try {
    writeFileSync(pdfPath, Buffer.from(pdfArrayBuffer))
    const minP = Math.min(...pages)
    const maxP = Math.max(...pages)
    execFileSync('pdftoppm', ['-png', '-f', String(minP), '-l', String(maxP), '-r', String(dpi), pdfPath, outPrefix], {
      stdio: 'pipe',
    })
    const out = {}
    for (const n of pages) {
      const idx = n - minP + 1
      const paths = [`${outPrefix}-${String(idx).padStart(2, '0')}.png`, `${outPrefix}-${idx}.png`]
      out[n] = readFileSync(paths.find((p) => { try { readFileSync(p); return true } catch { return false } }))
    }
    return out
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

function b64(buf) {
  return `data:image/png;base64,${buf.toString('base64')}`
}

function buildHtml({ logoBuf, pages, totalPages }) {
  const logo = b64(logoBuf)
  const p1 = b64(pages[1])
  const p2 = b64(pages[2] || pages[1])

  return `<!DOCTYPE html>
<html lang="pt"><head><meta charset="utf-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body {
    width:${W}px; height:${H}px; overflow:hidden;
    font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .cover {
    position:relative; width:${W}px; height:${H}px;
    background:#030108;
    overflow:hidden;
  }

  /* ── Nebulosa cósmica ── */
  .cosmos { position:absolute; inset:0; }
  .cosmos-base {
    position:absolute; inset:0;
    background:
      radial-gradient(ellipse 120% 80% at 50% 110%, #1a0533 0%, transparent 55%),
      radial-gradient(ellipse 90% 60% at 50% -10%, #0d1a4a 0%, transparent 50%),
      linear-gradient(180deg, #020108 0%, #0B071E 35%, #12082a 70%, #050208 100%);
  }
  .nebula {
    position:absolute; border-radius:50%; filter:blur(48px); opacity:0.85;
    mix-blend-mode:screen;
  }
  .n1 { width:520px; height:380px; top:-60px; left:-80px;
    background:radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(88,28,135,0.2) 45%, transparent 70%); }
  .n2 { width:600px; height:420px; top:180px; right:-160px;
    background:radial-gradient(circle, rgba(236,72,153,0.28) 0%, rgba(124,58,237,0.18) 40%, transparent 68%); }
  .n3 { width:700px; height:500px; bottom:-120px; left:50%; transform:translateX(-50%);
    background:radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(28,16,58,0.35) 50%, transparent 72%); }
  .n4 { width:340px; height:280px; top:42%; left:8%;
    background:radial-gradient(circle, rgba(223,183,108,0.18) 0%, transparent 65%); filter:blur(36px); mix-blend-mode:normal; }
  .stars {
    position:absolute; inset:0; opacity:0.9;
    background-image:
      radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1.5px 1.5px at 25% 42%, rgba(223,183,108,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 40% 8%, rgba(255,255,255,0.55) 0%, transparent 100%),
      radial-gradient(1px 1px at 55% 28%, rgba(255,255,255,0.4) 0%, transparent 100%),
      radial-gradient(1.2px 1.2px at 72% 12%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 88% 35%, rgba(223,183,108,0.45) 0%, transparent 100%),
      radial-gradient(1px 1px at 15% 68%, rgba(255,255,255,0.35) 0%, transparent 100%),
      radial-gradient(1.4px 1.4px at 92% 78%, rgba(255,255,255,0.5) 0%, transparent 100%),
      radial-gradient(1px 1px at 48% 88%, rgba(223,183,108,0.35) 0%, transparent 100%),
      radial-gradient(2px 2px at 62% 55%, rgba(255,248,231,0.25) 0%, transparent 100%);
  }
  .vignette {
    position:absolute; inset:0;
    background:radial-gradient(ellipse 75% 85% at 50% 48%, transparent 30%, rgba(0,0,0,0.55) 100%);
    pointer-events:none;
  }

  /* ── Header ── */
  .head {
    position:relative; z-index:10;
    display:flex; flex-direction:column; align-items:center;
    padding:38px 36px 0; text-align:center;
  }
  .head img {
    width:82px; height:82px; object-fit:contain;
    filter:drop-shadow(0 0 24px rgba(223,183,108,0.35));
  }
  .head h1 {
    margin-top:14px;
    font-size:12px; font-weight:800; letter-spacing:0.24em;
    text-transform:uppercase; color:#DFB76C;
    text-shadow:0 0 28px rgba(223,183,108,0.35);
  }
  .head p {
    margin-top:8px; font-size:10.5px; font-weight:500;
    letter-spacing:0.07em; color:rgba(255,255,255,0.55);
    max-width:90%; line-height:1.5;
  }

  /* ── Cena 3D ── */
  .stage {
    position:relative; z-index:5;
    flex:1; height:920px;
    margin-top:8px;
    perspective:1400px;
    perspective-origin:50% 42%;
    display:flex; align-items:center; justify-content:center;
  }
  .stage-floor {
    position:absolute; bottom:118px; left:50%; transform:translateX(-50%) rotateX(78deg);
    width:620px; height:280px;
    background:radial-gradient(ellipse at center, rgba(223,183,108,0.14) 0%, rgba(139,92,246,0.08) 35%, transparent 68%);
    filter:blur(8px); border-radius:50%;
    pointer-events:none;
  }
  .stack-3d {
    position:relative; width:500px; height:680px;
    transform-style:preserve-3d;
    transform:rotateX(10deg) rotateY(-14deg) rotateZ(1deg);
  }
  .page-shadow {
    position:absolute; left:50%; bottom:-18px;
    width:420px; height:60px; margin-left:-210px;
    background:radial-gradient(ellipse, rgba(0,0,0,0.65) 0%, transparent 72%);
    filter:blur(18px); transform:rotateX(78deg) translateZ(-40px);
  }
  .page {
    position:absolute; inset:0;
    border-radius:10px; overflow:hidden;
    background:#0B071E;
    border:1.5px solid rgba(223,183,108,0.35);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.06),
      0 2px 0 rgba(223,183,108,0.12);
  }
  .page img { display:block; width:100%; height:auto; }
  .page-back {
    transform:translateZ(-48px) translateX(28px) translateY(16px) rotateY(6deg);
    opacity:0.45; filter:brightness(0.72);
    border-color:rgba(223,183,108,0.15);
    box-shadow:0 40px 80px rgba(0,0,0,0.5);
  }
  .page-mid {
    transform:translateZ(-22px) translateX(14px) translateY(8px) rotateY(3deg);
    opacity:0.68; filter:brightness(0.85);
    border-color:rgba(223,183,108,0.22);
    box-shadow:0 50px 100px rgba(0,0,0,0.55);
  }
  .page-front {
    transform:translateZ(32px);
    border-color:rgba(223,183,108,0.5);
    box-shadow:
      0 0 0 1px rgba(223,183,108,0.1),
      0 4px 0 rgba(223,183,108,0.08),
      0 28px 60px rgba(0,0,0,0.55),
      0 60px 120px rgba(0,0,0,0.45),
      -20px 20px 60px rgba(139,92,246,0.12),
      20px -10px 50px rgba(223,183,108,0.08);
  }
  .page-edge {
    position:absolute; top:0; right:-3px; width:6px; height:100%;
    background:linear-gradient(90deg, rgba(28,16,58,0.9), rgba(11,7,30,0.95));
    transform:rotateY(90deg) translateZ(2px); transform-origin:right center;
    border-radius:0 3px 3px 0;
  }
  .vip-badge {
    position:absolute; top:18px; right:-8px; z-index:20;
    padding:8px 16px; border-radius:999px;
    background:linear-gradient(135deg, #F0D08A, #DFB76C 45%, #B8944F);
    color:#0B071E; font-size:10px; font-weight:900;
    letter-spacing:0.18em; text-transform:uppercase;
    box-shadow:0 10px 28px rgba(0,0,0,0.45), 0 0 20px rgba(223,183,108,0.25);
    transform:translateZ(60px);
  }
  .pages-pill {
    position:absolute; bottom:-36px; left:50%;
    transform:translateX(-50%) translateZ(50px);
    padding:7px 18px; border-radius:999px;
    background:rgba(11,7,30,0.88);
    border:1px solid rgba(223,183,108,0.42);
    backdrop-filter:blur(8px);
    font-size:9px; font-weight:800; letter-spacing:0.16em;
    color:#DFB76C; white-space:nowrap;
    box-shadow:0 12px 32px rgba(0,0,0,0.4);
  }
  .light-beam {
    position:absolute; top:120px; left:50%; margin-left:-180px;
    width:360px; height:500px;
    background:linear-gradient(180deg, rgba(223,183,108,0.08) 0%, transparent 80%);
    filter:blur(20px); transform:translateZ(-80px);
    pointer-events:none;
  }

  /* ── Footer ── */
  .foot {
    position:absolute; bottom:0; left:0; right:0; z-index:10;
    padding:0 32px 34px; text-align:center;
  }
  .foot-features {
    display:inline-block;
    padding:12px 22px; border-radius:14px;
    background:rgba(11,7,30,0.78);
    border:1px solid rgba(223,183,108,0.32);
    backdrop-filter:blur(12px);
    font-size:11.5px; font-weight:700; letter-spacing:0.05em;
    color:rgba(255,255,255,0.82); line-height:1.5;
    box-shadow:0 16px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05);
  }
  .foot-note {
    margin-top:12px;
    font-size:8.5px; letter-spacing:0.14em; text-transform:uppercase;
    color:rgba(223,183,108,0.45);
  }
  .frame {
    position:absolute; inset:16px; border-radius:24px;
    border:1px solid rgba(223,183,108,0.12);
    pointer-events:none; z-index:15;
  }
</style>
</head>
<body>
<div class="cover">
  <div class="cosmos">
    <div class="cosmos-base"></div>
    <div class="nebula n1"></div>
    <div class="nebula n2"></div>
    <div class="nebula n3"></div>
    <div class="nebula n4"></div>
    <div class="stars"></div>
    <div class="vignette"></div>
  </div>
  <div class="frame"></div>

  <header class="head">
    <img src="${logo}" alt="Sidus" width="82" height="82"/>
    <h1>Relatório PDF profissional</h1>
    <p>Sol, Lua, Ascendente e 10 planetas · Mapa Astral Completo VIP</p>
  </header>

  <div class="stage">
    <div class="stage-floor"></div>
    <div class="light-beam"></div>
    <div class="stack-3d">
      <div class="page-shadow"></div>
      <div class="page page-back"><img src="${p2}" alt=""/></div>
      <div class="page page-mid"><img src="${p2}" alt=""/></div>
      <div class="page page-front">
        <img src="${p1}" alt="PDF real"/>
        <div class="page-edge"></div>
      </div>
      <div class="vip-badge">Sidus VIP</div>
      <div class="pages-pill">${totalPages} páginas · PDF real</div>
    </div>
  </div>

  <footer class="foot">
    <p class="foot-features">☉ Sol · ☽ Lua · ASC · MC · 10 planetas · Casas Placidus</p>
    <p class="foot-note">Pré-visualização fiel do documento após a compra</p>
  </footer>
</div>
</body></html>`
}

async function screenshotHtml(html) {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: W, height: H } })
    await page.setContent(html, { waitUntil: 'load' })
    await page.waitForTimeout(400)
    return await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } })
  } finally {
    await browser.close()
  }
}

async function main() {
  const mapaNatal = calcularMapaDemo(DADOS_DEMO)
  const dataUTC = criarDataUTCporLocal(DADOS_DEMO.data, DADOS_DEMO.hora, DADOS_DEMO.fuso)
  const planetas = atribuirCasasPlanetas(calcularPlanetasDemo(dataUTC), mapaNatal.cusps)

  const doc = await gerarPdfMapaAstral(mapaNatal, DADOS_DEMO, planetas, null, 'pt', { returnDoc: true })
  const pdfArrayBuffer = doc.output('arraybuffer')
  const totalPages = doc.getNumberOfPages()

  const pages = renderPdfPages(pdfArrayBuffer, [1, 2], 200)
  const logoBuf = readFileSync(LOGO_STACKED)
  const png = await screenshotHtml(buildHtml({ logoBuf, pages, totalPages }))

  mkdirSync('/opt/cursor/artifacts', { recursive: true })
  writeFileSync(OUT_PREVIEW, png)
  console.log('Preview:', OUT_PREVIEW)

  if (APPLY) {
    writeFileSync(OUT_PROD, png)
    console.log('Applied:', OUT_PROD)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
