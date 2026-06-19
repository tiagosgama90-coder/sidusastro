/**
 * Análise estratégica do Fluxo Vital — combina biorritmo com contexto astrológico.
 */

const SIGNOS = [
  'Áries', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem',
  'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes',
]

const ELEMENTO = {
  Áries: 'Fogo', Touro: 'Terra', Gémeos: 'Ar', Caranguejo: 'Água',
  Leão: 'Fogo', Virgem: 'Terra', Balança: 'Ar', Escorpião: 'Água',
  Sagitário: 'Fogo', Capricórnio: 'Terra', Aquário: 'Ar', Peixes: 'Água',
}

const MODALIDADE = {
  Áries: 'Cardinal', Touro: 'Fixo', Gémeos: 'Mutável', Caranguejo: 'Cardinal',
  Leão: 'Fixo', Virgem: 'Mutável', Balança: 'Cardinal', Escorpião: 'Fixo',
  Sagitário: 'Mutável', Capricórnio: 'Cardinal', Aquário: 'Fixo', Peixes: 'Mutável',
}

function indiceSigno(nome) {
  const i = SIGNOS.indexOf(nome)
  return i >= 0 ? i : 0
}

function signoDoDia(date = new Date()) {
  const start = new Date(date.getFullYear(), 2, 21)
  const diff = (date - start) / 86400000
  const idx = Math.floor(((diff % 365.25) + 365.25) % 365.25 / 30.44)
  return SIGNOS[((idx % 12) + 12) % 12]
}

function aspectoEntreSignos(a, b) {
  const diff = Math.abs(indiceSigno(a) - indiceSigno(b)) % 12
  const d = diff > 6 ? 12 - diff : diff
  if (d === 0) return { tipo: 'conjunção', score: 85 }
  if (d === 6) return { tipo: 'oposição', score: 35 }
  if (d === 4) return { tipo: 'quadratura', score: 40 }
  if (d === 3) return { tipo: 'trígono', score: 90 }
  if (d === 2) return { tipo: 'sextil', score: 75 }
  return { tipo: 'neutro', score: 55 }
}

function faseLunarAproximada(date = new Date()) {
  const synodic = 29.53058867
  const known = new Date('2000-01-06T18:14:00Z').getTime()
  const age = ((date.getTime() - known) / 86400000) % synodic
  const norm = age < 0 ? age + synodic : age
  if (norm < 1.85) return 'nova'
  if (norm < 7.38) return 'crescente'
  if (norm < 14.77) return 'gibosaCrescente'
  if (norm < 16.61) return 'cheia'
  if (norm < 22.15) return 'gibosaMinguante'
  if (norm < 28.53) return 'minguante'
  return 'nova'
}

export function analisarFluxoVital({ fisico, emocional, intelectual, mapaNatal, lang = 'pt' }) {
  const pt = lang !== 'en'
  const solar = mapaNatal?.solar?.nome
  const lunar = mapaNatal?.lunar?.nome
  const ascendente = mapaNatal?.ascendente?.nome
  const hoje = new Date()
  const signoHoje = signoDoDia(hoje)
  const fase = faseLunarAproximada(hoje)

  const cruzCritica = [fisico, emocional, intelectual].filter((v) => Math.abs(v) < 15).length >= 2
  const todosAltos = fisico > 50 && emocional > 50 && intelectual > 50
  const algumBaixo = fisico < -40 || emocional < -40 || intelectual < -40

  const aspectoSol = solar ? aspectoEntreSignos(signoHoje, solar) : null
  const aspectoLua = lunar ? aspectoEntreSignos(signoHoje, lunar) : null

  const FASE_PT = {
    nova: 'Lua Nova — início de ciclo, ideal para intenção e planeamento.',
    crescente: 'Lua Crescente — fase de acção e construção progressiva.',
    gibosaCrescente: 'Lua Gibosa Crescente — refinamento e ajuste antes do clímax.',
    cheia: 'Lua Cheia — culminação emocional e máxima visibilidade.',
    gibosaMinguante: 'Lua Gibosa Minguante — partilha de sabedoria e integração.',
    minguante: 'Lua Minguante — libertação, conclusão e descanso activo.',
  }
  const FASE_EN = {
    nova: 'New Moon — cycle start; ideal for intention and planning.',
    crescente: 'Waxing Moon — action and progressive building phase.',
    gibosaCrescente: 'Waxing Gibbous — refinement before the peak.',
    cheia: 'Full Moon — emotional culmination and peak visibility.',
    gibosaMinguante: 'Waning Gibbous — sharing wisdom and integration.',
    minguante: 'Waning Moon — release, completion and active rest.',
  }
  const faseTxt = (pt ? FASE_PT : FASE_EN)[fase]

  let ritmoElementar = ''
  if (solar && lunar) {
    const elSol = ELEMENTO[solar]
    const elLua = ELEMENTO[lunar]
    const modSol = MODALIDADE[solar]
    ritmoElementar = pt
      ? `O teu eixo natal (${elSol}/${elLua}, modalidade ${modSol}) define o ritmo base. Hoje o Sol transita ${signoHoje} (${ELEMENTO[signoHoje]}), ${aspectoSol?.tipo === 'trígono' || aspectoSol?.tipo === 'sextil' ? 'facilitando fluidez' : aspectoSol?.tipo === 'quadratura' || aspectoSol?.tipo === 'oposição' ? 'pedindo ajuste consciente' : 'mantendo ritmo estável'}.`
      : `Your natal axis (${elSol}/${elLua}, ${modSol} modality) sets the base rhythm. Today the Sun transits ${signoHoje} (${ELEMENTO[signoHoje]}), ${aspectoSol?.tipo === 'trígono' || aspectoSol?.tipo === 'sextil' ? 'supporting flow' : aspectoSol?.tipo === 'quadratura' || aspectoSol?.tipo === 'oposição' ? 'asking for conscious adjustment' : 'keeping a steady pace'}.`
  }

  let luaNatal = ''
  if (lunar && aspectoLua) {
    luaNatal = pt
      ? `A Lua natal em ${lunar} responde hoje com tom ${aspectoLua.tipo} (${aspectoLua.score}% de harmonia). ${aspectoLua.score >= 75 ? 'Bom dia para expressar emoções com clareza.' : aspectoLua.score <= 45 ? 'Protege a sensibilidade; evita exposição desnecessária.' : 'Equilibra razão e emoção nas decisões.'}`
      : `Natal Moon in ${lunar} responds today with a ${aspectoLua.tipo} tone (${aspectoLua.score}% harmony). ${aspectoLua.score >= 75 ? 'Good day to express feelings clearly.' : aspectoLua.score <= 45 ? 'Protect sensitivity; avoid unnecessary exposure.' : 'Balance reason and emotion in decisions.'}`
  }

  let ascendenteNota = ''
  if (ascendente) {
    ascendenteNota = pt
      ? `Ascendente em ${ascendente}: a energia física (${Math.round(fisico)}%) reflecte-se na forma como te apresentas ao mundo — ${fisico > 30 ? 'aproveita para iniciativas visíveis' : fisico < -30 ? 'privilegia rotinas discretas' : 'mantém presença equilibrada'}.`
      : `Ascendant in ${ascendente}: physical energy (${Math.round(fisico)}%) shows in how you present yourself — ${fisico > 30 ? 'favour visible initiatives' : fisico < -30 ? 'favour discreet routines' : 'keep balanced presence'}.`
  }

  let estrategia
  if (cruzCritica) {
    estrategia = pt
      ? '⚠ Cruz crítica bio-rítmica: dois ou mais ciclos em transição. Evita decisões irreversíveis, competições intensas e cirurgias eletivas. Prioriza sono, hidratação e tarefas de baixo risco.'
      : '⚠ Biorhythm critical cross: two or more cycles in transition. Avoid irreversible decisions, intense competition and elective surgery. Prioritise sleep, hydration and low-risk tasks.'
  } else if (todosAltos) {
    estrategia = pt
      ? '✦ Janela de alto rendimento: físico, emocional e intelectual alinhados. Agenda negociações, apresentações e treino intenso. O cosmos e o biorritmo convergem a teu favor.'
      : '✦ High-performance window: physical, emotional and intellectual cycles aligned. Schedule negotiations, presentations and intense training. Cosmos and biorhythm converge in your favour.'
  } else if (algumBaixo) {
    const foco = fisico <= emocional && fisico <= intelectual ? (pt ? 'corpo' : 'body')
      : emocional <= intelectual ? (pt ? 'emoções' : 'emotions') : (pt ? 'mente' : 'mind')
    estrategia = pt
      ? `✦ Ritmo em recuperação no eixo ${foco}. Delega o que puderes, reduz estímulos e centra-te numa única prioridade. A astrologia sugere ${fase === 'cheia' || fase === 'minguante' ? 'introspecção' : 'acção moderada'}.`
      : `✦ Rhythm in recovery on the ${foco} axis. Delegate what you can, reduce stimuli and focus on one priority. Astrology suggests ${fase === 'cheia' || fase === 'minguante' ? 'introspection' : 'moderate action'}.`
  } else {
    estrategia = pt
      ? '✦ Dia misto: usa o ciclo intelectual para planear, o emocional para relações e o físico para rotinas leves. Sincroniza tarefas com o pico de cada onda.'
      : '✦ Mixed day: use the intellectual cycle to plan, the emotional for relationships and the physical for light routines. Sync tasks with each wave peak.'
  }

  const picos = [
    { nome: pt ? 'Físico' : 'Physical', val: fisico, cor: '#FB923C' },
    { nome: pt ? 'Emocional' : 'Emotional', val: emocional, cor: '#F472B6' },
    { nome: pt ? 'Intelectual' : 'Intellectual', val: intelectual, cor: '#60A5FA' },
  ].sort((a, b) => b.val - a.val)

  return {
    faseLunar: faseTxt,
    ritmoElementar,
    luaNatal,
    ascendenteNota,
    estrategia,
    cruzCritica,
    picoDominante: picos[0],
    valeDominante: picos[2],
    signoTransito: signoHoje,
  }
}
