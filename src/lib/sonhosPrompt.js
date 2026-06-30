/** Prompt interno - metodologia hermenêutica (nunca citar fontes ao utilizador). */
import { aiOutputLanguageBlock, oracleRespondLanguage, isPt, contentForLang, looksPortuguese } from './i18n/langUtil.js'
import { translateSigno } from './i18n/astro.js'

export function reforcoInstrucaoSonhosIA(lang = 'pt', retry = false) {
  const label = oracleRespondLanguage(lang)
  if (isPt(lang)) {
    return retry
      ? 'CRÍTICO: Responde de novo, 100% em Português de Portugal, quatro secções completas.'
      : 'Responde sempre em Português de Portugal.'
  }
  const prefix = retry
    ? `CRITICAL RETRY — your previous answer was in the WRONG language. `
    : 'CRITICAL — '
  return `${prefix}${aiOutputLanguageBlock(lang)} The dream report may be in any language; you MUST write the ENTIRE interpretation only in ${label}. Never use Portuguese. Section headers must also be in ${label}.`
}

const SEC_HEADERS = {
  pt: ['1. Análise do Estado da Alma', '2. O Alerta Interno', '3. O Caminho de Cura Espiritual', '4. Pergunta para Meditação'],
  en: ['1. Analysis of the Soul\'s State', '2. The Inner Alert', '3. The Path of Spiritual Healing', '4. Question for Meditation'],
  es: ['1. Análisis del Estado del Alma', '2. La Alerta Interior', '3. El Camino de Sanación Espiritual', '4. Pregunta para la Meditación'],
  it: ['1. Analisi dello Stato dell\'Anima', '2. L\'Allerta Interiore', '3. Il Cammino di Guarigione Spirituale', '4. Domanda per la Meditazione'],
  de: ['1. Analyse des Seelenzustands', '2. Die Innere Warnung', '3. Der Weg der Spirituellen Heilung', '4. Frage zur Meditation'],
  fr: ['1. Analyse de l\'État de l\'Âme', '2. L\'Alerte Intérieure', '3. Le Chemin de Guérison Spirituelle', '4. Question pour la Méditation'],
}

function dreamHeaders(lang) {
  return SEC_HEADERS[lang] || SEC_HEADERS.en
}

export function construirSistemaSonhos(lang = 'pt') {
  if (isPt(lang)) {
    return `
És o motor de interpretação de sonhos do Sidus Astro, programado para decodificar o relato estritamente através da Matriz Hermenêutica de Psicologia Espiritual Integrativa (método bíblico-psicológico).

REGRAS ABSOLUTAS:
1. Os sonhos NÃO são adivinhação - proíbe números da sorte e previsões futuras. O sonho processa vivências diárias e diagnostica o estado actual da alma.
2. Pesadelos (morte, perseguição, quedas) são alertas misericordiosos - convida a olhar feridas e ordenar pensamentos.
3. A CHAVE é o sentimento no sonho - o mesmo símbolo muda com paz vs medo.
4. NUNCA cites autores, monges, teólogos, ordens religiosas ou títulos de livros. Se perguntarem o método, responde: "Matriz Hermenêutica de Psicologia Espiritual Integrativa."

MATRIZ DE SÍMBOLOS NÚCLEO (aplica e combina conforme relevante):
- ÁGUA/MAR: calma = baptismo, purificação, Espírito acalmando emoções; tempestade = caos psíquico ou cobranças externas sufocando a fé.
- ANIMAIS/FERAS: instintos e paixões dados pelo Criador; agressivos = instintos reprimidos (raiva, sexualidade, cansaço) a integrar com amor.
- QUEDA/VERTIGEM: orgulho, perfeccionismo, ego - inconsciente a forçar contacto com a realidade e fragilidade humana.
- VOAR/SUBIR: desejo espiritual de liberdade; alerta frequentemente para fuga da realidade ou idealismo que afasta responsabilidades terrenas.
- ESCURIDÃO/NOITE/DESERTO: noite escura da alma - silêncio e paciência antes de novo ciclo.
- MORTE/ENTERRO: deixar morrer o velho eu - desapego e transição, NUNCA falecimento físico.
- CASAS/CÓMODOS: estrutura da alma; portas trancadas = áreas escondidas; porão = sombra; sótão = ideais elevados.

REGRA DE OURO para qualquer outro símbolo:
(1) O que revela sobre cansaço/conflito actual; (2) apelo de conversão ou mudança de atitude; (3) como transformar em remédio de cura e reconciliação.

FORMATO - usa EXACTAMENTE estes quatro títulos (texto simples):
1. Análise do Estado da Alma
2. O Alerta Interno
3. O Caminho de Cura Espiritual
4. Pergunta para Meditação

CRÍTICO:
- Cada resposta DEVE ser única a ESTE relato - cita imagens, pessoas, locais e acções concretas do utilizador.
- Interpreta CADA símbolo mencionado, não parágrafos genéricos iguais para todos.
- 180–320 palavras no total.
- Tom pastoral, caloroso, Português de Portugal.
`.trim()
  }

  const h = dreamHeaders(lang)
  const label = oracleRespondLanguage(lang)
  return `
You are the dream interpretation engine of Sidus Astro, decoding reports through Integrative Spiritual Psychology Hermeneutics.

${aiOutputLanguageBlock(lang)}
The user's dream text may be written in Portuguese or any language — you MUST still write your FULL interpretation only in ${label}. Never answer in Portuguese unless ${label} is Portuguese.

ABSOLUTE RULES:
1. Dreams are NOT fortune-telling - no lucky numbers, no future predictions.
2. Nightmares are merciful alerts - invite looking at wounds and ordering thoughts.
3. The KEY is the feeling in the dream.
4. NEVER cite authors, monks, theologians, religious orders, or book titles.

RESPONSE FORMAT - use EXACTLY these four headers (plain text):
${h[0]}
${h[1]}
${h[2]}
${h[3]}

CRITICAL:
- Each answer MUST be unique to THIS dream text.
- Interpret EVERY symbol mentioned.
- 180–320 words total.
- ${aiOutputLanguageBlock(lang)}
- Warm, pastoral, precise tone in ${oracleRespondLanguage(lang)}.
`.trim()
}

export function construirPedidoSonhos({ texto, lang, feeling, simbolosDetectados, mapaNatal }) {
  const pt = isPt(lang)
  const feelingLabel = feeling || (pt ? 'não indicado' : 'not specified')
  const lista = simbolosDetectados?.length
    ? (pt
      ? simbolosDetectados.map((s) => `- ${s.tema}: ${s.resumo}`).join('\n')
      : simbolosDetectados.map((s) => `- ${s.tema}`).join('\n')
        + `\n(Interpret each symbol in ${oracleRespondLanguage(lang)}.)`)
    : (pt ? '- Nenhum símbolo indexado - aplica Regra de Ouro a cada imagem do sonho.' : '- Apply Golden Rule to each image in the dream.')

  const astro = mapaNatal?.solar?.nome
    ? (pt
      ? `\nContexto natal (secundário): Sol ${mapaNatal.solar.nome}, Lua ${mapaNatal.lunar?.nome || '-'}, Asc ${mapaNatal.ascendente?.nome || '-'}. Integra levemente se relevante.`
      : `\nNatal context (secondary): Sun ${translateSigno(mapaNatal.solar.nome, lang)}, Moon ${translateSigno(mapaNatal.lunar?.nome, lang) || '-'}, Asc ${translateSigno(mapaNatal.ascendente?.nome, lang) || '-'}. Weave lightly if relevant.`)
    : ''

  if (pt) {
    return `Sentimento dominante no sonho: ${feelingLabel}

Símbolos detectados no léxico (usa como âncoras, expande com detalhes do sonho):
${lista}
${astro}

RELATO DO SONHO (interpreta cada detalhe de forma única):
"""
${texto}
"""`
  }

  return `Dominant feeling in dream: ${feelingLabel}

Symbols detected in lexicon:
${lista}
${astro}

DREAM REPORT:
"""
${texto}
"""

Write all four sections in ${oracleRespondLanguage(lang)}. Use the exact section headers from your instructions.`
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

function parseWithHeaders(texto, headerLang) {
  const headers = SEC_HEADERS[headerLang] || SEC_HEADERS.en
  const patterns = headers.map((header, i) => {
    const esc = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const nextHeader = headers[i + 1]
    const nextEsc = nextHeader ? nextHeader.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : null
    const lookahead = nextEsc ? `(?=\\d\\.?\\s*${nextEsc}|$)` : '$'
    return new RegExp(`${esc}\\s*[:\\n]+([\\s\\S]*?)${lookahead}`, 'i')
  })
  return patterns.map((re, i) => {
    const m = texto.match(re)
    return { key: SEC_KEYS[i], texto: m?.[1]?.trim() || '' }
  })
}

export function parseRespostaSonhos(texto, lang = 'pt') {
  if (!texto?.trim()) return null
  const tryLangs = [...new Set([lang, 'en', 'pt'])]
  for (const headerLang of tryLangs) {
    const seccoes = parseWithHeaders(texto, headerLang)
    if (seccoes.some((s) => s.texto?.length > 20)) return seccoes
  }
  const blocos = texto.split(/\n{2,}/).filter(Boolean)
  if (blocos.length >= 2) {
    return SEC_KEYS.map((key, i) => ({ key, texto: blocos[i]?.trim() || '' }))
  }
  return parseWithHeaders(texto, lang)
}

export function respostaSonhosNoIdioma(texto, lang = 'pt') {
  if (!texto?.trim() || isPt(lang)) return true
  return !looksPortuguese(texto)
}

/** Fallback gratuito offline - único por relato (léxico + excerto do texto). */
export function gerarInterpretacaoLocal(texto, lang, feelingLabel, simbolosDetectados, mapaNatal) {
  const excerto = texto.trim().slice(0, 120) + (texto.length > 120 ? '…' : '')
  const temasDefault = contentForLang(lang, {
    pt: 'imagens interiores', en: 'inner images', es: 'imágenes interiores',
    it: 'immagini interiori', de: 'innere Bilder', fr: 'images intérieures',
  })
  const temas = simbolosDetectados.map((s) => s.tema).join(', ') || temasDefault
  const detalhes = simbolosDetectados.slice(0, 4)
    .map((s) => {
      if (isPt(lang) || !looksPortuguese(s.resumo)) return `${s.tema}: ${s.resumo}`
      return s.tema
    })
    .join(' ')
  const solar = mapaNatal?.solar?.nome ? translateSigno(mapaNatal.solar.nome, lang) : null
  const lunar = mapaNatal?.lunar?.nome ? translateSigno(mapaNatal.lunar.nome, lang) : null
  const astro = solar && lunar
    ? contentForLang(lang, {
      pt: ` Com Sol em ${solar} e Lua em ${lunar}, o tom emocional alinha-se com o teu ritmo natal.`,
      en: ` With Sun in ${solar} and Moon in ${lunar}, the emotional tone aligns with your natal rhythm.`,
      es: ` Con Sol en ${solar} y Luna en ${lunar}, el tono emocional se alinea con tu ritmo natal.`,
      it: ` Con Sole in ${solar} e Luna in ${lunar}, il tono emotivo si allinea al tuo ritmo natal.`,
      de: ` Mit Sonne in ${solar} und Mond in ${lunar} stimmt der emotionale Ton mit deinem Geburtsrhythmus überein.`,
      fr: ` Avec Soleil en ${solar} et Lune en ${lunar}, le ton émotionnel s'aligne sur ton rythme natal.`,
    })
    : ''

  const medo = /medo|terror|pavor|fear|terror|nightmare|pesadelo|miedo|paura|angst|peur/i.test(texto + feelingLabel)

  const s1 = contentForLang(lang, {
    pt: `O teu sonho ("${excerpto}") não é adivinhação - espelha o processamento actual da alma. Sentimento: ${feelingLabel}. Símbolos emergentes: ${temas}. ${detalhes}${astro}`,
    en: `Your dream ("${excerpto}") is not fortune-telling - it mirrors your soul's current processing. Feeling noted: ${feelingLabel}. Symbols emerging: ${temas}. ${detalhes}${astro}`,
    es: `Tu sueño ("${excerpto}") no es adivinación: refleja el procesamiento actual del alma. Sentimiento: ${feelingLabel}. Símbolos emergentes: ${temas}. ${detalhes}${astro}`,
    it: `Il tuo sogno ("${excerpto}") non è divinazione: rispecchia l'elaborazione attuale dell'anima. Sentimento: ${feelingLabel}. Simboli emergenti: ${temas}. ${detalhes}${astro}`,
    de: `Dein Traum ("${excerpto}") ist keine Wahrsagerei – er spiegelt die aktuelle Verarbeitung der Seele. Gefühl: ${feelingLabel}. Emergierende Symbole: ${temas}. ${detalhes}${astro}`,
    fr: `Ton rêve ("${excerpto}") n'est pas de la divination – il reflète le traitement actuel de l'âme. Sentiment : ${feelingLabel}. Symboles émergents : ${temas}. ${detalhes}${astro}`,
  })

  const s2 = medo
    ? contentForLang(lang, {
      pt: 'A tensão ou qualidade de pesadelo é um alerta misericordioso - não castigo. Algo evitado na vida acordada regressa simbolicamente para o enfrentares com honestidade, não controlo.',
      en: 'The tension or nightmare quality is a merciful alert - not punishment. Something avoided in waking life returns symbolically so you may face it with honesty rather than control.',
      es: 'La tensión o calidad de pesadilla es una alerta misericordiosa, no castigo. Algo evitado en la vida despierta regresa simbólicamente para enfrentarlo con honestidad, no control.',
      it: 'La tensione o qualità dell\'incubo è un allerta misericordiosa, non punizione. Qualcosa evitato nella vita sveglia ritorna simbolicamente per affrontarlo con onestà, non controllo.',
      de: 'Die Spannung oder Albtraumqualität ist ein barmherziger Hinweis – keine Strafe. Etwas Vermiedenes im Wachleben kehrt symbolisch zurück, damit du es ehrlich statt kontrollierend begegnest.',
      fr: 'La tension ou la qualité de cauchemar est une alerte miséricordieuse – pas une punition. Quelque chose évité dans la vie éveillée revient symboliquement pour l\'affronter avec honnêteté, pas contrôle.',
    })
    : contentForLang(lang, {
      pt: 'Mesmo sonhos mais calmos pedem atenção: o conforto pode esconder estagnação. Pergunta se esta imagem confirma descanso necessário ou avisa contra adiar um passo necessário.',
      en: 'Even calmer dreams invite attention: comfort may hide stagnation. Ask whether this image confirms needed rest or gently warns against postponing a necessary step.',
      es: 'Incluso sueños más calmados piden atención: el confort puede esconder estancamiento. Pregunta si esta imagen confirma descanso necesario o avisa contra posponer un paso necesario.',
      it: 'Anche sogni più calmi chiedono attenzione: il comfort può nascondere stagnazione. Chiediti se questa immagine conferma riposo necessario o avvisa contro rimandare un passo necessario.',
      de: 'Selbst ruhigere Träume verlangen Aufmerksamkeit: Komfort kann Stagnation verbergen. Frage, ob dieses Bild nötige Ruhe bestätigt oder sanft vor dem Aufschieben eines nötigen Schritts warnt.',
      fr: 'Même les rêves plus calmes demandent attention : le confort peut cacher la stagnation. Demande si cette image confirme le repos nécessaire ou avertit contre reporter un pas nécessaire.',
    })

  const s3 = contentForLang(lang, {
    pt: 'Caminho prático: (1) Nomeia honestamente o que sentes hoje sobre este sonho. (2) Dez minutos de silêncio ou escrita. (3) Um pequeno gesto de reconciliação - contigo ou com quem o sonho tocou. Sem números da sorte; a cura vem pela actitude e quietude.',
    en: 'Practical path: (1) Name honestly what you feel today about this dream. (2) Ten minutes of silence or journaling. (3) One small reconciling gesture - with yourself or someone the dream touched. No lucky numbers; healing comes through attitude and quietude.',
    es: 'Camino práctico: (1) Nombra honestamente lo que sientes hoy sobre este sueño. (2) Diez minutos de silencio o escritura. (3) Un pequeño gesto de reconciliación, contigo o con quien el sueño tocó. Sin números de la suerte; la cura viene por actitud y quietud.',
    it: 'Percorso pratico: (1) Nomina onestamente ciò che senti oggi su questo sogno. (2) Dieci minuti di silenzio o scrittura. (3) Un piccolo gesto di riconciliazione, con te o con chi il sogno ha toccato. Niente numeri fortunati; la guarigione viene da atteggiamento e quiete.',
    de: 'Praktischer Weg: (1) Benenne ehrlich, was du heute über diesen Traum fühlst. (2) Zehn Minuten Stille oder Schreiben. (3) Eine kleine Geste der Versöhnung – mit dir oder wem der Traum berührte. Keine Glückszahlen; Heilung kommt durch Haltung und Stille.',
    fr: 'Chemin pratique : (1) Nomme honnêtement ce que tu ressens aujourd\'hui sur ce rêve. (2) Dix minutes de silence ou d\'écriture. (3) Un petit geste de réconciliation – avec toi ou quelqu\'un que le rêve a touché. Pas de numéros porte-bonheur ; la guérison vient par l\'attitude et la quiétude.',
  })

  const s4 = contentForLang(lang, {
    pt: `Que imagem de "${excerpto}" te pede um olhar mais suave sobre ti - não respostas, mas compaixão?`,
    en: `Which image from "${excerpto}" asks you for a softer gaze upon yourself - not answers, but compassion?`,
    es: `¿Qué imagen de "${excerpto}" te pide una mirada más suave sobre ti, no respuestas, sino compasión?`,
    it: `Quale immagine di "${excerpto}" ti chiede uno sguardo più dolce su te stesso/a, non risposte, ma compassione?`,
    de: `Welches Bild aus "${excerpto}" bittet dich um einen sanfteren Blick auf dich – nicht Antworten, sondern Mitgefühl?`,
    fr: `Quelle image de "${excerpto}" te demande un regard plus doux sur toi – pas des réponses, mais de la compassion ?`,
  })

  return [
    { key: 'section1', texto: s1 },
    { key: 'section2', texto: s2 },
    { key: 'section3', texto: s3 },
    { key: 'section4', texto: s4 },
  ]
}
