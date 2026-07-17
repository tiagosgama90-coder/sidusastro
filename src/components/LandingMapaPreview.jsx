const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']

export function LandingMapaPreview() {
  return (
    <div className="landing-testimonial-preview" aria-hidden="true">
      <div className="landing-testimonial-preview-inner">
        <svg viewBox="0 0 200 200" className="landing-testimonial-wheel">
          <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(223,183,108,0.35)" strokeWidth="1" />
          <circle cx="100" cy="100" r="68" fill="none" stroke="rgba(223,183,108,0.2)" strokeWidth="0.8" />
          <g className="landing-testimonial-zodiac-ring">
            {ZODIAC.map((sym, i) => {
              const a = ((i * 30 - 90) * Math.PI) / 180
              const x = 100 + Math.cos(a) * 80
              const y = 100 + Math.sin(a) * 80
              return (
                <g key={sym} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
                  <g className="landing-testimonial-zodiac-upright">
                    <text
                      x={0}
                      y={0}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="rgba(223,183,108,0.85)"
                      fontSize="11"
                    >
                      {sym}
                    </text>
                  </g>
                </g>
              )
            })}
          </g>
          <circle cx="100" cy="100" r="42" fill="rgba(11,7,30,0.6)" stroke="rgba(223,183,108,0.4)" strokeWidth="1" />
          <text x="100" y="96" textAnchor="middle" fill="#DFB76C" fontSize="9" fontWeight="600">☉ SOL</text>
          <text x="100" y="108" textAnchor="middle" fill="#C4B5FD" fontSize="8">☽ LUA</text>
          <text x="100" y="120" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="7">ASC</text>
        </svg>
        <div className="landing-testimonial-pdf-badge">PDF</div>
      </div>
    </div>
  )
}
