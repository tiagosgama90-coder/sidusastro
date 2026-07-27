const PDF_COVER_SRC = '/brand/sidus-natal-pdf-cover.png?v=1'
const GUIDE_THUMB_SRC = '/brand/sidus-natal-guide-thumb.png?v=1'

export function LandingMapaPreview() {
  return (
    <div className="landing-testimonial-preview" aria-hidden="true">
      <div className="natal-chart-premium natal-chart-premium--cover">
        <div className="natal-chart-premium__frame natal-chart-premium__frame--photo">
          <img
            className="natal-chart-premium__photo natal-chart-premium__photo--cover"
            src={PDF_COVER_SRC}
            alt=""
            width={520}
            height={693}
            decoding="async"
            draggable={false}
          />
          <span className="natal-chart-premium__pdf-badge">PDF</span>
        </div>
        <p className="natal-chart-premium__cover-meta">☉ Sol · ☽ Lua · ASC · MC · 10 planetas · Casas Placidus</p>
      </div>
    </div>
  )
}

export function LandingMapaGuideArt({ className = '' }) {
  return (
    <div className={`natal-chart-premium natal-chart-premium--guide ${className}`.trim()} aria-hidden>
      <img
        className="natal-chart-premium__photo natal-chart-premium__photo--guide"
        src={GUIDE_THUMB_SRC}
        alt=""
        width={640}
        height={360}
        decoding="async"
        draggable={false}
      />
    </div>
  )
}
