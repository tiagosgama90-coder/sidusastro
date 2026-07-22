export function dispositivoMovel() {
  if (typeof navigator === 'undefined') return false
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
}

export function abrirWhatsApp(texto) {
  const encoded = encodeURIComponent(texto)
  const url = `https://api.whatsapp.com/send?text=${encoded}`
  if (dispositivoMovel()) {
    window.location.href = url
    return
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function partilharNativo({ title, text, url }) {
  if (typeof navigator === 'undefined' || !navigator.share) return false
  navigator.share({ title, text, url }).catch(() => {})
  return true
}
