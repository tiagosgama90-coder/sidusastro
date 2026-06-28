/**
 * Renderização da interpretação profissional do Mapa Natal (Premium).
 * Estrutura em 5 secções - Tropical Placidus.
 */

const CORES = {
  dourado: '#DFB76C',
  branco: '#FFFFFF',
  brancoSuave: 'rgba(255, 255, 255, 0.85)',
  brancoMuted: 'rgba(255, 255, 255, 0.55)',
  vidroBorda: 'rgba(223, 183, 108, 0.22)',
  roxoClaro: 'rgba(139, 92, 246, 0.12)',
}

export function InterpretacaoMapa({ analise, estilosVidro, lang = 'pt', loading = false, loadingLabel }) {
  if (loading) {
    return (
      <div style={{ ...estilosVidro, padding: 20, marginBottom: 14, textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 13, color: CORES.brancoMuted, lineHeight: 1.5 }}>
          {loadingLabel || (lang === 'en' ? 'Writing your unique interpretation…' : 'A redigir a tua interpretação única…')}
        </p>
      </div>
    )
  }

  if (!analise?.seccoes?.length) return null

  const titulo = lang === 'en'
    ? '✦ Professional Interpretation'
    : '✦ Interpretação Profissional'

  const badge = analise.fonte === 'ia'
    ? (lang === 'en' ? '✦ Personalised chart reading' : '✦ Leitura personalizada ao teu mapa')
    : null

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: 11, color: CORES.dourado, textTransform: 'uppercase',
        letterSpacing: '0.1em', marginBottom: badge ? 6 : 12, fontWeight: 700,
      }}>
        {titulo}
      </div>
      {badge && (
        <p style={{ margin: '0 0 12px', fontSize: 11, color: CORES.brancoMuted, lineHeight: 1.45 }}>
          {badge}
        </p>
      )}

      {analise.seccoes.map(sec => (
        <div key={sec.id} style={{ ...estilosVidro, padding: 18, marginBottom: 14 }}>
          <h2 style={{
            fontSize: 15, color: CORES.dourado, fontWeight: 700, margin: '0 0 14px',
            lineHeight: 1.35,
          }}>
            {sec.id}. {sec.titulo}
          </h2>

          {sec.blocos.map((bloco, i) => (
            <div
              key={i}
              style={{
                marginBottom: i < sec.blocos.length - 1 ? 16 : 0,
                paddingBottom: i < sec.blocos.length - 1 ? 16 : 0,
                borderBottom: i < sec.blocos.length - 1 ? `1px solid ${CORES.vidroBorda}` : 'none',
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                gap: 8, marginBottom: 6, flexWrap: 'wrap',
              }}>
                <h3 style={{
                  fontSize: 13, color: CORES.branco, fontWeight: 600, margin: 0, flex: 1,
                }}>
                  {bloco.subtitulo}
                </h3>
                {bloco.meta && (
                  <span style={{
                    fontSize: 10, color: CORES.dourado, padding: '2px 8px', borderRadius: 10,
                    background: 'rgba(223,183,108,0.12)', border: `1px solid rgba(223,183,108,0.25)`,
                    whiteSpace: 'nowrap',
                  }}>
                    {bloco.meta}
                  </span>
                )}
              </div>
              <p style={{
                fontSize: 13, color: bloco.destaque ? CORES.brancoSuave : CORES.brancoMuted,
                lineHeight: 1.65, margin: 0,
                ...(bloco.destaque ? {
                  padding: 12, borderRadius: 10,
                  background: CORES.roxoClaro,
                  borderLeft: `3px solid ${CORES.dourado}`,
                } : {}),
              }}>
                {bloco.texto}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
