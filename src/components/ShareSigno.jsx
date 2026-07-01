import { useState, useCallback } from 'react'
import { Share2, Check, Loader2 } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'

const CORES = {
  dourado: '#DFB76C',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
}

function dispositivoMovel() {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function criarCanvasPartilha({ signoSol, signoLua, nome, lang }) {
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

  ctx.strokeStyle = 'rgba(223,183,108,0.4)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(W / 2, H / 2 - 10, 72, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = '#DFB76C'
  ctx.font = 'bold 22px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('Sidusastro', W / 2, 36)

  ctx.fillStyle = '#FFFFFF'
  ctx.font = '600 20px system-ui, sans-serif'
  const titulo = nome ? `${nome}` : (lang === 'pt' ? 'O meu mapa' : 'My chart')
  ctx.fillText(titulo, W / 2, 68)

  ctx.font = '16px system-ui, sans-serif'
  ctx.fillStyle = '#FCD34D'
  ctx.fillText(`☉ ${signoSol || '-'}`, W / 2 - 60, 120)
  ctx.fillStyle = '#C4B5FD'
  ctx.fillText(`☽ ${signoLua || '-'}`, W / 2 + 60, 120)

  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.font = '13px system-ui, sans-serif'
  const tagline = lang === 'pt'
    ? 'Descobre o teu mapa astral em sidusastro.com'
    : 'Discover your birth chart at sidusastro.com'
  ctx.fillText(tagline, W / 2, H - 28)

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

/** Partilha signo / excerto do mapa (Web Share API em mobile; clipboard + download no desktop). */
export function ShareSigno({ mapaNatal, nome }) {
  const { lang, t, ts } = useLanguage()
  const [estado, setEstado] = useState('idle') // idle | loading | done | error

  const signoSol = mapaNatal?.solar?.nome ? ts(mapaNatal.solar.nome) : null
  const signoLua = mapaNatal?.lunar?.nome ? ts(mapaNatal.lunar.nome) : null

  const handleShare = useCallback(async () => {
    if (!signoSol) return
    setEstado('loading')
    try {
      const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://sidusastro.com'
      const texto = t('share.text', {
        sun: signoSol,
        moon: signoLua || '-',
        url: siteUrl,
      })
      const canvas = criarCanvasPartilha({
        signoSol,
        signoLua,
        nome: nome?.trim() || null,
        lang,
      })
      const blob = await canvasParaBlob(canvas)
      const file = new File([blob], 'sidusastro-signo.png', { type: 'image/png' })

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
      if (!dispositivoMovel()) descarregarBlob(blob, 'sidusastro-signo.png')

      if (copiou) {
        setEstado('done')
        setTimeout(() => setEstado('idle'), 2500)
        return
      }

      if (!dispositivoMovel()) {
        setEstado('done')
        setTimeout(() => setEstado('idle'), 2500)
        return
      }

      setEstado('error')
      setTimeout(() => setEstado('idle'), 3500)
    } catch (e) {
      if (e?.name === 'AbortError') {
        setEstado('idle')
        return
      }
      setEstado('error')
      setTimeout(() => setEstado('idle'), 3500)
    }
  }, [signoSol, signoLua, nome, lang, t])

  if (!signoSol) return null

  const label = estado === 'loading'
    ? t('share.loading')
    : estado === 'done'
      ? (dispositivoMovel() ? t('share.copied') : t('share.copiedDesktop'))
      : estado === 'error'
        ? t('share.fail')
        : t('share.button')

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={estado === 'loading'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 10,
        padding: '8px 14px',
        borderRadius: 20,
        border: `1px solid ${CORES.vidroBorda}`,
        background: estado === 'error' ? 'rgba(248,113,113,0.12)' : 'rgba(223,183,108,0.1)',
        color: estado === 'error' ? '#F87171' : CORES.dourado,
        fontSize: 12,
        fontWeight: 600,
        cursor: estado === 'loading' ? 'default' : 'pointer',
        opacity: estado === 'loading' ? 0.7 : 1,
      }}
    >
      {estado === 'loading'
        ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
        : estado === 'done'
          ? <Check size={14} />
          : <Share2 size={14} />}
      {label}
    </button>
  )
}
