export function LandingMapaPreview() {
  return (
    <div className="landing-testimonial-preview" aria-hidden="true">
      <div className="landing-testimonial-preview-inner landing-testimonial-preview-inner--chart">
        <img
          className="landing-testimonial-preview-symbol"
          src="/brand/sidus-premium-thin-a-512.png?v=13"
          srcSet="/brand/sidus-premium-thin-a-512.png?v=13 1x, /brand/sidus-premium-thin-a-1024.png?v=13 2x"
          width={120}
          height={120}
          alt=""
          decoding="async"
          draggable={false}
        />
        <div className="landing-testimonial-pdf-badge">PDF</div>
      </div>
    </div>
  )
}
