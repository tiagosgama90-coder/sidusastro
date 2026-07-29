import { translatePlaneta, translatePontoNatal, translateHouseLabel, translateAspecto } from '../i18n/astro.js'
import { getTemaCasa } from '../casasPlacidus.js'

const ASP_LABEL = {
  pt: { conjuncao: 'em conjunção', sextil: 'em sextil', quadratura: 'em quadratura', trino: 'em trino', oposicao: 'em oposição' },
  en: { conjuncao: 'conjunct', sextil: 'sextile', quadratura: 'square', trino: 'trine', oposicao: 'opposite' },
  es: { conjuncao: 'en conjunción', sextil: 'en sextil', quadratura: 'en cuadratura', trino: 'en trino', oposicao: 'en oposición' },
  it: { conjuncao: 'in congiunzione', sextil: 'in sestile', quadratura: 'in quadratura', trino: 'in trigono', oposicao: 'in opposizione' },
  de: { conjuncao: 'in Konjunktion', sextil: 'im Sextil', quadratura: 'im Quadrat', trino: 'im Trigon', oposicao: 'in Opposition' },
  fr: { conjuncao: 'en conjonction', sextil: 'en sextile', quadratura: 'en carré', trino: 'en trigone', oposicao: 'en opposition' },
}

function geometria(transito, lang) {
  const tp = translatePlaneta(transito.planetaTransito, lang)
  const np = translatePontoNatal(transito.pontoNatal, lang)
  const asp = (ASP_LABEL[lang] || ASP_LABEL.en)[transito.aspecto] || translateAspecto(transito.aspecto, lang)
  const retro = transito.retrogrado ? (lang === 'pt' ? ' (retrógrado)' : lang === 'es' ? ' (retrógrado)' : lang === 'fr' ? ' (rétrograde)' : lang === 'de' ? ' (rückläufig)' : lang === 'it' ? ' (retrogrado)' : ' (retrograde)') : ''

  const templates = {
    pt: `Trânsito de ${tp}${retro} ${asp} ao ${np} natal a ${transito.grausNatal}° em ${transito.signoNatal} (orbe ${transito.orbeMin.toFixed(1)}°). O trânsito activa-se cerca do dia ${transito.diaExacto} do mês.`,
    en: `Transit of ${tp}${retro} ${asp} natal ${np} at ${transito.grausNatal}° in ${transito.signoNatal} (orb ${transito.orbeMin.toFixed(1)}°). Most active around day ${transito.diaExacto} of the month.`,
    es: `Tránsito de ${tp}${retro} ${asp} al ${np} natal a ${transito.grausNatal}° en ${transito.signoNatal} (orbe ${transito.orbeMin.toFixed(1)}°). Más activo hacia el día ${transito.diaExacto} del mes.`,
    it: `Transito di ${tp}${retro} ${asp} al ${np} natale a ${transito.grausNatal}° in ${transito.signoNatal} (orbe ${transito.orbeMin.toFixed(1)}°). Più attivo intorno al giorno ${transito.diaExacto} del mese.`,
    de: `Transit von ${tp}${retro} ${asp} zum natalen ${np} bei ${transito.grausNatal}° in ${transito.signoNatal} (Orbis ${transito.orbeMin.toFixed(1)}°). Am stärksten um Tag ${transito.diaExacto} des Monats.`,
    fr: `Transit de ${tp}${retro} ${asp} au ${np} natal à ${transito.grausNatal}° en ${transito.signoNatal} (orbe ${transito.orbeMin.toFixed(1)}°). Plus actif vers le jour ${transito.diaExacto} du mois.`,
  }
  return templates[lang] || templates.en
}

function activacaoCasa(transito, lang) {
  const temaT = getTemaCasa(transito.casaTransit, lang)
  const temaN = getTemaCasa(transito.casaNatal, lang)
  const tp = translatePlaneta(transito.planetaTransito, lang)
  const casaT = translateHouseLabel(transito.casaTransit, lang)
  const casaN = translateHouseLabel(transito.casaNatal, lang)
  const ponto = translatePontoNatal(transito.pontoNatal, lang)

  const templates = {
    pt: `A energia de ${tp} manifesta-se na ${casaT} (${temaT?.nome}: ${temaT?.foco}). Simultaneamente activa a ${casaN} ligada ao ${ponto} (${temaN?.nome}: ${temaN?.foco}).`,
    en: `${tp}'s energy manifests in the ${casaT} (${temaT?.nome}: ${temaT?.foco}). It simultaneously activates the ${casaN} linked to natal ${ponto} (${temaN?.nome}: ${temaN?.foco}).`,
    es: `La energía de ${tp} se manifiesta en la ${casaT} (${temaT?.nome}: ${temaT?.foco}). Activa simultáneamente la ${casaN} ligada al ${ponto} (${temaN?.nome}: ${temaN?.foco}).`,
    it: `L'energia di ${tp} si manifesta nella ${casaT} (${temaT?.nome}: ${temaT?.foco}). Attiva simultaneamente la ${casaN} legata al ${ponto} (${temaN?.nome}: ${temaN?.foco}).`,
    de: `Die Energie von ${tp} zeigt sich im ${casaT} (${temaT?.nome}: ${temaT?.foco}). Gleichzeitig aktiviert sie das ${casaN} des natalen ${ponto} (${temaN?.nome}: ${temaN?.foco}).`,
    fr: `L'énergie de ${tp} se manifeste en ${casaT} (${temaT?.nome}: ${temaT?.foco}). Elle active simultanément la ${casaN} liée au ${ponto} (${temaN?.nome}: ${temaN?.foco}).`,
  }
  return templates[lang] || templates.en
}

const CONSELHO_BASE = {
  Saturno: {
    conjuncao: {
      pt: 'Período de amadurecimento e responsabilidade. Define limites realistas, compromete-te com o essencial e aceita que a estrutura correcta pede tempo.',
      en: 'A period of maturation and responsibility. Set realistic limits, commit to essentials, and accept that proper structure takes time.',
    },
    quadratura: {
      pt: 'Tensão entre o que queres e o que a realidade exige. Trabalha com disciplina gradual; evita endurecer-te ou desistir prematuramente.',
      en: 'Tension between what you want and what reality demands. Work with gradual discipline; avoid hardening or quitting too soon.',
    },
    oposicao: {
      pt: 'Confronto com obrigações externas ou autoridade. Equilibra dever e necessidade pessoal sem rejeitar o que te fortalece a longo prazo.',
      en: 'Confrontation with external duties or authority. Balance duty and personal need without rejecting what strengthens you long-term.',
    },
    trino: {
      pt: 'Fluxo construtivo: consolida conquistas, organiza projectos e colhe frutos de esforços anteriores com estabilidade.',
      en: 'Constructive flow: consolidate gains, organize projects, and harvest fruits of past efforts with stability.',
    },
    sextil: {
      pt: 'Oportunidade prática de reorganizar. Pequenos passos consistentes produzem resultados duradouros neste ciclo.',
      en: 'Practical opportunity to reorganize. Small consistent steps produce lasting results in this cycle.',
    },
  },
  Júpiter: {
    conjuncao: {
      pt: 'Expansão e optimismo. Aproveita para crescer, mas evita excessos ou promessas que não consegues honrar.',
      en: 'Expansion and optimism. Grow wisely, but avoid excess or promises you cannot keep.',
    },
    quadratura: {
      pt: 'Exagero ou dispersão. Canaliza entusiasmo para um foco concreto; nem toda oportunidade merece perseguição.',
      en: 'Excess or dispersion. Channel enthusiasm into one concrete focus; not every opportunity deserves pursuit.',
    },
    oposicao: {
      pt: 'Polaridade entre crescimento pessoal e expectativas alheias. Integra visão ampla com critério realista.',
      en: 'Polarity between personal growth and others\' expectations. Integrate broad vision with realistic judgment.',
    },
    trino: {
      pt: 'Fluxo favorável de confiança e aprendizagem. Bom momento para ensinar, viajar ou alargar horizontes com moderação.',
      en: 'Favorable flow of confidence and learning. Good time to teach, travel, or broaden horizons with moderation.',
    },
    sextil: {
      pt: 'Portas subtis de crescimento. Inicia projectos com potencial se mantiveres presença e follow-through.',
      en: 'Subtle doors of growth. Start projects with potential if you maintain presence and follow-through.',
    },
  },
  Marte: {
    conjuncao: {
      pt: 'Energia intensa e impulso de acção. Canaliza a força com direcção consciente; evita conflitos desnecessários.',
      en: 'Intense energy and drive to act. Channel force with conscious direction; avoid unnecessary conflict.',
    },
    quadratura: {
      pt: 'Frustração ou urgência. Usa a tensão para agir com estratégia, não com reacção impulsiva.',
      en: 'Frustration or urgency. Use tension to act strategically, not react impulsively.',
    },
    oposicao: {
      pt: 'Confronto ou competição. Defende limites sem agressividade; a coragem madura é assertiva, não violenta.',
      en: 'Confrontation or competition. Defend boundaries without aggression; mature courage is assertive, not violent.',
    },
    trino: {
      pt: 'Vitalidade disponível. Bom período para iniciativas físicas, decisões corajosas e projectos que exigem empenho.',
      en: 'Vitality available. Good period for physical initiatives, brave decisions, and projects requiring effort.',
    },
    sextil: {
      pt: 'Iniciativa facilitada. Actua com coragem moderada em áreas que pedem movimento.',
      en: 'Initiative eased. Act with moderate courage in areas needing movement.',
    },
  },
  Plutão: {
    conjuncao: {
      pt: 'Transformação profunda. Liberta o que já não serve; o poder autêntico nasce da honestidade interior.',
      en: 'Deep transformation. Release what no longer serves; authentic power comes from inner honesty.',
    },
    quadratura: {
      pt: 'Crise de poder ou controlo. Observa onde resistes à mudança necessária; a regeneração exige rendição consciente.',
      en: 'Crisis of power or control. Notice where you resist needed change; regeneration requires conscious surrender.',
    },
    oposicao: {
      pt: 'Polaridades intensas em relações ou recursos partilhados. Integra sombra sem manipular nem ser manipulado.',
      en: 'Intense polarities in relationships or shared resources. Integrate shadow without manipulating or being manipulated.',
    },
    trino: {
      pt: 'Renovação profunda com menos resistência. Aprofunda autoconhecimento e cura padrões antigos.',
      en: 'Deep renewal with less resistance. Deepen self-knowledge and heal old patterns.',
    },
    sextil: {
      pt: 'Oportunidade de purificação gradual. Pequenas libertações acumulam transformação duradoura.',
      en: 'Opportunity for gradual purification. Small releases accumulate lasting transformation.',
    },
  },
  Urano: {
    conjuncao: {
      pt: 'Despertar súbito ou necessidade de liberdade. Abraça mudança autêntica sem destruir o que ainda é sólido.',
      en: 'Sudden awakening or need for freedom. Embrace authentic change without destroying what remains solid.',
    },
    quadratura: {
      pt: 'Instabilidade ou ruptura. Adapta-te com flexibilidade; a inovação pede coragem, não rebeldia cega.',
      en: 'Instability or rupture. Adapt with flexibility; innovation needs courage, not blind rebellion.',
    },
    oposicao: {
      pt: 'Tensão entre rotina e independência. Encontra formas criativas de ser livre sem abandonar responsabilidades essenciais.',
      en: 'Tension between routine and independence. Find creative ways to be free without abandoning essential duties.',
    },
    trino: {
      pt: 'Inspiração original e mudanças fluidas. Experimenta com ousadia inteligente.',
      en: 'Original inspiration and fluid changes. Experiment with intelligent boldness.',
    },
    sextil: {
      pt: 'Abertura a novas ideias. Pequenas ruturas positivas podem renovar a tua perspectiva.',
      en: 'Openness to new ideas. Small positive breaks can renew your perspective.',
    },
  },
  Neptuno: {
    conjuncao: {
      pt: 'Sensibilidade espiritual amplificada. Cultiva inspiração sem escapismo; distingue intuição de ilusão.',
      en: 'Amplified spiritual sensitivity. Cultivate inspiration without escapism; distinguish intuition from illusion.',
    },
    quadratura: {
      pt: 'Confusão ou idealização. Ancora-te em factos concretos; não tomes decisões importantes no nevoeiro.',
      en: 'Confusion or idealization. Anchor in concrete facts; avoid major decisions in the fog.',
    },
    oposicao: {
      pt: 'Difícil ver claramente em relações ou objectivos. Busca clareza gradual e limites saudáveis.',
      en: 'Hard to see clearly in relationships or goals. Seek gradual clarity and healthy boundaries.',
    },
    trino: {
      pt: 'Compaixão e criatividade fluem. Ideal para arte, meditação e serviço altruísta.',
      en: 'Compassion and creativity flow. Ideal for art, meditation, and selfless service.',
    },
    sextil: {
      pt: 'Intuição subtil disponível. Confia no processo interior com os pés na terra.',
      en: 'Subtle intuition available. Trust inner process while staying grounded.',
    },
  },
}

const DEFAULT_CONSELHO = {
  pt: 'Observa onde este aspecto se manifesta no corpo, nas emoções e nas decisões práticas. A consciência transforma qualquer trânsito em oportunidade de crescimento.',
  en: 'Notice where this aspect shows in body, emotions, and practical decisions. Awareness turns any transit into growth opportunity.',
  es: 'Observa dónde se manifiesta este aspecto en el cuerpo, las emociones y las decisiones prácticas. La conciencia transforma cualquier tránsito en oportunidad de crecimiento.',
  it: 'Osserva dove questo aspetto si manifesta nel corpo, nelle emozioni e nelle decisioni pratiche. La consapevolezza trasforma ogni transito in opportunità di crescita.',
  de: 'Beobachte, wo sich dieser Aspekt in Körper, Gefühlen und praktischen Entscheidungen zeigt. Bewusstsein verwandelt jeden Transit in Wachstumschance.',
  fr: 'Observe où cet aspect se manifeste dans le corps, les émotions et les décisions pratiques. La conscience transforme tout transit en opportunité de croissance.',
}

function conselho(transito, lang) {
  const planeta = transito.planetaTransito
  const asp = transito.aspecto
  const base = CONSELHO_BASE[planeta]?.[asp]
  if (base) return base[lang] || base.en || base.pt

  if (planeta === 'Sol' || planeta === 'Lua' || planeta === 'Mercúrio' || planeta === 'Vénus') {
    const personal = {
      conjuncao: {
        pt: 'Fusão de energias: este é um momento de identificar-te mais profundamente com esta área da vida. Integra, não te percas na fusão.',
        en: 'Fusion of energies: identify more deeply with this life area. Integrate without losing yourself in the merge.',
      },
      quadratura: {
        pt: 'Ajuste necessário entre necessidades internas e circunstâncias externas. Responde com flexibilidade, não com rigidez.',
        en: 'Needed adjustment between inner needs and outer circumstances. Respond with flexibility, not rigidity.',
      },
      oposicao: {
        pt: 'Polaridade a equilibrar. Reconhece o que o outro lado do aspecto te ensina sem projetar no exterior.',
        en: 'Polarity to balance. Recognize what the other side teaches without projecting outward.',
      },
      trino: {
        pt: 'Fluxo natural. Aproveita para expressar esta energia com leveza e consistência.',
        en: 'Natural flow. Express this energy with ease and consistency.',
      },
      sextil: {
        pt: 'Oportunidade que requer iniciativa consciente. Age com intenção moderada.',
        en: 'Opportunity requiring conscious initiative. Act with moderate intention.',
      },
    }
    const txt = personal[asp]
    if (txt) return txt[lang] || txt.en
  }

  return DEFAULT_CONSELHO[lang] || DEFAULT_CONSELHO.en
}

export function interpretarTransito(transito, lang) {
  return {
    geometria: geometria(transito, lang),
    activacaoCasa: activacaoCasa(transito, lang),
    conselho: conselho(transito, lang),
  }
}

export function textoAlertaEclipse(eclipse, lang) {
  const tipo = eclipse.tipo === 'solar'
    ? { pt: 'Eclipse Solar', en: 'Solar Eclipse', es: 'Eclipse Solar', it: 'Eclissi Solare', de: 'Sonnenfinsternis', fr: 'Éclipse Solaire' }
    : { pt: 'Eclipse Lunar', en: 'Lunar Eclipse', es: 'Eclipse Lunar', it: 'Eclissi Lunare', de: 'Mondfinsternis', fr: 'Éclipse Lunaire' }
  const titulo = (tipo[lang] || tipo.en) + ` ${eclipse.kindLabel}`

  const casaLabel = eclipse.casa ? translateHouseLabel(eclipse.casa, lang) : null

  if (!eclipse.casa) {
    const fallback = {
      pt: `${titulo} a ${eclipse.graus}° em ${eclipse.signo}. Marco cósmico de aceleração - observa decisões e acontecimentos nas semanas adjacentes.`,
      en: `${titulo} at ${eclipse.graus}° in ${eclipse.signo}. Cosmic acceleration marker - watch decisions and events in adjacent weeks.`,
      es: `${titulo} a ${eclipse.graus}° en ${eclipse.signo}. Hito cósmico de aceleración: observa decisiones y acontecimientos en las semanas adyacentes.`,
      it: `${titulo} a ${eclipse.graus}° in ${eclipse.signo}. Segno cosmico di accelerazione: osserva decisioni ed eventi nelle settimane adiacenti.`,
      de: `${titulo} bei ${eclipse.graus}° in ${eclipse.signo}. Kosmisches Beschleunigungszeichen - beobachte Entscheidungen und Ereignisse in den angrenzenden Wochen.`,
      fr: `${titulo} à ${eclipse.graus}° en ${eclipse.signo}. Marqueur d'accélération cosmique - observe les décisions et événements des semaines adjacentes.`,
    }
    return fallback[lang] || fallback.en
  }

  const templates = {
    pt: `${titulo} a ${eclipse.graus}° em ${eclipse.signo} na tua ${casaLabel} (${eclipse.temaNome}). Área activada: ${eclipse.temaFoco}. Capítulo acelerado - mudanças neste domínio podem desenrolar-se nos 6 a 18 meses seguintes.`,
    en: `${titulo} at ${eclipse.graus}° in ${eclipse.signo} in your ${casaLabel} (${eclipse.temaNome}). Activated area: ${eclipse.temaFoco}. Accelerated chapter - changes in this domain may unfold over the next 6 to 18 months.`,
    es: `${titulo} a ${eclipse.graus}° en ${eclipse.signo} en tu ${casaLabel} (${eclipse.temaNome}). Área activada: ${eclipse.temaFoco}. Capítulo acelerado: los cambios en este dominio pueden desplegarse en los próximos 6 a 18 meses.`,
    it: `${titulo} a ${eclipse.graus}° in ${eclipse.signo} nella tua ${casaLabel} (${eclipse.temaNome}). Area attivata: ${eclipse.temaFoco}. Capitolo accelerato: i cambiamenti in questo dominio possono svilupparsi nei prossimi 6-18 mesi.`,
    de: `${titulo} bei ${eclipse.graus}° in ${eclipse.signo} in deinem ${casaLabel} (${eclipse.temaNome}). Aktivierter Bereich: ${eclipse.temaFoco}. Beschleunigtes Kapitel - Veränderungen können sich in 6-18 Monaten entfalten.`,
    fr: `${titulo} à ${eclipse.graus}° en ${eclipse.signo} dans ta ${casaLabel} (${eclipse.temaNome}). Domaine activé : ${eclipse.temaFoco}. Chapitre accéléré - les changements peuvent se déployer sur 6 à 18 mois.`,
  }
  return templates[lang] || templates.en
}
