/** Carrossel horizontal de notícias — imagem real (urlToImage) ou logo Sidus. */
import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '../lib/i18n/LanguageContext.jsx'
import { gerarNoticiasAstrologia } from '../lib/astroNews.js'

const CORES = {
  dourado: '#DFB76C',
  brancoSuave: 'rgba(255,255,255,0.85)',
  brancoMuted: 'rgba(255,255,255,0.55)',
  vidroBorda: 'rgba(223,183,108,0.22)',
}

const VISIBLE = 5
const LOGO_SIDUS = '/favicon.svg'

const newsBtnStyle = {
  width: 32, height: 32, borderRadius: '50%',
  border: `1px solid ${CORES.vidroBorda}`,
  background: 'rgba(255,255,255,0.05)',
  color: CORES.dourado, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

/** URL de imagem para exibir — prioriza proxy (imagem), fallback urlToImage directo. */
function resolveImgSrc(noticia) {
  if (noticia?.imagem) return noticia.imagem
  if (noticia?.urlToImage) {
    return `/.netlify/functions/astro-image-proxy?url=${encodeURIComponent(noticia.urlToImage)}`
  }
  return null
}

export function AstroNewsCarousel({ aspetos = [] }) {
  const { lang, t } = useLanguage()
  const [noticias, setNoticias] = useState([])
  const [page, setPage] = useState(0)
  const [imgErrors, setImgErrors] = useState({})

  useEffect(() => {
    let cancelled = false
    setPage(0)
    setImgErrors({})
    ;(async () => {
      const items = await gerarNoticiasAstrologia({ aspetos, lang, max: 25, forceRefresh: true })
      if (cancelled) return
      console.log('[Sidus AstroNews debug] dados recebidos:', items.map((n) => ({
        texto: n.texto?.slice(0, 60),
        urlToImage: n.urlToImage ?? null,
        imagem: n.imagem ?? null,
        url: n.url ?? null,
        tag: n.tag,
      })))
      setNoticias(items)
    })()
    return () => { cancelled = true }
  }, [aspetos, lang])

  const totalPages = Math.max(1, Math.ceil(noticias.length / VISIBLE))
  const slice = noticias.slice(page * VISIBLE, page * VISIBLE + VISIBLE)

  const prev = useCallback(() => {
    setPage((p) => (p - 1 + totalPages) % totalPages)
  }, [totalPages])

  const next = useCallback(() => {
    setPage((p) => (p + 1) % totalPages)
  }, [totalPages])

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

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', borderRadius: 16,
      border: `1px solid ${CORES.vidroBorda}`, marginBottom: 18, overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px', borderBottom: `1px solid ${CORES.vidroBorda}`,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: CORES.brancoSuave }}>
          {t('home.astroNewsTitle')}
        </span>
        <span style={{ fontSize: 9, color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>{t('home.liveBadge')}</span>
      </div>

      <div style={{ padding: '12px 10px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(VISIBLE, slice.length)}, minmax(0, 1fr))`,
          gap: 8,
        }}>
          {slice.map((n, i) => {
            const key = `${page}-${i}-${n.url || n.texto}`
            const urlToImage = n.urlToImage || null
            const imgSrc = !imgErrors[key] ? resolveImgSrc(n) : null
            const showImg = Boolean(urlToImage && imgSrc && !imgErrors[key])

            return (
              <article key={key} style={{ minWidth: 0 }}>
                <a
                  href={n.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', display: 'block' }}
                  onClick={(e) => { if (!n.url) e.preventDefault() }}
                >
                  <div style={{
                    width: '100%', height: 68, borderRadius: 8, overflow: 'hidden',
                    border: `1px solid ${CORES.vidroBorda}`,
                    background: 'rgba(255,255,255,0.03)',
                    marginBottom: 6,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {showImg ? (
                      <img
                        key={imgSrc}
                        src={imgSrc}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        loading="lazy"
                        onError={() => {
                          console.warn('[Sidus AstroNews] imagem falhou:', { texto: n.texto?.slice(0, 40), urlToImage, imgSrc })
                          setImgErrors((prev) => ({ ...prev, [key]: true }))
                        }}
                      />
                    ) : (
                      <img
                        src={LOGO_SIDUS}
                        alt="Sidus"
                        style={{ width: 36, height: 36, objectFit: 'contain', opacity: 0.85 }}
                      />
                    )}
                  </div>
                  <span style={{
                    fontSize: 8, fontWeight: 700, color: CORES.dourado,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{n.tag}</span>
                  <p style={{
                    fontSize: 10, color: CORES.brancoSuave, lineHeight: 1.4,
                    margin: '3px 0 0', fontWeight: 600,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{n.texto}</p>
                </a>
              </article>
            )
          })}
        </div>

        {totalPages > 1 && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, marginTop: 10, paddingTop: 8,
            borderTop: `1px solid ${CORES.vidroBorda}`,
          }}>
            <button type="button" onClick={prev} aria-label="Anterior" style={newsBtnStyle}>
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontSize: 10, color: CORES.brancoMuted }}>{page + 1} / {totalPages}</span>
            <button type="button" onClick={next} aria-label="Seguinte" style={newsBtnStyle}>
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
