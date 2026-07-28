/**
 * Avatar do Chat Oráculo - bola de cristal com brilho cósmico.
 */
export function OracleChatAvatar({ size = 40 }) {
  return (
    <div
      className="oracle-chat-avatar"
      style={{ width: size, height: size, flexShrink: 0 }}
      aria-hidden
    >
      <svg viewBox="0 0 48 48" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="oracleOrb" cx="42%" cy="32%" r="58%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.95" />
            <stop offset="38%" stopColor="#7C3AED" stopOpacity="0.88" />
            <stop offset="72%" stopColor="#312E81" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#0B071E" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="oracleShine" cx="28%" cy="22%" r="45%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.72" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="oracleBase" x1="12" y1="38" x2="36" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9A7B3C" />
            <stop stopColor="#DFB76C" />
            <stop stopColor="#B8944F" />
          </linearGradient>
          <filter id="oracleGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx="24" cy="43.5" rx="11" ry="2.6" fill="rgba(0,0,0,0.45)" />
        <path
          d="M14.5 38.5C17 36.2 20.5 35 24 35c3.5 0 7 1.2 9.5 3.5"
          stroke="url(#oracleBase)"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <ellipse cx="24" cy="38.8" rx="8.5" ry="2.2" fill="url(#oracleBase)" />

        <g filter="url(#oracleGlow)">
          <circle cx="24" cy="21.5" r="14.5" fill="url(#oracleOrb)" stroke="#DFB76C" strokeWidth="1.3" />
          <circle cx="24" cy="21.5" r="14.5" fill="url(#oracleShine)" />
        </g>

        <path
          d="M17 24.5c2.2-3.2 5.8-4.8 7-4.8s4.8 1.6 7 4.8"
          stroke="rgba(223,183,108,0.35)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
        <circle cx="18.5" cy="17.5" r="0.9" fill="#FFFFFF" opacity="0.92" />
        <circle cx="27.5" cy="23.5" r="0.55" fill="#DFB76C" opacity="0.85" />
        <circle cx="22" cy="26.5" r="0.45" fill="#FFFFFF" opacity="0.7" />
        <circle cx="29" cy="18" r="0.35" fill="#C4B5FD" opacity="0.8" />
      </svg>
    </div>
  )
}
