/** Textos de envolvimento da sinastria — 6 idiomas. */
import { contentForLang } from './langUtil.js'

export function sx(lang, bundle, ...args) {
  const tpl = contentForLang(lang, bundle) ?? contentForLang('en', bundle) ?? contentForLang('pt', bundle)
  return typeof tpl === 'function' ? tpl(...args) : (tpl ?? '')
}

export const NOME_PADRAO_A = {
  pt: 'Tu', en: 'You', es: 'Tú', it: 'Tu', de: 'Du', fr: 'Toi',
}

export const NOME_PADRAO_B = {
  pt: 'o(a) parceiro(a)',
  en: 'your partner',
  es: 'tu pareja',
  it: 'il/la partner',
  de: 'dein(e) Partner(in)',
  fr: 'ton/ta partenaire',
}

export const NOME_PESSOA = {
  pt: 'Esta pessoa',
  en: 'This person',
  es: 'Esta persona',
  it: 'Questa persona',
  de: 'Diese Person',
  fr: 'Cette personne',
}

export function aberturaProfessor(lang, nomeA, nomeB, tema) {
  return sx(lang, {
    pt: (a, b, t) => `${a}, os astros falam contigo directamente sobre **${t}** com ${b}. Esta é a tua sinastria pessoal - tecida a partir do teu mapa exacto cruzado com o dele/a. Nada de texto genérico: cada frase reflecte o teu céu.\n\n`,
    en: (a, b, t) => `${a}, the stars speak directly to you about **${t}** with ${b}. This is your personal synastry - woven from your exact birth chart crossed with theirs. No generic text: every sentence reflects your sky.\n\n`,
    es: (a, b, t) => `${a}, los astros te hablan directamente sobre **${t}** con ${b}. Esta es tu sinastría personal, tejida a partir de tu carta exacta cruzada con la suya. Nada de texto genérico: cada frase refleja tu cielo.\n\n`,
    it: (a, b, t) => `${a}, le stelle ti parlano direttamente di **${t}** con ${b}. Questa è la tua sinastria personale, tessuta dal tuo tema esatto incrociato con il suo. Niente testo generico: ogni frase riflette il tuo cielo.\n\n`,
    de: (a, b, t) => `${a}, die Sterne sprechen dich direkt an über **${t}** mit ${b}. Dies ist deine persönliche Synastrie – gewebt aus deinem exakten Horoskop gekreuzt mit dem ihrem/seinem. Kein generischer Text: jeder Satz spiegelt deinen Himmel.\n\n`,
    fr: (a, b, t) => `${a}, les astres te parlent directement de **${t}** avec ${b}. C'est ta synastrie personnelle, tissée à partir de ta carte exacte croisée avec la sienne. Pas de texte générique : chaque phrase reflète ton ciel.\n\n`,
  }, nomeA, nomeB, tema)
}

export const TEMA_QUIMICA = {
  pt: 'atração sexual e química',
  en: 'sexual attraction and chemistry',
  es: 'atracción sexual y química',
  it: 'attrazione sessuale e chimica',
  de: 'sexuelle Anziehung und Chemie',
  fr: 'attraction sexuelle et alchimie',
}

export const TEMA_EMOCAO = {
  pt: 'sintonia emocional',
  en: 'emotional harmony',
  es: 'sintonía emocional',
  it: 'sintonia emotiva',
  de: 'emotionale Harmonie',
  fr: 'harmonie émotionnelle',
}

export const TEMA_COMUNICACAO = {
  pt: 'comunicação e diálogo',
  en: 'communication and dialogue',
  es: 'comunicación y diálogo',
  it: 'comunicazione e dialogo',
  de: 'Kommunikation und Dialog',
  fr: 'communication et dialogue',
}

export const TEMA_FUTURO = {
  pt: 'projectos e futuro',
  en: 'projects and future',
  es: 'proyectos y futuro',
  it: 'progetti e futuro',
  de: 'Projekte und Zukunft',
  fr: 'projets et avenir',
}

export const TOM_ASPECTO = {
  Trígono: {
    pt: 'flui com naturalidade', en: 'flows naturally', es: 'fluye con naturalidad',
    it: 'fluisce con naturalezza', de: 'fließt natürlich', fr: 'coule naturellement',
  },
  Sextil: {
    pt: 'abre portas cooperativas', en: 'opens cooperative doors', es: 'abre puertas cooperativas',
    it: 'apre porte cooperative', de: 'öffnet kooperative Türen', fr: 'ouvre des portes coopératives',
  },
  Conjunção: {
    pt: 'fundem-se intensamente', en: 'merges intensely', es: 'se fusionan intensamente',
    it: 'si fondono intensamente', de: 'verschmelzen intensiv', fr: 'fusionnent intensément',
  },
  Quadratura: {
    pt: 'cria atrito que exige crescimento', en: 'creates friction that demands growth', es: 'crea fricción que exige crecimiento',
    it: 'crea attrito che esige crescita', de: 'erzeugt Reibung, die Wachstum verlangt', fr: 'crée une friction qui exige croissance',
  },
  Oposição: {
    pt: 'polariza e espelha o que falta a cada um', en: 'polarizes and mirrors what each lacks', es: 'polariza y refleja lo que falta a cada uno',
    it: 'polarizza e rispecchia ciò che manca a ciascuno', de: 'polarisiert und spiegelt, was jedem fehlt', fr: 'polarise et reflète ce qui manque à chacun',
  },
  _default: {
    pt: 'conectam', en: 'connect', es: 'conectan', it: 'si collegano', de: 'verbinden sich', fr: 'se connectent',
  },
}

export function textoAspectoNarrativa(lang, nomeA, nomeB, a, tsAsp, tsSignA, tsSignB) {
  const tom = contentForLang(lang, TOM_ASPECTO[a.nome]) || contentForLang(lang, TOM_ASPECTO._default)
  const asp = tsAsp(a.nome)
  return sx(lang, {
    pt: (na, nb, pA, pB, t, as, sA, sB) => `${na}, quando o teu céu encontra o de ${nb}, ${pA} e ${pB} ${t} numa ${as.toLowerCase()} (${sA} · ${sB}). O cosmos aponta para este fio na vossa ligação - presta atenção.`,
    en: (na, nb, pA, pB, t, as, sA, sB) => `${na}, when your sky meets ${nb}'s, ${pA} and ${pB} ${t} in a ${as.toLowerCase()} (${sA} · ${sB}). The cosmos is pointing at this thread in your bond - pay attention.`,
    es: (na, nb, pA, pB, t, as, sA, sB) => `${na}, cuando tu cielo encuentra el de ${nb}, ${pA} y ${pB} ${t} en ${as.toLowerCase()} (${sA} · ${sB}). El cosmos señala este hilo en vuestro vínculo: presta atención.`,
    it: (na, nb, pA, pB, t, as, sA, sB) => `${na}, quando il tuo cielo incontra quello di ${nb}, ${pA} e ${pB} ${t} in ${as.toLowerCase()} (${sA} · ${sB}). Il cosmo indica questo filo nel vostro legame: presta attenzione.`,
    de: (na, nb, pA, pB, t, as, sA, sB) => `${na}, wenn dein Himmel auf den von ${nb} trifft, ${t} ${pA} und ${pB} in einem ${as} (${sA} · ${sB}). Der Kosmos zeigt auf diesen Faden in eurer Verbindung – achte darauf.`,
    fr: (na, nb, pA, pB, t, as, sA, sB) => `${na}, quand ton ciel rencontre celui de ${nb}, ${pA} et ${pB} ${t} en ${as.toLowerCase()} (${sA} · ${sB}). Le cosmos pointe ce fil dans votre lien – fais attention.`,
  }, nomeA, nomeB, a.pessoaA, a.pessoaB, tom, asp, tsSignA(a.signoA), tsSignB(a.signoB))
}

export function textoAspectoComposto(lang, a, tsAsp) {
  const asp = tsAsp(a.nome)
  if (a.harmonico) {
    return sx(lang, {
      pt: () => `• **${a.corpoA} ${a.nome.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): dom natural do vosso relacionamento - a energia flui aqui com facilidade, sem precisarem forçar.`,
      en: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): a natural gift in your relationship - energy flows here with ease, without you having to force it.`,
      es: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): don natural de vuestra relación: la energía fluye aquí con facilidad, sin forzar.`,
      it: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): dono naturale della vostra relazione: l'energia fluisce qui con facilità, senza forzare.`,
      de: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): natürliches Geschenk eurer Beziehung – Energie fließt hier mühelos, ohne Zwang.`,
      fr: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): don naturel de votre relation – l'énergie coule ici avec aisance, sans forcer.`,
    })
  }
  if (a.tenso) {
    return sx(lang, {
      pt: () => `• **${a.corpoA} ${a.nome.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): gatilho recorrente - a arena onde brigas ou crises voltam até aprenderem juntos a lição. Não é maldição: é fronteira de crescimento.`,
      en: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): a recurring trigger - the arena where arguments or crises return until you both learn the lesson together. Not a curse: a growth edge.`,
      es: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): gatillo recurrente: la arena donde vuelven discusiones o crisis hasta aprender juntos la lección. No es maldición: es frontera de crecimiento.`,
      it: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): grilletto ricorrente: l'arena dove tornano litigi o crisi finché imparate insieme la lezione. Non è una maledizione: è un confine di crescita.`,
      de: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): wiederkehrender Auslöser – die Arena, in der Streit oder Krisen zurückkehren, bis ihr die Lektion gemeinsam lernt. Kein Fluch: eine Wachstumsgrenze.`,
      fr: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): déclencheur récurrent – l'arène où reviennent disputes ou crises jusqu'à apprendre ensemble la leçon. Pas une malédiction : une frontière de croissance.`,
    })
  }
  return sx(lang, {
    pt: () => `• **${a.corpoA} ${a.nome.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): fusão intensa - tornam-se uma só voz nesta área, para melhor ou para fundir mais profundamente.`,
    en: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): intense fusion - you become one voice in this area, for better or for deeper merging.`,
    es: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): fusión intensa: se convierten en una sola voz en esta área, para mejor o para fundirse más profundamente.`,
    it: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): fusione intensa: diventate una sola voce in quest'area, per il meglio o per fondervi più profondamente.`,
    de: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): intensive Verschmelzung – ihr werdet in diesem Bereich zu einer Stimme, zum Besseren oder tieferen Zusammenwachsen.`,
    fr: () => `• **${a.corpoA} ${asp.toLowerCase()} ${a.corpoB}** (${a.signoA} · ${a.signoB}): fusion intense – vous devenez une seule voix dans ce domaine, pour le mieux ou une fusion plus profonde.`,
  })
}
