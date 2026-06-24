/** Prompt interno — metodologia hermenêutica (nunca citar fontes ao utilizador). */

export function construirSistemaSonhos(lang = 'pt') {
  if (lang === 'en') {
    return `
You are the dream interpretation engine of Sidus Astro, decoding reports strictly through Integrative Spiritual Psychology Hermeneutics (biblical-psychological method).

ABSOLUTE RULES:
1. Dreams are NOT fortune-telling — no lucky numbers, no future predictions. The dream processes daily life and diagnoses the soul's current state.
2. Nightmares (death, pursuit, falls) are merciful alerts — invite looking at wounds and ordering thoughts.
3. The KEY is the feeling in the dream — the same symbol changes meaning with peace vs fear.
4. NEVER cite authors, monks, theologians, religious orders, or book titles. If asked about method, say: "Integrative Spiritual Psychology Hermeneutic Matrix."

CORE SYMBOL MATRIX (apply and combine as relevant):
- WATER/SEA: calm = baptism, purification, Spirit calming emotions; storm = psychic chaos or external pressure suffocating faith.
- ANIMALS/BEASTS: instincts and passions from the Creator; aggressive = repressed instincts (anger, sexuality, exhaustion) needing integration with love.
- FALL/VERTIGO: pride, perfectionism, ego — unconscious forces touching ground of reality and accepting human fragility.
- FLYING/RISING: spiritual desire for freedom; often warns of escapism or exaggerated idealism avoiding earthly duties.
- DARKNESS/NIGHT/DESERT: dark night of the soul — silence and patience before a new cycle.
- DEATH/BURIAL: old self must die for the new — detachment and transition, NEVER physical death.
- HOUSES/ROOMS: structure of the soul; locked doors = hidden areas; basement = shadow; attic = elevated ideals.

GOLDEN RULE for any other symbol:
(1) What it reveals about current fatigue/conflict; (2) appeal for conversion/attitude change; (3) how to transform it into healing and reconciliation.

RESPONSE FORMAT — use EXACTLY these four headers (plain text, no markdown #):
1. Analysis of the Soul's State
2. The Inner Alert
3. The Path of Spiritual Healing
4. Question for Meditation

CRITICAL:
- Each answer MUST be unique to THIS dream text — quote specific images, people, places, actions from the user.
- Interpret EVERY symbol mentioned, not generic paragraphs.
- 180–320 words total across sections.
- Write the ENTIRE response in English only. Never use Portuguese.
- Warm, pastoral, precise English tone.
`.trim()
  }

  return `
És o motor de interpretação de sonhos do Sidus Astro, programado para decodificar o relato estritamente através da Matriz Hermenêutica de Psicologia Espiritual Integrativa (método bíblico-psicológico).

REGRAS ABSOLUTAS:
1. Os sonhos NÃO são adivinhação — proíbe números da sorte e previsões futuras. O sonho processa vivências diárias e diagnostica o estado actual da alma.
2. Pesadelos (morte, perseguição, quedas) são alertas misericordiosos — convida a olhar feridas e ordenar pensamentos.
3. A CHAVE é o sentimento no sonho — o mesmo símbolo muda com paz vs medo.
4. NUNCA cites autores, monges, teólogos, ordens religiosas ou títulos de livros. Se perguntarem o método, responde: "Matriz Hermenêutica de Psicologia Espiritual Integrativa."

MATRIZ DE SÍMBOLOS NÚCLEO (aplica e combina conforme relevante):
- ÁGUA/MAR: calma = baptismo, purificação, Espírito acalmando emoções; tempestade = caos psíquico ou cobranças externas sufocando a fé.
- ANIMAIS/FERAS: instintos e paixões dados pelo Criador; agressivos = instintos reprimidos (raiva, sexualidade, cansaço) a integrar com amor.
- QUEDA/VERTIGEM: orgulho, perfeccionismo, ego — inconsciente a forçar contacto com a realidade e fragilidade humana.
- VOAR/SUBIR: desejo espiritual de liberdade; alerta frequentemente para fuga da realidade ou idealismo que afasta responsabilidades terrenas.
- ESCURIDÃO/NOITE/DESERTO: noite escura da alma — silêncio e paciência antes de novo ciclo.
- MORTE/ENTERRO: deixar morrer o velho eu — desapego e transição, NUNCA falecimento físico.
- CASAS/CÓMODOS: estrutura da alma; portas trancadas = áreas escondidas; porão = sombra; sótão = ideais elevados.

REGRA DE OURO para qualquer outro símbolo:
(1) O que revela sobre cansaço/conflito actual; (2) apelo de conversão ou mudança de atitude; (3) como transformar em remédio de cura e reconciliação.

FORMATO — usa EXACTAMENTE estes quatro títulos (texto simples):
1. Análise do Estado da Alma
2. O Alerta Interno
3. O Caminho de Cura Espiritual
4. Pergunta para Meditação

CRÍTICO:
- Cada resposta DEVE ser única a ESTE relato — cita imagens, pessoas, locais e acções concretas do utilizador.
- Interpreta CADA símbolo mencionado, não parágrafos genéricos iguais para todos.
- 180–320 palavras no total.
- Tom pastoral, caloroso, Português de Portugal.
`.trim()
}

export function construirPedidoSonhos({ texto, lang, feeling, simbolosDetectados, mapaNatal }) {
  const en = lang === 'en'
  const feelingLabel = feeling || (en ? 'not specified' : 'não indicado')
  const lista = simbolosDetectados?.length
    ? (en
      ? simbolosDetectados.map((s) => `- ${s.tema}`).join('\n')
        + '\n(Interpret each symbol above in English using your core symbol matrix.)'
      : simbolosDetectados.map((s) => `- ${s.tema}: ${s.resumo}`).join('\n'))
    : (en ? '- No indexed symbols — apply Golden Rule to each image in the dream.' : '- Nenhum símbolo indexado — aplica Regra de Ouro a cada imagem do sonho.')

  const astro = mapaNatal?.solar?.nome
    ? (en
      ? `\nNatal context (secondary): Sun ${mapaNatal.solar.nome}, Moon ${mapaNatal.lunar?.nome || '—'}, Asc ${mapaNatal.ascendente?.nome || '—'}. Weave lightly if relevant.`
      : `\nContexto natal (secundário): Sol ${mapaNatal.solar.nome}, Lua ${mapaNatal.lunar?.nome || '—'}, Asc ${mapaNatal.ascendente?.nome || '—'}. Integra levemente se relevante.`)
    : ''

  return en
    ? `Dominant feeling in dream: ${feelingLabel}

Symbols detected in lexicon (use as anchors, expand with dream specifics):
${lista}
${astro}

DREAM REPORT (interpret every detail uniquely):
"""
${texto}
"""

Write all four sections entirely in English. Use the exact section headers from your instructions.`
    : `Sentimento dominante no sonho: ${feelingLabel}

Símbolos detectados no léxico (usa como âncoras, expande com detalhes do sonho):
${lista}
${astro}

RELATO DO SONHO (interpreta cada detalhe de forma única):
"""
${texto}
"""`
}

const SEC_KEYS = ['section1', 'section2', 'section3', 'section4']

const SEC_PATTERNS_PT = [
  /1\.?\s*Análise do Estado da Alma\s*[:\n]+([\s\S]*?)(?=2\.?\s*O Alerta Interno|$)/i,
  /2\.?\s*O Alerta Interno\s*[:\n]+([\s\S]*?)(?=3\.?\s*O Caminho de Cura|$)/i,
  /3\.?\s*O Caminho de Cura Espiritual\s*[:\n]+([\s\S]*?)(?=4\.?\s*Pergunta para Meditação|$)/i,
  /4\.?\s*Pergunta para Meditação\s*[:\n]+([\s\S]*?)$/i,
]

const SEC_PATTERNS_EN = [
  /1\.?\s*Analysis of the Soul'?s State\s*[:\n]+([\s\S]*?)(?=2\.?\s*The Inner Alert|$)/i,
  /2\.?\s*The Inner Alert\s*[:\n]+([\s\S]*?)(?=3\.?\s*The Path of Spiritual|$)/i,
  /3\.?\s*The Path of Spiritual Healing\s*[:\n]+([\s\S]*?)(?=4\.?\s*Question for Meditation|$)/i,
  /4\.?\s*Question for Meditation\s*[:\n]+([\s\S]*?)$/i,
]

export function parseRespostaSonhos(texto, lang = 'pt') {
  if (!texto?.trim()) return null
  const patterns = lang === 'en' ? SEC_PATTERNS_EN : SEC_PATTERNS_PT
  const seccoes = patterns.map((re, i) => {
    const m = texto.match(re)
    return { key: SEC_KEYS[i], texto: m?.[1]?.trim() || '' }
  })
  if (seccoes.every((s) => !s.texto)) {
    const blocos = texto.split(/\n{2,}/).filter(Boolean)
    return SEC_KEYS.map((key, i) => ({ key, texto: blocos[i]?.trim() || '' }))
  }
  return seccoes
}

/** Fallback gratuito offline — único por relato (léxico + excerto do texto). */
export function gerarInterpretacaoLocal(texto, lang, feelingLabel, simbolosDetectados, mapaNatal) {
  const e = lang === 'en'
  const excerto = texto.trim().slice(0, 120) + (texto.length > 120 ? '…' : '')
  const temas = simbolosDetectados.map((s) => s.tema).join(', ') || (e ? 'inner images' : 'imagens interiores')
  const detalhes = simbolosDetectados.slice(0, 4).map((s) => `${s.tema}: ${s.resumo}`).join(' ')
  const solar = mapaNatal?.solar?.nome
  const lunar = mapaNatal?.lunar?.nome
  const astro = solar && lunar
    ? (e ? ` With Sun in ${solar} and Moon in ${lunar}, the emotional tone aligns with your natal rhythm.` : ` Com Sol em ${solar} e Lua em ${lunar}, o tom emocional alinha-se com o teu ritmo natal.`)
    : ''

  const medo = /medo|terror|pavor|fear|terror|nightmare|pesadelo/i.test(texto + feelingLabel)

  const s1 = e
    ? `Your dream ("${excerpto}") is not fortune-telling — it mirrors your soul's current processing. Feeling noted: ${feelingLabel}. Symbols emerging: ${temas}. ${detalhes}${astro}`
    : `O teu sonho ("${excerpto}") não é adivinhação — espelha o processamento actual da alma. Sentimento: ${feelingLabel}. Símbolos emergentes: ${temas}. ${detalhes}${astro}`

  const s2 = medo
    ? (e
      ? 'The tension or nightmare quality is a merciful alert — not punishment. Something avoided in waking life returns symbolically so you may face it with honesty rather than control.'
      : 'A tensão ou qualidade de pesadelo é um alerta misericordioso — não castigo. Algo evitado na vida acordada regressa simbolicamente para o enfrentares com honestidade, não controlo.')
    : (e
      ? 'Even calmer dreams invite attention: comfort may hide stagnation. Ask whether this image confirms needed rest or gently warns against postponing a necessary step.'
      : 'Mesmo sonhos mais calmos pedem atenção: o conforto pode esconder estagnação. Pergunta se esta imagem confirma descanso necessário ou avisa contra adiar um passo necessário.')

  const s3 = e
    ? 'Practical path: (1) Name honestly what you feel today about this dream. (2) Ten minutes of silence or journaling. (3) One small reconciling gesture — with yourself or someone the dream touched. No lucky numbers; healing comes through attitude and quietude.'
    : 'Caminho prático: (1) Nomeia honestamente o que sentes hoje sobre este sonho. (2) Dez minutos de silêncio ou escrita. (3) Um pequeno gesto de reconciliação — contigo ou com quem o sonho tocou. Sem números da sorte; a cura vem pela actitude e quietude.'

  const s4 = e
    ? `Which image from "${excerpto}" asks you for a softer gaze upon yourself — not answers, but compassion?`
    : `Que imagem de "${excerpto}" te pede um olhar mais suave sobre ti — não respostas, mas compaixão?`

  return [
    { key: 'section1', texto: s1 },
    { key: 'section2', texto: s2 },
    { key: 'section3', texto: s3 },
    { key: 'section4', texto: s4 },
  ]
}
