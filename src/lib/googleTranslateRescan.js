export function isGoogleTranslated() {
  const html = document.documentElement
  return html.classList.contains('translated-ltr') || html.classList.contains('translated-rtl')
}

function triggerBrowserRescan() {
  window.dispatchEvent(new Event('resize'))
  window.dispatchEvent(new Event('scroll'))

  const combo = document.querySelector('select.goog-te-combo')
  if (combo) {
    combo.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

/** Pequena mutação em nós de texto para o Chrome voltar a traduzir conteúdo novo. */
function pokeSubtreeForRetranslate(root) {
  if (!root || !isGoogleTranslated()) return

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT
        if (node.parentElement?.closest('[translate="no"]')) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    },
  )

  const textNodes = []
  while (walker.nextNode()) textNodes.push(walker.currentNode)

  textNodes.forEach((node) => {
    const original = node.textContent
    node.textContent = `${original}\u200b`
    node.textContent = original
  })
}

/**
 * Agenda re-tradução após o React pintar conteúdo dinâmico (ex.: estado "guardado").
 * Só corre se a página já estiver traduzida pelo Google.
 */
export function scheduleGoogleTranslateRescan(root, delays = [100, 350, 700]) {
  if (!isGoogleTranslated()) return () => {}

  const timers = delays.map((delay) => window.setTimeout(() => {
    if (root) pokeSubtreeForRetranslate(root)
    triggerBrowserRescan()
  }, delay))

  return () => timers.forEach((id) => window.clearTimeout(id))
}
