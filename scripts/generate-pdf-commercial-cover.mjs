/**
 * Capa VIP v6 — PDF em vidro 3D, cosmos, bilingue PT/EN, máxima qualidade.
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

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const APPLY = process.argv.includes('--apply')
const OUT_PROD = join(root, 'public/brand/sidus-pdf-vip-commercial-cover.png')
const OUT_PREVIEW = '/opt/cursor/artifacts/sidus-pdf-vip-commercial-cover-v6.png'
const LOGO = join(root, 'public/brand/sidus-logo-stacked-1024.png')

const W = 1080
const H = 1800
const DPR = 2

const SIGNO_EN = {
  Carneiro: 'Aries', Touro: 'Taurus', Gémeos: 'Gemini', Caranguejo: 'Cancer',
  Leão: 'Leo', Virgem: 'Virgo', Balança: 'Libra', Escorpião: 'Scorpio',
  Sagitário: 'Sagittarius', Capricórnio: 'Capricorn', Aquário: 'Aquarius', Peixes: 'Pisces',
}

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

const VIP_FEATURES = [
  {
    pt: 'Quatro Pilares Fundamentais',
    en: 'Four Fundamental Pillars',
    descPt: 'Sol, Lua, Ascendente, Descendente e MC com graus exactos.',
    descEn: 'Sun, Moon, Ascendant, Descendant & MC with exact degrees.',
  },
  {
    pt: 'Interpretação profissional',
    en: 'Professional interpretation',
    descPt: 'Secções dedicadas: essência, emoções, relações, carreira, karma.',
    descEn: 'Dedicated sections: essence, emotions, relationships, career, karma.',
  },
  {
    pt: '10 planetas · Casas Placidus',
    en: '10 planets · Placidus houses',
    descPt: 'Posição de cada planeta no signo e na casa natal.',
    descEn: 'Each planet in sign and natal house position.',
  },
  {
    pt: 'Equilíbrio de elementos',
    en: 'Element balance',
    descPt: 'Fogo, Terra, Ar e Água — percentagem no teu mapa.',
    descEn: 'Fire, Earth, Air & Water — percentage in your chart.',
  },
  {
    pt: 'Mandala natal + dados técnicos',
    en: 'Natal mandala + technical data',
    descPt: 'Roda zodiacal visual, efemérides e coordenadas precisas.',
    descEn: 'Visual zodiac wheel, ephemerides & precise coordinates.',
  },
  {
    pt: 'PDF exportável + email',
    en: 'Exportable PDF + email',
    descPt: 'Descarrega e recebe o relatório completo no teu email.',
    descEn: 'Download and receive the full report in your inbox.',
  },
]

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

function renderPdfPages(buf, pages, dpi = 280) {
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

function fmtGraus(signo) {
  const g = Math.floor(signo.graus)
  const m = Math.round((signo.graus - g) * 60)
  return `${g}°${String(m).padStart(2, '0')}'`
}

function biSigno(signo) {
  const pt = `${signo.nome} ${signo.simbolo}`
  const en = `${SIGNO_EN[signo.nome] || signo.nome} ${signo.simbolo}`
  return { pt, en, graus: fmtGraus(signo) }
}

async function preparePage(pngBuf, width, cropRatio = 0.7) {
  const meta = await sharp(pngBuf).metadata()
  const cropH = Math.round(meta.height * cropRatio)
  return sharp(pngBuf)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .resize(width, null, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.25, m1: 0.82, m2: 0.52 })
    .png()
    .toBuffer()
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildHtml({ totalPages, mapa, labelsPt, labelsEn }) {
  const solar = biSigno(mapa.solar)
  const lunar = biSigno(mapa.lunar)
  const asc = biSigno(mapa.ascendente)
  const mc = biSigno(mapa.mc)

  const featuresHtml = VIP_FEATURES.map((f) => `
    <div class="feat">
      <div class="feat__pt">${esc(f.pt)}</div>
      <div class="feat__en">${esc(f.en)}</div>
      <div class="feat__dpt">${esc(f.descPt)}</div>
      <div class="feat__den">${esc(f.descEn)}</div>
    </div>`).join('')

  return `<!DOCTYPE html>
<html lang="pt"><head><meta charset="utf-8"/>
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;
  font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}

.canvas{position:relative;width:${W}px;height:${H}px;background:#010006;overflow:hidden}

.sky{position:absolute;inset:0;
  background:linear-gradient(168deg,#000004 0%,#0a0618 22%,#140a2e 48%,#08040f 78%,#020008 100%)}
.neb{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
.nb1{width:860px;height:580px;top:-160px;left:-220px;
  background:radial-gradient(circle,rgba(124,58,237,.58) 0%,rgba(76,29,149,.22) 42%,transparent 72%)}
.nb2{width:920px;height:640px;top:180px;right:-340px;
  background:radial-gradient(circle,rgba(219,39,119,.36) 0%,rgba(147,51,234,.16) 46%,transparent 70%)}
.nb3{width:1100px;height:760px;bottom:-280px;left:50%;transform:translateX(-50%);
  background:radial-gradient(circle,rgba(37,99,235,.32) 0%,rgba(28,16,58,.42) 52%,transparent 74%)}
.nb4{width:560px;height:440px;top:36%;left:2%;
  background:radial-gradient(circle,rgba(223,183,108,.18) 0%,transparent 68%);filter:blur(55px)}
.nb5{width:480px;height:380px;top:18%;right:8%;
  background:radial-gradient(circle,rgba(167,139,250,.14) 0%,transparent 65%);filter:blur(45px)}
.dust{position:absolute;inset:0;opacity:.9;
  background-image:
    radial-gradient(1px 1px at 5% 10%,rgba(255,255,255,.8),transparent),
    radial-gradient(1.5px 1.5px at 16% 36%,rgba(240,208,138,.6),transparent),
    radial-gradient(1px 1px at 30% 6%,rgba(255,255,255,.55),transparent),
    radial-gradient(2px 2px at 46% 20%,rgba(255,248,231,.4),transparent),
    radial-gradient(1px 1px at 62% 8%,rgba(255,255,255,.65),transparent),
    radial-gradient(1.2px 1.2px at 76% 28%,rgba(223,183,108,.5),transparent),
    radial-gradient(1px 1px at 90% 12%,rgba(255,255,255,.6),transparent),
    radial-gradient(1px 1px at 10% 70%,rgba(255,255,255,.38),transparent),
    radial-gradient(1.4px 1.4px at 84% 66%,rgba(255,255,255,.42),transparent),
    radial-gradient(1px 1px at 50% 84%,rgba(223,183,108,.32),transparent),
    radial-gradient(2px 2px at 68% 50%,rgba(255,255,255,.22),transparent),
    radial-gradient(1px 1px at 38% 92%,rgba(196,181,253,.35),transparent)}
.vig{position:absolute;inset:0;
  background:radial-gradient(ellipse 74% 80% at 50% 44%,transparent 22%,rgba(0,0,0,.65) 100%)}
.ring{position:absolute;inset:18px;border-radius:30px;
  border:1px solid rgba(223,183,108,.12);pointer-events:none;z-index:25}

.hdr{position:relative;z-index:20;padding:38px 36px 0;text-align:center}
.logo{width:84px;height:84px;object-fit:contain;
  filter:drop-shadow(0 0 34px rgba(223,183,108,.45))}
.hdr h1{margin-top:14px;font-size:26px;font-weight:700;letter-spacing:.05em;
  color:#F0D08A;text-shadow:0 0 44px rgba(223,183,108,.32)}
.hdr .h1en{margin-top:4px;font-size:14px;font-weight:500;letter-spacing:.14em;
  text-transform:uppercase;color:rgba(255,255,255,.52)}
.hdr .sub{margin-top:10px;font-size:11px;font-weight:600;letter-spacing:.16em;
  text-transform:uppercase;color:rgba(223,183,108,.72)}
.hdr .suben{margin-top:3px;font-size:10px;letter-spacing:.12em;color:rgba(255,255,255,.38)}
.hdr .tag{margin-top:8px;font-size:9px;letter-spacing:.1em;color:rgba(223,183,108,.4)}

.stage{position:absolute;inset:0;z-index:10;display:flex;align-items:center;justify-content:center;
  perspective:1500px;perspective-origin:50% 40%}
.plat{position:absolute;bottom:390px;left:50%;width:720px;height:240px;margin-left:-360px;
  transform:rotateX(84deg);
  background:radial-gradient(ellipse,rgba(223,183,108,.22) 0%,rgba(139,92,246,.14) 38%,transparent 70%);
  filter:blur(18px);border-radius:50%}

/* ─── Caixa de vidro ─── */
.glass-case{position:relative;padding:22px 20px 26px;border-radius:32px;
  background:linear-gradient(145deg,rgba(255,255,255,.14) 0%,rgba(255,255,255,.04) 38%,rgba(255,255,255,.07) 100%);
  border:1.5px solid rgba(255,255,255,.24);
  backdrop-filter:blur(28px) saturate(1.5);
  -webkit-backdrop-filter:blur(28px) saturate(1.5);
  box-shadow:
    inset 0 2px 6px rgba(255,255,255,.28),
    inset 0 -3px 12px rgba(0,0,0,.35),
    0 40px 100px rgba(0,0,0,.58),
    0 0 80px rgba(139,92,246,.16),
    0 0 120px rgba(223,183,108,.08);
  transform-style:preserve-3d;
  transform:rotateX(14deg) rotateY(-18deg) rotateZ(.6deg)}
.glass-shine{position:absolute;inset:0;border-radius:32px;pointer-events:none;
  background:linear-gradient(125deg,rgba(255,255,255,.22) 0%,transparent 28%,transparent 72%,rgba(255,255,255,.06) 100%)}
.glass-edge{position:absolute;top:8px;left:12px;right:12px;height:1px;border-radius:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.45) 30%,rgba(255,255,255,.55) 50%,rgba(255,255,255,.45) 70%,transparent)}

.doc-3d{position:relative;width:520px;transform-style:preserve-3d}
.sheet{position:absolute;inset:0;border-radius:10px;overflow:hidden;background:#0B071E}
.sheet img{display:block;width:100%;height:auto}
.s-back{transform:translateZ(-32px) translateX(22px) translateY(14px) rotateY(5deg);
  opacity:.28;filter:brightness(.6) blur(.4px);
  border:1px solid rgba(223,183,108,.15)}
.s-front{position:relative;transform:translateZ(42px);
  border:1px solid rgba(223,183,108,.55);
  box-shadow:
    -2px 0 0 rgba(223,183,108,.12),
    0 0 0 1px rgba(255,255,255,.05),
    -36px 36px 95px rgba(0,0,0,.58),
    0 60px 120px rgba(0,0,0,.5),
    0 0 100px rgba(139,92,246,.16)}
.spine{position:absolute;top:0;right:-7px;width:10px;height:100%;
  background:linear-gradient(90deg,#1e1040,#0b071e 58%,#060412);
  transform:rotateY(88deg);transform-origin:right center;
  border-radius:0 3px 3px 0;box-shadow:3px 0 12px rgba(0,0,0,.5)}
.rim{position:absolute;inset:0;border-radius:10px;pointer-events:none;
  background:linear-gradient(135deg,rgba(255,255,255,.1) 0%,transparent 32%,transparent 68%,rgba(0,0,0,.2) 100%)}
.reflect{position:absolute;top:100%;left:0;right:0;height:90px;margin-top:8px;
  transform:scaleY(-1);opacity:.09;pointer-events:none;
  mask-image:linear-gradient(to bottom,rgba(0,0,0,.5),transparent);
  -webkit-mask-image:linear-gradient(to bottom,rgba(0,0,0,.5),transparent);
  filter:blur(2px)}
.reflect img{width:100%;opacity:.5}
.badge{position:absolute;top:16px;right:-10px;z-index:30;
  padding:9px 18px;border-radius:999px;
  background:linear-gradient(145deg,#FFF3D6,#DFB76C 42%,#B8944F);
  color:#0B071E;font-size:9px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;
  box-shadow:0 14px 36px rgba(0,0,0,.48),0 0 28px rgba(223,183,108,.32);
  transform:translateZ(100px) rotateY(-5deg)}
.badge-en{display:block;font-size:7px;letter-spacing:.14em;margin-top:2px;opacity:.75}
.pill{position:absolute;bottom:-36px;left:50%;
  transform:translateX(-50%) translateZ(88px);
  padding:8px 18px;border-radius:999px;text-align:center;
  background:rgba(8,5,20,.9);border:1px solid rgba(223,183,108,.5);
  backdrop-filter:blur(12px);
  font-size:8px;font-weight:700;letter-spacing:.16em;color:#DFB76C;
  white-space:nowrap;box-shadow:0 18px 44px rgba(0,0,0,.48)}
.pill-en{display:block;font-size:7px;color:rgba(255,255,255,.45);letter-spacing:.12em;margin-top:3px;font-weight:500}

.float{position:absolute;z-index:30;max-width:230px;padding:10px 13px;border-radius:13px;
  background:rgba(8,5,20,.86);border:1px solid rgba(223,183,108,.34);
  backdrop-filter:blur(14px);box-shadow:0 14px 40px rgba(0,0,0,.42)}
.float .k{font-size:8px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:rgba(223,183,108,.68)}
.float .ken{font-size:7px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.35);margin-top:2px}
.float .v{font-size:11px;font-weight:600;line-height:1.35;color:rgba(255,255,255,.9);margin-top:5px}
.float .ven{font-size:9px;line-height:1.3;color:rgba(255,255,255,.5);margin-top:2px}
.float .g{font-size:9px;color:rgba(223,183,108,.65);margin-top:3px}
.f1{top:400px;left:28px}.f2{top:468px;right:26px}
.f3{top:588px;left:34px}.f4{top:656px;right:30px}

.ftr{position:absolute;bottom:0;left:0;right:0;z-index:20;padding:0 30px 36px}
.vip-label{text-align:center;margin-bottom:12px}
.vip-label .pt{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#DFB76C}
.vip-label .en{font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.38);margin-top:3px}
.feats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.feat{padding:10px 11px;border-radius:11px;
  background:rgba(11,7,30,.8);border:1px solid rgba(223,183,108,.22);
  backdrop-filter:blur(10px)}
.feat__pt{font-size:8px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#DFB76C}
.feat__en{font-size:7px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:2px}
.feat__dpt{font-size:8px;line-height:1.42;color:rgba(255,255,255,.62);margin-top:5px}
.feat__den{font-size:7px;line-height:1.38;color:rgba(255,255,255,.38);margin-top:3px}
.chips{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;margin-bottom:10px}
.chip{padding:7px 12px;border-radius:9px;
  background:rgba(11,7,30,.76);border:1px solid rgba(223,183,108,.26);
  font-size:9px;font-weight:600;color:rgba(255,255,255,.72);
  backdrop-filter:blur(10px)}
.chip-gold{color:#DFB76C;border-color:rgba(223,183,108,.42)}
.chip span{display:block;font-size:7px;color:rgba(255,255,255,.38);font-weight:500;margin-top:2px}
.legal{text-align:center;font-size:7px;letter-spacing:.14em;text-transform:uppercase;color:rgba(223,183,108,.36)}
.legal-en{display:block;font-size:6px;color:rgba(255,255,255,.28);margin-top:3px;letter-spacing:.1em}
</style></head>
<body>
<div class="canvas">
  <div class="sky"></div>
  <div class="neb nb1"></div><div class="neb nb2"></div><div class="neb nb3"></div>
  <div class="neb nb4"></div><div class="neb nb5"></div>
  <div class="dust"></div><div class="vig"></div><div class="ring"></div>

  <header class="hdr">
    <img class="logo" src="logo.png" alt="Sidus"/>
    <h1>Relatório PDF Profissional</h1>
    <p class="h1en">Professional PDF Report</p>
    <p class="sub">Mapa Astral Completo VIP</p>
    <p class="suben">Complete VIP Natal Chart</p>
    <p class="tag">Pré-visualização fiel · Faithful preview of your purchase</p>
  </header>

  <div class="float f1">
    <div class="k">☉ ${esc(labelsPt.labels.sun)}</div><div class="ken">☉ ${esc(labelsEn.labels.sun)}</div>
    <div class="v">${esc(solar.pt)}</div><div class="ven">${esc(solar.en)}</div><div class="g">${solar.graus}</div>
  </div>
  <div class="float f2">
    <div class="k">☽ ${esc(labelsPt.labels.moon)}</div><div class="ken">☽ ${esc(labelsEn.labels.moon)}</div>
    <div class="v">${esc(lunar.pt)}</div><div class="ven">${esc(lunar.en)}</div><div class="g">${lunar.graus}</div>
  </div>
  <div class="float f3">
    <div class="k">${esc(labelsPt.labels.asc)}</div><div class="ken">${esc(labelsEn.labels.asc)}</div>
    <div class="v">${esc(asc.pt)}</div><div class="ven">${esc(asc.en)}</div><div class="g">${asc.graus}</div>
  </div>
  <div class="float f4">
    <div class="k">${esc(labelsPt.labels.mc)}</div><div class="ken">${esc(labelsEn.labels.mc)}</div>
    <div class="v">${esc(mc.pt)}</div><div class="ven">${esc(mc.en)}</div><div class="g">${mc.graus}</div>
  </div>

  <div class="stage">
    <div class="plat"></div>
    <div class="glass-case">
      <div class="glass-shine"></div>
      <div class="glass-edge"></div>
      <div class="doc-3d">
        <div class="sheet s-back"><img src="page2.png" alt=""/></div>
        <div class="sheet s-front">
          <img src="page1.png" alt="PDF Sidus"/>
          <div class="spine"></div>
          <div class="rim"></div>
          <div class="reflect"><img src="page1.png" alt=""/></div>
        </div>
        <div class="badge">Sidus VIP<span class="badge-en">Premium Access</span></div>
        <div class="pill">${totalPages} páginas · PDF original<span class="pill-en">${totalPages} pages · Original site PDF</span></div>
      </div>
    </div>
  </div>

  <footer class="ftr">
    <div class="vip-label">
      <div class="pt">O que inclui o Mapa Astral Completo VIP</div>
      <div class="en">What the Complete VIP Natal Chart includes</div>
    </div>
    <div class="feats">${featuresHtml}</div>
    <div class="chips">
      <span class="chip chip-gold">☉ Sol<span>Sun</span></span>
      <span class="chip chip-gold">☽ Lua<span>Moon</span></span>
      <span class="chip">ASC<span>Ascendant</span></span>
      <span class="chip">MC<span>Midheaven</span></span>
      <span class="chip">10 planetas<span>10 planets</span></span>
      <span class="chip">Casas Placidus<span>Placidus houses</span></span>
    </div>
    <p class="legal">O mesmo PDF que recebes após a compra · sidusastro.com</p>
    <p class="legal-en">The same PDF you receive after purchase</p>
  </footer>
</div>
</body></html>`
}

async function renderCover(html, assetsDir) {
  writeFileSync(join(assetsDir, 'cover.html'), html)
  const browser = await chromium.launch({ args: ['--disable-dev-shm-usage', '--no-sandbox'] })
  try {
    const page = await browser.newPage({
      viewport: { width: W, height: H },
      deviceScaleFactor: DPR,
    })
    const url = pathToFileURL(join(assetsDir, 'cover.html')).href
    await page.goto(url, { waitUntil: 'load', timeout: 90000 })
    await page.waitForTimeout(1500)
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

  console.log(`PDF real · ${total} páginas · 280dpi…`)
  const pages = renderPdfPages(doc.output('arraybuffer'), [1, 2], 280)
  const page1 = await preparePage(pages[1], 520, 0.72)
  const page2 = await preparePage(pages[2] || pages[1], 520, 0.55)

  const assetsDir = mkdtempSync(join(tmpdir(), 'sidus-cover-v6-'))
  try {
    writeFileSync(join(assetsDir, 'page1.png'), page1)
    writeFileSync(join(assetsDir, 'page2.png'), page2)
    copyFileSync(LOGO, join(assetsDir, 'logo.png'))

    console.log('Cosmos · vidro 3D · bilingue PT/EN · máxima qualidade…')
    const shot = await renderCover(buildHtml({ totalPages: total, mapa, labelsPt, labelsEn }), assetsDir)

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
