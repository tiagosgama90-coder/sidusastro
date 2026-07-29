export function isGoogleTranslated() {
  const html = document.documentElement
  return html.classList.contains('translated-ltr') || html.classList.contains('translated-rtl')
}

/** Língua alvo detectada pelo Tradutor (Chrome ou widget). */
export function getGoogleTranslateTargetLang() {
  const html = document.documentElement
  const lang = (html.getAttribute('lang') || '').toLowerCase()
  if (!lang || lang === 'pt' || lang.startsWith('pt-')) return null
  return lang.split('-')[0]
}

function triggerWidgetRetranslate(targetLang) {
  const combo = document.querySelector('select.goog-te-combo')
  if (!combo) return false
  if (targetLang && combo.value !== targetLang) {
    combo.value = targetLang
  }
  combo.dispatchEvent(new Event('change', { bubbles: true }))
  return true
}

/** Força o widget Google Translate a voltar a processar a página (conteúdo novo). */
export function retranslatePageWithWidget(targetLang = getGoogleTranslateTargetLang()) {
  if (!targetLang) return () => {}

  const timers = []
  const tryRun = () => triggerWidgetRetranslate(targetLang)

  timers.push(window.setTimeout(tryRun, 50))
  timers.push(window.setTimeout(tryRun, 400))
  timers.push(window.setTimeout(tryRun, 1000))

  let attempts = 0
  const poll = window.setInterval(() => {
    attempts += 1
    if (tryRun() || attempts >= 15) window.clearInterval(poll)
  }, 250)
  timers.push(poll)

  return () => timers.forEach((id) => window.clearInterval(id))
}
