/** Margem de seguranca para acentos PT/ES/FR no Helvetica. */
const UNICODE_SAFE_FACTOR = 0.9

/** Remove simbolos que o Helvetica do jsPDF nao renderiza bem. */
export function sanitizarTextoPdf(texto) {
  return String(texto ?? '')
    .replace(/\u2726/g, '>>')
    .replace(/[🔥🌍💨💧⚡🏔🌊❤💼🔮📄✉⏳✓💳]/g, '')
    .replace(/℞/g, 'R')
    .replace(/\u00A0/g, ' ')
    .replace(/[\u2013\u2014]/g, '-')
}

/** Quebra texto para caber na largura util (mm). */
export function wrapPdfText(doc, texto, maxWidthMm) {
  const text = sanitizarTextoPdf(texto)
  if (!text) return ['']
  const safeWidth = Math.max(30, maxWidthMm * UNICODE_SAFE_FACTOR)
  return doc.splitTextToSize(text, safeWidth)
}

export function alturaTextoPdf(doc, texto, maxWidthMm, alturaLinha = 4.8) {
  return wrapPdfText(doc, texto, maxWidthMm).length * alturaLinha + 3
}

/** Desenha linhas alinhadas a esquerda com quebra de pagina linha a linha. */
export function escreverLinhasEsquerda(doc, linhas, x, yRef, pageBottom, lineHeight, onNewPage) {
  let y = yRef.value
  for (const linha of linhas) {
    if (y + lineHeight > pageBottom) {
      onNewPage()
      y = yRef.value
    }
    if (linha) doc.text(linha, x, y)
    y += lineHeight
  }
  yRef.value = y
  return y
}

/** Quebra e desenha paragrafo alinhado a esquerda. */
export function escreverParagrafoEsquerda(doc, texto, x, yRef, maxWidthMm, pageBottom, lineHeight, onNewPage) {
  const linhas = wrapPdfText(doc, texto, maxWidthMm)
  escreverLinhasEsquerda(doc, linhas, x, yRef, pageBottom, lineHeight, onNewPage)
  yRef.value += 3
  return yRef.value
}
