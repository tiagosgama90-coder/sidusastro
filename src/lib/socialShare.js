/** Imagem partilhada em WhatsApp, Telegram, iMessage, X, LinkedIn, Discord, Slack, etc. */
export const SOCIAL_SHARE_IMAGE = 'https://sidusastro.com/og-image.png?v=4'

function setMeta(attr, key, value) {
  if (!value) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

/** Open Graph + Twitter Card — padrão usado por quase todas as apps de mensagens. */
export function applySocialShareMeta({
  title,
  description,
  url = 'https://sidusastro.com/',
  type = 'website',
  locale = 'pt_PT',
} = {}) {
  const image = SOCIAL_SHARE_IMAGE

  setMeta('property', 'og:type', type)
  setMeta('property', 'og:site_name', 'Sidusastro')
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:locale', locale)
  if (title) setMeta('property', 'og:title', title)
  if (description) setMeta('property', 'og:description', description)

  setMeta('property', 'og:image', image)
  setMeta('property', 'og:image:secure_url', image)
  setMeta('property', 'og:image:type', 'image/png')
  setMeta('property', 'og:image:width', '1200')
  setMeta('property', 'og:image:height', '630')
  setMeta('property', 'og:image:alt', 'Sidus - estrela azul e logotipo SIDUS')

  setMeta('name', 'twitter:card', 'summary_large_image')
  if (title) setMeta('name', 'twitter:title', title)
  if (description) setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', image)
  setMeta('name', 'twitter:image:alt', 'Sidus - estrela azul e logotipo SIDUS')
}
