/** Fator de seguranca: Helvetica subestima largura de acentos PT/ES/FR. */
const UNICODE_SAFE_FACTOR = 0.62

/** Remove simbolos que o Helvetica do jsPDF nao renderiza bem. */
export function sanitizarTextoPdf(texto) {
  return String(texto ?? '')
    .replace(/\u2726/g, '>>')
    .replace(/[🔥🌍💨💧⚡🏔🌊❤💼🔮📄✉⏳✓💳]/g, '')
    .replace(/℞/g, 'R')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u2013\u2014]/g, '-')
}

/**
 * Quebra texto para caber na pagina (splitTextToSize + margem unicode).
 */
export function wrapPdfText(doc, texto, maxWidthMm) {
  const text = sanitizarTextoPdf(texto)
  if (!text) return ['']
  const safeWidth = Math.max(20, maxWidthMm * UNICODE_SAFE_FACTOR)
  return doc.splitTextToSize(text, safeWidth)
}

export function alturaTextoPdf(doc, texto, maxWidthMm, alturaLinha = 5) {
  return wrapPdfText(doc, texto, maxWidthMm).length * alturaLinha + 3
}

/** Desenha linhas centradas; devolve o Y final. */
export function escreverLinhasCentradas(doc, linhas, centerX, y, lineHeight = 5) {
  for (const linha of linhas) {
    if (linha) doc.text(linha, centerX, y, { align: 'center' })
    y += lineHeight
  }
  return y
}

/** Quebra e desenha paragrafo centrado; devolve o Y final. */
export function escreverParagrafoCentrado(doc, texto, centerX, y, maxWidthMm, lineHeight = 5) {
  const linhas = wrapPdfText(doc, texto, maxWidthMm)
  return escreverLinhasCentradas(doc, linhas, centerX, y, lineHeight) + 3
}
