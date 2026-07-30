const MANDALA_SRC = '/brand/sidus-natal-guide-wheels.png?v=2'

/** Animação tipo reveal da roda natal (substitui vídeo pesado). */
export function LandingMandalaReveal() {
  return (
    <div className="landing-mandala-reveal" aria-hidden="true">
      <div className="landing-mandala-reveal__glow" />
      <div className="landing-mandala-reveal__ring landing-mandala-reveal__ring--outer" />
      <div className="landing-mandala-reveal__ring landing-mandala-reveal__ring--inner" />
      <img
        src={MANDALA_SRC}
        alt=""
        className="landing-mandala-reveal__img"
        width={280}
        height={280}
        decoding="async"
        draggable={false}
      />
      <div className="landing-mandala-reveal__scan" />
    </div>
  )
}
