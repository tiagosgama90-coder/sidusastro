/**
 * Gerador de PDF do Mapa Astral Completo com jsPDF.
 * Uso: await gerarPdfMapaAstral(mapaNatal, dados, planetas)
 */

export async function gerarPdfMapaAstral(mapaNatal, dados, planetas = []) {
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const L = 20   // margin left
  const W = 170  // usable width
  let y = 20     // cursor y

  // ── Cores (aproximações PDF) ─────────────────────────────────────────────
  const DOURADO = [223, 183, 108]
  const BRANCO  = [255, 255, 255]
  const ESCURO  = [11, 7, 30]
  const ROXO    = [28, 16, 58]
  const MUTED   = [160, 140, 200]

  // ── Fundo ────────────────────────────────────────────────────────────────
  doc.setFillColor(...ESCURO)
  doc.rect(0, 0, 210, 297, 'F')

  // ── Cabeçalho ────────────────────────────────────────────────────────────
  doc.setFillColor(...ROXO)
  doc.rect(0, 0, 210, 45, 'F')

  doc.setTextColor(...DOURADO)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text('✦ SIDUS', 105, 18, { align: 'center' })

  doc.setFontSize(11)
  doc.setTextColor(...MUTED)
  doc.text('Mapa Astral Natal Completo', 105, 26, { align: 'center' })

  doc.setFontSize(10)
  doc.setTextColor(...BRANCO)
  doc.text(`${dados.nome}`, 105, 34, { align: 'center' })
  doc.setTextColor(...MUTED)
  doc.text(`${dados.data || ''}  ${dados.hora || ''}  ·  ${dados.cidade || ''}`, 105, 40, { align: 'center' })

  y = 55

  // ── Secção: Pilares Fundamentais ─────────────────────────────────────────
  secaoTitulo(doc, y, 'Pilares Fundamentais', DOURADO, ROXO, L, W)
  y += 10

  const pilares = [
    { icon: '☀', label: 'Signo Solar',    valor: mapaNatal?.solar?.nome || '—', grau: mapaNatal?.solar?.grau },
    { icon: '☽', label: 'Signo Lunar',    valor: mapaNatal?.lunar?.nome || '—', grau: mapaNatal?.lunar?.grau },
    { icon: '↑', label: 'Ascendente',     valor: mapaNatal?.ascendente?.nome || '—', grau: mapaNatal?.ascendente?.grau },
    { icon: '⊕', label: 'Meio do Céu',   valor: mapaNatal?.mc?.nome || '—', grau: mapaNatal?.mc?.grau },
  ]

  pilares.forEach((p, i) => {
    const x = L + (i % 2) * (W / 2)
    if (i % 2 === 0 && i > 0) y += 20
    doc.setFillColor(28, 16, 58)
    doc.roundedRect(x, y, W / 2 - 4, 16, 3, 3, 'F')
    doc.setDrawColor(...DOURADO)
    doc.setLineWidth(0.3)
    doc.roundedRect(x, y, W / 2 - 4, 16, 3, 3, 'S')

    doc.setTextColor(...DOURADO)
    doc.setFontSize(9)
    doc.text(p.icon, x + 5, y + 7)
    doc.setTextColor(...MUTED)
    doc.setFontSize(7)
    doc.text(p.label, x + 12, y + 6)
    doc.setTextColor(...BRANCO)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(p.valor, x + 12, y + 13)
    if (p.grau != null) {
      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      doc.text(`${p.grau.toFixed(1)}°`, x + W / 2 - 16, y + 13)
    }
  })
  y += 26

  // ── Secção: Posições Planetárias ─────────────────────────────────────────
  if (planetas.length > 0) {
    secaoTitulo(doc, y, 'Posições Planetárias', DOURADO, ROXO, L, W)
    y += 10

    planetas.forEach((pl, i) => {
      if (y > 260) { doc.addPage(); y = 20; doc.setFillColor(...ESCURO); doc.rect(0, 0, 210, 297, 'F') }
      const x = L + (i % 2) * (W / 2)
      if (i % 2 === 0 && i > 0) y += 10

      doc.setFillColor(20, 12, 45)
      doc.roundedRect(x, y, W / 2 - 4, 9, 2, 2, 'F')
      doc.setTextColor(...DOURADO)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text(pl.nome || pl.id || '?', x + 4, y + 6)
      doc.setTextColor(...BRANCO)
      doc.setFont('helvetica', 'normal')
      doc.text(pl.signo?.nome || '—', x + 30, y + 6)
      doc.setTextColor(...MUTED)
      doc.setFontSize(7)
      doc.text(`${(pl.longitude ?? 0).toFixed(1)}°${pl.retrogrado ? ' ℞' : ''}`, x + W / 2 - 22, y + 6)
    })
    y += 18
  }

  // ── Secção: Interpretação do Sol ─────────────────────────────────────────
  if (y > 240) { doc.addPage(); y = 20; doc.setFillColor(...ESCURO); doc.rect(0, 0, 210, 297, 'F') }
  secaoTitulo(doc, y, 'Interpretação do Signo Solar', DOURADO, ROXO, L, W)
  y += 10

  const interpretacaoSol = gerarInterpretacaoSol(mapaNatal?.solar?.nome)
  const linhasS = doc.splitTextToSize(interpretacaoSol, W - 4)
  doc.setTextColor(...BRANCO)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  linhasS.forEach(l => {
    if (y > 270) { doc.addPage(); y = 20; doc.setFillColor(...ESCURO); doc.rect(0, 0, 210, 297, 'F') }
    doc.text(l, L + 2, y)
    y += 5
  })
  y += 6

  // ── Secção: Interpretação Ascendente ─────────────────────────────────────
  if (y > 240) { doc.addPage(); y = 20; doc.setFillColor(...ESCURO); doc.rect(0, 0, 210, 297, 'F') }
  secaoTitulo(doc, y, 'Interpretação do Ascendente', DOURADO, ROXO, L, W)
  y += 10

  const interpretacaoAsc = gerarInterpretacaoAscendente(mapaNatal?.ascendente?.nome)
  const linhasA = doc.splitTextToSize(interpretacaoAsc, W - 4)
  doc.setTextColor(...BRANCO)
  doc.setFontSize(9)
  linhasA.forEach(l => {
    if (y > 270) { doc.addPage(); y = 20; doc.setFillColor(...ESCURO); doc.rect(0, 0, 210, 297, 'F') }
    doc.text(l, L + 2, y)
    y += 5
  })
  y += 6

  // ── Rodapé ────────────────────────────────────────────────────────────────
  const totalPaginas = doc.getNumberOfPages()
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    doc.setFillColor(11, 7, 30)
    doc.rect(0, 288, 210, 9, 'F')
    doc.setTextColor(...MUTED)
    doc.setFontSize(7)
    doc.text(`Sidus — Mapa Astral de ${dados.nome} · Gerado em ${new Date().toLocaleDateString('pt-PT')} · Pág. ${i}/${totalPaginas}`, 105, 293, { align: 'center' })
  }

  doc.save(`Sidus_MapaNatal_${dados.nome?.replace(/\s+/g, '_') || 'perfil'}.pdf`)
}

function secaoTitulo(doc, y, texto, DOURADO, ROXO, L, W) {
  doc.setFillColor(...ROXO)
  doc.rect(L, y, W, 8, 'F')
  doc.setTextColor(...DOURADO)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.text(texto.toUpperCase(), L + 4, y + 5.5)
}

function gerarInterpretacaoSol(signo) {
  const interp = {
    'Áries':      'Com o Sol em Áries, és uma alma pioneira e corajosa. A tua energia é vital e directa — preferes a acção à contemplação. Nasceste com uma missão de iniciar, de abrir caminho onde antes não havia nenhum. A tua autenticidade é a tua maior força, mas aprender a ouvir antes de agir aprofundará todas as tuas relações.',
    'Touro':      'O Sol em Touro confere-te uma natureza sólida, paciente e profundamente conectada aos prazeres da vida. Valorizas a estabilidade e a beleza, e tens um talento natural para construir coisas que durem. A tua teimosia é, na verdade, perseverança — quando decides algo, completás-lo.',
    'Gémeos':     'Com o Sol em Gémeos, a tua mente é o teu instrumento mais poderoso. Tens uma curiosidade insaciável e uma capacidade única de ver múltiplas perspectivas ao mesmo tempo. A comunicação é o teu dom. Nos momentos de dispersão, lembra que a profundidade é tão valiosa quanto a variedade.',
    'Caranguejo': 'O Sol em Caranguejo faz de ti uma alma profundamente intuitiva e nutrida pelo amor. A família e o lar são o teu universo. Tens uma memória emocional extraordinária e uma capacidade de sentir o que os outros ocultam. A tua missão é criar espaços de segurança para quem amas.',
    'Leão':       'O Sol em Leão — o signo do próprio Sol — dá-te uma presença luminosa e magnética. Tens um coração generoso e uma criatividade que precisa de se expressar. Nasceste para liderar, para inspirar, para brilhar. A verdadeira coragem não está em suprimir os teus medos, mas em agir apesar deles.',
    'Virgem':     'Com o Sol em Virgem, tens uma mente analítica e um senso de serviço notável. Percebes detalhes que os outros ignoram e tens um talento natural para melhorar sistemas e processos. A tua missão é trazer ordem ao caos, mas lembra-te: a perfeição é inimiga do bem.',
    'Balança':    'O Sol em Balança confere-te um dom natural para a harmonia, a justiça e a beleza. És diplomático, equilibrado e profundamente consciente das relações. Tens a capacidade rara de ver todas as perspectivas. A tua missão é construir pontes entre mundos aparentemente opostos.',
    'Escorpião':  'Com o Sol em Escorpião, a tua profundidade é incomum. Não te contentas com o superficial — precisas de chegar à verdade essencial das coisas. Tens uma intensidade magnética e uma capacidade de transformação que poucas almas possuem. Cada fim na tua vida é o prenúncio de um renascimento mais poderoso.',
    'Sagitário':  'O Sol em Sagitário acende em ti uma chama de liberdade, aventura e busca de verdade. És um filósofo do quotidiano — precisas de sentido mais do que de conforto. A tua missão é expandir horizontes, teus e dos outros, através da experiência directa da vida.',
    'Capricórnio':'Com o Sol em Capricórnio, trazes a força da montanha: lenta mas inesgotável. Tens uma ambição disciplinada e uma maturidade que transcende a tua idade. O teu legado é construído tijolo a tijolo, com paciência e determinação. O sucesso material é apenas uma expressão do teu domínio interior.',
    'Aquário':    'O Sol em Aquário faz de ti um visionário e um agente de mudança. Pensas no futuro, nas possibilidades que ainda não existem. Tens um amor genuíno pela humanidade e uma mente que desafia convenções. A tua missão é criar o amanhã que o mundo ainda não sabe que precisa.',
    'Peixes':     'Com o Sol em Peixes, a tua alma é uma porta aberta ao invisível. Tens uma empatia oceânica e uma conexão com dimensões que a maioria não percebe. A tua criatividade e espiritualidade são dons raros. A tua missão é ser uma ponte entre o mundo dos sonhos e o mundo dos homens.',
  }
  return interp[signo] || `O Signo Solar ${signo || 'desconhecido'} confere uma identidade única e valiosa. Cada signo é um arquétipo que carrega a sabedoria acumulada de milénios de observação do cosmos.`
}

function gerarInterpretacaoAscendente(signo) {
  const interp = {
    'Áries':      'Com o Ascendente em Áries, a tua presença no mundo é enérgica, directa e impossível de ignorar. As pessoas sentem a tua vitalidade antes mesmo de te conhecerem. Tens uma abordagem pioneira à vida — enfrentas desafios de frente, sem hesitar.',
    'Touro':      'O Ascendente em Touro dá-te uma presença sólida, tranquila e de confiança. As pessoas percebem-te como alguém estável e digno de confiança. Tens um charme natural e um estilo que reflecte elegância sem esforço.',
    'Gémeos':     'Com o Ascendente em Gémeos, és percebido como alguém vivaz, curioso e comunicativo. A tua mente rápida e o teu humor tornam-te magnético nas interacções sociais. Adaptas-te a qualquer ambiente com facilidade.',
    'Caranguejo': 'O Ascendente em Caranguejo confere-te uma presença calorosa e acolhedora. As pessoas sentem-te como alguém seguro e empático. Tens uma capacidade instintiva de perceber as necessidades emocionais dos outros.',
    'Leão':       'Com o Ascendente em Leão, entras numa sala e ela sente a tua presença. Tens um porte natural de liderança e uma generosidade que inspira. O teu estilo é dramático e criativo — não para chamar atenção, mas porque é assim que a vida flui em ti.',
    'Virgem':     'O Ascendente em Virgem projeta uma imagem de competência, atenção ao detalhe e humildade genuína. Es visto como alguém prático e de confiança. Tens uma observação aguda do ambiente à tua volta.',
    'Balança':    'Com o Ascendente em Balança, a tua presença é harmoniosa e refinada. Es percebido como justo, charmoso e diplomaticamente hábil. A beleza e o equilíbrio seguem-te naturalmente.',
    'Escorpião':  'O Ascendente em Escorpião confere-te uma presença intensa e magnética. Há algo nos teus olhos que as pessoas sentem mas não conseguem definir — uma profundidade que fascina e intimida em simultâneo.',
    'Sagitário':  'Com o Ascendente em Sagitário, irradias entusiasmo e optimismo. Es visto como alguém aventureiro, filosófico e inspirador. A tua abordagem à vida é expansiva — cada dia é uma nova descoberta.',
    'Capricórnio':'O Ascendente em Capricórnio projeta autoridade e seriedade. Podes parecer mais formal ao primeiro encontro, mas a tua fiabilidade e determinação ganham respeito profundo ao longo do tempo.',
    'Aquário':    'Com o Ascendente em Aquário, és visto como singular, progressista e ligeiramente enigmático. As pessoas percebem em ti alguém que pensa de forma diferente — e isso atrai quem busca perspectivas novas.',
    'Peixes':     'O Ascendente em Peixes confere-te uma presença etérea e compassiva. Há uma suavidade na tua forma de te mover no mundo que as pessoas encontram profundamente reconfortante.',
  }
  return interp[signo] || `O Ascendente em ${signo || 'desconhecido'} define a máscara que mostras ao mundo e a forma como inicias cada nova etapa da tua vida.`
}
