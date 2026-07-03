/** Remove símbolos que o Helvetica do jsPDF não renderiza bem. */
export function sanitizarTextoPdf(texto) {
  return String(texto ?? '')
    .replace(/\u2726/g, '>>')
    .replace(/[🔥🌍💨💧⚡🏔🌊❤💼🔮📄✉⏳✓💳]/g, '')
    .replace(/℞/g, 'R')
    .replace(/\u00A0/g, ' ')
}

/**
 * Quebra texto usando getTextWidth (consistente com doc.text).
 * splitTextToSize do jsPDF subestima largura com acentos PT/ES/FR.
 */
export function wrapPdfText(doc, texto, maxWidthMm) {
  const text = sanitizarTextoPdf(texto)
  if (!text) return ['']

  const linhas = []
  for (const paragrafo of text.split(/\n/)) {
    const trimmed = paragrafo.trim()
    if (!trimmed) {
      linhas.push('')
      continue
    }

    const palavras = trimmed.split(/\s+/).filter(Boolean)
    let linha = ''

    for (const palavra of palavras) {
      const candidata = linha ? `${linha} ${palavra}` : palavra
      if (doc.getTextWidth(candidata) <= maxWidthMm) {
        linha = candidata
        continue
      }

      if (linha) linhas.push(linha)

      if (doc.getTextWidth(palavra) <= maxWidthMm) {
        linha = palavra
        continue
      }

      let pedaco = ''
      for (const ch of palavra) {
        const teste = pedaco + ch
        if (doc.getTextWidth(teste) <= maxWidthMm) {
          pedaco = teste
        } else {
          if (pedaco) linhas.push(pedaco)
          pedaco = ch
        }
      }
      linha = pedaco
    }

    if (linha) linhas.push(linha)
  }

  return linhas.length ? linhas : ['']
}

export function alturaTextoPdf(doc, texto, maxWidthMm, alturaLinha = 5) {
  return wrapPdfText(doc, texto, maxWidthMm).length * alturaLinha + 3
}
