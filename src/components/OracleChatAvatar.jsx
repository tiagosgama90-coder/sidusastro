/**
 * Avatar do Chat Oráculo - olho místico Sidus (planeta com anel).
 */
const EYE_SRC = '/brand/sidus-mystic-eye.svg'

export function OracleChatAvatar({ size = 40 }) {
  return (
    <div
      className="oracle-chat-avatar"
      style={{ width: size, height: size, flexShrink: 0 }}
      aria-hidden
    >
      <img
        src={EYE_SRC}
        width={size}
        height={size}
        alt=""
        decoding="async"
        draggable={false}
        className="oracle-chat-avatar__eye"
      />
    </div>
  )
}
