/**
 * Capa VIP v5 — PDF único inclinado 3D, cosmos denso, excertos reais.
 *   npx vite-node scripts/generate-pdf-commercial-cover.mjs
 *   npx vite-node scripts/generate-pdf-commercial-cover.mjs --apply
 */
import { writeFileSync, mkdtempSync, rmSync, readFileSync, mkdirSync, copyFileSync } from 'fs'
import { tmpdir } from 'os'
import { execFileSync } from 'child_process'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'
import sharp from 'sharp'
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
const OUT_PREVIEW = '/opt/cursor/artifacts/sidus-pdf-vip-commercial-cover-v5.png'
const LOGO = join(root, 'public/brand/sidus-logo-stacked-1024.png')

const W = 1080
const H = 1680

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

function renderPdfPage1(buf, dpi = 260) {
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

function fmtGraus(signo) {
  const g = Math.floor(signo.graus)
  const m = Math.round((signo.graus - g) * 60)
  return `${g}°${String(m).padStart(2, '0')}'`
}

function fmtSigno(signo) {
  return `${signo.nome} ${signo.simbolo} ${fmtGraus(signo)}`
}

/** Mostra cabeçalho + Quatro Pilares + início das secções (texto legível). */
async function preparePdfForCover(pngBuf) {
  const meta = await sharp(pngBuf).metadata()
  const cropH = Math.round(meta.height * 0.68)
  return sharp(pngBuf)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .resize(560, null, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.2, m1: 0.8, m2: 0.5 })
    .png()
    .toBuffer()
}

function buildHtml({ totalPages, mapa }) {
  const solar = fmtSigno(mapa.solar)
  const lunar = fmtSigno(mapa.lunar)
  const asc = fmtSigno(mapa.ascendente)
  const mc = fmtSigno(mapa.mc)

  return `<!DOCTYPE html>
<html lang="pt"><head><meta charset="utf-8"/>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}

.canvas{position:relative;width:${W}px;height:${H}px;background:#020108;overflow:hidden}

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
.horizon{position:absolute;bottom:360px;left:50%;transform:translateX(-50%);
  width:900px;height:2px;
  background:linear-gradient(90deg,transparent,rgba(223,183,108,.12) 30%,rgba(139,92,246,.15) 70%,transparent);
  filter:blur(1px)}
.ring{position:absolute;inset:20px;border-radius:28px;
  border:1px solid rgba(223,183,108,.1);pointer-events:none;z-index:25}

.hdr{position:relative;z-index:20;padding:42px 40px 0;text-align:center}
.logo{width:80px;height:80px;object-fit:contain;
  filter:drop-shadow(0 0 30px rgba(223,183,108,.4))}
.hdr h1{margin-top:16px;font-size:24px;font-weight:700;letter-spacing:.06em;
  color:#F0D08A;text-shadow:0 0 40px rgba(223,183,108,.3)}
.hdr .sub{margin-top:8px;font-size:11px;font-weight:500;letter-spacing:.18em;
  text-transform:uppercase;color:rgba(255,255,255,.5)}
.hdr .tag{margin-top:6px;font-size:10px;letter-spacing:.1em;color:rgba(223,183,108,.42)}

.stage{position:absolute;inset:0;z-index:10;display:flex;align-items:center;justify-content:center;
  perspective:1400px;perspective-origin:50% 42%}
.plat{position:absolute;bottom:360px;left:50%;width:680px;height:220px;margin-left:-340px;
  transform:rotateX(82deg);
  background:radial-gradient(ellipse,rgba(223,183,108,.2) 0%,rgba(139,92,246,.12) 35%,transparent 68%);
  filter:blur(16px);border-radius:50%}
.glow{position:absolute;width:520px;height:680px;
  background:radial-gradient(ellipse at 50% 30%,rgba(223,183,108,.12) 0%,transparent 65%);
  filter:blur(32px);pointer-events:none}

.doc-wrap{position:relative;width:560px;transform-style:preserve-3d;
  transform:rotateX(16deg) rotateY(-20deg) rotateZ(.8deg)}
.shadow-back{position:absolute;inset:0;border-radius:8px;
  transform:translateZ(-36px) translateX(28px) translateY(18px) rotateY(6deg);
  background:rgba(0,0,0,.55);filter:blur(22px);opacity:.75}
.sheet{position:relative;border-radius:8px;overflow:hidden;background:#0B071E;
  border:1px solid rgba(223,183,108,.5);
  box-shadow:
    -1px 0 0 rgba(223,183,108,.15),
    0 0 0 1px rgba(255,255,255,.04),
    -34px 34px 90px rgba(0,0,0,.55),
    0 56px 110px rgba(0,0,0,.48),
    0 0 90px rgba(139,92,246,.14),
    0 0 130px rgba(223,183,108,.08);
  transform:translateZ(48px)}
.sheet img{display:block;width:100%;height:auto;vertical-align:top}
.spine{position:absolute;top:0;right:-6px;width:9px;height:100%;
  background:linear-gradient(90deg,#1c103a,#0b071e 60%,#060412);
  transform:rotateY(88deg);transform-origin:right center;
  border-radius:0 2px 2px 0;box-shadow:2px 0 10px rgba(0,0,0,.45)}
.rim{position:absolute;inset:0;border-radius:8px;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,.08) 0%,transparent 35%,transparent 65%,rgba(0,0,0,.18) 100%)}
.reflect{position:absolute;top:100%;left:0;right:0;height:100px;margin-top:6px;
  transform:scaleY(-1);opacity:.1;pointer-events:none;
  mask-image:linear-gradient(to bottom,rgba(0,0,0,.45),transparent);
  -webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,.45),transparent);
  filter:blur(2px)}
.reflect img{width:100%;opacity:.55}
.badge{position:absolute;top:20px;right:-12px;z-index:30;
  padding:9px 18px;border-radius:999px;
  background:linear-gradient(145deg,#FFF3D6,#DFB76C 40%,#B8944F);
  color:#0B071E;font-size:10px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;
  box-shadow:0 12px 32px rgba(0,0,0,.45),0 0 24px rgba(223,183,108,.3);
  transform:translateZ(90px) rotateY(-5deg)}
.pill{position:absolute;bottom:-40px;left:50%;
  transform:translateX(-50%) translateZ(80px);
  padding:8px 20px;border-radius:999px;
  background:rgba(8,5,20,.88);border:1px solid rgba(223,183,108,.48);
  backdrop-filter:blur(10px);
  font-size:9px;font-weight:700;letter-spacing:.18em;color:#DFB76C;
  white-space:nowrap;box-shadow:0 16px 40px rgba(0,0,0,.45)}

.float{position:absolute;z-index:30;max-width:250px;padding:10px 14px;border-radius:12px;
  background:rgba(8,5,20,.82);border:1px solid rgba(223,183,108,.32);
  backdrop-filter:blur(12px);box-shadow:0 12px 36px rgba(0,0,0,.4)}
.float .k{font-size:8px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(223,183,108,.65);margin-bottom:4px}
.float .v{font-size:11px;font-weight:600;line-height:1.35;color:rgba(255,255,255,.88)}
.float .x{font-size:9px;line-height:1.4;color:rgba(255,255,255,.52);margin-top:5px}
.f1{top:430px;left:36px}
.f2{top:500px;right:34px}
.f3{top:620px;left:42px}
.f4{top:690px;right:38px}

.ftr{position:absolute;bottom:0;left:0;right:0;z-index:20;padding:0 36px 40px;text-align:center}
.samples{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;text-align:left}
.sample{padding:10px 12px;border-radius:10px;
  background:rgba(11,7,30,.78);border:1px solid rgba(223,183,108,.24);
  backdrop-filter:blur(10px)}
.sample .t{font-size:8px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#DFB76C;margin-bottom:4px}
.sample .b{font-size:9px;line-height:1.45;color:rgba(255,255,255,.68)}
.chips{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-bottom:12px}
.chip{padding:8px 14px;border-radius:10px;
  background:rgba(11,7,30,.75);border:1px solid rgba(223,183,108,.28);
  font-size:10px;font-weight:600;letter-spacing:.04em;color:rgba(255,255,255,.75);
  backdrop-filter:blur(10px)}
.chip-gold{color:#DFB76C;border-color:rgba(223,183,108,.45)}
.legal{font-size:8px;letter-spacing:.16em;text-transform:uppercase;color:rgba(223,183,108,.38)}
</style></head>
<body>
<div class="canvas">
  <div class="sky"></div>
  <div class="neb nb1"></div><div class="neb nb2"></div><div class="neb nb3"></div><div class="neb nb4"></div>
  <div class="dust"></div><div class="vig"></div><div class="horizon"></div>
  <div class="ring"></div>

  <header class="hdr">
    <img class="logo" src="logo.png" alt="Sidus"/>
    <h1>Relatório PDF Profissional</h1>
    <p class="sub">Mapa Astral Completo VIP</p>
    <p class="tag">Pré-visualização fiel do PDF original</p>
  </header>

  <div class="float f1"><div class="k">☉ Solar</div><div class="v">${solar}</div></div>
  <div class="float f2"><div class="k">☽ Lunar</div><div class="v">${lunar}</div></div>
  <div class="float f3"><div class="k">Ascendente</div><div class="v">${asc}</div></div>
  <div class="float f4"><div class="k">Meio do Céu</div><div class="v">${mc}</div></div>

  <div class="stage">
    <div class="plat"></div>
    <div class="glow"></div>
    <div class="doc-wrap">
      <div class="shadow-back"></div>
      <div class="sheet">
        <img src="page.png" alt="PDF Sidus"/>
        <div class="spine"></div>
        <div class="rim"></div>
        <div class="reflect"><img src="page.png" alt=""/></div>
      </div>
      <div class="badge">Sidus VIP</div>
      <div class="pill">${totalPages} páginas · PDF original do site</div>
    </div>
  </div>

  <footer class="ftr">
    <div class="samples">
      <div class="sample">
        <div class="t">0. Nota metodológica</div>
        <div class="b">Posicionamento astronómico preciso com motor astronomy-engine + Meeus.</div>
      </div>
      <div class="sample">
        <div class="t">1. A tua essência central</div>
        <div class="b">Análise do Sol em ${mapa.solar.nome} — propósito vital e identidade cósmica.</div>
      </div>
      <div class="sample">
        <div class="t">Quatro pilares</div>
        <div class="b">Solar, Lunar, Ascendente, Descendente e MC com graus exactos.</div>
      </div>
      <div class="sample">
        <div class="t">10 planetas + casas</div>
        <div class="b">Mercúrio a Plutão em signos e casas Placidus — texto justificado.</div>
      </div>
    </div>
    <div class="chips">
      <span class="chip chip-gold">☉ Sol</span>
      <span class="chip chip-gold">☽ Lua</span>
      <span class="chip">ASC</span>
      <span class="chip">MC</span>
      <span class="chip">10 planetas</span>
      <span class="chip">Casas Placidus</span>
    </div>
    <p class="legal">O mesmo PDF que recebes após a compra · sidusastro.com</p>
  </footer>
</div>
</body></html>`
}

async function renderCover(html, assetsDir) {
  writeFileSync(join(assetsDir, 'cover.html'), html)
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--no-sandbox'] })
  try {
    const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 })
    const url = pathToFileURL(join(assetsDir, 'cover.html')).href
    await page.goto(url, { waitUntil: 'load', timeout: 60000 })
    await page.waitForTimeout(1200)
    return await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: W, height: H },
      timeout: 60000,
    })
  } finally {
    await browser.close()
  }
}

async function main() {
  const mapa = calcularMapaDemo(DADOS_DEMO)
  const utc = criarDataUTCporLocal(DADOS_DEMO.data, DADOS_DEMO.hora, DADOS_DEMO.fuso)
  const planetas = atribuirCasasPlanetas(calcularPlanetasDemo(utc), mapa.cusps)
  const doc = await gerarPdfMapaAstral(mapa, DADOS_DEMO, planetas, null, 'pt', { returnDoc: true })
  const total = doc.getNumberOfPages()

  console.log('PDF real · página 1 · 260dpi…')
  const pagePng = await preparePdfForCover(renderPdfPage1(doc.output('arraybuffer'), 260))

  const assetsDir = mkdtempSync(join(tmpdir(), 'sidus-cover-v5-'))
  try {
    writeFileSync(join(assetsDir, 'page.png'), pagePng)
    copyFileSync(LOGO, join(assetsDir, 'logo.png'))

    console.log('Cosmos 3D · PDF inclinado · excertos…')
    const shot = await renderCover(buildHtml({ totalPages: total, mapa }), assetsDir)

    mkdirSync('/opt/cursor/artifacts', { recursive: true })
    const final = await sharp(shot)
      .resize(W, H, { fit: 'cover' })
      .png({ compressionLevel: 6 })
      .toBuffer()

    writeFileSync(OUT_PREVIEW, final)
    console.log('Preview:', OUT_PREVIEW)
    if (APPLY) {
      writeFileSync(OUT_PROD, final)
      console.log('Applied:', OUT_PROD)
    }
  } finally {
    rmSync(assetsDir, { recursive: true, force: true })
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
