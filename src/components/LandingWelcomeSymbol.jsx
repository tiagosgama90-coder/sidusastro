const CHART_SRC = '/brand/sidus-premium-thin-a-1024.png?v=13'
const CHART_SRCSET =
  '/brand/sidus-premium-thin-a-512.png?v=13 512w, /brand/sidus-premium-thin-a-1024.png?v=13 1024w, /brand/sidus-premium-thin-a-2048.png?v=13 2048w'

/** Símbolo premium A com brilho central e nos pontos - PNG transparente. */
export function LandingWelcomeSymbol() {
  return (
    <div className="landing-welcome-zodiac notranslate" translate="no" aria-hidden>
      <div className="landing-welcome-zodiac__halo" />
      <div className="landing-welcome-zodiac__core-glow" />
      <div className="landing-welcome-zodiac__spark landing-welcome-zodiac__spark--1" />
      <div className="landing-welcome-zodiac__spark landing-welcome-zodiac__spark--2" />
      <div className="landing-welcome-zodiac__spark landing-welcome-zodiac__spark--3" />
      <div className="landing-welcome-zodiac__spark landing-welcome-zodiac__spark--4" />
      <img
        className="landing-welcome-zodiac__img"
        src={CHART_SRC}
        srcSet={CHART_SRCSET}
        sizes="(max-width: 640px) 140px, 192px"
        width={192}
        height={192}
        alt=""
        decoding="async"
        draggable={false}
      />
    </div>
  )
}
