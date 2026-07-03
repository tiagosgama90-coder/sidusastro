import { useState } from 'react'
import { imagemCartaUrl, imagemVersoUrl } from '../lib/tarot/images.js'

const CORES = {
  dourado: '#DFB76C',
  fundo: '#0B071E',
}

const PALETAS_MAJOR = {
  0: '#6D28D9', 1: '#B45309', 2: '#0369A1', 3: '#047857', 4: '#B91C1C',
  5: '#7C3AED', 6: '#DB2777', 7: '#D97706', 8: '#92400E', 9: '#1D4ED8',
  10: '#7C3AED', 11: '#059669', 12: '#0284C7', 13: '#1E293B', 14: '#0891B2',
  15: '#991B1B', 16: '#6D28D9', 17: '#1D4ED8', 18: '#1E3A5F', 19: '#B45309',
  20: '#7C3AED', 21: '#047857',
}

const NAIPES_COR = {
  paus: '#D97706',
  copas: '#0284C7',
  espadas: '#64748B',
  ouros: '#047857',
}

const FLIP_CSS = `
@keyframes cartaFlipIn {
  0% { transform: rotateY(180deg); }
  100% { transform: rotateY(0deg); }
}
@keyframes cartaGlow {
  0%, 100% { box-shadow: 0 4px 24px rgba(223,183,108,0.2); }
  50% { box-shadow: 0 4px 32px rgba(223,183,108,0.55); }
}
`

let flipCssInjected = false
function ensureFlipCss() {
  if (flipCssInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.textContent = FLIP_CSS
  document.head.appendChild(el)
  flipCssInjected = true
}

function toRoman(n) {
  const v = [10, 9, 5, 4, 1]
  const s = ['X', 'IX', 'V', 'IV', 'I']
  let r = ''
  let num = n
  v.forEach((val, i) => {
    while (num >= val) { r += s[i]; num -= val }
  })
  return r
}

function rankLabel(carta) {
  if (carta.tipo === 'major' || carta.id <= 21) {
    return carta.id === 0 ? '☽' : toRoman(carta.id)
  }
  const map = { as: 'I', '02': 'II', '03': 'III', '04': 'IV', '05': 'V', '06': 'VI', '07': 'VII', '08': 'VIII', '09': 'IX', '10': 'X' }
  return map[carta.rank] || '♛'
}

function SuitGlyph({ naipe, cor, size = 28 }) {
  const s = size
  if (naipe === 'paus') {
    return (
      <g fill={cor} stroke={CORES.dourado} strokeWidth="0.5">
        <rect x={45 - s / 4} y={72 - s / 2} width={s / 2} height={s} rx="2" opacity="0.9" />
        <circle cx="45" cy={72 - s / 2 - 4} r="4" fill={cor} />
      </g>
    )
  }
  if (naipe === 'copas') {
    return (
      <g fill="none" stroke={cor} strokeWidth="1.5">
        <path d={`M ${45 - s / 3} 58 Q 45 ${58 + s / 2} ${45 + s / 3} 58 L ${45 + s / 4} ${72 + s / 4} L ${45 - s / 4} ${72 + s / 4} Z`} />
        <line x1="45" y1={72 + s / 4} x2="45" y2={82} stroke={CORES.dourado} />
      </g>
    )
  }
  if (naipe === 'espadas') {
    return (
      <g fill={cor} stroke={CORES.dourado} strokeWidth="0.5">
        <polygon points={`45,${72 - s / 2} ${45 + s / 4},${72 + s / 4} 45,${72} ${45 - s / 4},${72 + s / 4}`} />
        <rect x="43" y={72 + s / 4} width="4" height="8" rx="1" />
      </g>
    )
  }
  return (
    <g fill="none" stroke={cor} strokeWidth="1.5">
      <polygon points={`45,${72 - s / 3} ${45 + s / 3},${72} 45,${72 + s / 3} ${45 - s / 3},${72}`} />
      <circle cx="45" cy="72" r="3" fill={cor} />
    </g>
  )
}

function CartaFallbackSVG({ carta, size }) {
  const isLenormand = carta.tipo === 'lenormand'
  const { w, h } = dimensoesCarta(size, isLenormand ? 'lenormand' : 'tarot')
  const isMajor = !isLenormand && (carta.tipo === 'major' || carta.id <= 21)
  const cor = isLenormand ? '#5B21B6' : isMajor ? (PALETAS_MAJOR[carta.id] ?? '#6D28D9') : (NAIPES_COR[carta.naipe] ?? carta.cor ?? '#6D28D9')
  const id = `fb_${carta.id}_${size}`

  return (
    <svg width={w} height={h} viewBox="0 0 90 144" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`bg_${id}`} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={cor} stopOpacity="0.7" />
          <stop offset="100%" stopColor={CORES.fundo} />
        </radialGradient>
        <pattern id={`pt_${id}`} x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.5" fill={CORES.dourado} opacity="0.12" />
        </pattern>
      </defs>
      <rect width="90" height="144" rx="8" fill={`url(#bg_${id})`} />
      <rect width="90" height="144" rx="8" fill={`url(#pt_${id})`} />
      <rect x="2" y="2" width="86" height="140" rx="7" fill="none" stroke={CORES.dourado} strokeWidth="1.2" opacity="0.7" />
      <rect x="6" y="6" width="78" height="132" rx="5" fill="none" stroke={CORES.dourado} strokeWidth="0.4" opacity="0.35" />
      <text x="10" y="17" fontSize="8" fill={CORES.dourado} fontFamily="Georgia,serif" opacity="0.9">{rankLabel(carta)}</text>
      {isLenormand ? (
        <text x="45" y="82" fontSize="34" textAnchor="middle" dominantBaseline="middle">{carta.simb}</text>
      ) : isMajor ? (
        <text x="45" y="82" fontSize="34" textAnchor="middle" dominantBaseline="middle">{carta.simb}</text>
      ) : (
        <SuitGlyph naipe={carta.naipe} cor={cor} />
      )}
      <line x1="12" y1="108" x2="78" y2="108" stroke={CORES.dourado} strokeWidth="0.6" opacity="0.5" />
      <text x="45" y="122" fontSize="5.5" textAnchor="middle" fill={CORES.dourado} fontFamily="Georgia,serif" letterSpacing="0.5">
        {carta.nome.length > 22 ? `${carta.nome.slice(0, 20)}…` : carta.nome.toUpperCase()}
      </text>
      {[18, 34, 56, 72].map((x) => (
        <text key={x} x={x} y="134" fontSize="6" fill={CORES.dourado} opacity="0.35" textAnchor="middle">✦</text>
      ))}
      {carta.invertida && !isLenormand && (
        <text x="45" y="141" fontSize="5" fill="#EF4444" textAnchor="middle" opacity="0.9">
          {carta.invertidaLabel || 'INV'}
        </text>
      )}
    </svg>
  )
}

function VersoSVG({ w, h }) {
  return (
    <svg width={w} height={h} viewBox="0 0 90 144">
      <defs>
        <linearGradient id="vd_mystic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d0722" />
          <stop offset="100%" stopColor="#1a0d3a" />
        </linearGradient>
      </defs>
      <rect width="90" height="144" rx="8" fill="url(#vd_mystic)" />
      <rect x="2" y="2" width="86" height="140" rx="7" fill="none" stroke={CORES.dourado} strokeWidth="1" opacity="0.45" />
      <text x="45" y="76" fontSize="26" textAnchor="middle" dominantBaseline="middle" fill={CORES.dourado} opacity="0.3">✦</text>
    </svg>
  )
}

export const LENORMAND_ASPECT = 1.5 // largura / altura (1536×1024)

export function dimensoesCarta(size, deck = 'tarot') {
  if (deck === 'lenormand') {
    return { w: Math.round(size * LENORMAND_ASPECT), h: size }
  }
  return { w: size, h: Math.round(size * 1.6) }
}

/**
 * Carta de tarot profissional - ilustração Mystic com fallback SVG ornamentado.
 * animarFlip: animação 3D ao revelar (sem conflito com rotação invertida).
 */
export function CartaTarot({ carta, size = 110, virada = false, animarFlip = false, className, style }) {
  const [imgOk, setImgOk] = useState(true)
  if (!carta) return null
  if (animarFlip) ensureFlipCss()

  const isLenormand = carta?.tipo === 'lenormand'
  const deck = isLenormand ? 'lenormand' : 'tarot'
  const { w, h } = dimensoesCarta(size, deck)
  const src = virada
    ? imagemVersoUrl(carta?.tipo === 'lenormand' ? 'lenormand' : 'tarot')
    : imagemCartaUrl(carta)
  const showImg = src && imgOk

  const outerStyle = {
    width: w,
    height: h,
    borderRadius: 8,
    overflow: 'hidden',
    flexShrink: 0,
    display: 'inline-block',
    verticalAlign: 'top',
    perspective: animarFlip ? 800 : undefined,
    boxShadow: virada ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 24px rgba(223,183,108,0.2)',
    animation: animarFlip && !virada ? 'cartaGlow 2s ease-in-out 0.6s 3' : undefined,
    ...style,
  }

  const faceStyle = {
    width: '100%',
    height: '100%',
    transform: carta.invertida && !virada && carta.tipo !== 'lenormand' ? 'rotate(180deg)' : undefined,
    transformOrigin: 'center center',
    animation: animarFlip && !virada ? 'cartaFlipIn 0.65s ease-out forwards' : undefined,
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
  }

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'center',
    display: 'block',
    background: isLenormand ? '#0a0f18' : undefined,
  }

  const renderFace = () => {
    if (virada) {
      if (!showImg) return <VersoSVG w={w} h={h} />
      return (
        <img
          src={src}
          alt="Verso"
          width={w}
          height={h}
          loading="eager"
          decoding="async"
          onError={() => setImgOk(false)}
          style={imgStyle}
        />
      )
    }
    if (!showImg) return <CartaFallbackSVG carta={carta} size={size} />
    return (
      <img
        src={src}
        alt={carta.nome}
        width={w}
        height={h}
        loading="eager"
        decoding="async"
        onError={() => setImgOk(false)}
        style={imgStyle}
      />
    )
  }

  return (
    <div className={className} style={outerStyle}>
      <div style={faceStyle}>
        {renderFace()}
      </div>
    </div>
  )
}

export default CartaTarot
