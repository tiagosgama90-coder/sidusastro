/**
 * Gerador de PDF do Mapa Astral Completo - Sidus
 * Layout tipo documento Word: margens fixas, texto justificado a esquerda.
 */

import { gerarAnaliseCompleta } from '../lib/mapaInterpretacao.js'
import { sidusLogoParaPdf, SIDUS_COPYRIGHT_PT, SIDUS_COPYRIGHT_EN } from '../lib/sidusLogoPdf.js'
import { getPdfLabels } from '../lib/pdfLabels.js'
import {
  wrapPdfText,
  alturaTextoPdf,
  sanitizarTextoPdf,
  escreverLinhasJustificadas,
  escreverParagrafoJustificado,
} from '../lib/pdfTextWrap.js'

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

  const L = 18
  const R = 18
  const W = 210 - L - R
  const CX = 105
  const TEXT_X = L
  const TEXT_W = W
  const PAGE_TOP = 20
  const PAGE_BOTTOM = 278
  const LINE_H = 4.8

  const DOURADO = [223, 183, 108]
  const BRANCO  = [255, 255, 255]
  const ESCURO  = [11, 7, 30]
  const ROXO    = [28, 16, 58]
  const MUTED   = [160, 140, 200]
  const VERDE   = [52, 211, 153]
  const LARANJA = [251, 146, 60]
  const AZUL    = [147, 197, 253]
  const LILAS   = [129, 140, 248]

  const yRef = { value: PAGE_TOP }

  const novaPagina = () => {
    doc.addPage()
    doc.setFillColor(...ESCURO)
    doc.rect(0, 0, 210, 297, 'F')
    yRef.value = PAGE_TOP
  }

  const caberNaPagina = (alturaNecessaria) => {
    if (yRef.value + alturaNecessaria > PAGE_BOTTOM) novaPagina()
  }

  const onNewPage = () => novaPagina()

  doc.setFillColor(...ESCURO)
  doc.rect(0, 0, 210, 297, 'F')

  doc.setFillColor(...ROXO)
  doc.rect(0, 0, 210, 58, 'F')
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.5)
  doc.line(L, 58, 210 - L, 58)

  if (logoData) {
    doc.addImage(logoData, 'PNG', CX - 7, 7, 14, 14)
  }

  doc.setTextColor(...DOURADO)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text(labels.headerTitle, CX, 26, { align: 'center' })

  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.setFont('helvetica', 'normal')
  doc.text(sanitizarTextoPdf(labels.headerSubtitle), CX, 32, { align: 'center', maxWidth: TEXT_W })
  doc.text(sanitizarTextoPdf(labels.headerTagline), CX, 36, { align: 'center', maxWidth: TEXT_W })

  doc.setFontSize(6.5)
  let hy = 41
  wrapPdfText(doc, copyright, TEXT_W).forEach((line) => {
    doc.text(line, CX, hy, { align: 'center' })
    hy += 3.2
  })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(...BRANCO)
  doc.text(sanitizarTextoPdf(dados.nome || ''), CX, 50, { align: 'center', maxWidth: TEXT_W })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  const localDt = [
    formatarData(dados.data),
    dados.hora ? `${labels.atTime} ${dados.hora}` : '',
    dados.cidade ? `- ${dados.cidade}` : '',
  ].filter(Boolean).join(' ')
  doc.text(sanitizarTextoPdf(localDt), CX, 55, { align: 'center', maxWidth: TEXT_W })

  yRef.value = 68

  yRef.value = secaoTitulo(doc, yRef.value, labels.fourPillars, DOURADO, ROXO, L, W, TEXT_X, TEXT_W)
  yRef.value += 4

  const pilares = [
    { label: labels.labels.sun, valor: mapaNatal?.solar?.nome || '-', grau: mapaNatal?.solar?.graus },
    { label: labels.labels.moon, valor: mapaNatal?.lunar?.nome || '-', grau: mapaNatal?.lunar?.graus },
    { label: labels.labels.asc, valor: mapaNatal?.ascendente?.nome || '-', grau: mapaNatal?.ascendente?.graus },
    { label: labels.labels.desc, valor: mapaNatal?.descendente?.nome || '-', grau: mapaNatal?.descendente?.graus },
    { label: labels.labels.mc, valor: mapaNatal?.mc?.nome || '-', grau: mapaNatal?.mc?.graus },
  ]

  pilares.forEach((p, i) => {
    const col = i % 2
    const boxW = W / 2 - 2
    const x = L + col * (W / 2 + 2)
    if (col === 0 && i > 0) yRef.value += 22
    caberNaPagina(20)
    doc.setFillColor(28, 16, 58)
    doc.roundedRect(x, yRef.value, boxW, 18, 3, 3, 'F')
    doc.setDrawColor(...DOURADO)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, yRef.value, boxW, 18, 3, 3, 'S')
    doc.setTextColor(...MUTED)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text(sanitizarTextoPdf(p.label.toUpperCase()), x + 5, yRef.value + 7)
    doc.setTextColor(...BRANCO)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(sanitizarTextoPdf(p.valor), x + 13, yRef.value + 14)
    if (p.grau != null) {
      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      doc.text(`${p.grau}°`, x + boxW - 12, yRef.value + 14)
    }
  })
  yRef.value += 26

  for (const sec of (analiseFinal?.seccoes || [])) {
    caberNaPagina(22)
    yRef.value = secaoTitulo(doc, yRef.value, `>> ${sec.id}. ${sanitizarTextoPdf(sec.titulo || '').toUpperCase()}`, DOURADO, ROXO, L, W, TEXT_X, TEXT_W)
    yRef.value += 4

    for (const bloco of (sec.blocos || [])) {
      const subtitulo = sanitizarTextoPdf(bloco?.subtitulo || '')
      const meta = bloco?.meta ? sanitizarTextoPdf(bloco.meta) : ''
      const texto = sanitizarTextoPdf(bloco?.texto || '')

      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DOURADO)
      const tituloLinhas = subtitulo ? wrapPdfText(doc, subtitulo, TEXT_W) : []
      escreverLinhasJustificadas(doc, tituloLinhas, TEXT_X, TEXT_W, yRef, PAGE_BOTTOM, LINE_H, onNewPage)

      if (meta) {
        doc.setTextColor(...MUTED)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        const metaLinhas = wrapPdfText(doc, meta, TEXT_W)
        escreverLinhasJustificadas(doc, metaLinhas, TEXT_X, TEXT_W, yRef, PAGE_BOTTOM, LINE_H, onNewPage)
      }

      yRef.value += 2
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...BRANCO)
      if (texto) {
        escreverParagrafoJustificado(doc, texto, TEXT_X, TEXT_W, yRef, PAGE_BOTTOM, LINE_H, onNewPage)
      }
      yRef.value += 3
    }
    yRef.value += 4
  }

  caberNaPagina(22)
  yRef.value = secaoTitulo(doc, yRef.value, labels.positions, DOURADO, ROXO, L, W, TEXT_X, TEXT_W)
  yRef.value += 4

  if (planetas.length > 0) {
    planetas.forEach((pl, i) => {
      caberNaPagina(12)
      const col = i % 2
      const boxW = W / 2 - 2
      const x = L + col * (W / 2 + 2)
      if (col === 0 && i > 0) yRef.value += 11
      doc.setFillColor(20, 12, 45)
      doc.roundedRect(x, yRef.value, boxW, 10, 2, 2, 'F')
      doc.setTextColor(...DOURADO)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(sanitizarTextoPdf(`${pl.simbolo || ''} ${pl.nome || ''}`.trim()), x + 4, yRef.value + 7)
      doc.setTextColor(...BRANCO)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      const signoCasa = sanitizarTextoPdf(`${pl.signo?.nome || '-'}${pl.casa ? ` · C${pl.casa}` : ''}`)
      doc.text(signoCasa, x + 28, yRef.value + 7, { maxWidth: boxW - 32 })
      doc.setTextColor(...MUTED)
      doc.text(`${(pl.longitude ?? 0).toFixed(1)}°${pl.retrograde ? ' R' : ''}`, x + boxW - 18, yRef.value + 7)
    })
    yRef.value += 16
  }

  caberNaPagina(50)
  yRef.value = secaoTitulo(doc, yRef.value, labels.elements, DOURADO, ROXO, L, W, TEXT_X, TEXT_W)
  yRef.value += 4

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
      caberNaPagina(13)
      const count = balEl[key] || 0
      const pct = total > 0 ? count / total : 0
      doc.setTextColor(...BRANCO)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text(sanitizarTextoPdf(`${label}  ${count}/${total}`), TEXT_X, yRef.value + 5)
      doc.setFillColor(255, 255, 255, 0.06)
      doc.roundedRect(TEXT_X, yRef.value + 7, TEXT_W, 3.5, 1, 1, 'F')
      if (pct > 0) {
        doc.setFillColor(...cor)
        doc.roundedRect(TEXT_X, yRef.value + 7, TEXT_W * pct, 3.5, 1, 1, 'F')
      }
      yRef.value += 13
    })
  }

  caberNaPagina(35)
  yRef.value = secaoTitulo(doc, yRef.value, labels.technical, DOURADO, ROXO, L, W, TEXT_X, TEXT_W)
  yRef.value += 4

  ;[
    [labels.technicalSystem, labels.technicalSystemVal],
    [labels.technicalUt, mapaNatal?.instanteUTC ? mapaNatal.instanteUTC.replace('T', ' ').slice(0, 16) + ' UTC' : '-'],
    [labels.technicalCoords, mapaNatal?.lat != null ? `${mapaNatal.lat.toFixed(4)}°, ${mapaNatal.lon?.toFixed(4)}°` : '-'],
  ].forEach(([label, valor]) => {
    caberNaPagina(12)
    doc.setTextColor(...MUTED)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text(sanitizarTextoPdf(label), TEXT_X, yRef.value)
    doc.setTextColor(...BRANCO)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    const valorLinhas = wrapPdfText(doc, String(valor), TEXT_W - 38)
    valorLinhas.forEach((l, idx) => {
      if (yRef.value + LINE_H > PAGE_BOTTOM) novaPagina()
      const ultima = idx === valorLinhas.length - 1
      try {
        doc.text(l, TEXT_X + 38, yRef.value, {
          align: ultima ? 'left' : 'justify',
          maxWidth: TEXT_W - 38,
        })
      } catch {
        doc.text(l, TEXT_X + 38, yRef.value, { align: 'left', maxWidth: TEXT_W - 38 })
      }
      yRef.value += LINE_H
    })
    yRef.value += 2
  })

  if (mandalaPng) {
    try {
      novaPagina()
      yRef.value = secaoTitulo(doc, yRef.value, labels.mandala, DOURADO, ROXO, L, W, TEXT_X, TEXT_W)
      yRef.value += 6
      const { adicionarMandalaAoPdf } = await import('../lib/mandalaPdf.js')
      await adicionarMandalaAoPdf(doc, mandalaPng, { L, W, yStart: yRef.value, pageBottom: PAGE_BOTTOM, ESCURO })
    } catch (e) {
      console.warn('[Sidus] Mandala PDF section skipped:', e?.message)
    }
  }

  const totalPaginas = doc.getNumberOfPages()
  const dateLocales = { pt: 'pt-PT', en: 'en-GB', es: 'es-ES', de: 'de-DE', fr: 'fr-FR', it: 'it-IT' }
  const dateLocale = dateLocales[lang] || 'en-GB'
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.setFillColor(11, 7, 30)
    doc.rect(0, 285, 210, 12, 'F')
    doc.setDrawColor(...DOURADO)
    doc.setLineWidth(0.2)
    doc.line(L, 285, 210 - L, 285)
    doc.setTextColor(...MUTED)
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    const footerLine = `Sidus Astro · ${sanitizarTextoPdf(dados.nome || '')} · Tropical Placidus · ${new Date().toLocaleDateString(dateLocale)} · ${labels.pageLabel} ${i}/${totalPaginas}`
    doc.text(footerLine, CX, 289, { align: 'center', maxWidth: TEXT_W })
    doc.setFontSize(5.5)
    wrapPdfText(doc, copyright, TEXT_W).forEach((line, idx) => {
      doc.text(line, CX, 292 + idx * 2.4, { align: 'center' })
    })
  }

  doc.save(`Sidus_MapaNatal_${(dados.nome || 'perfil').replace(/\s+/g, '_')}.pdf`)
}

function secaoTitulo(doc, y, texto, DOURADO, ROXO, L, W, textX, textW) {
  doc.setFillColor(...ROXO)
  doc.rect(L, y, W, 9, 'F')
  doc.setDrawColor(...DOURADO)
  doc.setLineWidth(0.3)
  doc.rect(L, y, W, 9, 'S')
  doc.setTextColor(...DOURADO)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  const linhas = wrapPdfText(doc, texto, textW - 4)
  doc.text(linhas[0] || '', textX + 2, y + 6)
  return y + 11
}

function formatarData(iso) {
  if (!iso) return '-'
  const [a, m, d] = iso.split('-')
  return `${d}/${m}/${a}`
}
