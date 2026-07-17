import { useState, useCallback, useMemo } from 'react'
import { Share2, Check, Loader2, MessageCircle, Camera } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  roxo: '#8B5CF6',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

function dispositivoMovel() {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function criarCanvasPartilha({ signoSol, signoLua, signoAsc, nome, lang }) {
  const W = 600
  const H = 315
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, '#0B071E')
  grad.addColorStop(0.5, '#1a0d3a')
  grad.addColorStop(1, '#0B071E')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  for (let i = 0; i < 40; i++) {
    const x = Math.random() * W
    const y = Math.random() * H
    ctx.fillStyle = `rgba(223,183,108,${0.1 + Math.random() * 0.25})`
    ctx.beginPath()
    ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.strokeStyle = 'rgba(223,183,108,0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(W / 2, H / 2 - 8, 78, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = '#DFB76C'
  ctx.font = 'bold 20px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('✦ Sidusastro', W / 2, 32)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '600 18px system-ui, sans-serif'
  const titulo = nome ? `${nome}` : (lang === 'pt' ? 'O meu mapa' : 'My chart')
  ctx.fillText(titulo, W / 2, 58)

  ctx.font = 'bold 15px system-ui, sans-serif'
  ctx.fillStyle = '#FCD34D'
  ctx.fillText(`☉ ${signoSol || '-'}`, W / 2 - 90, 108)
  ctx.fillStyle = '#C4B5FD'
  ctx.fillText(`☽ ${signoLua || '-'}`, W / 2, 108)
  ctx.fillStyle = '#A78BFA'
  ctx.fillText(`↑ ${signoAsc || '-'}`, W / 2 + 90, 108)

  const linhaMapa = lang === 'pt'
    ? `O meu mapa: Sol em ${signoSol || '-'}, Lua em ${signoLua || '-'}${signoAsc ? `, Ascendente em ${signoAsc}` : ''}`
    : `My chart: Sun in ${signoSol || '-'}, Moon in ${signoLua || '-'}${signoAsc ? `, Ascendant in ${signoAsc}` : ''}`
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '13px system-ui, sans-serif'
  ctx.fillText(linhaMapa.slice(0, 52) + (linhaMapa.length > 52 ? '…' : ''), W / 2, 148)

  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '12px system-ui, sans-serif'
  const tagline = lang === 'pt'
    ? 'Descobre o teu mapa astral em sidusastro.com'
    : 'Discover your birth chart at sidusastro.com'
  ctx.fillText(tagline, W / 2, H - 24)

  return canvas
}

function canvasParaBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('canvas_blob'))
    }, 'image/png')
  })
}

async function copiarTexto(texto) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(texto)
    return true
  }
  const ta = document.createElement('textarea')
  ta.value = texto
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(ta)
  return ok
}

function descarregarBlob(blob, nomeFicheiro) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nomeFicheiro
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function partilharNativo(payload) {
  if (!navigator.share) return false
  try {
    if (navigator.canShare && !navigator.canShare(payload)) return false
    await navigator.share(payload)
    return true
  } catch (e) {
    if (e?.name === 'AbortError') throw e
    return false
  }
}

/** Partilha signo / excerto do mapa (Web Share API, WhatsApp, Instagram Stories). */
export function ShareSigno({ mapaNatal, nome, variant = 'default' }) {
  const { lang, t, ts } = useLanguage()
  const [estado, setEstado] = useState('idle')

  const signoSol = mapaNatal?.solar?.nome ? ts(mapaNatal.solar.nome) : null
  const signoLua = mapaNatal?.lunar?.nome ? ts(mapaNatal.lunar.nome) : null
  const signoAsc = mapaNatal?.ascendente?.nome ? ts(mapaNatal.ascendente.nome) : null

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sidusastro.com'

  const textoPartilha = useMemo(() => t('share.textFull', {
    sun: signoSol,
    moon: signoLua || '-',
    asc: signoAsc || '-',
    url: siteUrl,
  }), [t, signoSol, signoLua, signoAsc, siteUrl])

  const prepararPartilha = useCallback(async () => {
    const canvas = criarCanvasPartilha({
      signoSol,
      signoLua,
      signoAsc,
      nome: nome?.trim() || null,
      lang,
    })
    const blob = await canvasParaBlob(canvas)
    const file = new File([blob], 'sidusastro-mapa.png', { type: 'image/png' })
    return { canvas, blob, file, texto: textoPartilha }
  }, [signoSol, signoLua, signoAsc, nome, lang, textoPartilha])

  const handleShare = useCallback(async () => {
    if (!signoSol) return
    setEstado('loading')
    try {
      const { file, texto } = await prepararPartilha()

      if (dispositivoMovel() && navigator.share) {
        const comImagem = { title: t('share.title'), text: texto, files: [file] }
        if (await partilharNativo(comImagem)) {
          setEstado('done')
          setTimeout(() => setEstado('idle'), 2500)
          return
        }
        if (await partilharNativo({ title: t('share.title'), text: texto })) {
          setEstado('done')
          setTimeout(() => setEstado('idle'), 2500)
          return
        }
      }

      const copiou = await copiarTexto(texto)
      const { blob } = await prepararPartilha()
      if (!dispositivoMovel()) descarregarBlob(blob, 'sidusastro-mapa.png')

      setEstado(copiou || !dispositivoMovel() ? 'done' : 'error')
      setTimeout(() => setEstado('idle'), 2500)
    } catch (e) {
      if (e?.name === 'AbortError') {
        setEstado('idle')
        return
      }
      setEstado('error')
      setTimeout(() => setEstado('idle'), 3500)
    }
  }, [signoSol, prepararPartilha, t])

  const handleWhatsApp = useCallback(async () => {
    if (!signoSol) return
    setEstado('loading')
    try {
      const { texto } = await prepararPartilha()
      const waUrl = `https://wa.me/?text=${encodeURIComponent(texto)}`
      window.open(waUrl, '_blank', 'noopener,noreferrer')
      setEstado('done')
      setTimeout(() => setEstado('idle'), 2000)
    } catch {
      setEstado('error')
      setTimeout(() => setEstado('idle'), 3000)
    }
  }, [signoSol, prepararPartilha])

  const handleInstagram = useCallback(async () => {
    if (!signoSol) return
    setEstado('loading')
    try {
      const { blob, texto } = await prepararPartilha()
      await copiarTexto(texto)
      if (!dispositivoMovel()) descarregarBlob(blob, 'sidusastro-stories.png')
      if (dispositivoMovel() && navigator.share) {
        const file = new File([blob], 'sidusastro-stories.png', { type: 'image/png' })
        await partilharNativo({ files: [file] })
      }
      setEstado('done')
      setTimeout(() => setEstado('idle'), 2500)
    } catch (e) {
      if (e?.name === 'AbortError') {
        setEstado('idle')
        return
      }
      setEstado('error')
      setTimeout(() => setEstado('idle'), 3000)
    }
  }, [signoSol, prepararPartilha])

  if (!signoSol) return null

  const prominente = variant === 'prominent'
  const label = estado === 'loading'
    ? t('share.loading')
    : estado === 'done'
      ? (dispositivoMovel() ? t('share.copied') : t('share.copiedDesktop'))
      : estado === 'error'
        ? t('share.fail')
        : t('share.button')

  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: prominente ? '10px 14px' : '8px 12px',
    borderRadius: 20,
    border: `1px solid ${CORES.vidroBorda}`,
    background: estado === 'error' ? 'rgba(248,113,113,0.12)' : 'rgba(223,183,108,0.1)',
    color: estado === 'error' ? '#F87171' : CORES.dourado,
    fontSize: prominente ? 13 : 12,
    fontWeight: 600,
    cursor: estado === 'loading' ? 'default' : 'pointer',
    opacity: estado === 'loading' ? 0.7 : 1,
    flex: prominente ? 1 : undefined,
  }

  return (
    <div className={prominente ? 'share-signo-prominent' : undefined} style={{ marginTop: prominente ? 14 : 10 }}>
      {prominente && (
        <p className="share-signo-lead">{t('share.lead', { sun: signoSol, moon: signoLua || '-', asc: signoAsc || '-' })}</p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <button type="button" onClick={handleShare} disabled={estado === 'loading'} style={btnStyle}>
          {estado === 'loading' ? <Loader2 size={14} className="spin-icon" /> : estado === 'done' ? <Check size={14} /> : <Share2 size={14} />}
          {label}
        </button>
        <button type="button" onClick={handleWhatsApp} disabled={estado === 'loading'} style={{ ...btnStyle, background: 'rgba(37,211,102,0.12)', borderColor: 'rgba(37,211,102,0.35)', color: '#4ADE80' }}>
          <MessageCircle size={14} />
          WhatsApp
        </button>
        <button type="button" onClick={handleInstagram} disabled={estado === 'loading'} style={{ ...btnStyle, background: 'rgba(244,114,182,0.12)', borderColor: 'rgba(244,114,182,0.35)', color: '#F472B6' }}>
          <Camera size={14} />
          Stories
        </button>
      </div>
    </div>
  )
}
