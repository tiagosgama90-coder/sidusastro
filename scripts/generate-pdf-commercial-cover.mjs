/**
 * Capa comercial VIP — apresentação 3D vertical, PDF real, nebulosa cósmica.
 *   npx vite-node scripts/generate-pdf-commercial-cover.mjs --apply
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
const OUT_PREVIEW = '/opt/cursor/artifacts/sidus-pdf-vip-commercial-cover-v3.png'
const LOGO = join(root, 'public/brand/sidus-logo-stacked-1024.png')

const W = 1200
const H = 1600

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

function renderPdfPages(buf, pages, dpi = 240) {
  const tmp = mkdtempSync(join(tmpdir(), 'sidus-pdf-'))
  const pdfPath = join(tmp, 'm.pdf')
  const prefix = join(tmp, 'p')
  try {
    writeFileSync(pdfPath, Buffer.from(buf))
    const lo = Math.min(...pages)
    const hi = Math.max(...pages)
    execFileSync('pdftoppm', ['-png', '-f', String(lo), '-l', String(hi), '-r', String(dpi), pdfPath, prefix], {
      stdio: 'pipe',
    })
    const out = {}
    for (const n of pages) {
      const i = n - lo + 1
      for (const p of [`${prefix}-${String(i).padStart(2, '0')}.png`, `${prefix}-${i}.png`]) {
        try {
          out[n] = readFileSync(p)
          break
        } catch { /* next */ }
      }
    }
    return out
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

const b64 = (buf) => `data:image/png;base64,${buf.toString('base64')}`

function buildHtml({ logo, pages, totalPages }) {
  const p1 = b64(pages[1])
  const p2 = b64(pages[2] || pages[1])

  return `<!DOCTYPE html>
<html lang="pt"><head><meta charset="utf-8"/>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}

.canvas{position:relative;width:${W}px;height:${H}px;background:#020108;overflow:hidden}

/* ─── Cosmos layers ─── */
.sky{position:absolute;inset:0;
  background:linear-gradient(175deg,#010008 0%,#0a0618 28%,#12082a 55%,#06030f 100%)}
.neb{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none}
.nb1{width:780px;height:520px;top:-140px;left:-200px;
  background:radial-gradient(circle,rgba(124,58,237,.55) 0%,rgba(76,29,149,.2) 40%,transparent 70%)}
.nb2{width:900px;height:600px;top:200px;right:-320px;
  background:radial-gradient(circle,rgba(219,39,119,.32) 0%,rgba(147,51,234,.15) 45%,transparent 68%)}
.nb3{width:1000px;height:700px;bottom:-250px;left:50%;transform:translateX(-50%);
  background:radial-gradient(circle,rgba(37,99,235,.28) 0%,rgba(28,16,58,.4) 50%,transparent 72%)}
.nb4{width:500px;height:400px;top:38%;left:5%;
  background:radial-gradient(circle,rgba(223,183,108,.16) 0%,transparent 65%);filter:blur(50px)}
.dust{position:absolute;inset:0;opacity:.85;
  background-image:
    radial-gradient(1px 1px at 7% 12%,rgba(255,255,255,.75),transparent),
    radial-gradient(1.5px 1.5px at 18% 38%,rgba(240,208,138,.55),transparent),
    radial-gradient(1px 1px at 32% 7%,rgba(255,255,255,.5),transparent),
    radial-gradient(2px 2px at 48% 22%,rgba(255,248,231,.35),transparent),
    radial-gradient(1px 1px at 63% 9%,rgba(255,255,255,.6),transparent),
    radial-gradient(1.2px 1.2px at 78% 31%,rgba(223,183,108,.45),transparent),
    radial-gradient(1px 1px at 91% 14%,rgba(255,255,255,.55),transparent),
    radial-gradient(1px 1px at 12% 72%,rgba(255,255,255,.35),transparent),
    radial-gradient(1.4px 1.4px at 85% 68%,rgba(255,255,255,.4),transparent),
    radial-gradient(1px 1px at 52% 86%,rgba(223,183,108,.3),transparent),
    radial-gradient(1.8px 1.8px at 70% 52%,rgba(255,255,255,.2),transparent)}
.vig{position:absolute;inset:0;
  background:radial-gradient(ellipse 72% 78% at 50% 46%,transparent 25%,rgba(0,0,0,.62) 100%)}
.horizon{position:absolute;bottom:280px;left:50%;transform:translateX(-50%);
  width:900px;height:2px;
  background:linear-gradient(90deg,transparent,rgba(223,183,108,.12) 30%,rgba(139,92,246,.15) 70%,transparent);
  filter:blur(1px)}

/* ─── Header ─── */
.hdr{position:relative;z-index:20;padding:48px 48px 0;text-align:center}
.logo{width:76px;height:76px;object-fit:contain;
  filter:drop-shadow(0 0 30px rgba(223,183,108,.4))}
.hdr h1{margin-top:18px;
  font-size:22px;font-weight:700;letter-spacing:.08em;
  color:#F0D08A;text-shadow:0 0 40px rgba(223,183,108,.3)}
.hdr .sub{margin-top:10px;font-size:11px;font-weight:500;letter-spacing:.18em;
  text-transform:uppercase;color:rgba(255,255,255,.48)}
.hdr .tag{margin-top:6px;font-size:10px;letter-spacing:.1em;color:rgba(223,183,108,.42)}

/* ─── 3D Stage ─── */
.stage{position:absolute;inset:0;z-index:10;
  display:flex;align-items:center;justify-content:center;
  perspective:1600px;perspective-origin:50% 44%}
.plat{position:absolute;bottom:310px;left:50%;
  width:640px;height:200px;margin-left:-320px;
  transform:rotateX(82deg);
  background:radial-gradient(ellipse,rgba(223,183,108,.18) 0%,rgba(139,92,246,.1) 35%,transparent 68%);
  filter:blur(14px);border-radius:50%}
.glow{position:absolute;width:480px;height:620px;
  background:radial-gradient(ellipse at 50% 30%,rgba(223,183,108,.1) 0%,transparent 65%);
  filter:blur(30px);pointer-events:none}

.book{position:relative;width:520px;height:700px;
  transform-style:preserve-3d;
  transform:rotateX(14deg) rotateY(-16deg) rotateZ(.5deg);
  animation:none}
.sheet{position:absolute;inset:0;border-radius:6px;overflow:hidden;background:#0B071E;
  border:1px solid rgba(223,183,108,.25)}
.sheet img{display:block;width:100%;height:auto;vertical-align:top}
.s3{transform:translateZ(-56px) translateX(36px) translateY(20px) rotateY(5deg);
  opacity:.35;filter:brightness(.65) blur(.3px)}
.s2{transform:translateZ(-28px) translateX(18px) translateY(10px) rotateY(2.5deg);
  opacity:.55;filter:brightness(.78)}
.s1{transform:translateZ(40px);
  border-color:rgba(223,183,108,.55);
  box-shadow:
    -1px 0 0 rgba(223,183,108,.15),
    0 0 0 1px rgba(255,255,255,.04),
    -30px 30px 80px rgba(0,0,0,.5),
    0 50px 100px rgba(0,0,0,.45),
    0 0 80px rgba(139,92,246,.12),
    0 0 120px rgba(223,183,108,.06)}
.spine{position:absolute;top:0;right:-5px;width:8px;height:100%;
  background:linear-gradient(90deg,#1c103a,#0b071e 60%,#060412);
  transform:rotateY(88deg);transform-origin:right center;
  border-radius:0 2px 2px 0;box-shadow:2px 0 8px rgba(0,0,0,.4)}
.rim{position:absolute;inset:0;border-radius:6px;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,.07) 0%,transparent 35%,transparent 65%,rgba(0,0,0,.15) 100%)}
.reflect{position:absolute;top:100%;left:0;right:0;height:120px;margin-top:4px;
  transform:scaleY(-1) rotateX(180deg);opacity:.12;
  mask-image:linear-gradient(to bottom,rgba(0,0,0,.5),transparent);
  -webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,.5),transparent);
  filter:blur(2px);pointer-events:none}
.reflect img{width:100%;opacity:.6}
.badge{position:absolute;top:24px;right:-14px;z-index:30;
  padding:9px 18px;border-radius:999px;
  background:linear-gradient(145deg,#FFF3D6,#DFB76C 40%,#B8944F);
  color:#0B071E;font-size:10px;font-weight:800;letter-spacing:.2em;
  text-transform:uppercase;
  box-shadow:0 12px 32px rgba(0,0,0,.45),0 0 24px rgba(223,183,108,.3);
  transform:translateZ(80px) rotateY(-4deg)}
.pill{position:absolute;bottom:-44px;left:50%;
  transform:translateX(-50%) translateZ(70px);
  padding:8px 20px;border-radius:999px;
  background:rgba(8,5,20,.85);border:1px solid rgba(223,183,108,.45);
  backdrop-filter:blur(10px);
  font-size:9px;font-weight:700;letter-spacing:.18em;color:#DFB76C;
  white-space:nowrap;box-shadow:0 16px 40px rgba(0,0,0,.45)}

/* ─── Footer ─── */
.ftr{position:absolute;bottom:0;left:0;right:0;z-index:20;
  padding:0 40px 44px;text-align:center}
.chips{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:14px}
.chip{padding:8px 14px;border-radius:10px;
  background:rgba(11,7,30,.75);border:1px solid rgba(223,183,108,.28);
  font-size:10px;font-weight:600;letter-spacing:.04em;color:rgba(255,255,255,.75);
  backdrop-filter:blur(10px)}
.chip-gold{color:#DFB76C;border-color:rgba(223,183,108,.45)}
.legal{font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:rgba(223,183,108,.38)}
.ring{position:absolute;inset:20px;border-radius:28px;
  border:1px solid rgba(223,183,108,.1);pointer-events:none;z-index:25}
</style></head>
<body>
<div class="canvas">
  <div class="sky"></div>
  <div class="neb nb1"></div><div class="neb nb2"></div><div class="neb nb3"></div><div class="neb nb4"></div>
  <div class="dust"></div><div class="vig"></div><div class="horizon"></div>
  <div class="ring"></div>

  <header class="hdr">
    <img class="logo" src="${b64(logo)}" alt="Sidus"/>
    <h1>Relatório PDF Profissional</h1>
    <p class="sub">Mapa Astral Completo VIP</p>
    <p class="tag">Sol · Lua · Ascendente · 10 planetas</p>
  </header>

  <div class="stage">
    <div class="plat"></div>
    <div class="glow"></div>
    <div class="book">
      <div class="sheet s2"><img src="${p2}" alt=""/></div>
      <div class="sheet s1">
        <img src="${p1}" alt="PDF Sidus"/>
        <div class="spine"></div>
        <div class="rim"></div>
        <div class="reflect"><img src="${p1}" alt=""/></div>
      </div>
      <div class="badge">Sidus VIP</div>
      <div class="pill">${totalPages} páginas · PDF original do site</div>
    </div>
  </div>

  <footer class="ftr">
    <div class="chips">
      <span class="chip chip-gold">☉ Sol</span>
      <span class="chip chip-gold">☽ Lua</span>
      <span class="chip">ASC</span>
      <span class="chip">MC</span>
      <span class="chip">10 planetas</span>
      <span class="chip">Casas Placidus</span>
    </div>
    <p class="legal">Pré-visualização fiel · o mesmo PDF que recebes após a compra</p>
  </footer>
</div>
</body></html>`
}

async function render(html) {
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage'] })
  try {
    const page = await browser.newPage({ viewport: { width: W, height: H } })
    await page.setContent(html, { waitUntil: 'load', timeout: 60000 })
    await page.waitForTimeout(800)
    const shot = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H }, timeout: 60000 })
    return shot
  } finally {
    await browser.close()
  }
}

async function main() {
  console.log('PDF real (PdfMapa.jsx)…')
  const mapa = calcularMapaDemo(DADOS_DEMO)
  const utc = criarDataUTCporLocal(DADOS_DEMO.data, DADOS_DEMO.hora, DADOS_DEMO.fuso)
  const planetas = atribuirCasasPlanetas(calcularPlanetasDemo(utc), mapa.cusps)
  const doc = await gerarPdfMapaAstral(mapa, DADOS_DEMO, planetas, null, 'pt', { returnDoc: true })
  const buf = doc.output('arraybuffer')
  const total = doc.getNumberOfPages()
  console.log(`${(buf.byteLength / 1024).toFixed(0)} KB · ${total} páginas`)

  const pages = renderPdfPages(buf, [1, 2], 210)
  const png = await render(buildHtml({ logo: readFileSync(LOGO), pages, totalPages: total }))

  mkdirSync('/opt/cursor/artifacts', { recursive: true })
  writeFileSync(OUT_PREVIEW, png)
  console.log('Preview:', OUT_PREVIEW)
  if (APPLY) {
    writeFileSync(OUT_PROD, png)
    console.log('Applied:', OUT_PROD)
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
