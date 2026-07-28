/**
 * Avatar do Chat Oráculo - olho místico Sidus (planeta com anel).
 */
export function OracleChatAvatar({ size = 40 }) {
  const id = `oracle-eye-${size}`

  return (
    <div
      className="oracle-chat-avatar"
      style={{ width: size, height: size, flexShrink: 0 }}
      aria-hidden
    >
      <svg
        className="oracle-chat-avatar__eye"
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${id}-gold`} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F0D08A" />
            <stop offset="0.5" stopColor="#DFB76C" />
            <stop offset="1" stopColor="#B8944F" />
          </linearGradient>
          <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g
          filter={`url(#${id}-glow)`}
          stroke={`url(#${id}-gold)`}
          strokeWidth="1.35"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M14 16.5C18.5 11.5 29.5 11.5 34 16.5" />
          <path d="M8.5 24C14.5 14.5 33.5 14.5 39.5 24" />
          <path d="M8.5 24C14.5 33.5 33.5 33.5 39.5 24" />
        </g>
        <circle cx="24" cy="24" r="4.1" fill={`url(#${id}-gold)`} />
        <ellipse
          cx="24"
          cy="24"
          rx="7.4"
          ry="2.5"
          transform="rotate(-18 24 24)"
          stroke={`url(#${id}-gold)`}
          strokeWidth="1.1"
          fill="none"
        />
      </svg>
    </div>
  )
}
