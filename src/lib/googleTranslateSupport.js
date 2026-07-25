let debounceTimer = null

export function isGoogleTranslated() {
  const html = document.documentElement
  return html.classList.contains('translated-ltr') || html.classList.contains('translated-rtl')
}

/** Reativa o Tradutor do Google após o React actualizar o DOM. */
export function triggerGoogleTranslateRescan() {
  if (!isGoogleTranslated()) return

  const combo = document.querySelector('select.goog-te-combo')
  if (combo) {
    combo.dispatchEvent(new Event('change', { bubbles: true }))
  }

  window.dispatchEvent(new Event('resize'))
  window.dispatchEvent(new Event('scroll'))

  const html = document.documentElement
  const marker = html.getAttribute('data-sidus-gt') === '1' ? '0' : '1'
  html.setAttribute('data-sidus-gt', marker)
}

export function scheduleGoogleTranslateRescan(delay = 120) {
  clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(triggerGoogleTranslateRescan, delay)
}

export function observeGoogleTranslateRescan(root) {
  if (!root || typeof MutationObserver === 'undefined') {
    return () => {}
  }

  let moTimer = null
  const domObserver = new MutationObserver(() => {
    if (!isGoogleTranslated()) return
    clearTimeout(moTimer)
    moTimer = window.setTimeout(() => scheduleGoogleTranslateRescan(80), 0)
  })

  domObserver.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
  })

  const htmlObserver = new MutationObserver(() => {
    if (isGoogleTranslated()) scheduleGoogleTranslateRescan(200)
  })
  htmlObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'lang'],
  })

  return () => {
    domObserver.disconnect()
    htmlObserver.disconnect()
    clearTimeout(moTimer)
    clearTimeout(debounceTimer)
  }
}
