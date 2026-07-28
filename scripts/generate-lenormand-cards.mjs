#!/usr/bin/env node
/**
 * Gera ilustrações SVG Lenormand estilo Ciro Marchetti (Gilded Reverie).
 * Uso: node scripts/generate-lenormand-cards.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../public/tarot/lenormand')

const W = 450
const H = 720

const GOLD = '#DFB76C'
const GOLD_DARK = '#B8944F'
const CRIMSON = '#4A0E12'
const CRIMSON_DEEP = '#1A0508'

function defs(id) {
  return `
  <defs>
    <linearGradient id="gold_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F5E6B8"/><stop offset="40%" stop-color="${GOLD}"/><stop offset="100%" stop-color="${GOLD_DARK}"/>
    </linearGradient>
    <radialGradient id="glow_${id}" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="rgba(255,220,150,0.35)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/>
    </radialGradient>
    <filter id="soft_${id}"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`
}

function filigree(id) {
  const f = (tx, ty, sx = 1, sy = 1) => `
    <g transform="translate(${tx},${ty}) scale(${sx},${sy})" fill="none" stroke="url(#gold_${id})" stroke-width="2.2" opacity="0.9">
      <path d="M4,4 C18,2 28,12 22,26 C14,18 4,4 4,4Z"/>
      <path d="M8,8 C14,6 18,12 14,18" stroke-width="1.2" opacity="0.7"/>
      <circle cx="20" cy="8" r="2.5" fill="url(#gold_${id})" stroke="none"/>
    </g>`
  return f(8, 8) + f(W - 8, 8, -1, 1) + f(8, H - 8, 1, -1) + f(W - 8, H - 8, -1, -1)
}

function medallion(num, id) {
  return `
    <circle cx="58" cy="58" r="36" fill="url(#gold_${id})" stroke="${GOLD_DARK}" stroke-width="2"/>
    <circle cx="58" cy="58" r="28" fill="${CRIMSON}"/>
    <text x="58" y="70" text-anchor="middle" fill="${GOLD}" font-family="Georgia,serif" font-size="32" font-weight="bold">${num}</text>`
}

function wrap(id, num, bgStops, inner) {
  const bg = bgStops.map((s, i) => `<stop offset="${i === 0 ? '0' : i === bgStops.length - 1 ? '100' : `${(i / (bgStops.length - 1)) * 100}`}%" stop-color="${s}"/>`).join('')
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
${defs(id)}
<rect width="${W}" height="${H}" rx="24" fill="${CRIMSON_DEEP}"/>
<rect width="${W}" height="${H}" rx="24" fill="url(#bg_${id})"/>
<defs><radialGradient id="bg_${id}" cx="50%" cy="38%" r="75%">${bg}</radialGradient></defs>
<rect width="${W}" height="${H}" rx="24" fill="url(#glow_${id})"/>
<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="20" fill="none" stroke="url(#gold_${id})" stroke-width="2.5" opacity="0.75"/>
${filigree(id)}
${num != null ? medallion(num, id) : ''}
<g filter="url(#soft_${id})">${inner}</g>
</svg>`
}

const SCENES = {
  '01-cavaleiro': (id) => wrap(id, 1, ['#1a0a2e', '#4a1530', '#8b2035'], `
    <rect x="0" y="520" width="450" height="200" fill="url(#gold_${id})" opacity="0.15"/>
    <path d="M40,580 Q120,520 200,560 T380,540" stroke="url(#gold_${id})" stroke-width="8" fill="none" opacity="0.8"/>
    <path d="M60,600 Q150,560 230,590 T400,570" stroke="#E879F9" stroke-width="4" fill="none" opacity="0.5"/>
    <ellipse cx="280" cy="480" rx="90" ry="35" fill="#F8F8FF" opacity="0.95"/>
    <ellipse cx="250" cy="500" rx="55" ry="70" fill="#F8F8FF"/>
    <path d="M200,520 L240,420 L280,400 L310,420 L290,520 Z" fill="#DC2626"/>
    <circle cx="265" cy="385" r="22" fill="#FECACA"/>
    <path d="M180,530 L160,560 L200,555 Z" fill="#F8F8FF"/>
    <path d="M320,530 L340,560 L300,555 Z" fill="#F8F8FF"/>
    ${Array.from({length: 40}, (_, i) => `<circle cx="${(i*47)%450}" cy="${(i*31)%350}" r="1.5" fill="white" opacity="0.6"/>`).join('')}
  `),
  '02-trevo': (id) => wrap(id, 2, ['#0a1f12', '#14532d', '#166534'], `
    ${[0,1,2,3].map(i => `<g transform="translate(${140 + (i%2)*120},${220 + Math.floor(i/2)*130}) rotate(${i*15})">
      <ellipse cx="50" cy="70" rx="45" ry="55" fill="#22C55E" opacity="0.9"/>
      <ellipse cx="20" cy="30" rx="28" ry="35" fill="#4ADE80" transform="rotate(-30 20 30)"/>
      <ellipse cx="80" cy="30" rx="28" ry="35" fill="#4ADE80" transform="rotate(30 80 30)"/>
      <ellipse cx="20" cy="90" rx="28" ry="35" fill="#4ADE80" transform="rotate(30 20 90)"/>
      <ellipse cx="80" cy="90" rx="28" ry="35" fill="#4ADE80" transform="rotate(-30 80 90)"/>
    </g>`).join('')}
    <circle cx="225" cy="360" r="80" fill="url(#gold_${id})" opacity="0.12"/>
  `),
  '03-navio': (id) => wrap(id, 3, ['#0c1929', '#1e3a5f', '#0e4d6e'], `
    <path d="M0,500 Q112,470 225,490 T450,480 L450,720 L0,720Z" fill="#1E40AF" opacity="0.7"/>
    <path d="M80,490 Q225,450 370,490" stroke="#60A5FA" stroke-width="3" fill="none" opacity="0.5"/>
    <path d="M120,420 L330,420 L380,500 L70,500Z" fill="#5C3D2E"/>
    <rect x="150" y="320" width="150" height="100" fill="#7C2D12" rx="4"/>
    <path d="M150,320 L225,220 L300,320Z" fill="#DC2626"/>
    <line x1="225" y1="220" x2="225" y2="160" stroke="${GOLD}" stroke-width="4"/>
    <path d="M225,160 L320,280 L225,260Z" fill="#FEF3C7" opacity="0.9"/>
    <circle cx="200" cy="380" r="8" fill="url(#gold_${id})"/><circle cx="250" cy="380" r="8" fill="url(#gold_${id})"/>
  `),
  '04-casa': (id) => wrap(id, 4, ['#1a1020', '#2d1f3d', '#4a2040'], `
    <path d="M100,520 L225,300 L350,520Z" fill="#7F1D1D"/>
    <rect x="120" y="400" width="210" height="160" fill="#D4A574"/>
    <rect x="190" y="470" width="70" height="90" fill="#451A03"/>
    <rect x="140" y="430" width="45" height="45" fill="#FEF08A" opacity="0.8"/>
    <rect x="265" y="430" width="45" height="45" fill="#FEF08A" opacity="0.8"/>
    <rect x="60" y="480" width="30" height="80" fill="url(#gold_${id})" opacity="0.6"/>
    <rect x="360" y="480" width="30" height="80" fill="url(#gold_${id})" opacity="0.6"/>
    <ellipse cx="225" cy="580" rx="160" ry="30" fill="#166534" opacity="0.5"/>
  `),
  '05-arvore': (id) => wrap(id, 5, ['#0a1a10', '#14532d', '#052e16'], `
    <rect x="210" y="400" width="30" height="200" fill="#78350F"/>
    <ellipse cx="225" cy="280" rx="130" ry="150" fill="#15803D"/>
    <ellipse cx="180" cy="320" rx="80" ry="90" fill="#22C55E" opacity="0.8"/>
    <ellipse cx="270" cy="300" rx="85" ry="95" fill="#4ADE80" opacity="0.7"/>
    <circle cx="225" cy="200" r="60" fill="url(#gold_${id})" opacity="0.2"/>
    <path d="M180,250 Q225,180 270,250" stroke="${GOLD}" stroke-width="2" fill="none" opacity="0.5"/>
  `),
  '06-nuvens': (id) => wrap(id, 6, ['#1a1a2e', '#2d2d44', '#1a1a2e'], `
    <rect x="0" y="0" width="225" height="720" fill="#1E293B"/>
    <ellipse cx="100" cy="250" rx="120" ry="60" fill="#475569"/><ellipse cx="160" cy="280" rx="90" ry="50" fill="#64748B"/>
    <ellipse cx="80" cy="350" rx="100" ry="55" fill="#334155"/>
    <rect x="225" y="0" width="225" height="720" fill="url(#gold_${id})" opacity="0.25"/>
    <circle cx="340" cy="180" r="70" fill="#FCD34D" opacity="0.9"/>
    <ellipse cx="320" cy="300" rx="80" ry="40" fill="#FEF9C3" opacity="0.4"/>
  `),
  '07-serpente': (id) => wrap(id, 7, ['#0f1a0f', '#1a2e1a', '#0d2818'], `
    <path d="M80,550 Q150,200 225,280 T370,150" stroke="none" fill="url(#gold_${id})" opacity="0"/>
    <path d="M100,580 C120,450 180,350 220,300 S300,180 350,120" stroke="#22C55E" stroke-width="22" fill="none" stroke-linecap="round"/>
    <path d="M100,580 C120,450 180,350 220,300 S300,180 350,120" stroke="#86EFAC" stroke-width="8" fill="none" stroke-linecap="round"/>
    <ellipse cx="355" cy="115" rx="25" ry="18" fill="#22C55E"/>
    <circle cx="365" cy="108" r="5" fill="#FEF08A"/><circle cx="372" cy="112" r="3" fill="#0f172a"/>
    <ellipse cx="200" cy="420" rx="30" ry="18" fill="#BE123C" opacity="0.7" transform="rotate(-20 200 420)"/>
  `),
  '08-caixao': (id) => wrap(id, 8, ['#0f0a14', '#1a1020', '#2d1a28'], `
    <rect x="100" y="320" width="250" height="120" rx="8" fill="#3D2B1F" stroke="url(#gold_${id})" stroke-width="3"/>
    <rect x="100" y="300" width="250" height="30" rx="6" fill="#5C4033"/>
    <path d="M120,440 L180,520 M270,440 L210,520" stroke="url(#gold_${id})" stroke-width="2" opacity="0.5"/>
    <ellipse cx="160" cy="500" rx="25" ry="40" fill="#F8FAFC" opacity="0.9"/>
    <ellipse cx="200" cy="490" rx="22" ry="38" fill="#FFFFFF"/>
    <ellipse cx="240" cy="500" rx="25" ry="40" fill="#F8FAFC" opacity="0.9"/>
  `),
  '09-bouquet': (id) => wrap(id, 9, ['#1a0a18', '#3d1a35', '#5c2048'], `
    <ellipse cx="225" cy="520" rx="100" ry="40" fill="#166534" opacity="0.4"/>
    ${['#DC2626','#F472B6','#FBBF24','#FFFFFF','#A855F7'].map((c,i) =>
      `<circle cx="${180+i*22}" cy="${380+Math.sin(i)*20}" r="28" fill="${c}" opacity="0.9"/>
       <circle cx="${190+i*20}" cy="${360+Math.cos(i)*15}" r="18" fill="${c}" opacity="0.7"/>`
    ).join('')}
    <path d="M200,520 Q225,420 250,520" stroke="#166534" stroke-width="8" fill="none"/>
    <rect x="210" y="500" width="30" height="60" fill="url(#gold_${id})" rx="4"/>
  `),
  '10-foice': (id) => wrap(id, 10, ['#1a1508', '#3d3010', '#5c4a18'], `
    <path d="M280,150 L120,580" stroke="#94A3B8" stroke-width="6"/>
    <path d="M280,150 Q350,200 380,280 Q360,220 280,150" fill="url(#gold_${id})"/>
    <path d="M280,150 Q320,180 340,240" stroke="${GOLD}" stroke-width="2" fill="none"/>
    <ellipse cx="225" cy="600" rx="180" ry="40" fill="#CA8A04" opacity="0.4"/>
    <path d="M60,580 Q225,540 390,580" stroke="#EAB308" stroke-width="2" fill="none" opacity="0.6"/>
  `),
  '11-chicote': (id) => wrap(id, 11, ['#1a0808', '#3d1010', '#5c1818'], `
    <path d="M100,200 Q200,250 180,400 T220,600" stroke="#78350F" stroke-width="8" fill="none"/>
    <path d="M110,210 Q205,260 190,395 T225,590" stroke="#A16207" stroke-width="3" fill="none"/>
    ${Array.from({length:8}, (_,i) => `<line x1="${150+i*15}" y1="250" x2="${140+i*20}" y2="350" stroke="url(#gold_${id})" stroke-width="2"/>`).join('')}
    <circle cx="220" cy="610" r="20" fill="url(#gold_${id})"/>
  `),
  '12-passaros': (id) => wrap(id, 12, ['#1a1008', '#3d2810', '#5c4020'], `
    <rect x="140" y="380" width="170" height="140" fill="#92400E" rx="8"/>
    <path d="M140,380 L225,300 L310,380Z" fill="#B45309"/>
    <circle cx="200" cy="350" r="8" fill="#1E293B"/>
    <ellipse cx="120" cy="320" rx="25" ry="15" fill="#F97316" transform="rotate(-15 120 320)"/>
    <ellipse cx="330" cy="300" rx="22" ry="14" fill="#EAB308" transform="rotate(20 330 300)"/>
    <ellipse cx="280" cy="360" rx="20" ry="12" fill="#3B82F6"/>
    <path d="M115,325 L95,315 M125,318 L140,310" stroke="#1E293B" stroke-width="2"/>
    <path d="M335,295 L355,285 M325,298 L310,290" stroke="#1E293B" stroke-width="2"/>
  `),
  '13-crianca': (id) => wrap(id, 13, ['#0a1a20', '#1a3a4a', '#2a5a6a'], `
    <ellipse cx="225" cy="580" rx="150" ry="40" fill="#86EFAC" opacity="0.4"/>
    <circle cx="225" cy="380" r="45" fill="#FECACA"/>
    <ellipse cx="225" cy="480" rx="55" ry="70" fill="#93C5FD"/>
    <path d="M200,350 Q225,300 250,350" fill="#4B5563"/>
    <path d="M280,400 Q340,350 360,280" stroke="#1E293B" stroke-width="2" fill="none"/>
    <ellipse cx="360" cy="270" rx="20" ry="12" fill="#F472B6" transform="rotate(30 360 270)"/>
  `),
  '14-raposa': (id) => wrap(id, 14, ['#0f0a08', '#2d1a10', '#4a2818'], `
    <ellipse cx="225" cy="450" rx="90" ry="60" fill="#EA580C"/>
    <ellipse cx="280" cy="400" rx="50" ry="40" fill="#F97316"/>
    <path d="M300,380 L340,340 L320,390Z" fill="#EA580C"/>
    <path d="M260,390 L280,370 L270,395Z" fill="#EA580C"/>
    <circle cx="310" cy="385" r="8" fill="#FEF08A"/><circle cx="315" cy="383" r="3" fill="#0f172a"/>
    <path d="M160,480 Q140,520 180,530" stroke="#EA580C" stroke-width="12" fill="none" stroke-linecap="round"/>
    <ellipse cx="225" cy="200" r="50" fill="#FCD34D" opacity="0.3"/>
  `),
  '15-urso': (id) => wrap(id, 15, ['#0a1420', '#1a2840', '#2a4060'], `
    <ellipse cx="225" cy="500" rx="200" ry="60" fill="#1E40AF" opacity="0.5"/>
    <ellipse cx="225" cy="420" rx="100" ry="80" fill="#E2E8F0" opacity="0.85"/>
    <circle cx="180" cy="350" r="35" fill="#F1F5F9" opacity="0.9"/><circle cx="270" cy="350" r="35" fill="#F1F5F9" opacity="0.9"/>
    <ellipse cx="225" cy="400" rx="70" ry="55" fill="#CBD5E1" opacity="0.9"/>
    <circle cx="210" cy="390" r="6" fill="#0f172a"/><circle cx="240" cy="390" r="6" fill="#0f172a"/>
    <path d="M100,300 L150,200 L200,280 L225,180 L250,280 L300,200 L350,300" fill="#BAE6FD" opacity="0.4"/>
  `),
  '16-estrelas': (id) => wrap(id, 16, ['#050818', '#0a1030', '#101850'], `
    <circle cx="225" cy="360" r="100" fill="none" stroke="url(#gold_${id})" stroke-width="2" opacity="0.6"/>
    ${Array.from({length:8}, (_,i) => {
      const a = (i/8)*Math.PI*2 - Math.PI/2
      const x = 225 + Math.cos(a)*90, y = 360 + Math.sin(a)*90
      return `<line x1="225" y1="360" x2="${x}" y2="${y}" stroke="url(#gold_${id})" stroke-width="3"/>
        <polygon points="${x},${y-15} ${x+5},${y-5} ${x+15},${y} ${x+5},${y+5} ${x},${y+15} ${x-5},${y+5} ${x-15},${y} ${x-5},${y-5}" fill="${GOLD}"/>`
    }).join('')}
    ${Array.from({length:60}, (_,i) => `<circle cx="${(i*73)%450}" cy="${(i*47)%500}" r="${1+(i%2)}" fill="white" opacity="${0.3+(i%5)*0.1}"/>`).join('')}
  `),
  '17-cegonha': (id) => wrap(id, 17, ['#0a1520', '#1a3040', '#2a5060'], `
    <rect x="180" y="280" width="90" height="200" fill="#78716C"/>
    <path d="M180,280 L225,200 L270,280Z" fill="#57534E"/>
    <ellipse cx="225" cy="250" rx="70" ry="30" fill="#57534E"/>
    <ellipse cx="225" cy="420" rx="25" ry="50" fill="#F8FAFC"/>
    <ellipse cx="225" cy="360" rx="18" ry="30" fill="#F8FAFC"/>
    <path d="M250,370 L310,340" stroke="#F97316" stroke-width="4"/>
    <path d="M200,370 L140,340" stroke="#F97316" stroke-width="4"/>
    <circle cx="235" cy="345" r="10" fill="#F8FAFC"/><circle cx="240" cy="342" r="3" fill="#DC2626"/>
  `),
  '18-cao': (id) => wrap(id, 18, ['#1a1008', '#3d2818', '#5c4030'], `
    <rect x="130" y="250" width="190" height="280" fill="#451A03" rx="4"/>
    <rect x="160" y="300" width="130" height="180" fill="#FEF3C7" opacity="0.3"/>
    <ellipse cx="225" cy="480" rx="70" ry="50" fill="#D97706"/>
    <ellipse cx="225" cy="430" rx="50" ry="45" fill="#F59E0B"/>
    <circle cx="210" cy="415" r="6" fill="#0f172a"/><circle cx="240" cy="415" r="6" fill="#0f172a"/>
    <ellipse cx="225" cy="435" rx="15" ry="10" fill="#451A03"/>
    <path d="M190,460 L160,500" stroke="#DC2626" stroke-width="5" fill="none"/>
    <circle cx="155" cy="505" r="8" fill="#DC2626"/>
  `),
  '19-torre': (id) => wrap(id, 19, ['#0a0f18', '#1a2030', '#2a3550'], `
    <rect x="175" y="200" width="100" height="350" fill="#64748B"/>
    <rect x="165" y="180" width="120" height="30" fill="#94A3B8"/>
    <rect x="200" y="220" width="50" height="60" fill="#FEF08A" opacity="0.7"/>
    <rect x="200" y="320" width="50" height="60" fill="#FEF08A" opacity="0.5"/>
    <path d="M0,550 Q225,500 450,560 L450,720 L0,720Z" fill="#1E3A5F" opacity="0.7"/>
    <ellipse cx="350" cy="400" rx="80" ry="40" fill="#CBD5E1" opacity="0.3"/>
  `),
  '20-jardim': (id) => wrap(id, 20, ['#0a180a', '#1a3018', '#2a4828'], `
    <path d="M120,400 L120,550 L180,550 L180,400 Q150,350 120,400" fill="none" stroke="url(#gold_${id})" stroke-width="4"/>
    <path d="M270,400 Q300,350 330,400 L330,550 L270,550Z" fill="none" stroke="url(#gold_${id})" stroke-width="4"/>
    <rect x="120" y="380" width="210" height="15" fill="url(#gold_${id})"/>
    <circle cx="200" cy="300" r="15" fill="#FCD34D"/><circle cx="250" cy="280" r="12" fill="#F472B6"/>
    <circle cx="180" cy="270" r="10" fill="#60A5FA"/>
    ${Array.from({length:6}, (_,i) => `<ellipse cx="${150+i*30}" cy="520" rx="12" ry="20" fill="#22C55E"/>`).join('')}
  `),
  '21-montanha': (id) => wrap(id, 21, ['#0a1020', '#1a2840', '#2a4060'], `
    <path d="M0,550 L120,250 L200,400 L280,180 L380,350 L450,280 L450,720 L0,720Z" fill="#475569"/>
    <path d="M120,250 L200,400 L280,180" fill="#64748B" opacity="0.8"/>
    <path d="M280,180 L380,350 L450,280" fill="#94A3B8" opacity="0.6"/>
    <path d="M0,550 L450,550" stroke="url(#gold_${id})" stroke-width="2" opacity="0.4"/>
    <ellipse cx="280" cy="200" rx="40" ry="20" fill="white" opacity="0.8"/>
  `),
  '22-caminho': (id) => wrap(id, 22, ['#0a1508', '#1a2810', '#2a4020'], `
    <path d="M225,600 L225,350" stroke="#A16207" stroke-width="20" fill="none" stroke-linecap="round"/>
    <path d="M225,450 L80,300" stroke="#CA8A04" stroke-width="16" fill="none" stroke-linecap="round"/>
    <path d="M225,450 L370,300" stroke="#CA8A04" stroke-width="16" fill="none" stroke-linecap="round"/>
    <ellipse cx="225" cy="620" rx="30" ry="15" fill="url(#gold_${id})"/>
    ${[80,370].map(x => `<rect x="${x-15}" y="270" width="30" height="40" fill="url(#gold_${id})" rx="4"/>`).join('')}
    <ellipse cx="225" cy="340" rx="100" ry="60" fill="#166534" opacity="0.5"/>
  `),
  '23-rato': (id) => wrap(id, 23, ['#0f0a08', '#2a1810', '#3d2818'], `
    <ellipse cx="180" cy="450" rx="40" ry="30" fill="#9CA3AF"/>
    <circle cx="165" cy="435" r="20" fill="#D1D5DB"/>
    <circle cx="158" cy="430" r="4" fill="#0f172a"/><circle cx="172" cy="430" r="4" fill="#0f172a"/>
    <ellipse cx="280" cy="480" rx="35" ry="25" fill="#9CA3AF"/>
    <circle cx="268" cy="468" r="18" fill="#D1D5DB"/>
    <rect x="140" y="520" width="80" height="15" fill="#FEF3C7" opacity="0.6" transform="rotate(-10 180 527)"/>
    <circle cx="350" cy="400" r="30" fill="#FCD34D" opacity="0.5"/>
  `),
  '24-coracao': (id) => wrap(id, 24, ['#1a0810', '#3d1020', '#5c1830'], `
    <path d="M225,520 C120,400 100,280 160,230 C200,200 225,250 225,250 C225,250 250,200 290,230 C350,280 330,400 225,520Z" fill="#DC2626"/>
    <path d="M225,500 C140,400 130,300 170,260 C200,240 225,280 225,280 C225,280 250,240 280,260 C320,300 310,400 225,500Z" fill="#F87171"/>
    <circle cx="225" cy="360" r="80" fill="url(#gold_${id})" opacity="0.15"/>
    <ellipse cx="160" cy="480" rx="20" ry="30" fill="#BE123C" transform="rotate(-30 160 480)"/>
    <ellipse cx="290" cy="480" rx="20" ry="30" fill="#BE123C" transform="rotate(30 290 480)"/>
  `),
  '25-anel': (id) => wrap(id, 25, ['#0a0818', '#1a1030', '#2a1848'], `
    <rect x="80" y="480" width="290" height="120" fill="#4C1D95" opacity="0.5" rx="8"/>
    <circle cx="225" cy="400" r="80" fill="none" stroke="url(#gold_${id})" stroke-width="18"/>
    <circle cx="225" cy="360" r="15" fill="#60A5FA" opacity="0.9"/>
    <circle cx="265" cy="390" r="12" fill="#F472B6" opacity="0.8"/>
    <circle cx="185" cy="390" r="12" fill="#F472B6" opacity="0.8"/>
    <ellipse cx="225" cy="400" rx="100" ry="30" fill="url(#gold_${id})" opacity="0.1"/>
  `),
  '26-livro': (id) => wrap(id, 26, ['#0f0a08', '#2a1810', '#3d2818'], `
    <rect x="130" y="280" width="190" height="260" rx="8" fill="#5C3D2E"/>
    <rect x="140" y="290" width="170" height="240" rx="4" fill="#78350F"/>
    <rect x="215" y="290" width="10" height="240" fill="url(#gold_${id})"/>
    <circle cx="225" cy="410" r="35" fill="none" stroke="url(#gold_${id})" stroke-width="3"/>
    <path d="M210,410 L225,395 L240,410 L225,425Z" fill="url(#gold_${id})"/>
    <ellipse cx="100" cy="500" rx="25" ry="40" fill="#FCD34D" opacity="0.6"/>
  `),
  '27-carta': (id) => wrap(id, 27, ['#0a1018', '#1a2030', '#2a3048'], `
    <rect x="120" y="300" width="210" height="150" fill="#FEF3C7" rx="4"/>
    <path d="M120,300 L225,380 L330,300" fill="#FDE68A"/>
    <circle cx="225" cy="360" r="25" fill="#7F1D1D"/>
    <text x="225" y="368" text-anchor="middle" fill="${GOLD}" font-family="Georgia" font-size="20">S</text>
    <line x1="300" y1="500" x2="340" y2="420" stroke="#451A03" stroke-width="4"/>
    <path d="M335,415 L350,400 L345,430Z" fill="#451A03"/>
  `),
  '28-homem': (id) => wrap(id, 28, ['#0a0f18', '#1a2035', '#2a3050'], `
    <ellipse cx="225" cy="580" rx="120" ry="35" fill="url(#gold_${id})" opacity="0.1"/>
    <circle cx="225" cy="300" r="55" fill="#FECACA"/>
    <path d="M175,300 Q225,240 275,300" fill="#1E293B"/>
    <path d="M150,580 L150,400 Q225,360 300,400 L300,580Z" fill="#1E3A8A"/>
    <path d="M190,400 L190,360 L260,360 L260,400" fill="#FFFFFF"/>
    <ellipse cx="225" cy="320" rx="40" ry="8" fill="#4B5563"/>
  `),
  '29-mulher': (id) => wrap(id, 29, ['#180a18', '#301830', '#482848'], `
    <ellipse cx="225" cy="580" rx="120" ry="35" fill="url(#gold_${id})" opacity="0.1"/>
    <circle cx="225" cy="300" r="55" fill="#FECACA"/>
    <path d="M170,300 Q225,220 280,300 L290,380 Q225,400 160,380Z" fill="#831843"/>
    <path d="M150,580 L150,400 Q225,370 300,400 L300,580Z" fill="#9D174D"/>
    <ellipse cx="200" cy="310" r="8" fill="#1E293B"/><ellipse cx="250" cy="310" r="8" fill="#1E293B"/>
    <path d="M215,340 Q225,355 235,340" stroke="#BE123C" stroke-width="2" fill="none"/>
  `),
  '30-lirios': (id) => wrap(id, 30, ['#0a1020', '#1a2840', '#2a4060'], `
    <ellipse cx="225" cy="550" rx="150" ry="40" fill="#1E40AF" opacity="0.4"/>
    ${[170,225,280].map((x,i) => `
      <line x1="${x}" y1="550" x2="${x}" y2="380" stroke="#166534" stroke-width="4"/>
      <ellipse cx="${x}" cy="350" rx="25" ry="45" fill="#FFFFFF" transform="rotate(${i*10-10} ${x} 350)"/>
      <ellipse cx="${x}" cy="330" rx="15" ry="25" fill="#F8FAFC" transform="rotate(${i*10-10} ${x} 330)"/>
    `).join('')}
    <circle cx="350" cy="200" r="40" fill="#E2E8F0" opacity="0.4"/>
  `),
  '31-sol': (id) => wrap(id, 31, ['#1a1008', '#3d2810', '#5c4020'], `
    <circle cx="225" cy="320" r="90" fill="#FCD34D"/>
    <circle cx="225" cy="320" r="70" fill="#FDE68A"/>
    ${Array.from({length:12}, (_,i) => {
      const a = (i/12)*Math.PI*2
      return `<line x1="${225+Math.cos(a)*80}" y1="${320+Math.sin(a)*80}" x2="${225+Math.cos(a)*120}" y2="${320+Math.sin(a)*120}" stroke="#FCD34D" stroke-width="6" stroke-linecap="round"/>`
    }).join('')}
    <circle cx="225" cy="500" r="35" fill="#FECACA"/>
    <ellipse cx="225" cy="560" rx="40" ry="50" fill="#93C5FD"/>
    ${[100,150,200,250,300,350].map(x => `<line x1="${x}" y1="600" x2="${x+10}" y2="540" stroke="#CA8A04" stroke-width="3"/>`).join('')}
  `),
  '32-lua': (id) => wrap(id, 32, ['#050818', '#0a1030', '#101848'], `
    <circle cx="280" cy="280" r="90" fill="#E2E8F0"/>
    <circle cx="310" cy="260" r="80" fill="#101848"/>
    <ellipse cx="225" cy="520" rx="180" ry="30" fill="#1E40AF" opacity="0.5"/>
    <ellipse cx="225" cy="515" rx="120" ry="8" fill="#93C5FD" opacity="0.3"/>
    ${Array.from({length:30}, (_,i) => `<circle cx="${(i*67)%450}" cy="${(i*41)%350}" r="1.5" fill="white" opacity="0.5"/>`).join('')}
  `),
  '33-chave': (id) => wrap(id, 33, ['#0f0a08', '#2a1810', '#3d2818'], `
    <circle cx="225" cy="350" r="45" fill="none" stroke="url(#gold_${id})" stroke-width="8"/>
    <circle cx="225" cy="350" r="20" fill="${CRIMSON}"/>
    <rect x="215" y="395" width="20" height="120" fill="url(#gold_${id})" rx="4"/>
    <rect x="200" y="480" width="15" height="30" fill="url(#gold_${id})" rx="2"/>
    <rect x="235" y="460" width="15" height="35" fill="url(#gold_${id})" rx="2"/>
    <rect x="160" y="300" width="60" height="200" fill="#451A03" opacity="0.5" rx="4"/>
    <ellipse cx="130" cy="400" rx="20" ry="80" fill="#FEF08A" opacity="0.3"/>
  `),
  '34-peixes': (id) => wrap(id, 34, ['#0a1020', '#102040', '#183060'], `
  <ellipse cx="225" cy="520" rx="180" ry="50" fill="#1E40AF" opacity="0.6"/>
  ${[[160,400],[225,360],[300,420]].map(([x,y],i) => `
    <ellipse cx="${x}" cy="${y}" rx="50" ry="25" fill="url(#gold_${id})" transform="rotate(${i*15-15} ${x} ${y})"/>
    <path d="M${x-50},${y} L${x-70},${y-15} L${x-70},${y+15}Z" fill="url(#gold_${id})"/>
    <circle cx="${x+20}" cy="${y-5}" r="5" fill="#0f172a"/>
  `).join('')}
  ${Array.from({length:8}, (_,i) => `<circle cx="${100+i*40}" cy="500" r="8" fill="#FCD34D" opacity="0.6"/>`).join('')}
  `),
  '35-ancora': (id) => wrap(id, 35, ['#0a0f18', '#1a2535', '#2a3548'], `
    <ellipse cx="225" cy="560" rx="160" ry="40" fill="#57534E" opacity="0.6"/>
    <circle cx="225" cy="280" r="25" fill="none" stroke="url(#gold_${id})" stroke-width="8"/>
    <rect x="218" y="305" width="14" height="200" fill="url(#gold_${id})"/>
    <path d="M120,480 L225,400 L330,480" stroke="url(#gold_${id})" stroke-width="12" fill="none" stroke-linecap="round"/>
    <path d="M120,480 L100,500 M330,480 L350,500" stroke="url(#gold_${id})" stroke-width="8" stroke-linecap="round"/>
  `),
  '36-cruz': (id) => wrap(id, 36, ['#1a1008', '#302018', '#483028'], `
    <rect x="205" y="220" width="40" height="280" fill="url(#gold_${id})" rx="4"/>
    <rect x="140" y="340" width="170" height="35" fill="url(#gold_${id})" rx="4"/>
    <ellipse cx="225" cy="580" rx="140" ry="50" fill="#78350F" opacity="0.4"/>
    <circle cx="350" cy="200" r="60" fill="#F97316" opacity="0.5"/>
    <circle cx="100" cy="220" r="40" fill="#DC2626" opacity="0.3"/>
  `),
  verso: (id) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
${defs(id)}
<rect width="${W}" height="${H}" rx="24" fill="${CRIMSON_DEEP}"/>
${Array.from({length:12}, (_,r) => Array.from({length:8}, (_,c) => {
  const x = c*56 + (r%2)*28, y = r*60
  return `<polygon points="${x},${y} ${x+28},${y+30} ${x},${y+60} ${x-28},${y+30}" fill="${(r+c)%2===0 ? '#5C1018' : '#8B1A28'}" opacity="0.95"/>`
}).join('')).join('')}
${filigree(id)}
<circle cx="225" cy="360" r="55" fill="url(#gold_${id})" stroke="${GOLD_DARK}" stroke-width="3"/>
<circle cx="225" cy="360" r="38" fill="${CRIMSON}" opacity="0.8"/>
<text x="225" y="372" text-anchor="middle" fill="${GOLD}" font-family="Georgia,serif" font-size="28"></text>
</svg>`,
}

fs.mkdirSync(OUT, { recursive: true })

let count = 0
for (const [slug, render] of Object.entries(SCENES)) {
  const id = slug.replace(/[^a-z0-9]/gi, '')
  const svg = typeof render === 'function' ? render(id) : render(id)
  const file = path.join(OUT, `${slug}.svg`)
  fs.writeFileSync(file, svg.trim())
  count += 1
  console.log(`✓ ${slug}.svg`)
}

console.log(`\n${count} ilustrações Lenormand geradas em public/tarot/lenormand/`)
