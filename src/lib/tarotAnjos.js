/** Mensagens dos anjos por Arcano - tom profissional, astrologia + tarot. */
const ANJOS_PT = {
  0: 'Os anjos convidam-te a dar o primeiro passo com confiança. A Lua testemunha a tua coragem - o Universo apoia quem ousa com pureza de intenção.',
  1: 'Miguel alinha os teus recursos: tens poder de manifestação. Usa-o com ética, como um astrólogo usa o mapa - com precisão e respeito pelo destino.',
  2: 'Gabriel sussurra através da intuição. Antes de agir, escuta o silêncio. A resposta que buscas já está escrita nas tuas emoções profundas.',
  3: 'Haniel abençoa a fertilidade deste ciclo - criativo, afectivo ou material. Nutre o que plantaste; a abundância cresce com paciência consciente.',
  4: 'Zadkiel pede estrutura e liderança amorosa. Estabelece limites que protejam, não que aprisionem. A autoridade verdadeira serve o bem comum.',
  5: 'Raziel traz ensinamento ancestral. Honra a tradição, mas deixa espaço para a tua verdade espiritual emergir com maturidade.',
  6: 'Anael ilumina o caminho do coração. Uma escolha amorosa define este momento - escolhe com alma, não só com medo ou hábito.',
  7: 'Camael fortalece a tua vontade. Avança com foco, mas lembra-te: a vitória duradoura inclui quem caminha contigo.',
  8: 'Ariel recorda que a força maior é gentil. Domina os impulsos com compaixão; o teu mapa natal pede coragem emocional, não dureza.',
  9: 'Cassiel guia o recolhimento necessário. Na pausa encontras a lanterna que faltava - a sabedoria nasce quando o ruído cessa.',
  10: 'Metatron anuncia viragem de ciclo. Aceita a mudança como portal, não como perda. O céu move-se a teu favor quando cooperas.',
  11: 'Raguel restaura o equilíbrio kármico. Age com integridade; o que enviares ao Universo regressa com clareza justa.',
  12: 'Sachiel pede perspectiva nova. O sacrifício consciente de hoje abre uma visão que ontem era impossível.',
  13: 'Azrael acompanha uma morte simbólica necessária. Deixa ir o velho com gratidão - renascer exige espaço interior.',
  14: 'Jophiel pede moderação e arte. A alquimia deste momento está no meio-termo sábio, não nos extremos.',
  15: 'Os anjos pedem que nomeies o que te prende. A libertação começa quando reconheces a corrente - ela é mais fraca do que parece.',
  16: 'Uriel avisa: o que cai construía sobre areia. Reconstrói com verdade. A torre que ruí agora poupa-te anos de ilusão.',
  17: 'Haniel envia cura e esperança. Mantém fé mesmo na escuridão - a estrela guia quem não desiste de si.',
  18: 'Gabriel fala pelos sonhos e pela intuição. Nem tudo é o que parece; discernimento é o teu escudo esta semana.',
  19: 'Raziel traz luz e clareza solar. Celebra quem és sem pedir permissão - a alegria autêntica é medicina para o mapa.',
  20: 'Metatron chama ao despertar. Perdoa o passado e responde ao propósito maior que te convoca agora.',
  21: 'Os anjos celebram um ciclo completo. Integra o que aprendeste e prepara o próximo vóo - estás pronto/a para mais.',
}

const ANJOS_EN = {
  0: 'The angels invite a first step in faith. The Moon witnesses your courage - the Universe supports pure intention.',
  1: 'Michael aligns your resources: you have power to manifest. Use it ethically, as an astrologer reads a chart - with precision and respect.',
  2: 'Gabriel whispers through intuition. Before acting, listen to silence. The answer lives in your deeper emotions.',
  3: 'Haniel blesses this fertile cycle - creative, emotional or material. Nurture what you planted; abundance grows with conscious patience.',
  4: 'Zadkiel asks for loving structure. Set boundaries that protect, not imprison. True authority serves the greater good.',
  5: 'Raziel brings ancestral teaching. Honour tradition, yet leave room for your spiritual truth to mature.',
  6: 'Anael lights the path of the heart. A loving choice defines this moment - choose with soul, not only habit or fear.',
  7: 'Camael strengthens your will. Advance with focus, yet remember: lasting victory includes those who walk with you.',
  8: 'Ariel reminds that the greatest strength is gentle. Master impulses with compassion; your chart asks for emotional courage.',
  9: 'Cassiel guides necessary withdrawal. In pause you find the missing lantern - wisdom is born when noise ceases.',
  10: 'Metatron announces a cycle turning. Accept change as a portal, not a loss. The sky moves in your favour when you cooperate.',
  11: 'Raguel restores karmic balance. Act with integrity; what you send to the Universe returns with fair clarity.',
  12: 'Sachiel asks for a new perspective. Today\'s conscious sacrifice opens a view that yesterday was impossible.',
  13: 'Azrael accompanies a necessary symbolic death. Release the old with gratitude - rebirth needs inner space.',
  14: 'Jophiel asks for moderation and art. This moment\'s alchemy lives in wise middle ground, not extremes.',
  15: 'The angels ask you to name what binds you. Freedom begins when you see the chain - it is weaker than it seems.',
  16: 'Uriel warns: what falls was built on sand. Rebuild with truth. The tower that crumbles now saves you years of illusion.',
  17: 'Haniel sends healing and hope. Keep faith in darkness - the star guides those who do not abandon themselves.',
  18: 'Gabriel speaks through dreams and intuition. Not all is as it seems; discernment is your shield this week.',
  19: 'Raziel brings solar light and clarity. Celebrate who you are without asking permission - authentic joy heals the chart.',
  20: 'Metatron calls you to awakening. Forgive the past and answer the greater purpose summoning you now.',
  21: 'The angels celebrate a completed cycle. Integrate what you learned and prepare the next flight - you are ready for more.',
}

export function gerarMensagemAnjos(cartas, mapaNatal, lang = 'pt') {
  if (!cartas?.length) return ''
  const dict = lang === 'en' ? ANJOS_EN : ANJOS_PT
  const principal = cartas[0]
  const base = dict[principal.id] || dict[0]

  const lua = mapaNatal?.lunar?.nome
  const prefix = lang === 'en'
    ? (lua ? `Through your Moon in ${lua}, ` : '')
    : (lua ? `Através da tua Lua em ${lua}, ` : '')

  if (cartas.length === 1) {
    const inv = principal.invertida
      ? (lang === 'en'
        ? ' The angels ask for inner review before acting.'
        : ' Os anjos pedem revisão interior antes de agires.')
      : ''
    return `${prefix}${base}${inv}`
  }

  const fechamento = lang === 'en'
    ? ` The angelic message weaves ${cartas.length} cards: trust the sequence from ${cartas[0].nome} to ${cartas[cartas.length - 1].nome} as a guided path.`
    : ` A mensagem angélica entrelaça ${cartas.length} cartas: confia na sequência de ${cartas[0].nome} a ${cartas[cartas.length - 1].nome} como caminho guiado.`

  return `${prefix}${base}${fechamento}`
}
