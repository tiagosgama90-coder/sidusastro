/**
 * Capa VIP v8 — thumbnail estilo landing Sidus, bilingue PT/EN, 3D, rodapé VIP.
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
import { getPdfLabels } from '../src/lib/pdfLabels.js'
import pt from '../src/lib/i18n/pt.js'
import en from '../src/lib/i18n/en.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const APPLY = process.argv.includes('--apply')
const OUT_PROD = join(root, 'public/brand/sidus-pdf-vip-commercial-cover.png')
const OUT_PREVIEW = '/opt/cursor/artifacts/sidus-pdf-vip-commercial-cover-v8.png'
const LOGO_H = join(root, 'public/brand/sidus-logo-horizontal-1024.png')
const ZODIAC = join(root, 'public/brand/sidus-zodiac-ring.svg')

const W = 1080
const H = 1400

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
  nome: 'Mapa Astral Premium',
  data: '1990-03-15',
  hora: '14:30',
  cidade: 'Lisboa, Portugal',
  localizacao: { lat: 38.7223, lon: -9.1393 },
  fuso: 0,
}

const VIP_INCLUDES = [
  {
    pt: 'Quatro Pilares Fundamentais',
    en: 'Four Fundamental Pillars',
    detailPt: 'Sol, Lua, Ascendente, Descendente e Meio do Céu com graus exactos.',
    detailEn: 'Sun, Moon, Ascendant, Descendant and Midheaven with exact degrees.',
  },
  {
    pt: 'Interpretação profissional por secção',
    en: 'Professional section-by-section reading',
    detailPt: 'Essência central, emoções, relações, carreira, karma e propósito.',
    detailEn: 'Core essence, emotions, relationships, career, karma and purpose.',
  },
  {
    pt: '10 planetas em casas Placidus',
    en: '10 planets in Placidus houses',
    detailPt: 'Mercúrio a Plutão - signo, casa e coordenadas eclípticas.',
    detailEn: 'Mercury to Pluto - sign, house and ecliptic coordinates.',
  },
  {
    pt: 'Equilíbrio de elementos e modalidades',
    en: 'Element balance and modalities',
    detailPt: 'Fogo, Terra, Ar, Água - cardinal, fixo e mutável.',
    detailEn: 'Fire, Earth, Air, Water - cardinal, fixed and mutable.',
  },
  {
    pt: 'Mandala astrológica + dados técnicos',
    en: 'Astrological mandala + technical data',
    detailPt: 'Roda zodiacal visual, efemérides e coordenadas de nascimento.',
    detailEn: 'Visual zodiac wheel, ephemerides and birth coordinates.',
  },
  {
    pt: 'PDF completo em português e inglês',
    en: 'Full PDF in Portuguese and English',
    detailPt: 'Descarrega e recebe por email - o mesmo relatório Premium.',
    detailEn: 'Download and email delivery - the same Premium report.',
  },
]

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

function renderPdfPage1(buf, dpi = 300) {
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

async function preparePdfThumb(pngBuf) {
  const meta = await sharp(pngBuf).metadata()
  const cropH = Math.round(meta.height * 0.54)
  return sharp(pngBuf)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .resize(500, null, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.2, m1: 0.8, m2: 0.5 })
    .png()
    .toBuffer()
}

function buildHtml({ totalPages, labelsPt, labelsEn }) {
  const mPt = pt.mapa
  const mEn = en.mapa

  const includesHtml = VIP_INCLUDES.map((item) => `
    <div class="inc">
      <div class="inc__pt">${esc(item.pt)}</div>
      <div class="inc__en">${esc(item.en)}</div>
      <div class="inc__dpt">${esc(item.detailPt)}</div>
      <div class="inc__den">${esc(item.detailEn)}</div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="pt"><head><meta charset="utf-8"/>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;
  font-family:system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}

.page{position:relative;width:${W}px;height:${H}px;background:#030818;overflow:hidden}

.cosmos{position:absolute;inset:0;
  background:
    radial-gradient(ellipse 90% 70% at 50% 0%,rgba(12,28,68,.55) 0%,transparent 62%),
    radial-gradient(ellipse 60% 50% at 20% 30%,rgba(124,58,237,.35) 0%,transparent 55%),
    radial-gradient(ellipse 55% 45% at 85% 25%,rgba(219,39,119,.22) 0%,transparent 50%),
    radial-gradient(ellipse 70% 40% at 50% 100%,rgba(37,99,235,.2) 0%,transparent 55%),
    #030818}
.stars{position:absolute;inset:0;opacity:.85;
  background-image:
    radial-gradient(1px 1px at 8% 12%,rgba(255,255,255,.7),transparent),
    radial-gradient(1.5px 1.5px at 22% 35%,rgba(240,208,138,.5),transparent),
    radial-gradient(1px 1px at 45% 8%,rgba(255,255,255,.55),transparent),
    radial-gradient(1px 1px at 68% 18%,rgba(255,255,255,.6),transparent),
    radial-gradient(1.2px 1.2px at 88% 28%,rgba(223,183,108,.45),transparent),
    radial-gradient(1px 1px at 15% 78%,rgba(255,255,255,.35),transparent),
    radial-gradient(1px 1px at 82% 72%,rgba(255,255,255,.4),transparent)}

/* ── Card estilo landing-conversion-zone ── */
.card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  width:940px;padding:28px 32px 26px;border-radius:22px;
  border:1px solid rgba(223,183,108,.28);
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%,rgba(223,183,108,.1),transparent 62%),
    rgba(8,5,24,.82);
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  box-shadow:0 0 0 1px rgba(255,255,255,.03) inset,0 28px 72px rgba(0,0,0,.45)}

.logo-h{display:block;height:42px;width:auto;margin:0 auto 18px;object-fit:contain;
  filter:drop-shadow(0 0 16px rgba(223,183,108,.25))}

.head{text-align:center;margin-bottom:16px}
.eyebrow{margin:0 0 3px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(223,183,108,.82)}
.eyebrow-en{margin:0 0 10px;font-size:9px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.38)}

.title{margin:0 0 4px;font-size:26px;font-weight:700;line-height:1.25;color:#fff;letter-spacing:-.01em}
.title-en{margin:0 0 10px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.5)}

.sub{margin:0 0 2px;font-size:12px;line-height:1.5;color:rgba(255,255,255,.68)}
.sub-en{margin:0;font-size:10px;line-height:1.45;color:rgba(255,255,255,.4)}

.glow-word{background:linear-gradient(180deg,#FFF8E7 0%,#F5DCA0 28%,#DFB76C 58%,#C9A55A 100%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  -webkit-text-fill-color:transparent;
  filter:drop-shadow(0 0 10px rgba(223,183,108,.45))}

.zodiac{width:100px;height:100px;margin:12px auto 8px;display:block;opacity:.92;
  filter:drop-shadow(0 0 20px rgba(223,183,108,.2))}

/* ── 3D PDF ── */
.stage{position:relative;height:340px;margin:6px 0 14px;
  perspective:1100px;perspective-origin:50% 40%}
.plat{position:absolute;bottom:20px;left:50%;width:420px;height:80px;margin-left:-210px;
  transform:rotateX(82deg);background:radial-gradient(ellipse,rgba(223,183,108,.18) 0%,transparent 68%);
  filter:blur(12px);border-radius:50%}
.doc{position:absolute;left:50%;top:50%;
  width:460px;margin-left:-230px;margin-top:-155px;
  transform-style:preserve-3d;
  transform:rotateX(20deg) rotateY(-18deg) rotateZ(.5deg)}
.sheet{position:relative;border-radius:8px;overflow:hidden;background:#0B071E;
  border:1px solid rgba(223,183,108,.5);
  box-shadow:-28px 32px 70px rgba(0,0,0,.55),0 0 80px rgba(139,92,246,.12),0 0 50px rgba(223,183,108,.08);
  transform:translateZ(30px)}
.sheet img{display:block;width:100%;height:auto}
.spine{position:absolute;top:0;right:-5px;width:8px;height:100%;
  background:linear-gradient(90deg,#1c103a,#0b071e);transform:rotateY(88deg);transform-origin:right center}
.rim{position:absolute;inset:0;border-radius:8px;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,.08) 0%,transparent 40%,transparent 70%,rgba(0,0,0,.15) 100%)}
.badge{position:absolute;top:14px;right:-8px;z-index:5;padding:7px 14px;border-radius:999px;
  background:linear-gradient(145deg,#FFF3D6,#DFB76C 42%,#B8944F);
  color:#0B071E;font-size:8px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;
  box-shadow:0 10px 28px rgba(0,0,0,.4);transform:translateZ(50px)}
.badge-en{display:block;font-size:6.5px;letter-spacing:.12em;margin-top:2px;opacity:.8;font-weight:700}

/* ── Rodapé VIP ── */
.vip-foot{margin-top:4px;padding:16px 14px 14px;border-radius:16px;
  border:1px solid rgba(223,183,108,.22);
  background:rgba(11,7,30,.72)}
.vip-foot__title{margin:0 0 2px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#DFB76C;text-align:center}
.vip-foot__title-en{margin:0 0 12px;font-size:9px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.38);text-align:center}

.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.inc{padding:9px 10px;border-radius:10px;background:rgba(0,0,0,.22);border:1px solid rgba(223,183,108,.14)}
.inc__pt{font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#DFB76C;line-height:1.3}
.inc__en{font-size:7px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.42);margin-top:2px;line-height:1.25}
.inc__dpt{font-size:7.5px;line-height:1.4;color:rgba(255,255,255,.62);margin-top:5px}
.inc__den{font-size:6.5px;line-height:1.35;color:rgba(255,255,255,.36);margin-top:3px}

.legal{margin-top:12px;text-align:center}
.legal__pt{font-size:8px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:rgba(223,183,108,.5)}
.legal__en{font-size:7px;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.3);margin-top:3px}
.chips{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:10px}
.chip{font-size:8px;font-weight:600;padding:5px 9px;border-radius:8px;
  background:rgba(11,7,30,.8);border:1px solid rgba(223,183,108,.22);color:rgba(255,255,255,.7)}
.chip span{display:block;font-size:6.5px;color:rgba(255,255,255,.38);font-weight:500;margin-top:1px}
</style></head>
<body>
<div class="page">
  <div class="cosmos"></div>
  <div class="stars"></div>

  <div class="card">
    <img class="logo-h" src="logo-horizontal.png" alt="Sidus"/>

    <div class="head">
      <p class="eyebrow">${esc(pt.auth.portal.conversionEyebrow)}</p>
      <p class="eyebrow-en">${esc(en.auth.portal.conversionEyebrow)}</p>
      <h1 class="title"><span class="glow-word">${esc(mPt.fullChart)}</span> Premium</h1>
      <p class="title-en">${esc(mEn.fullChart)} Premium</p>
      <p class="sub">${esc(mPt.fullDesc)}</p>
      <p class="sub-en">${esc(mEn.fullDesc)}</p>
    </div>

    <img class="zodiac" src="zodiac.svg" alt=""/>

    <div class="stage">
      <div class="plat"></div>
      <div class="doc">
        <div class="sheet">
          <img src="page.png" alt="PDF"/>
          <div class="spine"></div>
          <div class="rim"></div>
        </div>
        <div class="badge">Sidus Premium<span class="badge-en">Vitalício</span></div>
      </div>
    </div>

    <div class="vip-foot">
      <p class="vip-foot__title">O que recebes ao pagar o Premium</p>
      <p class="vip-foot__title-en">What you get when you upgrade to Premium</p>
      <div class="grid">${includesHtml}</div>
      <div class="chips">
        <span class="chip">☉ ${esc(labelsPt.labels.sun)}<span>${esc(labelsEn.labels.sun)}</span></span>
        <span class="chip">☽ ${esc(labelsPt.labels.moon)}<span>${esc(labelsEn.labels.moon)}</span></span>
        <span class="chip">${esc(labelsPt.labels.asc)}<span>${esc(labelsEn.labels.asc)}</span></span>
        <span class="chip">${esc(labelsPt.labels.mc)}<span>${esc(labelsEn.labels.mc)}</span></span>
        <span class="chip">10 planetas<span>10 planets</span></span>
        <span class="chip">Casas Placidus<span>Placidus houses</span></span>
      </div>
      <div class="legal">
        <p class="legal__pt">${totalPages} páginas · Pré-visualização fiel do PDF · PT &amp; EN</p>
        <p class="legal__en">${totalPages} pages · Faithful PDF preview · Portuguese &amp; English</p>
      </div>
    </div>
  </div>
</div>
</body></html>`
}

async function renderCover(html, assetsDir) {
  writeFileSync(join(assetsDir, 'cover.html'), html)
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--no-sandbox'] })
  try {
    const page = await browser.newPage({
      viewport: { width: W, height: H },
      deviceScaleFactor: 2,
    })
    await page.goto(pathToFileURL(join(assetsDir, 'cover.html')).href, { waitUntil: 'load', timeout: 90000 })
    await page.waitForTimeout(1400)
    return await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: W, height: H },
      timeout: 90000,
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
  const labelsPt = getPdfLabels('pt')
  const labelsEn = getPdfLabels('en')

  console.log('PDF real · thumbnail landing Sidus…')
  const pagePng = await preparePdfThumb(renderPdfPage1(doc.output('arraybuffer'), 300))

  const assetsDir = mkdtempSync(join(tmpdir(), 'sidus-cover-v8-'))
  try {
    writeFileSync(join(assetsDir, 'page.png'), pagePng)
    copyFileSync(LOGO_H, join(assetsDir, 'logo-horizontal.png'))
    copyFileSync(ZODIAC, join(assetsDir, 'zodiac.svg'))

    console.log('Card landing · 3D · bilingue PT/EN · rodapé VIP…')
    const shot = await renderCover(buildHtml({ totalPages: total, labelsPt, labelsEn }), assetsDir)

    mkdirSync('/opt/cursor/artifacts', { recursive: true })
    const final = await sharp(shot)
      .resize(W, H, { kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 5 })
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
