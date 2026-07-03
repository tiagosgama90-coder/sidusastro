/**
 * Gerador de PDF do Mapa Astral Completo - Sidus
 * Tropical · Placidus · 5 secções profissionais
 */

import { gerarAnaliseCompleta } from '../lib/mapaInterpretacao.js'
import { sidusLogoParaPdf, SIDUS_COPYRIGHT_PT, SIDUS_COPYRIGHT_EN } from '../lib/sidusLogoPdf.js'
import { getPdfLabels } from '../lib/pdfLabels.js'
import { wrapPdfText, alturaTextoPdf, sanitizarTextoPdf } from '../lib/pdfTextWrap.js'

const ELEMENTO_DO_SIGNO = {
  Carneiro:'Fogo', Leão:'Fogo', Sagitário:'Fogo',
  Touro:'Terra', Virgem:'Terra', Capricórnio:'Terra',
  Gémeos:'Ar', Balança:'Ar', Aquário:'Ar',
  Caranguejo:'Água', Escorpião:'Água', Peixes:'Água',
}

export async function gerarPdfMapaAstral(mapaNatal, dados, planetas = [], analise = null, lang = 'pt', opts = {}) {
  const { mandalaPng } = opts
  const { jsPDF } = await import('jspdf')

  const analiseFinal = analise || gerarAnaliseCompleta(mapaNatal, planetas, [], dados, lang)
  const copyright = lang !== 'pt' ? SIDUS_COPYRIGHT_EN : SIDUS_COPYRIGHT_PT
  const logoData = await sidusLogoParaPdf()
  const labels = getPdfLabels(lang)

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const L = 20
  const W = 170
  const PAD = 4
  const TEXT_W = W - PAD * 2
  const PAGE_BOTTOM = 268
  let y = 20

  const DOURADO = [223, 183, 108]
  const BRANCO  = [255, 255, 255]
  const ESCURO  = [11, 7, 30]
  const ROXO    = [28, 16, 58]
  const MUTED   = [160, 140, 200]
  const VERDE   = [52, 211, 153]
  const LARANJA = [251, 146, 60]
  const AZUL    = [147, 197, 253]
  const LILAS   = [129, 140, 248]

  const novaPageSeNecessario = (h = 25) => {
    if (y + h > PAGE_BOTTOM) {
      doc.addPage()
      doc.setFillColor(...ESCURO)
      doc.rect(0, 0, 210, 297, 'F')
      y = 20
    }
  }

  const escreverParagrafo = (texto, indent = 0) => {
    const largura = TEXT_W - indent
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const linhas = wrapPdfText(doc, texto, largura)
    novaPageSeNecessario(linhas.length * 5 + 8)
    doc.setTextColor(...BRANCO)
    linhas.forEach((l) => {
      doc.text(l, L + PAD + indent, y)
      y += 5
    })
    y += 3
  }

  doc.setFillColor(...ESCURO)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFillColor(...ROXO)
  doc.rect(0, 0, 210, 58, 'F')
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.5)
  doc.line(L, 58, 210 - L, 58)

  if (logoData) {
    doc.addImage(logoData, 'PNG', 105 - 7, 7, 14, 14)
  }

  doc.setTextColor(...DOURADO)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text(labels.headerTitle, 105, 26, { align: 'center' })

  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.text(sanitizarTextoPdf(labels.headerSubtitle), 105, 32, { align: 'center' })
  doc.text(sanitizarTextoPdf(labels.headerTagline), 105, 36, { align: 'center' })

  doc.setFontSize(6.5)
  wrapPdfText(doc, copyright, W).forEach((line, i) => {
    doc.text(line, 105, 41 + i * 3.2, { align: 'center' })
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...BRANCO)
  doc.text(sanitizarTextoPdf(dados.nome || ''), 105, 50, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  const localDt = [
    formatarData(dados.data),
    dados.hora ? `${labels.atTime} ${dados.hora}` : '',
    dados.cidade ? `· ${dados.cidade}` : '',
  ].filter(Boolean).join(' ')
  doc.text(sanitizarTextoPdf(localDt), 105, 55, { align: 'center' })

  y = 68

  secaoTitulo(doc, y, labels.fourPillars, DOURADO, ROXO, L, W)
  y += 12

  const pilares = [
    { icon: 'Sol', label: labels.labels.sun, valor: mapaNatal?.solar?.nome || '-', grau: mapaNatal?.solar?.graus },
    { icon: 'Lua', label: labels.labels.moon, valor: mapaNatal?.lunar?.nome || '-', grau: mapaNatal?.lunar?.graus },
    { icon: 'AS', label: labels.labels.asc, valor: mapaNatal?.ascendente?.nome || '-', grau: mapaNatal?.ascendente?.graus },
    { icon: 'DC', label: labels.labels.desc, valor: mapaNatal?.descendente?.nome || '-', grau: mapaNatal?.descendente?.graus },
    { icon: 'MC', label: labels.labels.mc, valor: mapaNatal?.mc?.nome || '-', grau: mapaNatal?.mc?.graus },
  ]

  pilares.forEach((p, i) => {
    const col = i % 2
    const x = L + col * (W / 2 + 2)
    if (col === 0 && i > 0) y += 22
    doc.setFillColor(28, 16, 58)
    doc.roundedRect(x, y, W / 2 - 2, 18, 3, 3, 'F')
    doc.setDrawColor(...DOURADO)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, W / 2 - 2, 18, 3, 3, 'S')
    doc.setTextColor(...DOURADO)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text(p.icon, x + 5, y + 8)
    doc.setTextColor(...MUTED)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(sanitizarTextoPdf(p.label.toUpperCase()), x + 13, y + 7)
    doc.setTextColor(...BRANCO)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(sanitizarTextoPdf(p.valor), x + 13, y + 14)
    if (p.grau != null) {
      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      doc.text(`${p.grau}°`, x + W / 2 - 16, y + 14)
    }
  })
  y += 28

  // ── 5 Secções de interpretação ──
  for (const sec of analiseFinal.seccoes) {
    novaPageSeNecessario(25)
    secaoTitulo(doc, y, `>> ${sec.id}. ${sanitizarTextoPdf(sec.titulo).toUpperCase()}`, DOURADO, ROXO, L, W)
    y += 12

    for (const bloco of sec.blocos) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      const tituloLinhas = wrapPdfText(doc, bloco.subtitulo, TEXT_W)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      const metaAltura = bloco.meta ? 5 : 0
      const alturaParag = alturaTextoPdf(doc, bloco.texto, TEXT_W - (bloco.destaque ? 2 : 0))
      novaPageSeNecessario(tituloLinhas.length * 5 + metaAltura + alturaParag + 10)

      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DOURADO)
      tituloLinhas.forEach((l) => {
        doc.text(l, L + PAD, y)
        y += 5
      })

      if (bloco.meta) {
        doc.setTextColor(...MUTED)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        wrapPdfText(doc, bloco.meta, TEXT_W).forEach((l) => {
          doc.text(l, L + PAD, y)
          y += 5
        })
      }
      y += 2
      escreverParagrafo(bloco.texto, bloco.destaque ? 2 : 0)
      y += 2
    }
    y += 6
  }

  // ── Posições planetárias ──
  novaPageSeNecessario(25)
  secaoTitulo(doc, y, labels.positions, DOURADO, ROXO, L, W)
  y += 12

  if (planetas.length > 0) {
    planetas.forEach((pl, i) => {
      novaPageSeNecessario(14)
      const col = i % 2
      const x = L + col * (W / 2 + 2)
      if (col === 0 && i > 0) y += 12
      doc.setFillColor(20, 12, 45)
      doc.roundedRect(x, y, W / 2 - 2, 10, 2, 2, 'F')
      doc.setTextColor(...DOURADO)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      const nomePl = sanitizarTextoPdf(`${pl.simbolo || ''} ${pl.nome || ''}`.trim())
      doc.text(nomePl, x + 4, y + 7, { maxWidth: 22 })
      doc.setTextColor(...BRANCO)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      const signoCasa = sanitizarTextoPdf(`${pl.signo?.nome || '-'}${pl.casa ? ` · C${pl.casa}` : ''}`)
      doc.text(signoCasa, x + 28, y + 7, { maxWidth: W / 2 - 34 })
      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      doc.text(`${(pl.longitude ?? 0).toFixed(1)}°${pl.retrograde ? ' R' : ''}`, x + W / 2 - 22, y + 7)
    })
    y += 18
  }

  // ── Elementos ──
  novaPageSeNecessario(55)
  secaoTitulo(doc, y, labels.elements, DOURADO, ROXO, L, W)
  y += 12

  if (planetas.length > 0) {
    const balEl = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 }
    planetas.forEach(p => { const el = ELEMENTO_DO_SIGNO[p.signo?.nome]; if (el) balEl[el]++ })
    const total = planetas.length
    ;[
      { label: labels.fire, key: 'Fogo', cor: LARANJA },
      { label: labels.earth, key: 'Terra', cor: VERDE },
      { label: labels.air, key: 'Ar', cor: AZUL },
      { label: labels.water, key: 'Água', cor: LILAS },
    ].forEach(({ label, key, cor }) => {
      novaPageSeNecessario(14)
      const count = balEl[key] || 0
      const pct = total > 0 ? count / total : 0
      doc.setTextColor(...BRANCO)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(sanitizarTextoPdf(`${label}  ${count}/${total}`), L + PAD, y + 5)
      doc.setFillColor(255, 255, 255, 0.06)
      doc.roundedRect(L + PAD, y + 7, TEXT_W, 4, 1, 1, 'F')
      if (pct > 0) {
        doc.setFillColor(...cor)
        doc.roundedRect(L + PAD, y + 7, TEXT_W * pct, 4, 1, 1, 'F')
      }
      y += 13
    })
  }

  novaPageSeNecessario(40)
  secaoTitulo(doc, y, labels.technical, DOURADO, ROXO, L, W)
  y += 12

  ;[
    [labels.technicalSystem, labels.technicalSystemVal],
    [labels.technicalUt, mapaNatal?.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '-'],
    [labels.technicalCoords, mapaNatal?.lat != null ? `${mapaNatal.lat.toFixed(4)}°, ${mapaNatal.lon?.toFixed(4)}°` : '-'],
  ].forEach(([label, valor]) => {
    novaPageSeNecessario(10)
    doc.setTextColor(...MUTED)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(sanitizarTextoPdf(label), L + PAD, y)
    doc.setTextColor(...BRANCO)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    wrapPdfText(doc, String(valor), TEXT_W - 40).forEach((l, idx) => {
      doc.text(l, L + 42, y + idx * 5)
    })
    y += 8
  })

  // ── Mandala astrológica (última secção) ──
  if (mandalaPng) {
    doc.addPage()
    doc.setFillColor(...ESCURO)
    doc.rect(0, 0, 210, 297, 'F')
    y = 20
    secaoTitulo(doc, y, labels.mandala, DOURADO, ROXO, L, W)
    y += 12
    const { adicionarMandalaAoPdf } = await import('../lib/mandalaPdf.js')
    await adicionarMandalaAoPdf(doc, mandalaPng, { L, W, yStart: y, pageBottom: PAGE_BOTTOM, ESCURO })
  }

  const totalPaginas = doc.getNumberOfPages()
  const dateLocale = lang === 'pt' ? 'pt-PT' : lang === 'en' ? 'en-GB' : `${lang}-${lang.toUpperCase()}`
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.setFillColor(11, 7, 30)
    doc.rect(0, 287, 210, 10, 'F')
    doc.setDrawColor(...DOURADO)
    doc.setLineWidth(0.2)
    doc.line(L, 287, 210 - L, 287)
    doc.setTextColor(...MUTED)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    const footerLine = `Sidus Astro · ${sanitizarTextoPdf(dados.nome || '')} · Tropical Placidus · ${new Date().toLocaleDateString(dateLocale)} · ${labels.pageLabel} ${i}/${totalPaginas}`
    doc.text(footerLine, 105, 290, { align: 'center' })
    doc.setFontSize(5.5)
    wrapPdfText(doc, copyright, W).forEach((line, idx) => {
      doc.text(line, 105, 293.5 + idx * 2.6, { align: 'center' })
    })
  }

  doc.save(`Sidus_MapaNatal_${(dados.nome || 'perfil').replace(/\s+/g, '_')}.pdf`)
}

function secaoTitulo(doc, y, texto, DOURADO, ROXO, L, W) {
  doc.setFillColor(...ROXO)
  doc.rect(L, y, W, 9, 'F')
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.3)
  doc.rect(L, y, W, 9, 'S')
  doc.setTextColor(...DOURADO)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  const linhas = wrapPdfText(doc, texto, W - 8)
  doc.text(linhas[0] || '', L + 4, y + 6)
}

function formatarData(iso) {
  if (!iso) return '-'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}
