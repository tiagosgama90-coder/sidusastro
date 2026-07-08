/**
 * Templates de parágrafos do mapa natal - 6 idiomas.
 */
import { contentForLang } from '../langUtil.js'
import { translateAspecto, translatePlaneta } from '../astro.js'

const ELEM_CANON = {
  Carneiro: 'fire', Touro: 'earth', Gémeos: 'air', Caranguejo: 'water',
  Leão: 'fire', Virgem: 'earth', Balança: 'air', Escorpião: 'water',
  Sagitário: 'fire', Capricórnio: 'earth', Aquário: 'air', Peixes: 'water',
}

export function elemCanon(signo) {
  return ELEM_CANON[signo] || null
}

function ordinalEn(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}

export function casaEm(lang, casa) {
  if (!casa) return ''
  const fns = {
    pt: (c) => ` na ${c}ª Casa`,
    en: (c) => ` in the ${c}${ordinalEn(c)} House`,
    es: (c) => ` en la Casa ${c}`,
    it: (c) => ` nella Casa ${c}`,
    de: (c) => ` im ${c}. Haus`,
    fr: (c) => ` en Maison ${c}`,
  }
  return (contentForLang(lang, fns) || fns.en)(casa)
}

const TENSAO_ELEM = {
  'fire-water': {
    pt: 'entre a acção impulsiva e a profundidade emocional',
    en: 'between impulsive action and emotional depth',
    es: 'entre la acción impulsiva y la profundidad emocional',
    it: 'tra azione impulsiva e profondità emotiva',
    de: 'zwischen impulsivem Handeln und emotionaler Tiefe',
    fr: 'entre l\'action impulsive et la profondeur émotionnelle',
  },
  'air-earth': {
    pt: 'entre a mente abstracta e a necessidade de concretude',
    en: 'between abstract mind and need for concreteness',
    es: 'entre la mente abstracta y la necesidad de concreción',
    it: 'tra mente astratta e bisogno di concretezza',
    de: 'zwischen abstraktem Denken und Bedürfnis nach Konkretion',
    fr: 'entre l\'esprit abstrait et le besoin de concrétude',
  },
  'fire-earth': {
    pt: 'entre impulso e prudência',
    en: 'between impulse and prudence',
    es: 'entre impulso y prudencia',
    it: 'tra impulso e prudenza',
    de: 'zwischen Impuls und Besonnenheit',
    fr: 'entre impulsion et prudence',
  },
  default: {
    pt: 'entre estilos elementais diferentes que pedem tradução consciente',
    en: 'between different elemental styles that ask for conscious translation',
    es: 'entre estilos elementales distintos que piden traducción consciente',
    it: 'tra stili elementali diversi che chiedono traduzione consapevole',
    de: 'zwischen verschiedenen Elementstilen, die bewusste Übersetzung verlangen',
    fr: 'entre des styles élémentaires différents qui demandent une traduction consciente',
  },
}

function tensaoElem(eSol, eLua, lang) {
  const key = `${eSol}-${eLua}`
  const rev = `${eLua}-${eSol}`
  const bundle = TENSAO_ELEM[key] || TENSAO_ELEM[rev] || TENSAO_ELEM.default
  return contentForLang(lang, bundle) || bundle.en
}

const SOL_EXTRA = {
  deep: {
    pt: ' A tua força reside na profundidade e na persistência - o mundo reconhece a tua competência quando deixas de esconder o que sabes.',
    en: ' Your strength lies in depth and persistence - the world recognises your competence when you stop hiding what you know.',
    es: ' Tu fuerza reside en la profundidad y la persistencia: el mundo reconoce tu competencia cuando dejas de esconder lo que sabes.',
    it: ' La tua forza risiede nella profondità e nella persistenza: il mondo riconosce la tua competenza quando smetti di nascondere ciò che sai.',
    de: ' Deine Stärke liegt in Tiefe und Ausdauer – die Welt erkennt deine Kompetenz, wenn du aufhörst zu verbergen, was du weißt.',
    fr: ' Ta force réside dans la profondeur et la persévérance – le monde reconnaît ta compétence quand tu cesses de cacher ce que tu sais.',
  },
  fire: {
    pt: ' Precisas de palco e propósito: sem expressão autêntica, a vitalidade transforma-se em inquietação.',
    en: ' You need stage and purpose: without authentic expression, vitality turns into restlessness.',
    es: ' Necesitas escenario y propósito: sin expresión auténtica, la vitalidad se convierte en inquietud.',
    it: ' Hai bisogno di palcoscenico e scopo: senza espressione autentica, la vitalità diventa irrequietezza.',
    de: ' Du brauchst Bühne und Sinn: ohne authentischen Ausdruck wird Vitalität zu Unruhe.',
    fr: ' Tu as besoin de scène et de sens : sans expression authentique, la vitalité devient agitation.',
  },
  default: {
    pt: ' A maturidade astrológica passa por honrar este signo nos momentos em que escolhes ser fiel a ti mesmo/a.',
    en: ' Astrological maturity comes from honouring this sign when you choose to be true to yourself.',
    es: ' La madurez astrológica pasa por honrar este signo cuando eliges ser fiel a ti mismo/a.',
    it: ' La maturità astrologica passa per onorare questo segno quando scegli di essere fedele a te stesso/a.',
    de: ' Astrologische Reife kommt davon, dieses Zeichen zu ehren, wenn du wählst, dir selbst treu zu sein.',
    fr: ' La maturité astrologique passe par honorer ce signe quand tu choisis d\'être fidèle à toi-même.',
  },
}

function solExtraType(signo) {
  if (['Escorpião', 'Capricórnio', 'Virgem'].includes(signo)) return 'deep'
  if (['Leão', 'Carneiro', 'Sagitário'].includes(signo)) return 'fire'
  return 'default'
}

export function buildParagrafoSol(lang, { s, signo, casa, essencia, temas }) {
  const extra = contentForLang(lang, SOL_EXTRA[solExtraType(signo)])
  const ess = essencia[signo] || contentForLang(lang, {
    pt: 'uma essência única', en: 'a unique essence', es: 'una esencia única',
    it: 'un\'essenza unica', de: 'eine einzigartige Essenz', fr: 'une essence unique',
  })
  const casaPart = casa
    ? contentForLang(lang, {
      pt: `Este é o palco onde a tua luz precisa de brilhar: ${temas[casa]?.foco || 'a tua área de realização pessoal'}. Quando honras esta casa, sentes vitalidade; quando a ignoras, a alma adoece silenciosamente.`,
      en: `This is the stage where your light must shine: ${temas[casa]?.foco || 'your area of personal fulfilment'}. When you honour this house, you feel vitality; when you ignore it, the soul quietly grows ill.`,
      es: `Este es el escenario donde tu luz debe brillar: ${temas[casa]?.foco || 'tu área de realización personal'}. Cuando honras esta casa, sientes vitalidad; cuando la ignoras, el alma enferma en silencio.`,
      it: `Questo è il palcoscenico dove la tua luce deve brillare: ${temas[casa]?.foco || 'la tua area di realizzazione personale'}. Quando onori questa casa, senti vitalità; quando la ignori, l\'anima ammala in silenzio.`,
      de: `Dies ist die Bühne, auf der dein Licht leuchten muss: ${temas[casa]?.foco || 'dein Bereich persönlicher Erfüllung'}. Wenn du dieses Haus ehrst, spürst du Vitalität; wenn du es ignorierst, erkrankt die Seele still.`,
      fr: `C\'est la scène où ta lumière doit briller : ${temas[casa]?.foco || 'ton domaine d\'accomplissement personnel'}. Quand tu honores cette maison, tu ressens la vitalité ; quand tu l\'ignores, l\'âme tombe malade en silence.`,
    })
    : contentForLang(lang, {
      pt: 'O teu propósito manifesta-se sempre que ages com autenticidade e coragem de ser quem realmente és.',
      en: 'Your purpose manifests whenever you act with authenticity and courage to be who you truly are.',
      es: 'Tu propósito se manifiesta siempre que actúas con autenticidad y valor para ser quien realmente eres.',
      it: 'Il tuo scopo si manifesta ogni volta che agisci con autenticità e coraggio per essere chi sei veramente.',
      de: 'Dein Zweck zeigt sich, wann immer du mit Authentizität und Mut handelst, wer du wirklich bist.',
      fr: 'Ton but se manifeste chaque fois que tu agis avec authenticité et courage pour être qui tu es vraiment.',
    })
  const intro = contentForLang(lang, {
    pt: `Com o Sol em ${s}${casaEm(lang, casa)}, a tua identidade consciente expressa ${ess}. `,
    en: `With the Sun in ${s}${casaEm(lang, casa)}, your conscious identity expresses ${ess}. `,
    es: `Con el Sol en ${s}${casaEm(lang, casa)}, tu identidad consciente expresa ${ess}. `,
    it: `Con il Sole in ${s}${casaEm(lang, casa)}, la tua identità conscia esprime ${ess}. `,
    de: `Mit der Sonne in ${s}${casaEm(lang, casa)} drückt deine bewusste Identität ${ess} aus. `,
    fr: `Avec le Soleil en ${s}${casaEm(lang, casa)}, ton identité consciente exprime ${ess}. `,
  })
  return intro + casaPart + extra
}

export function buildParagrafoLua(lang, { s, signo, casa, essencia, temas }) {
  const ess = essencia[signo] || contentForLang(lang, {
    pt: 'uma sensibilidade particular', en: 'a particular sensitivity', es: 'una sensibilidad particular',
    it: 'una particolare sensibilità', de: 'eine besondere Sensibilität', fr: 'une sensibilité particulière',
  })
  const casaBit = casa
    ? contentForLang(lang, {
      pt: `A segurança emocional ancora-se em ${temas[casa]?.foco || 'temas desta casa'}. Nutrir esta área é cuidar da tua base interior.`,
      en: `Emotional security anchors in ${temas[casa]?.foco || 'themes of this house'}. Nurturing this area is caring for your inner foundation.`,
      es: `La seguridad emocional se ancla en ${temas[casa]?.foco || 'temas de esta casa'}. Nutrir esta área es cuidar tu base interior.`,
      it: `La sicurezza emotiva si ancora in ${temas[casa]?.foco || 'temi di questa casa'}. Nutrire quest\'area è curare la tua base interiore.`,
      de: `Emotionale Sicherheit verankert sich in ${temas[casa]?.foco || 'Themen dieses Hauses'}. Diesen Bereich zu nähren heißt, dein inneres Fundament zu pflegen.`,
      fr: `La sécurité émotionnelle s\'ancre dans ${temas[casa]?.foco || 'les thèmes de cette maison'}. Nourrir ce domaine, c\'est soigner ta base intérieure.`,
    })
    : contentForLang(lang, {
      pt: 'As tuas necessidades afectivas pedem reconhecimento - não são fraqueza, são bússola.',
      en: 'Your affective needs ask for recognition - they are not weakness, they are compass.',
      es: 'Tus necesidades afectivas piden reconocimiento: no son debilidad, son brújula.',
      it: 'Le tue necessità affettive chiedono riconoscimento: non sono debolezza, sono bussola.',
      de: 'Deine affektiven Bedürfnisse verlangen Anerkennung – sie sind keine Schwäche, sondern Kompass.',
      fr: 'Tes besoins affectifs demandent reconnaissance – ce n\'est pas faiblesse, c\'est boussole.',
    })
  return contentForLang(lang, {
    pt: `A Lua em ${s}${casaEm(lang, casa)} descreve o teu mundo emocional: ${ess}. Sob stress, regresses a estes padrões instintivos. ${casaBit}`,
    en: `The Moon in ${s}${casaEm(lang, casa)} describes your emotional world: ${ess}. Under stress, you regress to these instinctive patterns. ${casaBit}`,
    es: `La Luna en ${s}${casaEm(lang, casa)} describe tu mundo emocional: ${ess}. Bajo estrés, regresas a estos patrones instintivos. ${casaBit}`,
    it: `La Luna in ${s}${casaEm(lang, casa)} descrive il tuo mondo emotivo: ${ess}. Sotto stress, regredi a questi schemi istintivi. ${casaBit}`,
    de: `Der Mond in ${s}${casaEm(lang, casa)} beschreibt deine emotionale Welt: ${ess}. Unter Stress kehrst du zu diesen instinktiven Mustern zurück. ${casaBit}`,
    fr: `La Lune en ${s}${casaEm(lang, casa)} décrit ton monde émotionnel : ${ess}. Sous stress, tu régresses vers ces schémas instinctifs. ${casaBit}`,
  })
}

export function buildParagrafoAsc(lang, { s, signo, essencia }) {
  const ess = essencia[signo] || contentForLang(lang, {
    pt: 'uma presença distinta', en: 'a distinct presence', es: 'una presencia distinta',
    it: 'una presenza distinta', de: 'eine ausgeprägte Präsenz', fr: 'une présence distincte',
  })
  return contentForLang(lang, {
    pt: `O Ascendente em ${s} é a máscara natural com que entras no mundo: ${ess}. É a primeira impressão que causas e o corpo-veículo da tua jornada evolutiva. Ao integrar conscientemente este signo, deixas de «actuar» a persona e passas a habitá-la com presença autêntica.`,
    en: `The Ascendant in ${s} is the natural mask with which you enter the world: ${ess}. It is the first impression you make and the body-vehicle of your evolutionary journey. By consciously integrating this sign, you stop "acting" the persona and begin to inhabit it with authentic presence.`,
    es: `El Ascendente en ${s} es la máscara natural con la que entras al mundo: ${ess}. Es la primera impresión que causas y el cuerpo-vehículo de tu viaje evolutivo. Al integrar conscientemente este signo, dejas de «actuar» la persona y empiezas a habitarla con presencia auténtica.`,
    it: `L\'Ascendente in ${s} è la maschera naturale con cui entri nel mondo: ${ess}. È la prima impressione che dai e il corpo-veicolo del tuo viaggio evolutivo. Integrando consapevolmente questo segno, smetti di «recitare» la persona e inizi ad abitarla con presenza autentica.`,
    de: `Der Aszendent in ${s} ist die natürliche Maske, mit der du in die Welt trittst: ${ess}. Es ist der erste Eindruck und der Körper-Wagen deiner evolutionären Reise. Wenn du dieses Zeichen bewusst integrierst, hörst du auf, die Persona zu «spielen», und bewohnst sie mit authentischer Präsenz.`,
    fr: `L\'Ascendant en ${s} est le masque naturel avec lequel tu entres dans le monde : ${ess}. C\'est la première impression que tu causes et le corps-véhicule de ton voyage évolutif. En intégrant consciemment ce signe, tu cesses de «jouer» la persona et commences à l\'habiter avec une présence authentique.`,
  })
}

export function buildDinamicaBig3(lang, { sol, lua, asc, sn, elemento, modalidade }) {
  if (!sol || !lua || !asc) {
    return contentForLang(lang, {
      pt: 'A interacção entre Sol, Lua e Ascendente revela a coreografia entre quem és (Sol), o que sentes (Lua) e como te apresentas (Ascendente). Integrar estes três polos é o primeiro passo da maturidade astrológica.',
      en: 'The interaction between Sun, Moon and Ascendant reveals the choreography between who you are (Sun), what you feel (Moon) and how you present yourself (Ascendant). Integrating these three poles is the first step of astrological maturity.',
      es: 'La interacción entre Sol, Luna y Ascendente revela la coreografía entre quién eres (Sol), lo que sientes (Luna) y cómo te presentas (Ascendente). Integrar estos tres polos es el primer paso de la madurez astrológica.',
      it: 'L\'interazione tra Sole, Luna e Ascendente rivela la coreografia tra chi sei (Sole), cosa senti (Luna) e come ti presenti (Ascendente). Integrare questi tre poli è il primo passo della maturità astrologica.',
      de: 'Die Wechselwirkung von Sonne, Mond und Aszendent zeigt die Choreografie zwischen wer du bist (Sonne), was du fühlst (Mond) und wie du dich zeigst (Aszendent). Diese drei Pole zu integrieren ist der erste Schritt astrologischer Reife.',
      fr: 'L\'interaction entre Soleil, Lune et Ascendant révèle la chorégraphie entre qui tu es (Soleil), ce que tu ressens (Lune) et comment tu te présentes (Ascendant). Intégrer ces trois pôles est la première étape de la maturité astrologique.',
    })
  }
  const eSol = elemCanon(sol), eLua = elemCanon(lua), eAsc = elemCanon(asc)
  const eSolL = elemento[sol], eLuaL = elemento[lua], eAscL = elemento[asc]
  const mSol = modalidade[sol], mLua = modalidade[lua]
  const ss = sn(sol), sl = sn(lua), sa = sn(asc)
  const partes = []

  if (eSol !== eLua) {
    const tensao = tensaoElem(eSol, eLua, lang)
    partes.push(contentForLang(lang, {
      pt: `Sol (${ss}/${eSolL}) e Lua (${sl}/${eLuaL}) dialogam com tensão ${tensao}. Não se tratam de inimigos internos - são dois idiomas que a tua psique fala.`,
      en: `Sun (${ss}/${eSolL}) and Moon (${sl}/${eLuaL}) dialogue with tension ${tensao}. They are not internal enemies - they are two languages your psyche speaks.`,
      es: `Sol (${ss}/${eSolL}) y Luna (${sl}/${eLuaL}) dialogan con tensión ${tensao}. No son enemigos internos: son dos idiomas que habla tu psique.`,
      it: `Sole (${ss}/${eSolL}) e Luna (${sl}/${eLuaL}) dialogano con tensione ${tensao}. Non sono nemici interiori: sono due linguaggi che la tua psiche parla.`,
      de: `Sonne (${ss}/${eSolL}) und Mond (${sl}/${eLuaL}) dialogisieren mit Spannung ${tensao}. Sie sind keine inneren Feinde – zwei Sprachen deiner Psyche.`,
      fr: `Soleil (${ss}/${eSolL}) et Lune (${sl}/${eLuaL}) dialoguent avec une tension ${tensao}. Ce ne sont pas des ennemis intérieurs – deux langues que parle ta psyché.`,
    }))
  } else {
    partes.push(contentForLang(lang, {
      pt: `Sol e Lua no mesmo elemento (${eSolL}) conferem coerência emocional-identitária: sentes e ages alinhados, embora possas carecer de contraste criativo.`,
      en: `Sun and Moon in the same element (${eSolL}) confer emotional-identity coherence: you feel and act aligned, though you may lack creative contrast.`,
      es: `Sol y Luna en el mismo elemento (${eSolL}) confieren coherencia emocional-identitaria: sientes y actúas alineado/a, aunque puedas carecer de contraste creativo.`,
      it: `Sole e Luna nello stesso elemento (${eSolL}) conferiscono coerenza emotivo-identitaria: senti e agisci allineato/a, anche se può mancare contrasto creativo.`,
      de: `Sonne und Mond im gleichen Element (${eSolL}) geben emotionale-identitäre Kohärenz: du fühlst und handelst im Einklang, auch wenn kreativer Kontrast fehlen kann.`,
      fr: `Soleil et Lune dans le même élément (${eSolL}) confèrent une cohérence émotionnelle-identitaire : tu ressens et agis aligné(e), même si le contraste créatif peut manquer.`,
    }))
  }

  if (eAsc !== eSol) {
    partes.push(contentForLang(lang, {
      pt: `O Ascendente em ${sa} (${eAscL}) colore a forma como o mundo lê o teu Sol em ${ss}: por vezes és percebido/a de forma diferente da tua essência íntima - usar isso como recurso, não como contradição.`,
      en: `The Ascendant in ${sa} (${eAscL}) colours how the world reads your Sun in ${ss}: sometimes you are perceived differently from your inner essence - use this as a resource, not a contradiction.`,
      es: `El Ascendente en ${sa} (${eAscL}) colorea cómo el mundo lee tu Sol en ${ss}: a veces eres percibido/a de forma distinta a tu esencia íntima – úsalo como recurso, no como contradicción.`,
      it: `L\'Ascendente in ${sa} (${eAscL}) colora come il mondo legge il tuo Sole in ${ss}: a volte sei percepito/a diversamente dalla tua essenza intima – usalo come risorsa, non contraddizione.`,
      de: `Der Aszendent in ${sa} (${eAscL}) färbt, wie die Welt deine Sonne in ${ss} liest: manchmal wirst du anders wahrgenommen als deine innere Essenz – nutze das als Ressource, nicht als Widerspruch.`,
      fr: `L\'Ascendant en ${sa} (${eAscL}) colore comment le monde lit ton Soleil en ${ss} : parfois tu es perçu(e) différemment de ton essence intime – utilise cela comme ressource, pas contradiction.`,
    }))
  } else {
    partes.push(contentForLang(lang, {
      pt: 'Ascendente e Sol partilham elemento: a tua imagem pública reforça a identidade - transparência e autenticidade são o teu superpoder social.',
      en: 'Ascendant and Sun share element: your public image reinforces identity - transparency and authenticity are your social superpower.',
      es: 'Ascendente y Sol comparten elemento: tu imagen pública refuerza la identidad – transparencia y autenticidad son tu superpoder social.',
      it: 'Ascendente e Sole condividono elemento: la tua immagine pubblica rafforza l\'identità – trasparenza e autenticità sono il tuo superpotere sociale.',
      de: 'Aszendent und Sonne teilen das Element: dein öffentliches Bild stärkt die Identität – Transparenz und Authentizität sind deine soziale Superkraft.',
      fr: 'Ascendant et Soleil partagent l\'élément : ton image publique renforce l\'identité – transparence et authenticité sont ton superpouvoir social.',
    }))
  }

  if (mSol !== mLua) {
    partes.push(contentForLang(lang, {
      pt: `Modalidades distintas (Sol ${mSol}, Lua ${mLua}) indicam ritmos internos diferentes: saber quando iniciar, sustentar ou adaptar é chave para o teu equilíbrio.`,
      en: `Different modalities (Sun ${mSol}, Moon ${mLua}) indicate different internal rhythms: knowing when to initiate, sustain or adapt is key to your balance.`,
      es: `Modalidades distintas (Sol ${mSol}, Luna ${mLua}) indican ritmos internos diferentes: saber cuándo iniciar, sostener o adaptar es clave para tu equilibrio.`,
      it: `Modalità distinte (Sole ${mSol}, Luna ${mLua}) indicano ritmi interni diversi: sapere quando iniziare, sostenere o adattarsi è chiave per il tuo equilibrio.`,
      de: `Unterschiedliche Modalitäten (Sonne ${mSol}, Mond ${mLua}) zeigen verschiedene innere Rhythmen: zu wissen, wann initiieren, halten oder anpassen, ist Schlüssel zu deinem Gleichgewicht.`,
      fr: `Modalités distinctes (Soleil ${mSol}, Lune ${mLua}) indiquent des rythmes intérieurs différents : savoir quand initier, soutenir ou s\'adapter est clé pour ton équilibre.`,
    }))
  }
  return partes.join(' ')
}

function planetaParagrafo(lang, planeta, s, signo, casa, essencia, temas, template) {
  const ess = essencia[signo] || ''
  const foco = casa ? (temas[casa]?.foco || '') : ''
  return contentForLang(lang, template)({ planeta, s, casa, ess, foco, casaEm: casaEm(lang, casa) })
}

const MERC_T = {
  pt: ({ s, casaEm: ce, ess, foco }) => `Mercúrio em ${s}${ce} define como pensas, aprendes e comunicas: ${ess || 'um estilo mental próprio'}. ${foco ? `A mente activa-se especialmente em ${foco}. ` : ''}Escreve, fala e questiona a partir deste lugar - é aí que a tua inteligência floresce.`,
  en: ({ s, casaEm: ce, ess, foco }) => `Mercury in ${s}${ce} defines how you think, learn and communicate: ${ess || 'your own mental style'}. ${foco ? `The mind activates especially in ${foco}. ` : ''}Write, speak and question from this place - that is where your intelligence flourishes.`,
  es: ({ s, casaEm: ce, ess, foco }) => `Mercurio en ${s}${ce} define cómo piensas, aprendes y comunicas: ${ess || 'un estilo mental propio'}. ${foco ? `La mente se activa especialmente en ${foco}. ` : ''}Escribe, habla y cuestiona desde este lugar: ahí florece tu inteligencia.`,
  it: ({ s, casaEm: ce, ess, foco }) => `Mercurio in ${s}${ce} definisce come pensi, impari e comunichi: ${ess || 'uno stile mentale proprio'}. ${foco ? `La mente si attiva soprattutto in ${foco}. ` : ''}Scrivi, parla e interroga da questo luogo: lì fiorisce la tua intelligenza.`,
  de: ({ s, casaEm: ce, ess, foco }) => `Merkur in ${s}${ce} definiert, wie du denkst, lernst und kommunizierst: ${ess || 'dein eigener mentaler Stil'}. ${foco ? `Der Geist aktiviert sich besonders in ${foco}. ` : ''}Schreibe, sprich und hinterfrage von hier – dort blüht deine Intelligenz.`,
  fr: ({ s, casaEm: ce, ess, foco }) => `Mercure en ${s}${ce} définit comment tu penses, apprends et communiques : ${ess || 'ton propre style mental'}. ${foco ? `L\'esprit s\'active surtout dans ${foco}. ` : ''}Écris, parle et questionne depuis ce lieu – c\'est là que ton intelligence fleurit.`,
}

const VEN_T = {
  pt: ({ s, casaEm: ce, ess, foco }) => `Vénus em ${s}${ce} revela a tua linguagem de amor e o que magnetiza: ${ess || 'valores relacionais únicos'}. ${foco ? `A abundância e o prazer fluem quando cultivas ${foco}.` : ''}`,
  en: ({ s, casaEm: ce, ess, foco }) => `Venus in ${s}${ce} reveals your love language and what magnetises you: ${ess || 'unique relational values'}. ${foco ? `Abundance and pleasure flow when you cultivate ${foco}.` : ''}`,
  es: ({ s, casaEm: ce, ess, foco }) => `Venus en ${s}${ce} revela tu lenguaje del amor y lo que magnetiza: ${ess || 'valores relacionales únicos'}. ${foco ? `La abundancia y el placer fluyen cuando cultivas ${foco}.` : ''}`,
  it: ({ s, casaEm: ce, ess, foco }) => `Venere in ${s}${ce} rivela il tuo linguaggio dell\'amore e ciò che magnetizza: ${ess || 'valori relazionali unici'}. ${foco ? `Abbondanza e piacere fluiscono quando coltivi ${foco}.` : ''}`,
  de: ({ s, casaEm: ce, ess, foco }) => `Venus in ${s}${ce} offenbart deine Sprache der Liebe und was dich magnetisiert: ${ess || 'einzigartige Beziehungswerte'}. ${foco ? `Fülle und Freude fließen, wenn du ${foco} kultivierst.` : ''}`,
  fr: ({ s, casaEm: ce, ess, foco }) => `Vénus en ${s}${ce} révèle ton langage de l\'amour et ce qui te magnétise : ${ess || 'valeurs relationnelles uniques'}. ${foco ? `L\'abondance et le plaisir coulent quand tu cultives ${foco}.` : ''}`,
}

const MAR_T = {
  pt: ({ s, casaEm: ce, ess, foco }) => `Marte em ${s}${ce} indica como assertas desejos, lidas com a raiva e inicias: ${ess || 'uma energia de acção particular'}. ${foco ? `O impulso vital concentra-se em ${foco}. Canalizar esta força evita explosões ou passividade.` : 'A chave é usar a tua coragem a favor de objectivos que te dignifiquem.'}`,
  en: ({ s, casaEm: ce, ess, foco }) => `Mars in ${s}${ce} indicates how you assert desires, handle anger and initiate: ${ess || 'a particular action energy'}. ${foco ? `Vital impulse concentrates in ${foco}. Channel this force to avoid explosions or passivity.` : 'The key is using your courage for goals that dignify you.'}`,
  es: ({ s, casaEm: ce, ess, foco }) => `Marte en ${s}${ce} indica cómo afirmas deseos, manejas la ira e inicias: ${ess || 'una energía de acción particular'}. ${foco ? `El impulso vital se concentra en ${foco}. Canalizar esta fuerza evita explosiones o pasividad.` : 'La clave es usar tu coraje para objetivos que te dignifiquen.'}`,
  it: ({ s, casaEm: ce, ess, foco }) => `Marte in ${s}${ce} indica come affermi desideri, gestisci la rabbia e inizi: ${ess || 'un\'energia d\'azione particolare'}. ${foco ? `L\'impulso vitale si concentra in ${foco}. Canalizzare questa forza evita esplosioni o passività.` : 'La chiave è usare il tuo coraggio per obiettivi che ti dignificano.'}`,
  de: ({ s, casaEm: ce, ess, foco }) => `Mars in ${s}${ce} zeigt, wie du Wünsche behauptest, Wut handhabst und initiierst: ${ess || 'eine besondere Handlungsenergie'}. ${foco ? `Vitaler Impuls konzentriert sich in ${foco}. Diese Kraft zu kanalisieren vermeidet Explosionen oder Passivität.` : 'Der Schlüssel ist, deinen Mut für Ziele zu nutzen, die dich würdigen.'}`,
  fr: ({ s, casaEm: ce, ess, foco }) => `Mars en ${s}${ce} indique comment tu affirmes tes désirs, gères la colère et initie : ${ess || 'une énergie d\'action particulière'}. ${foco ? `L\'élan vital se concentre dans ${foco}. Canaliser cette force évite explosions ou passivité.` : 'La clé est d\'utiliser ton courage pour des objectifs qui te dignifient.'}`,
}

const JUP_T = {
  pt: ({ s, casaEm: ce, ess, foco }) => `Júpiter em ${s}${ce} aponta onde a vida te expande com mais facilidade: ${ess || 'optimismo e crescimento'}. ${foco ? `A tua «sorte» filosófica activa-se em ${foco}. Confia, mas não exageres - Júpiter também inflaciona.` : ''}`,
  en: ({ s, casaEm: ce, ess, foco }) => `Jupiter in ${s}${ce} points where life expands most easily: ${ess || 'optimism and growth'}. ${foco ? `Your philosophical "luck" activates in ${foco}. Trust, but do not exaggerate - Jupiter also inflates.` : ''}`,
  es: ({ s, casaEm: ce, ess, foco }) => `Júpiter en ${s}${ce} señala dónde la vida te expande con más facilidad: ${ess || 'optimismo y crecimiento'}. ${foco ? `Tu «suerte» filosófica se activa en ${foco}. Confía, pero no exageres: Júpiter también infla.` : ''}`,
  it: ({ s, casaEm: ce, ess, foco }) => `Giove in ${s}${ce} indica dove la vita ti espande più facilmente: ${ess || 'ottimismo e crescita'}. ${foco ? `La tua «fortuna» filosofica si attiva in ${foco}. Fidati, ma non esagerare: Giove gonfia anche.` : ''}`,
  de: ({ s, casaEm: ce, ess, foco }) => `Jupiter in ${s}${ce} zeigt, wo das Leben dich am leichtesten erweitert: ${ess || 'Optimismus und Wachstum'}. ${foco ? `Dein philosophisches «Glück» aktiviert sich in ${foco}. Vertraue, aber übertreibe nicht – Jupiter bläht auch auf.` : ''}`,
  fr: ({ s, casaEm: ce, ess, foco }) => `Jupiter en ${s}${ce} indique où la vie t\'étend le plus facilement : ${ess || 'optimisme et croissance'}. ${foco ? `Ta «chance» philosophique s\'active dans ${foco}. Fais confiance, mais n\'exagère pas – Jupiter gonfle aussi.` : ''}`,
}

const SAT_T = {
  pt: ({ s, casaEm: ce, ess, foco }) => `Saturno em ${s}${ce} é o teu mestre kármico: ${ess || 'lições de maturidade'}. ${foco ? `Aqui sentes medo do fracasso até construíres competência sólida em ${foco}. A disciplina nesta área torna-se o teu trono.` : ''} Saturno não pune - ensina através do tempo.`,
  en: ({ s, casaEm: ce, ess, foco }) => `Saturn in ${s}${ce} is your karmic teacher: ${ess || 'lessons of maturity'}. ${foco ? `Here you fear failure until you build solid competence in ${foco}. Discipline in this area becomes your throne.` : ''} Saturn does not punish - it teaches through time.`,
  es: ({ s, casaEm: ce, ess, foco }) => `Saturno en ${s}${ce} es tu maestro kármico: ${ess || 'lecciones de madurez'}. ${foco ? `Aquí temes el fracaso hasta construir competencia sólida en ${foco}. La disciplina en esta área se convierte en tu trono.` : ''} Saturno no castiga: enseña con el tiempo.`,
  it: ({ s, casaEm: ce, ess, foco }) => `Saturno in ${s}${ce} è il tuo maestro karmico: ${ess || 'lezioni di maturità'}. ${foco ? `Qui temi il fallimento finché non costruisci competenza solida in ${foco}. La disciplina in quest\'area diventa il tuo trono.` : ''} Saturno non punisce: insegna col tempo.`,
  de: ({ s, casaEm: ce, ess, foco }) => `Saturn in ${s}${ce} ist dein karmischer Lehrer: ${ess || 'Lektionen der Reife'}. ${foco ? `Hier fürchtest du Versagen, bis du solide Kompetenz in ${foco} aufbaust. Disziplin in diesem Bereich wird dein Thron.` : ''} Saturn bestraft nicht – er lehrt durch die Zeit.`,
  fr: ({ s, casaEm: ce, ess, foco }) => `Saturne en ${s}${ce} est ton maître karmique : ${ess || 'leçons de maturité'}. ${foco ? `Ici tu crains l\'échec jusqu\'à construire une compétence solide dans ${foco}. La discipline dans ce domaine devient ton trône.` : ''} Saturne ne punit pas – il enseigne avec le temps.`,
}

export function buildParagrafoMerc(lang, ctx) { return planetaParagrafo(lang, 'Mercury', ctx.s, ctx.signo, ctx.casa, ctx.essencia, ctx.temas, MERC_T) }
export function buildParagrafoVen(lang, ctx) { return planetaParagrafo(lang, 'Venus', ctx.s, ctx.signo, ctx.casa, ctx.essencia, ctx.temas, VEN_T) }
export function buildParagrafoMar(lang, ctx) { return planetaParagrafo(lang, 'Mars', ctx.s, ctx.signo, ctx.casa, ctx.essencia, ctx.temas, MAR_T) }
export function buildParagrafoJup(lang, ctx) { return planetaParagrafo(lang, 'Jupiter', ctx.s, ctx.signo, ctx.casa, ctx.essencia, ctx.temas, JUP_T) }
export function buildParagrafoSat(lang, ctx) { return planetaParagrafo(lang, 'Saturn', ctx.s, ctx.signo, ctx.casa, ctx.essencia, ctx.temas, SAT_T) }

export function buildParagrafoMC(lang, { s, signo, essencia, temas }) {
  const ess = essencia[signo] || contentForLang(lang, {
    pt: 'uma missão profissional única', en: 'a unique professional mission', es: 'una misión profesional única',
    it: 'una missione professionale unica', de: 'eine einzigartige Berufsmission', fr: 'une mission professionnelle unique',
  })
  const tailKey = ['Capricórnio', 'Virgem', 'Touro'].includes(signo) ? 'consist'
    : ['Leão', 'Carneiro', 'Sagitário'].includes(signo) ? 'lead' : 'sens'
  const tails = {
    consist: { pt: 'e consistência', en: 'and consistency', es: 'y consistencia', it: 'e coerenza', de: 'und Beständigkeit', fr: 'et constance' },
    lead: { pt: 'e liderança inspiradora', en: 'and inspiring leadership', es: 'y liderazgo inspirador', it: 'e leadership ispiratrice', de: 'und inspirierende Führung', fr: 'et leadership inspirant' },
    sens: { pt: 'e sensibilidade estratégica', en: 'and strategic sensitivity', es: 'y sensibilidad estratégica', it: 'e sensibilità strategica', de: 'und strategische Sensibilität', fr: 'et sensibilité stratégique' },
  }
  const tail = contentForLang(lang, tails[tailKey])
  const foco10 = temas[10]?.foco || contentForLang(lang, {
    pt: 'assumes o teu lugar no palco social', en: 'take your place on the social stage',
    es: 'asumes tu lugar en el escenario social', it: 'assumi il tuo posto sul palcoscenico sociale',
    de: 'deinen Platz auf der sozialen Bühne einnimmst', fr: 'prends ta place sur la scène sociale',
  })
  return contentForLang(lang, {
    pt: `O Meio do Céu em ${s} define a tua vocação pública e o legado que buscas deixar: ${ess}. A carreira ideal não é apenas um emprego - é a expressão visível da tua autoridade interior. Em ${s}, o mundo reconhece-te quando ${foco10} com autenticidade ${tail}.`,
    en: `The Midheaven in ${s} defines your public vocation and the legacy you seek to leave: ${ess}. The ideal career is not just a job - it is the visible expression of your inner authority. In ${s}, the world recognises you when you ${foco10} with authenticity ${tail}.`,
    es: `El Medio Cielo en ${s} define tu vocación pública y el legado que buscas dejar: ${ess}. La carrera ideal no es solo un empleo: es la expresión visible de tu autoridad interior. En ${s}, el mundo te reconoce cuando ${foco10} con autenticidad ${tail}.`,
    it: `Il Medio Cielo in ${s} definisce la tua vocazione pubblica e l\'eredità che cerchi di lasciare: ${ess}. La carriera ideale non è solo un lavoro: è l\'espressione visibile della tua autorità interiore. In ${s}, il mondo ti riconosce quando ${foco10} con autenticità ${tail}.`,
    de: `Das Medium Coeli in ${s} definiert deine öffentliche Berufung und das Erbe, das du hinterlassen willst: ${ess}. Der ideale Beruf ist nicht nur ein Job – er ist der sichtbare Ausdruck deiner inneren Autorität. In ${s} erkennt dich die Welt, wenn du ${foco10} mit Authentizität ${tail}.`,
    fr: `Le Milieu du Ciel en ${s} définit ta vocation publique et l\'héritage que tu cherches à laisser : ${ess}. La carrière idéale n\'est pas qu\'un emploi – c\'est l\'expression visible de ton autorité intérieure. En ${s}, le monde te reconnaît quand tu ${foco10} avec authenticité ${tail}.`,
  })
}

export function buildParagrafoGeracional(lang, { nome, s, signo, casa, essencia, temas }) {
  const ess = essencia[signo] || ''
  const foco = casa ? temas[casa]?.foco : ''
  const ce = casaEm(lang, casa)
  const karma = contentForLang(lang, {
    pt: 'crescimento kármico', en: 'karmic growth', es: 'crecimiento kármico',
    it: 'crescita karmica', de: 'karmisches Wachstum', fr: 'croissance karmique',
  })
  const templates = {
    Urano: {
      pt: `Urano em ${s}${ce} marca a tua relação com a liberdade, a inovação e as rupturas necessárias. ${ess} ${foco ? `Revoluções pessoais activam-se em ${foco}.` : ''} Onde te sentes sufocado por rotinas obsoletas, Urano pede autenticidade radical.`,
      en: `Uranus in ${s}${ce} marks your relationship with freedom, innovation and necessary ruptures. ${ess} ${foco ? `Personal revolutions activate in ${foco}.` : ''} Where you feel suffocated by obsolete routines, Uranus demands radical authenticity.`,
      es: `Urano en ${s}${ce} marca tu relación con la libertad, la innovación y las rupturas necesarias. ${ess} ${foco ? `Las revoluciones personales se activan en ${foco}.` : ''} Donde te sientes sofocado por rutinas obsoletas, Urano pide autenticidad radical.`,
      it: `Urano in ${s}${ce} segna la tua relazione con libertà, innovazione e rotture necessarie. ${ess} ${foco ? `Le rivoluzioni personali si attivano in ${foco}.` : ''} Dove ti senti soffocato da routine obsolete, Urano chiede autenticità radicale.`,
      de: `Uranus in ${s}${ce} markiert deine Beziehung zu Freiheit, Innovation und notwendigen Brüchen. ${ess} ${foco ? `Persönliche Revolutionen aktivieren sich in ${foco}.` : ''} Wo obsolete Routinen dich ersticken, verlangt Uranus radikale Authentizität.`,
      fr: `Uranus en ${s}${ce} marque ta relation à la liberté, l\'innovation et les ruptures nécessaires. ${ess} ${foco ? `Les révolutions personnelles s\'activent dans ${foco}.` : ''} Là où les routines obsolètes t\'étouffent, Uranus exige une authenticité radicale.`,
    },
    Neptuno: {
      pt: `Neptuno em ${s}${ce} abre portas ao plano simbólico, espiritual e criativo. ${ess} ${foco ? `A dissolução de fronteiras opera em ${foco}.` : ''} Cuidado com ilusões - Neptuno também nebuliza; a intuição precisa de ancoragem.`,
      en: `Neptune in ${s}${ce} opens doors to the symbolic, spiritual and creative plane. ${ess} ${foco ? `Dissolution of boundaries operates in ${foco}.` : ''} Beware of illusions - Neptune also clouds; intuition needs grounding.`,
      es: `Neptuno en ${s}${ce} abre puertas al plano simbólico, espiritual y creativo. ${ess} ${foco ? `La disolución de fronteras opera en ${foco}.` : ''} Cuidado con las ilusiones: Neptuno también nubla; la intuición necesita anclaje.`,
      it: `Nettuno in ${s}${ce} apre porte al piano simbolico, spirituale e creativo. ${ess} ${foco ? `La dissoluzione dei confini opera in ${foco}.` : ''} Attenzione alle illusioni: Nettuno anche offusca; l\'intuizione ha bisogno di radicamento.`,
      de: `Neptun in ${s}${ce} öffnet Türen zur symbolischen, spirituellen und kreativen Ebene. ${ess} ${foco ? `Auflösung von Grenzen wirkt in ${foco}.` : ''} Vorsicht vor Illusionen – Neptun trübt auch; Intuition braucht Verankerung.`,
      fr: `Neptune en ${s}${ce} ouvre des portes au plan symbolique, spirituel et créatif. ${ess} ${foco ? `La dissolution des frontières opère dans ${foco}.` : ''} Attention aux illusions – Neptune brouille aussi ; l\'intuition a besoin d\'ancrage.`,
    },
    Plutão: {
      pt: `Plutão em ${s}${ce} indica onde a transformação profunda é inevitável. ${ess} ${foco ? `Crises regeneradoras concentram-se em ${foco}.` : ''} O que morre aqui renasce com mais poder autêntico.`,
      en: `Pluto in ${s}${ce} indicates where deep transformation is inevitable. ${ess} ${foco ? `Regenerative crises concentrate in ${foco}.` : ''} What dies here is reborn with more authentic power.`,
      es: `Plutón en ${s}${ce} indica dónde la transformación profunda es inevitable. ${ess} ${foco ? `Las crisis regeneradoras se concentran en ${foco}.` : ''} Lo que muere aquí renace con más poder auténtico.`,
      it: `Plutone in ${s}${ce} indica dove la trasformazione profonda è inevitabile. ${ess} ${foco ? `Le crisi rigeneratrici si concentrano in ${foco}.` : ''} Ciò che muore qui rinasce con più potere autentico.`,
      de: `Pluto in ${s}${ce} zeigt, wo tiefe Transformation unvermeidlich ist. ${ess} ${foco ? `Regenerative Krisen konzentrieren sich in ${foco}.` : ''} Was hier stirbt, wird mit authentischerer Kraft wiedergeboren.`,
      fr: `Pluton en ${s}${ce} indique où la transformation profonde est inévitable. ${ess} ${foco ? `Les crises régénératrices se concentrent dans ${foco}.` : ''} Ce qui meurt ici renaît avec plus de pouvoir authentique.`,
    },
    'Nodo Norte': {
      pt: `O Nodo Norte em ${s}${ce} aponta a direcção evolutiva da tua alma nesta vida: ${ess || karma}. ${foco ? `O destino evolutivo liga-se a ${foco}.` : ''} Os hábitos do Nodo Sul (signo oposto) são confortáveis mas já não te servem.`,
      en: `The North Node in ${s}${ce} points to your soul's evolutionary direction in this life: ${ess || karma}. ${foco ? `The evolutionary destiny links to ${foco}.` : ''} South Node habits are comfortable but no longer serve you.`,
      es: `El Nodo Norte en ${s}${ce} señala la dirección evolutiva de tu alma en esta vida: ${ess || karma}. ${foco ? `El destino evolutivo se vincula a ${foco}.` : ''} Los hábitos del Nodo Sur son cómodos pero ya no te sirven.`,
      it: `Il Nodo Nord in ${s}${ce} indica la direzione evolutiva della tua anima in questa vita: ${ess || karma}. ${foco ? `Il destino evolutivo si collega a ${foco}.` : ''} Le abitudini del Nodo Sud sono comode ma non ti servono più.`,
      de: `Der Nordknoten in ${s}${ce} zeigt die evolutionäre Richtung deiner Seele in diesem Leben: ${ess || karma}. ${foco ? `Das evolutionäre Schicksal verbindet sich mit ${foco}.` : ''} Südknoten-Gewohnheiten sind bequem, dienen dir aber nicht mehr.`,
      fr: `Le Nœud Nord en ${s}${ce} indique la direction évolutive de ton âme dans cette vie : ${ess || karma}. ${foco ? `Le destin évolutif se lie à ${foco}.` : ''} Les habitudes du Nœud Sud sont confortables mais ne te servent plus.`,
    },
    Quíron: {
      pt: `Quíron em ${s}${ce} revela a ferida-sabedoria - o ponto onde sentes inadequação e onde, precisamente por isso, podes curar outros. ${foco ? `A cura passa por ${foco}.` : ''}`,
      en: `Chiron in ${s}${ce} reveals the wound-wisdom - where you feel inadequate and where, precisely because of that, you can heal others. ${foco ? `Healing passes through ${foco}.` : ''}`,
      es: `Quirón en ${s}${ce} revela la herida-sabiduría: el punto donde sientes inadecuación y donde, precisamente por eso, puedes curar a otros. ${foco ? `La cura pasa por ${foco}.` : ''}`,
      it: `Chirone in ${s}${ce} rivela la ferita-saggezza: il punto dove senti inadeguatezza e dove, proprio per questo, puoi curare gli altri. ${foco ? `La guarigione passa per ${foco}.` : ''}`,
      de: `Chiron in ${s}${ce} offenbart die Wunde-Weisheit – wo du dich unzulänglich fühlst und wo du gerade deshalb andere heilen kannst. ${foco ? `Heilung geht durch ${foco}.` : ''}`,
      fr: `Chiron en ${s}${ce} révèle la blessure-sagesse : l\'endroit où tu te sens inadéquat(e) et où, précisément pour cela, tu peux guérir les autres. ${foco ? `La guérison passe par ${foco}.` : ''}`,
    },
  }
  const t = templates[nome]
  if (t) return contentForLang(lang, t)
  return contentForLang(lang, {
    pt: `${nome} em ${s}${casa ? ` na Casa ${casa}` : ''} colore dimensões transpersonais do teu mapa.`,
    en: `${nome} in ${s}${casa ? ` in House ${casa}` : ''} colours transpersonal dimensions of your chart.`,
    es: `${nome} en ${s}${casa ? ` en Casa ${casa}` : ''} colorea dimensiones transpersonales de tu carta.`,
    it: `${nome} in ${s}${casa ? ` in Casa ${casa}` : ''} colora dimensioni transpersonali della tua carta.`,
    de: `${nome} in ${s}${casa ? ` im Haus ${casa}` : ''} färbt transpersonale Dimensionen deines Horoskops.`,
    fr: `${nome} en ${s}${casa ? ` en Maison ${casa}` : ''} colore les dimensions transpersonnelles de ta carte.`,
  })
}

export function buildResumoGratuito(lang, { sn, mapaNatal, gancho }) {
  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  return {
    sol: sol ? contentForLang(lang, {
      pt: `O teu Sol em ${sn(sol)} define o núcleo da tua identidade - mas em que *casa* brilhas? Isso muda tudo.`,
      en: `Your Sun in ${sn(sol)} defines the core of your identity - but in which *house* do you shine? That changes everything.`,
      es: `Tu Sol en ${sn(sol)} define el núcleo de tu identidad, pero ¿en qué *casa* brillas? Eso lo cambia todo.`,
      it: `Il tuo Sole in ${sn(sol)} definisce il nucleo della tua identità – ma in quale *casa* brilli? Questo cambia tutto.`,
      de: `Deine Sonne in ${sn(sol)} definiert den Kern deiner Identität – aber in welchem *Haus* strahlst du? Das ändert alles.`,
      fr: `Ton Soleil en ${sn(sol)} définit le cœur de ton identité – mais dans quelle *maison* brilles-tu ? Cela change tout.`,
    }) : null,
    lua: lua ? contentForLang(lang, {
      pt: `A Lua em ${sn(lua)} regula o teu mundo emocional. A casa lunar revela onde buscas segurança - informação reservada ao mapa completo.`,
      en: `The Moon in ${sn(lua)} regulates your emotional world. The lunar house reveals where you seek security - reserved for the full chart.`,
      es: `La Luna en ${sn(lua)} regula tu mundo emocional. La casa lunar revela dónde buscas seguridad – reservado para la carta completa.`,
      it: `La Luna in ${sn(lua)} regola il tuo mondo emotivo. La casa lunare rivela dove cerchi sicurezza – riservato alla carta completa.`,
      de: `Der Mond in ${sn(lua)} reguliert deine emotionale Welt. Das Mondhaus zeigt, wo du Sicherheit suchst – dem vollen Horoskop vorbehalten.`,
      fr: `La Lune en ${sn(lua)} régule ton monde émotionnel. La maison lunaire révèle où tu cherches la sécurité – réservé à la carte complète.`,
    }) : null,
    asc: asc ? contentForLang(lang, {
      pt: `Ascendente em ${sn(asc)}: o mundo vê-te através desta lente. A combinação Sol–Lua–Ascendente forma a tua assinatura psíquica única.`,
      en: `Ascendant in ${sn(asc)}: the world sees you through this lens. The Sun–Moon–Ascendant combination forms your unique psychic signature.`,
      es: `Ascendente en ${sn(asc)}: el mundo te ve a través de esta lente. La combinación Sol–Luna–Ascendente forma tu firma psíquica única.`,
      it: `Ascendente in ${sn(asc)}: il mondo ti vede attraverso questa lente. La combinazione Sole–Luna–Ascendente forma la tua firma psichica unica.`,
      de: `Aszendent in ${sn(asc)}: die Welt sieht dich durch diese Linse. Die Kombination Sonne–Mond–Aszendent bildet deine einzigartige psychische Signatur.`,
      fr: `Ascendant en ${sn(asc)} : le monde te voit à travers cette lentille. La combinaison Soleil–Lune–Ascendant forme ta signature psychique unique.`,
    }) : null,
    gancho,
  }
}

export function buildSinteseAspectoTenso(lang, { asp, L }) {
  if (!asp) {
    return {
      titulo: L.harmonia,
      texto: contentForLang(lang, {
        pt: 'Não há quadratura ou oposição dominante nos aspectos principais - isso não significa vida fácil, mas indica que os teus planetas pessoais dialogam com relativa fluidez. O teu crescimento virá de integrar polaridades subtis (Sol/Lua/Ascendente) em vez de grandes choques internos.',
        en: 'There is no dominant square or opposition among major aspects - this does not mean an easy life, but indicates your personal planets dialogue with relative fluidity. Your growth will come from integrating subtle polarities (Sun/Moon/Ascendant) rather than major internal clashes.',
        es: 'No hay cuadratura u oposición dominante en los aspectos principales: no significa vida fácil, pero indica que tus planetas personales dialogan con relativa fluidez. Tu crecimiento vendrá de integrar polaridades sutiles (Sol/Luna/Ascendente) en vez de grandes choques internos.',
        it: 'Non c\'è quadratura o opposizione dominante negli aspetti principali: non significa vita facile, ma indica che i tuoi pianeti personali dialogano con relativa fluidità. La crescita verrà dall\'integrare polarità sottili (Sole/Luna/Ascendente) invece di grandi scontri interni.',
        de: 'Kein dominantes Quadrat oder Opposition unter den Hauptaspekten – das bedeutet kein leichtes Leben, zeigt aber, dass deine persönlichen Planeten mit relativer Flüssigkeit dialogisieren. Wachstum kommt durch Integration subtiler Polaritäten (Sonne/Mond/Aszendent) statt großer innerer Konflikte.',
        fr: 'Pas de carré ou opposition dominant parmi les aspects majeurs – cela ne signifie pas une vie facile, mais indique que tes planètes personnelles dialoguent avec une fluidité relative. Ta croissance viendra d\'intégrer des polarités subtiles (Soleil/Lune/Ascendant) plutôt que de grands chocs internes.',
      }),
      conselho: contentForLang(lang, {
        pt: 'Aprofunda autoconhecimento nas áreas de casa que mais te movem emocionalmente.',
        en: 'Deepen self-knowledge in the house areas that move you most emotionally.',
        es: 'Profundiza el autoconocimiento en las áreas de casa que más te mueven emocionalmente.',
        it: 'Approfondisci l\'autoconoscenza nelle aree di casa che ti muovono di più emotivamente.',
        de: 'Vertiefe Selbsterkenntnis in den Hausbereichen, die dich emotional am meisten bewegen.',
        fr: 'Approfondis la connaissance de toi dans les domaines de maison qui te touchent le plus émotionnellement.',
      }),
    }
  }
  const nomeAsp = asp.aspecto === 'Oposicao'
    ? contentForLang(lang, { pt: 'Oposição', en: 'Opposition', es: 'Oposición', it: 'Opposizione', de: 'Opposition', fr: 'Opposition' })
    : translateAspecto(asp.aspecto, lang)
  const pA = translatePlaneta(asp.planetaA, lang)
  const pB = translatePlaneta(asp.planetaB, lang)
  const orbeLabel = lang === 'pt' ? 'orbe' : 'orb'
  return {
    titulo: `${nomeAsp} ${pA} · ${pB} (${orbeLabel} ${asp.orbe})`,
    texto: contentForLang(lang, {
      pt: `O aspecto mais tenso do teu mapa é a ${nomeAsp} entre ${asp.planetaA} e ${asp.planetaB}. Esta tensão não é maldição - é combustível evolutivo. Onde sentes «puxar para lados opostos», nasce a tua maior competência quando aprendes a negociar internamente em vez de escolher um polo e rejeitar o outro.`,
      en: `The most tense aspect in your chart is the ${nomeAsp} between ${pA} and ${pB}. This tension is not a curse - it is evolutionary fuel. Where you feel "pulled in opposite directions", your greatest competence is born when you learn to negotiate internally instead of choosing one pole and rejecting the other.`,
      es: `El aspecto más tenso de tu carta es la ${nomeAsp} entre ${pA} y ${pB}. Esta tensión no es maldición: es combustible evolutivo. Donde sientes «tirar hacia lados opuestos», nace tu mayor competencia al aprender a negociar internamente en vez de elegir un polo y rechazar el otro.`,
      it: `L\'aspetto più teso della tua carta è la ${nomeAsp} tra ${pA} e ${pB}. Questa tensione non è maledizione: è combustibile evolutivo. Dove senti «tirare verso poli opposti», nasce la tua maggiore competenza quando impari a negoziare internamente invece di scegliere un polo e rifiutare l\'altro.`,
      de: `Der spannungsreichste Aspekt deines Horoskops ist das ${nomeAsp} zwischen ${pA} und ${pB}. Diese Spannung ist kein Fluch – evolutionärer Treibstoff. Wo du dich «in entgegengesetzte Richtungen gezogen» fühlst, entsteht deine größte Kompetenz, wenn du intern verhandelst statt einen Pol zu wählen und den anderen abzulehnen.`,
      fr: `L\'aspect le plus tendu de ta carte est la ${nomeAsp} entre ${pA} et ${pB}. Cette tension n\'est pas une malédiction – c\'est du carburant évolutif. Là où tu te sens «tiré(e) vers des pôles opposés», naît ta plus grande compétence quand tu apprends à négocier intérieurement au lieu de choisir un pôle et rejeter l\'autre.`,
    }),
    conselho: contentForLang(lang, {
      pt: `Usa a ${nomeAsp} como professor/a: quando surgir conflito entre estas energias, pausa e pergunta «o que cada uma precisa de ser ouvida?». A integração deste aspecto é o teu superpoder de maturidade.`,
      en: `Use the ${nomeAsp} as your teacher: when conflict arises between these energies, pause and ask "what does each need to be heard?". Integrating this aspect is your maturity superpower.`,
      es: `Usa la ${nomeAsp} como maestro/a: cuando surja conflicto entre estas energías, pausa y pregunta «¿qué necesita cada una ser escuchada?». Integrar este aspecto es tu superpoder de madurez.`,
      it: `Usa la ${nomeAsp} come maestro/a: quando sorge conflitto tra queste energie, fermati e chiedi «cosa ha bisogno ciascuna di essere ascoltata?». Integrare questo aspetto è il tuo superpotere di maturità.`,
      de: `Nutze das ${nomeAsp} als Lehrer: bei Konflikt zwischen diesen Energien halte inne und frage «was braucht jede, gehört zu werden?». Diesen Aspekt zu integrieren ist deine Reife-Superkraft.`,
      fr: `Utilise la ${nomeAsp} comme professeur : quand un conflit surgit entre ces énergies, pause et demande «de quoi chacune a besoin pour être entendue ?». Intégrer cet aspect est ton superpouvoir de maturité.`,
    }),
  }
}

export function buildConselhoFinal(lang, { sol, lua, casaTxt, casaSat, casaJup }) {
  const satBit = casaSat ? contentForLang(lang, {
    pt: `Saturno na ${casaSat}ª Casa pede paciência estruturada - constrói tijolo a tijolo.`,
    en: `Saturn in the ${casaSat}th House asks for structured patience - build brick by brick.`,
    es: `Saturno en la Casa ${casaSat} pide paciencia estructurada: construye ladrillo a ladrillo.`,
    it: `Saturno nella Casa ${casaSat} chiede pazienza strutturata: costruisci mattone su mattone.`,
    de: `Saturn im ${casaSat}. Haus verlangt strukturierte Geduld – Stein für Stein bauen.`,
    fr: `Saturne en Maison ${casaSat} demande une patience structurée – construis brique par brique.`,
  }) : ''
  const jupBit = casaJup ? contentForLang(lang, {
    pt: `Júpiter na ${casaJup}ª Casa abre portas quando te permites crescer além do conforto conhecido.`,
    en: `Jupiter in the ${casaJup}th House opens doors when you allow yourself to grow beyond known comfort.`,
    es: `Júpiter en la Casa ${casaJup} abre puertas cuando te permites crecer más allá del confort conocido.`,
    it: `Giove nella Casa ${casaJup} apre porte quando ti permetti di crescere oltre il comfort conosciuto.`,
    de: `Jupiter im ${casaJup}. Haus öffnet Türen, wenn du dich über bekannten Komfort hinaus entwickelst.`,
    fr: `Jupiter en Maison ${casaJup} ouvre des portes quand tu te permets de grandir au-delà du confort connu.`,
  }) : ''
  return contentForLang(lang, {
    pt: `Nos próximos meses, honra o teu Sol em ${sol} actuando com coragem na ${casaTxt}. Cuida da Lua em ${lua} criando rotinas de segurança emocional. ${satBit} ${jupBit} O cosmos não decide por ti: oferece o mapa. Tu traças o caminho.`,
    en: `In the coming months, honour your Sun in ${sol} by acting with courage in ${casaTxt}. Care for the Moon in ${lua} by creating emotional security routines. ${satBit} ${jupBit} The cosmos does not decide for you: it offers the map. You trace the path.`,
    es: `En los próximos meses, honra tu Sol en ${sol} actuando con valor en ${casaTxt}. Cuida la Luna en ${lua} creando rutinas de seguridad emocional. ${satBit} ${jupBit} El cosmos no decide por ti: ofrece la carta. Tú trazas el camino.`,
    it: `Nei prossimi mesi, onora il tuo Sole in ${sol} agendo con coraggio in ${casaTxt}. Cura la Luna in ${lua} creando routine di sicurezza emotiva. ${satBit} ${jupBit} Il cosmo non decide per te: offre la carta. Tu tracci il cammino.`,
    de: `In den kommenden Monaten ehre deine Sonne in ${sol}, indem du mit Mut in ${casaTxt} handelst. Pflege den Mond in ${lua} mit Routinen emotionaler Sicherheit. ${satBit} ${jupBit} Der Kosmos entscheidet nicht für dich: er bietet die Karte. Du zeichnest den Weg.`,
    fr: `Dans les mois à venir, honore ton Soleil en ${sol} en agissant avec courage dans ${casaTxt}. Prends soin de la Lune en ${lua} en créant des routines de sécurité émotionnelle. ${satBit} ${jupBit} Le cosmos ne décide pas pour toi : il offre la carte. Tu traces le chemin.`,
  })
}
