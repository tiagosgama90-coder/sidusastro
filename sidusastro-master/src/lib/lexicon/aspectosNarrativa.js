/**
 * Narrativas de aspetos planetários - estilo interpretativo profissional.
 * Sem orbes, graus ou jargão matemático.
 */
import { translatePlaneta, translateSigno, translateAspecto } from '../i18n/astro.js'
import { contentForLang, casaParentese } from '../i18n/langUtil.js'
import { planetaPorNome } from '../casasPlacidus.js'

const ASPETO_NUCLEO_PT = {
  Conjunção: 'duas forças fundem-se num só canal - intensificam-se mutuamente, para bem ou para tensão concentrada',
  Conjuncao: 'duas forças fundem-se num só canal - intensificam-se mutuamente, para bem ou para tensão concentrada',
  Oposição: 'polos opostos pedem integração consciente - o outro revela o que negas em ti',
  Oposicao: 'polos opostos pedem integração consciente - o outro revela o que negas em ti',
  Trígono: 'fluxo natural e talento espontâneo - o dom precisa de ser usado, não apenas possuído',
  Trigono: 'fluxo natural e talento espontâneo - o dom precisa de ser usado, não apenas possuído',
  Quadratura: 'fricção criativa que obriga à acção - o desconforto é motor de crescimento quando não fujas',
  Sextil: 'oportunidade gentil que requer iniciativa - a porta abre-se para quem bate',
}

const ASPETO_NUCLEO_EN = {
  Conjunction: 'two forces merge into one channel - they intensify each other, for better or concentrated tension',
  Conjuncao: 'two forces merge into one channel - they intensify each other, for better or concentrated tension',
  Opposition: 'opposite poles ask conscious integration - the other reveals what you deny in yourself',
  Oposicao: 'opposite poles ask conscious integration - the other reveals what you deny in yourself',
  Trine: 'natural flow and spontaneous talent - the gift must be used, not merely possessed',
  Trigono: 'natural flow and spontaneous talent - the gift must be used, not merely possessed',
  Square: 'creative friction that demands action - discomfort drives growth when you do not flee',
  Quadratura: 'creative friction that demands action - discomfort drives growth when you do not flee',
  Sextile: 'gentle opportunity requiring initiative - the door opens for those who knock',
  Sextil: 'gentle opportunity requiring initiative - the door opens for those who knock',
}

const PAR_DINAMICA_PT = {
  'Sol-Lua': 'O eixo identidade–emoção: o que queres ser e o que precisas de sentir para estar inteiro/a.',
  'Sol-Saturno': 'O encontro entre vontade e limite: autoridade interior versus medo de falhar.',
  'Sol-Júpiter': 'Expansão da identidade: fé em ti mesmo/a e excesso de promessas.',
  'Lua-Saturno': 'Emoção contida: necessidade de segurança versus medo de vulnerabilidade.',
  'Lua-Vénus': 'Afeto e prazer: como amas e como precisas de ser amado/a.',
  'Mercúrio-Marte': 'Pensamento e acção: palavras como espada ou como ponte.',
  'Vénus-Marte': 'Desejo e atração: magnetismo relacional e tensão criativa.',
  'Marte-Saturno': 'Impulso versus disciplina: onde a raiva encontra o muro ou o mestre.',
  'Júpiter-Saturno': 'Expansão e contracção: saber quando crescer e quando consolidar.',
}

const PAR_DINAMICA_EN = {
  'Sun-Moon': 'The identity–emotion axis: who you want to be and what you need to feel whole.',
  'Sun-Saturn': 'Will meets limit: inner authority versus fear of failure.',
  'Sun-Jupiter': 'Identity expansion: faith in yourself and excess of promises.',
  'Moon-Saturn': 'Contained emotion: need for security versus fear of vulnerability.',
  'Moon-Venus': 'Affection and pleasure: how you love and need to be loved.',
  'Mercury-Mars': 'Thought and action: words as sword or bridge.',
  'Venus-Mars': 'Desire and attraction: relational magnetism and creative tension.',
  'Mars-Saturn': 'Impulse versus discipline: where anger meets wall or teacher.',
  'Jupiter-Saturn': 'Expansion and contraction: knowing when to grow and when to consolidate.',
}

const ASPETO_NUCLEO_ES = {
  Conjunção: 'dos fuerzas se funden en un solo canal - se intensifican mutuamente, para bien o para tensión concentrada',
  Conjuncao: 'dos fuerzas se funden en un solo canal - se intensifican mutuamente, para bien o para tensión concentrada',
  Oposição: 'polos opuestos piden integración consciente - el otro revela lo que niegas en ti',
  Oposicao: 'polos opuestos piden integración consciente - el otro revela lo que niegas en ti',
  Trígono: 'flujo natural y talento espontáneo - el don debe usarse, no solo poseerse',
  Trigono: 'flujo natural y talento espontáneo - el don debe usarse, no solo poseerse',
  Quadratura: 'fricción creativa que exige acción - la incomodidad impulsa el crecimiento cuando no huyes',
  Sextil: 'oportunidad amable que requiere iniciativa - la puerta se abre a quien llama',
}

const PAR_DINAMICA_ES = {
  'Sol-Lua': 'El eje identidad–emoción: quién quieres ser y qué necesitas sentir para estar entero/a.',
  'Sol-Saturno': 'El encuentro entre voluntad y límite: autoridad interior frente al miedo a fallar.',
  'Sol-Júpiter': 'Expansión de la identidad: fe en ti mismo/a y exceso de promesas.',
  'Lua-Saturno': 'Emoción contenida: necesidad de seguridad frente al miedo a la vulnerabilidad.',
  'Lua-Vénus': 'Afecto y placer: cómo amas y cómo necesitas ser amado/a.',
  'Mercúrio-Marte': 'Pensamiento y acción: palabras como espada o como puente.',
  'Vénus-Marte': 'Deseo y atracción: magnetismo relacional y tensión creativa.',
  'Marte-Saturno': 'Impulso frente a disciplina: donde la ira encuentra el muro o el maestro.',
  'Júpiter-Saturno': 'Expansión y contracción: saber cuándo crecer y cuándo consolidar.',
}

const ASPETO_NUCLEO_IT = {
  Conjunção: 'due forze si fondono in un solo canale - si intensificano a vicenda, per il meglio o per tensione concentrata',
  Conjuncao: 'due forze si fondono in un solo canale - si intensificano a vicenda, per il meglio o per tensione concentrata',
  Oposição: 'poli opposti chiedono integrazione consapevole - l\'altro rivela ciò che neghi in te',
  Oposicao: 'poli opposti chiedono integrazione consapevole - l\'altro rivela ciò che neghi in te',
  Trígono: 'flusso naturale e talento spontaneo - il dono va usato, non solo posseduto',
  Trigono: 'flusso naturale e talento spontaneo - il dono va usato, non solo posseduto',
  Quadratura: 'attrito creativo che esige azione - il disagio è motore di crescita quando non fuggi',
  Sextil: 'opportunità gentile che richiede iniziativa - la porta si apre a chi bussa',
}

const PAR_DINAMICA_IT = {
  'Sol-Lua': 'L\'asse identità–emozione: chi vuoi essere e cosa hai bisogno di sentire per essere intero/a.',
  'Sol-Saturno': 'L\'incontro tra volontà e limite: autorità interiore contro paura di fallire.',
  'Sol-Júpiter': 'Espansione dell\'identità: fede in te stesso/a ed eccesso di promesse.',
  'Lua-Saturno': 'Emozione contenuta: bisogno di sicurezza contro paura della vulnerabilità.',
  'Lua-Vénus': 'Affetto e piacere: come ami e come hai bisogno di essere amato/a.',
  'Mercúrio-Marte': 'Pensiero e azione: parole come spada o come ponte.',
  'Vénus-Marte': 'Desiderio e attrazione: magnetismo relazionale e tensione creativa.',
  'Marte-Saturno': 'Impulso contro disciplina: dove la rabbia incontra il muro o il maestro.',
  'Júpiter-Saturno': 'Espansione e contrazione: sapere quando crescere e quando consolidare.',
}

const ASPETO_NUCLEO_DE = {
  Conjunção: 'zwei Kräfte verschmelzen zu einem Kanal - sie verstärken sich gegenseitig, zum Guten oder als konzentrierte Spannung',
  Conjuncao: 'zwei Kräfte verschmelzen zu einem Kanal - sie verstärken sich gegenseitig, zum Guten oder als konzentrierte Spannung',
  Oposição: 'gegensätzliche Pole verlangen bewusste Integration - der andere zeigt, was du in dir verleugnest',
  Oposicao: 'gegensätzliche Pole verlangen bewusste Integration - der andere zeigt, was du in dir verleugnest',
  Trígono: 'natürlicher Fluss und spontanes Talent - die Gabe muss genutzt werden, nicht nur besessen',
  Trigono: 'natürlicher Fluss und spontanes Talent - die Gabe muss genutzt werden, nicht nur besessen',
  Quadratura: 'kreative Reibung, die Handlung verlangt - Unbehagen treibt Wachstum, wenn du nicht fliehst',
  Sextil: 'sanfte Gelegenheit, die Initiative erfordert - die Tür öffnet sich für die, die klopfen',
}

const PAR_DINAMICA_DE = {
  'Sol-Lua': 'Die Identitäts–Emotions-Achse: wer du sein willst und was du fühlen musst, um ganz zu sein.',
  'Sol-Saturno': 'Die Begegnung von Wille und Grenze: innere Autorität versus Angst zu scheitern.',
  'Sol-Júpiter': 'Identitätsexpansion: Vertrauen in dich und Überschuss an Versprechen.',
  'Lua-Saturno': 'Gezügelte Emotion: Sicherheitsbedürfnis versus Angst vor Verletzlichkeit.',
  'Lua-Vénus': 'Zuneigung und Genuss: wie du liebst und geliebt werden musst.',
  'Mercúrio-Marte': 'Gedanke und Handlung: Worte als Schwert oder Brücke.',
  'Vénus-Marte': 'Begehren und Anziehung: relationale Magnetik und kreative Spannung.',
  'Marte-Saturno': 'Impuls versus Disziplin: wo Wut auf Mauer oder Lehrer trifft.',
  'Júpiter-Saturno': 'Expansion und Kontraktion: wissen, wann wachsen und wann festigen.',
}

const ASPETO_NUCLEO_FR = {
  Conjunção: 'deux forces fusionnent en un seul canal - elles s\'intensifient mutuellement, pour le meilleur ou une tension concentrée',
  Conjuncao: 'deux forces fusionnent en un seul canal - elles s\'intensifient mutuellement, pour le meilleur ou une tension concentrée',
  Oposição: 'des pôles opposés demandent une intégration consciente - l\'autre révèle ce que tu nies en toi',
  Oposicao: 'des pôles opposés demandent une intégration consciente - l\'autre révèle ce que tu nies en toi',
  Trígono: 'flux naturel et talent spontané - le don doit être utilisé, pas seulement possédé',
  Trigono: 'flux naturel et talent spontané - le don doit être utilisé, pas seulement possédé',
  Quadratura: 'friction créative qui exige l\'action - l\'inconfort est moteur de croissance quand tu ne fuis pas',
  Sextil: 'opportunité douce qui demande de l\'initiative - la porte s\'ouvre à celui qui frappe',
}

const PAR_DINAMICA_FR = {
  'Sol-Lua': 'L\'axe identité–émotion : qui tu veux être et ce dont tu as besoin pour te sentir entier(ère).',
  'Sol-Saturno': 'La rencontre entre volonté et limite : autorité intérieure face à la peur d\'échouer.',
  'Sol-Júpiter': 'Expansion de l\'identité : foi en toi et excès de promesses.',
  'Lua-Saturno': 'Émotion contenue : besoin de sécurité face à la peur de la vulnérabilité.',
  'Lua-Vénus': 'Affection et plaisir : comment tu aimes et comment tu as besoin d\'être aimé(e).',
  'Mercúrio-Marte': 'Pensée et action : les mots comme épée ou comme pont.',
  'Vénus-Marte': 'Désir et attraction : magnétisme relationnel et tension créative.',
  'Marte-Saturno': 'Impulsion contre discipline : là où la colère rencontre le mur ou le maître.',
  'Júpiter-Saturno': 'Expansion et contraction : savoir quand grandir et quand consolider.',
}

const ASPETO_BY_LANG = {
  es: ASPETO_NUCLEO_ES, it: ASPETO_NUCLEO_IT, de: ASPETO_NUCLEO_DE, fr: ASPETO_NUCLEO_FR,
}
const PAR_BY_LANG = {
  es: PAR_DINAMICA_ES, it: PAR_DINAMICA_IT, de: PAR_DINAMICA_DE, fr: PAR_DINAMICA_FR,
}

function nomePlaneta(str) {
  return (str || '').split(' ')[0]
}

function chavePar(a, b) {
  const par = [a, b].sort().join('-')
  return par
}

function sn(signo, lang) {
  return translateSigno(signo, lang) || signo || ''
}

function tp(nome, lang) {
  return translatePlaneta(nome, lang) || nome
}

function nucleoAspeto(tipo, lang) {
  if (lang === 'pt') return ASPETO_NUCLEO_PT[tipo] || ASPETO_NUCLEO_PT[translateAspecto(tipo, 'pt')] || ''
  if (lang === 'en') return ASPETO_NUCLEO_EN[tipo] || ASPETO_NUCLEO_EN[translateAspecto(tipo, 'en')] || ''
  const map = ASPETO_BY_LANG[lang]
  if (map) {
    return map[tipo] || map[translateAspecto(tipo, lang)] || ASPETO_NUCLEO_EN[translateAspecto(tipo, 'en')] || ''
  }
  return ASPETO_NUCLEO_EN[translateAspecto(tipo, 'en')] || ''
}

function parDinamica(pa, pb, lang) {
  const parKey = chavePar(pa, pb)
  const parKeyEn = chavePar(tp(pa, 'en'), tp(pb, 'en'))
  if (lang === 'pt') return PAR_DINAMICA_PT[parKey] || ''
  if (lang === 'en') return PAR_DINAMICA_EN[parKeyEn] || PAR_DINAMICA_EN[parKey] || ''
  const map = PAR_BY_LANG[lang]
  if (map) return map[parKey] || PAR_DINAMICA_EN[parKeyEn] || PAR_DINAMICA_EN[parKey] || ''
  return PAR_DINAMICA_EN[parKeyEn] || PAR_DINAMICA_EN[parKey] || ''
}

export function narrarAspecto(aspecto, planetas, lang = 'pt') {
  const pa = nomePlaneta(aspecto.planetaA)
  const pb = nomePlaneta(aspecto.planetaB)
  const pA = planetaPorNome(planetas, pa)
  const pB = planetaPorNome(planetas, pb)
  const aspLabel = translateAspecto(
    aspecto.aspecto === 'Conjuncao' ? 'Conjunção' : aspecto.aspecto,
    lang,
  )
  const dinamica = parDinamica(pa, pb, lang)

  const signoA = sn(pA?.signo?.nome, lang)
  const signoB = sn(pB?.signo?.nome, lang)
  const nucleo = nucleoAspeto(aspecto.aspecto, lang)
  const a = tp(pa, lang)
  const b = tp(pb, lang)
  const casaA = pA?.casa ? casaParentese(lang, pA.casa) : ''
  const casaB = pB?.casa ? casaParentese(lang, pB.casa) : ''

  const intro = contentForLang(lang, {
    pt: `${pa} em ${aspLabel.toLowerCase()} com ${pb}: ${nucleo}.`,
    en: `${a} ${aspLabel.toLowerCase()} ${b}: ${nucleo}.`,
    es: `${a} en ${aspLabel.toLowerCase()} con ${b}: ${nucleo}.`,
    it: `${a} in ${aspLabel.toLowerCase()} con ${b}: ${nucleo}.`,
    de: `${a} ${aspLabel.toLowerCase()} ${b}: ${nucleo}.`,
    fr: `${a} en ${aspLabel.toLowerCase()} avec ${b} : ${nucleo}.`,
  })

  const meio = contentForLang(lang, {
    pt: `Com ${pa} em ${signoA}${casaA} e ${pb} em ${signoB}${casaB}, este diálogo molda a forma como vives ambas as funções no quotidiano.`,
    en: `With ${a} in ${signoA}${casaA} and ${b} in ${signoB}${casaB}, this dialogue shapes how you experience both functions in daily life.`,
    es: `Con ${a} en ${signoA}${casaA} y ${b} en ${signoB}${casaB}, este diálogo moldea cómo vives ambas funciones en el cotidiano.`,
    it: `Con ${a} in ${signoA}${casaA} e ${b} in ${signoB}${casaB}, questo dialogo modella come vivi entrambe le funzioni nel quotidiano.`,
    de: `Mit ${a} in ${signoA}${casaA} und ${b} in ${signoB}${casaB} formt dieser Dialog, wie du beide Funktionen im Alltag erlebst.`,
    fr: `Avec ${a} en ${signoA}${casaA} et ${b} en ${signoB}${casaB}, ce dialogue façonne comment tu vis les deux fonctions au quotidien.`,
  })

  const sombra = contentForLang(lang, {
    pt: `Sombra: repetir este aspeto inconscientemente cria narrativas fixas sobre quem és. Luz: o diálogo consciente entre ${pa} e ${pb} torna-se uma das tuas maiores competências relacionais e criativas.`,
    en: `Shadow: repeating this aspect unconsciously creates fixed stories about yourself. Light: conscious dialogue between ${a} and ${b} becomes one of your greatest relational and creative competences.`,
    es: `Sombra: repetir este aspecto inconscientemente crea narrativas fijas sobre quién eres. Luz: el diálogo consciente entre ${a} y ${b} se convierte en una de tus mayores competencias relacionales y creativas.`,
    it: `Ombra: ripetere questo aspetto inconsciamente crea narrazioni fisse su chi sei. Luce: il dialogo consapevole tra ${a} e ${b} diventa una delle tue maggiori competenze relazionali e creative.`,
    de: `Schatten: diesen Aspekt unbewusst zu wiederholen schafft feste Geschichten über dich. Licht: bewusster Dialog zwischen ${a} und ${b} wird eine deiner größten relationalen und kreativen Kompetenzen.`,
    fr: `Ombre : répéter cet aspect inconsciemment crée des récits fixes sur qui tu es. Lumière : le dialogue conscient entre ${a} et ${b} devient l'une de tes plus grandes compétences relationnelles et créatives.`,
  })

  return [intro, dinamica ? `${dinamica} ` : '', meio, sombra].filter(Boolean).join(' ')
}

const ASPETOS_PRIORITARIOS = ['Conjunção', 'Conjuncao', 'Oposição', 'Oposicao', 'Quadratura', 'Trigono', 'Trígono', 'Sextil']

export function interpretarAspectosNatais(aspetos, planetas, lang = 'pt') {
  const lista = (aspetos || [])
    .filter((a) => ASPETOS_PRIORITARIOS.includes(a.aspecto))
    .sort((a, b) => parseFloat(a.orbe) - parseFloat(b.orbe))
    .slice(0, 12)

  if (!lista.length) {
    return contentForLang(lang, {
      pt: 'Nenhum aspeto maior apertado domina este mapa - a tua história desenrola-se sobretudo através da ênfase de signos e casas, e não por diálogo planetário. Isto concede flexibilidade, mas pede escolha consciente em vez de impulso por tensão interior.',
      en: 'No major tight aspects dominate this chart - your story unfolds through sign and house emphasis rather than planetary dialogue. This grants flexibility but asks you to choose consciously rather than being propelled by inner tension.',
      es: 'Ningún aspecto mayor ajustado domina esta carta: tu historia se despliega sobre todo por énfasis de signos y casas, no por diálogo planetario. Esto concede flexibilidad pero pide elección consciente en vez de impulso por tensión interior.',
      it: 'Nessun aspetto maggiore stretto domina questa carta: la tua storia si dispiega soprattutto per enfasi di segni e case, non per dialogo planetario. Questo concede flessibilità ma chiede scelta consapevole invece di spinta da tensione interiore.',
      de: 'Kein enger Hauptaspekt dominiert dieses Horoskop – deine Geschichte entfaltet sich vor allem durch Zeichen- und Hausbetonung, nicht planetaren Dialog. Das gibt Flexibilität, verlangt aber bewusste Wahl statt innerer Spannungsantrieb.',
      fr: 'Aucun aspect majeur serré ne domine cette carte - ton histoire se déploie surtout par l\'emphase des signes et maisons, pas par dialogue planétaire. Cela accorde de la flexibilité mais demande un choix conscient plutôt qu\'une poussée de tension intérieure.',
    })
  }

  return lista.map((a) => narrarAspecto(a, planetas, lang)).join('\n\n')
}

export function narrarAspectosPlaneta(planeta, aspetos, planetas, lang = 'pt') {
  const lista = (aspetos || [])
    .filter((a) => {
      const pa = nomePlaneta(a.planetaA)
      const pb = nomePlaneta(a.planetaB)
      return pa === planeta || pb === planeta
    })
    .filter((a) => ASPETOS_PRIORITARIOS.includes(a.aspecto))
    .sort((a, b) => parseFloat(a.orbe) - parseFloat(b.orbe))
    .slice(0, 3)

  if (!lista.length) return ''
  const textos = lista.map((a) => narrarAspecto(a, planetas, lang))
  return contentForLang(lang, {
    pt: ` Diálogos planetários: ${textos.join(' ')}`,
    en: ` Planetary dialogues: ${textos.join(' ')}`,
    es: ` Diálogos planetarios: ${textos.join(' ')}`,
    it: ` Dialoghi planetari: ${textos.join(' ')}`,
    de: ` Planetare Dialoge: ${textos.join(' ')}`,
    fr: ` Dialogues planétaires : ${textos.join(' ')}`,
  })
}
