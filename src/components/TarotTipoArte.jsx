/** Ilustrações por tipo de leitura - arte gerada Sidus. */

const IMAGENS = {
  diaria: '/images/tarot/tipos/tipo-diaria.png',
  simnao: '/images/tarot/tipos/tipo-simnao.png',
  amor: '/images/tarot/tipos/tipo-amor.png',
  geral: '/images/tarot/tipos/tipo-geral.png',
  cigano: '/images/tarot/tipos/tipo-cigano.png',
  oraculo: '/images/tarot/tipos/tipo-oraculo.png',
  trabalho: '/images/tarot/tipos/tipo-trabalho.png',
  ferradura: '/images/tarot/tipos/tipo-ferradura.png',
  cruzcelta: '/images/tarot/tipos/tipo-cruzcelta.png',
}

export function TarotTipoArte({ tipoId, size = 120, hovered = false, landscape = false }) {
  const src = IMAGENS[tipoId] || IMAGENS.geral
  const w = size
  const h = landscape ? Math.round(size * 0.62) : Math.round(size * 0.72)
  return (
    <div
      className={`tarot-tipo-arte${hovered ? ' tarot-tipo-arte--hover' : ''}`}
      style={{ width: w, height: h }}
    >
      <img src={src} alt="" width={w} height={h} loading="lazy" decoding="async" />
    </div>
  )
}
