/** Destaca uma expressão no texto com brilho dourado (landing mística). */
export function LandingMysticHighlight({ text, highlight }) {
  if (!text || !highlight) return text ?? null
  const idx = text.indexOf(highlight)
  if (idx < 0) return text

  const before = text.slice(0, idx)
  const after = text.slice(idx + highlight.length)

  return (
    <>
      {before}
      <span className="landing-mystic-glow">{highlight}</span>
      {after}
    </>
  )
}
