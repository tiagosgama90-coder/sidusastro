/** Carrossel de notícias — desktop 5 cards / mobile 1 card com auto-rotação. */
import { useEffect, useState, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { gerarNoticiasAstrologia } from '../lib/astroNews.js'

const CORES = {
  dourado: '#DFB76C',
  brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

const DESKTOP_VISIBLE = 5
const MOBILE_VISIBLE = 1
const AUTO_MS = 5500
const LOGO_SIDUS = '/favicon.svg'

const newsBtnStyle = {
  width: 36, height: 36, borderRadius: '50%',
  border: `1px solid ${CORES.vidroBorda}`,
  background: 'rgba(255,255,255,0.06)',
  color: CORES.dourado, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
}

function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(`(max-width:${bp}px)`).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp}px)`)
    const fn = () => setMobile(mq.matches)
    mq.addEventListener('change', fn)
    setMobile(mq.matches)
    return () => mq.removeEventListener('change', fn)
  }, [bp])
  return mobile
}

/** Prioriza URL directa da API; proxy só como fallback após erro. */
function buildImgCandidates(noticia) {
  const raw = noticia?.urlToImage
  if (!raw) return []
  const list = [raw]
  if (noticia?.imagem && noticia.imagem !== raw) list.push(noticia.imagem)
  const proxied = `/.netlify/functions/astro-image-proxy?url=${encodeURIComponent(raw)}`
  if (!list.includes(proxied)) list.push(proxied)
  return list
}

export function AstroNewsCarousel({ aspetos = [] }) {
  const { lang, t } = useLanguage()
  const isMobile = useIsMobile()
  const visible = isMobile ? MOBILE_VISIBLE : DESKTOP_VISIBLE
  const imgHeight = isMobile ? 200 : 120

  const [noticias, setNoticias] = useState([])
  const [page, setPage] = useState(0)
  const [imgState, setImgState] = useState({})
  const pauseAuto = useRef(false)

  useEffect(() => {
    let cancelled = false
    setPage(0)
    setImgState({})
    ;(async () => {
      const items = await gerarNoticiasAstrologia({ aspetos, lang, max: 25, forceRefresh: true })
      if (cancelled) return
      console.log('[Sidus AstroNews debug]', items.map((n) => ({
        texto: n.texto?.slice(0, 55),
        urlToImage: n.urlToImage ?? null,
        tag: n.tag,
      })))
      setNoticias(items)
    })()
    return () => { cancelled = true }
  }, [aspetos, lang])

  const totalPages = Math.max(1, Math.ceil(noticias.length / visible))
  const slice = noticias.slice(page * visible, page * visible + visible)

  const prev = useCallback(() => {
    pauseAuto.current = true
    setPage((p) => (p - 1 + totalPages) % totalPages)
  }, [totalPages])

  const next = useCallback(() => {
    pauseAuto.current = true
    setPage((p) => (p + 1) % totalPages)
  }, [totalPages])

  useEffect(() => {
    if (totalPages <= 1) return undefined
    const id = setInterval(() => {
      if (pauseAuto.current) {
        pauseAuto.current = false
        return
      }
      setPage((p) => (p + 1) % totalPages)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [totalPages, isMobile])

  const onImgError = useCallback((key, candidates, idx) => {
    const nextIdx = idx + 1
    if (nextIdx < candidates.length) {
      setImgState((s) => ({ ...s, [key]: nextIdx }))
    } else {
      setImgState((s) => ({ ...s, [key]: -1 }))
    }
  }, [])

  if (!noticias.length) {
    return (
      <div style={{
        background: 'rgba(255,255,255,0.04)', borderRadius: 16,
        border: `1px solid ${CORES.vidroBorda}`, padding: 16, marginBottom: 18,
      }}>
        <p style={{ fontSize: 12, color: CORES.brancoMuted, margin: 0 }}>{t('home.loadingContent')}</p>
      </div>
    )
  }

  const cardBody = (n, i) => {
    const key = `${page}-${i}-${n.url || n.texto}`
    const candidates = buildImgCandidates(n)
    const idx = imgState[key] ?? 0
    const failed = idx === -1
    const imgSrc = !failed && candidates.length ? candidates[idx] : null

    return (
      <article key={key} style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <a
          href={n.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', flex: 1 }}
          onClick={(e) => { if (!n.url) e.preventDefault() }}
        >
          <div style={{
            width: '100%', height: imgHeight, borderRadius: isMobile ? 12 : 10,
            overflow: 'hidden', border: `1px solid ${CORES.vidroBorda}`,
            background: 'rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {imgSrc ? (
              <img
                src={imgSrc}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
                onError={() => onImgError(key, candidates, idx)}
              />
            ) : (
              <img
                src={LOGO_SIDUS}
                alt="Sidus"
                style={{ width: isMobile ? 48 : 40, height: isMobile ? 48 : 40, objectFit: 'contain', opacity: 0.7 }}
              />
            )}
          </div>
          <span style={{
            display: 'block', marginTop: isMobile ? 12 : 8,
            fontSize: isMobile ? 10 : 8, fontWeight: 700, color: CORES.dourado,
            textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>{n.tag}</span>
          <p style={{
            fontSize: isMobile ? 14 : 11, color: CORES.brancoSuave,
            lineHeight: isMobile ? 1.55 : 1.45, margin: isMobile ? '8px 0 0' : '5px 0 0',
            fontWeight: 600, flex: 1,
            display: '-webkit-box', WebkitLineClamp: isMobile ? 4 : 3,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{n.texto}</p>
        </a>
      </article>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', borderRadius: 16,
      border: `1px solid ${CORES.vidroBorda}`, marginBottom: 18, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '12px 16px' : '10px 14px',
        borderBottom: `1px solid ${CORES.vidroBorda}`,
      }}>
        <span style={{
          fontSize: isMobile ? 13 : 12, fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase', color: CORES.brancoSuave,
        }}>
          {t('home.astroNewsTitle')}
        </span>
        <span style={{ fontSize: 9, color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>
          {t('home.liveBadge')}
        </span>
      </div>

      <div style={{ padding: isMobile ? '16px 14px' : '14px 12px' }}>
        {isMobile ? (
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 10 }}>
              <button type="button" onClick={prev} aria-label="Anterior" style={newsBtnStyle}>
                <ChevronLeft size={20} />
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>{slice.map((n, i) => cardBody(n, i))}</div>
              <button type="button" onClick={next} aria-label="Seguinte" style={newsBtnStyle}>
                <ChevronRight size={20} />
              </button>
            </div>
            {totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, marginTop: 14,
              }}>
                {Array.from({ length: totalPages }, (_, dot) => (
                  <span
                    key={dot}
                    style={{
                      width: dot === page ? 18 : 6, height: 6, borderRadius: 3,
                      background: dot === page ? CORES.dourado : 'rgba(255,255,255,0.2)',
                      transition: 'width 0.2s',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.min(DESKTOP_VISIBLE, slice.length)}, minmax(0, 1fr))`,
              gap: 12,
            }}>
              {slice.map((n, i) => cardBody(n, i))}
            </div>
            {totalPages > 1 && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 14, marginTop: 12, paddingTop: 10,
                borderTop: `1px solid ${CORES.vidroBorda}`,
              }}>
                <button type="button" onClick={prev} aria-label="Anterior" style={newsBtnStyle}>
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontSize: 11, color: CORES.brancoMuted }}>{page + 1} / {totalPages}</span>
                <button type="button" onClick={next} aria-label="Seguinte" style={newsBtnStyle}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
