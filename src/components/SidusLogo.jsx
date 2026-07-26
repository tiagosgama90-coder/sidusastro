import { SidusConstellationMark } from './SidusConstellationMark.jsx'

const WORDMARK_STYLE = {
  fontWeight: 600,
  letterSpacing: '0.2em',
  color: '#DFB76C',
  lineHeight: 1,
  background: 'linear-gradient(180deg, #F0D08A 0%, #DFB76C 45%, #C9A55A 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

/**
 * Logótipo Sidus — horizontal | stacked | mark
 * Sempre notranslate (nunca traduzir SIDUS).
 */
export function SidusLogo({
  variant = 'horizontal',
  markSize,
  onClick,
  className = '',
  glow = true,
  showWordmark = true,
}) {
  const isHorizontal = variant === 'horizontal'
  const isStacked = variant === 'stacked'
  const isMark = variant === 'mark'

  const defaultMark = isStacked ? 72 : isHorizontal ? 34 : 32
  const size = markSize ?? defaultMark
  const wordSize = isStacked ? 34 : isHorizontal ? 19 : 0

  const inner = (
    <>
      <SidusConstellationMark size={size} glow={glow} className="sidus-logo__mark" />
      {showWordmark && !isMark && (
        <span
          className="sidus-logo__word notranslate"
          translate="no"
          style={{ ...WORDMARK_STYLE, fontSize: wordSize }}
        >
          SIDUS
        </span>
      )}
    </>
  )

  const layoutClass = [
    'sidus-logo',
    `sidus-logo--${variant}`,
    className,
  ].filter(Boolean).join(' ')

  if (onClick) {
    return (
      <button
        type="button"
        className={layoutClass}
        onClick={onClick}
        aria-label="Sidus - Home"
      >
        {inner}
      </button>
    )
  }

  return <div className={layoutClass}>{inner}</div>
}
