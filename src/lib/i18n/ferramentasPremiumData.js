/** Localised data for FerramentasPremium components */

const IMPACTO_PT = {
  alto: 'alto', médio: 'médio', baixo: 'baixo', atenção: 'atenção',
  intenso: 'intenso', transformador: 'transformador', desafio: 'desafio',
  padrão: 'padrão', optimismo: 'optimismo',
}

const IMPACTO_EN = {
  alto: 'high', médio: 'medium', baixo: 'low', atenção: 'caution',
  intenso: 'intense', transformador: 'transformative', desafio: 'challenge',
  padrão: 'standard', optimismo: 'optimism',
}

const TRANSITOS_PT = [
  { mes: 'Janeiro', planeta: 'Saturno', signo: 'Áries', tipo: 'ingresso', impacto: 'alto',
    desc: 'Saturno inicia um novo ciclo de 2,5 anos em Áries. Momento de construir estruturas com coragem. Responsabilidade e acção directa são a chave.' },
  { mes: 'Fevereiro', planeta: 'Vénus', signo: 'Peixes', tipo: 'trânsito', impacto: 'médio',
    desc: 'Vénus em Peixes - período de romantismo, espiritualidade e dissolução de fronteiras emocionais. Ideal para arte, meditação e conexões profundas.' },
  { mes: 'Março', planeta: 'Marte', signo: 'Caranguejo', tipo: 'trânsito', impacto: 'médio',
    desc: 'Marte no Caranguejo activa a protecção do lar e da família. Acção emocional intensa. Cuidado com reactividade - age a partir do coração.' },
  { mes: 'Abril', planeta: 'Júpiter', signo: 'Gémeos', tipo: 'trânsito', impacto: 'alto',
    desc: 'Júpiter expande tudo em Gémeos: comunicação, aprendizagem, viagens curtas. Excelente para estudos, escrita e novos contactos profissionais.' },
  { mes: 'Maio', planeta: 'Sol', signo: 'Touro', tipo: 'sazonalidade', impacto: 'padrão',
    desc: 'Temporada de Touro - foco em estabilidade, recursos e prazeres sensoriais. Altura ideal para consolidar projectos e cuidar do corpo.' },
  { mes: 'Junho', planeta: 'Mercúrio', signo: 'Caranguejo', tipo: 'retrógrado', impacto: 'atenção',
    desc: 'Mercúrio Retrógrado em Caranguejo (1–25 Jun). Revisão de comunicações emocionais. Evita decisões importantes. Reconcilia-te com o passado.' },
  { mes: 'Julho', planeta: 'Vénus', signo: 'Leão', tipo: 'trânsito', impacto: 'alto',
    desc: 'Vénus em Leão: romance dramático e criatividade em ebulição. O amor quer ser celebrado em voz alta. Óptimo para relações, arte e auto-expressão.' },
  { mes: 'Agosto', planeta: 'Lua Nova', signo: 'Leão', tipo: 'eclipse', impacto: 'transformador',
    desc: 'Eclipse Solar em Leão. Um portal de transformação da identidade. Liberta o que já não representa quem és. Novo capítulo da tua história pessoal.' },
  { mes: 'Setembro', planeta: 'Júpiter', signo: 'Caranguejo', tipo: 'ingresso', impacto: 'alto',
    desc: 'Júpiter entra em Caranguejo: expansão emocional, familiar e espiritual. Fertilidade, cura de raízes e abundância doméstica nos próximos 13 meses.' },
  { mes: 'Outubro', planeta: 'Marte', signo: 'Escorpião', tipo: 'trânsito', impacto: 'intenso',
    desc: 'Marte em Escorpião: determinação inabalável, instinto aguçado e transformação profunda. Poder de investigar, curar e regenerar. Cuidado com obsessões.' },
  { mes: 'Novembro', planeta: 'Saturno', signo: 'Áries', tipo: 'quadratura', impacto: 'desafio',
    desc: 'Saturno em Áries em tensão com Capricórnio. Questões de identidade vs responsabilidades externas. Os limites são necessários para proteger a tua essência.' },
  { mes: 'Dezembro', planeta: 'Sol', signo: 'Sagitário', tipo: 'sazonalidade', impacto: 'optimismo',
    desc: 'Temporada de Sagitário: expansão, filosofia e aventura. Termina o ano com visão e esperança. Os sonhos de Dezembro tornam-se os planos de Janeiro.' },
]

const TRANSITOS_EN = [
  { mes: 'January', planeta: 'Saturn', signo: 'Aries', tipo: 'ingresso', impacto: 'alto',
    desc: 'Saturn begins a new 2.5-year cycle in Aries. Time to build structures with courage. Responsibility and direct action are key.' },
  { mes: 'February', planeta: 'Venus', signo: 'Pisces', tipo: 'trânsito', impacto: 'médio',
    desc: 'Venus in Pisces - a period of romance, spirituality and dissolving emotional boundaries. Ideal for art, meditation and deep connections.' },
  { mes: 'March', planeta: 'Mars', signo: 'Cancer', tipo: 'trânsito', impacto: 'médio',
    desc: 'Mars in Cancer activates protection of home and family. Intense emotional action. Watch reactivity - act from the heart.' },
  { mes: 'April', planeta: 'Jupiter', signo: 'Gemini', tipo: 'trânsito', impacto: 'alto',
    desc: 'Jupiter expands everything in Gemini: communication, learning, short trips. Excellent for studies, writing and new professional contacts.' },
  { mes: 'May', planeta: 'Sun', signo: 'Taurus', tipo: 'sazonalidade', impacto: 'padrão',
    desc: 'Taurus season - focus on stability, resources and sensory pleasures. Ideal time to consolidate projects and care for the body.' },
  { mes: 'June', planeta: 'Mercury', signo: 'Cancer', tipo: 'retrógrado', impacto: 'atenção',
    desc: 'Mercury Retrograde in Cancer (1–25 Jun). Review emotional communications. Avoid major decisions. Reconcile with the past.' },
  { mes: 'July', planeta: 'Venus', signo: 'Leo', tipo: 'trânsito', impacto: 'alto',
    desc: 'Venus in Leo: dramatic romance and creativity in full bloom. Love wants to be celebrated out loud. Great for relationships, art and self-expression.' },
  { mes: 'August', planeta: 'New Moon', signo: 'Leo', tipo: 'eclipse', impacto: 'transformador',
    desc: 'Solar Eclipse in Leo. A portal of identity transformation. Release what no longer represents who you are. A new chapter in your personal story.' },
  { mes: 'September', planeta: 'Jupiter', signo: 'Cancer', tipo: 'ingresso', impacto: 'alto',
    desc: 'Jupiter enters Cancer: emotional, family and spiritual expansion. Fertility, healing of roots and domestic abundance for the next 13 months.' },
  { mes: 'October', planeta: 'Mars', signo: 'Scorpio', tipo: 'trânsito', impacto: 'intenso',
    desc: 'Mars in Scorpio: unshakeable determination, sharp instinct and deep transformation. Power to investigate, heal and regenerate. Watch obsessions.' },
  { mes: 'November', planeta: 'Saturn', signo: 'Aries', tipo: 'quadratura', impacto: 'desafio',
    desc: 'Saturn in Aries in tension with Capricorn. Identity vs external responsibilities. Boundaries are necessary to protect your essence.' },
  { mes: 'December', planeta: 'Sun', signo: 'Sagittarius', tipo: 'sazonalidade', impacto: 'optimismo',
    desc: 'Sagittarius season: expansion, philosophy and adventure. End the year with vision and hope. December dreams become January plans.' },
]

const COMPAT_PT = {
  'Fogo-Fogo': 'Ligação apaixonada e enérgica. Juntos conquistam o mundo mas precisam de aprender a ceder.',
  'Fogo-Ar': 'Combinação mágica! O Ar alimenta o Fogo. Estímulo intelectual e aventura em conjunto.',
  'Fogo-Terra': 'Tensão criativa. O Fogo inspira, a Terra estabiliza. Complementaridade se houver paciência.',
  'Fogo-Água': 'Intensa e transformadora. Química irresistível com potencial para grandes paixões e conflitos.',
  'Terra-Terra': 'Solidez e confiança mútua. Constroem algo duradouro juntos. Podem precisar de mais espontaneidade.',
  'Terra-Água': 'Nutrição mútua profunda. A Água hidrata a Terra. Relação de cuidado e suporte emocional.',
  'Terra-Ar': 'Diferenças complementares. A Terra ancora o Ar, o Ar areja a Terra. Crescimento mútuo.',
  'Ar-Ar': 'Estímulo intelectual constante. Ligação mental forte. Podem precisar de aprofundar a dimensão emocional.',
  'Ar-Água': 'Criatividade e emoção juntas. O Ar inspira, a Água sente. Relação rica e multidimensional.',
  'Água-Água': 'Profundidade emocional oceânica. Empatia total. Precisam de limites saudáveis para não se perderem.',
}

const COMPAT_EN = {
  'Fogo-Fogo': 'Passionate, energetic bond. Together you conquer the world but need to learn to yield.',
  'Fogo-Ar': 'Magical combination! Air feeds Fire. Intellectual stimulation and adventure together.',
  'Fogo-Terra': 'Creative tension. Fire inspires, Earth stabilises. Complementary with patience.',
  'Fogo-Água': 'Intense and transformative. Irresistible chemistry with potential for great passions and conflicts.',
  'Terra-Terra': 'Solidity and mutual trust. You build something lasting together. May need more spontaneity.',
  'Terra-Água': 'Deep mutual nourishment. Water hydrates Earth. A relationship of care and emotional support.',
  'Terra-Ar': 'Complementary differences. Earth anchors Air, Air refreshes Earth. Mutual growth.',
  'Ar-Ar': 'Constant intellectual stimulation. Strong mental connection. May need to deepen the emotional dimension.',
  'Ar-Água': 'Creativity and emotion together. Air inspires, Water feels. A rich, multidimensional relationship.',
  'Água-Água': 'Oceanic emotional depth. Total empathy. Need healthy boundaries so as not to get lost.',
}

const ASPECTOS_PT = [
  { a: 'Sol', b: 'Sol', tipo: 'conjunção', desc: 'Partilham a mesma essência. Reconhecimento imediato e ligação de almas.' },
  { a: 'Sol', b: 'Lua', tipo: 'conjunção', desc: 'O Sol ilumina o mundo emocional da Lua. União entre o consciente e o inconsciente.' },
  { a: 'Vénus', b: 'Marte', tipo: 'conjunção', desc: 'Atracção física e emocional intensa. A clássica "química" entre dois seres.' },
  { a: 'Sol', b: 'Ascendente', tipo: 'trígono', desc: 'Uma fluidez natural. A personalidade de um suporta e inspira a expressão do outro.' },
  { a: 'Lua', b: 'Lua', tipo: 'sextil', desc: 'Harmonia emocional profunda. Entendem-se sem precisar de explicações.' },
  { a: 'Mercúrio', b: 'Mercúrio', tipo: 'trígono', desc: 'Comunicação fluida e enriquecedora. Conversas que nunca acabam.' },
]

const ASPECTOS_EN = [
  { a: 'Sun', b: 'Sun', tipo: 'conjunction', desc: 'You share the same essence. Immediate recognition and soul connection.' },
  { a: 'Sun', b: 'Moon', tipo: 'conjunction', desc: 'The Sun illuminates the Moon\'s emotional world. Union of conscious and unconscious.' },
  { a: 'Venus', b: 'Mars', tipo: 'conjunction', desc: 'Intense physical and emotional attraction. The classic chemistry between two beings.' },
  { a: 'Sun', b: 'Ascendant', tipo: 'trine', desc: 'Natural flow. One\'s personality supports and inspires the other\'s expression.' },
  { a: 'Moon', b: 'Moon', tipo: 'sextile', desc: 'Deep emotional harmony. You understand each other without explanations.' },
  { a: 'Mercury', b: 'Mercury', tipo: 'trine', desc: 'Fluid, enriching communication. Conversations that never end.' },
]

export function getTransitos2026(lang) {
  const data = lang !== 'pt' ? TRANSITOS_EN : TRANSITOS_PT
  const impactoMap = lang !== 'pt' ? IMPACTO_EN : IMPACTO_PT
  return data.map(t => ({ ...t, impactoLabel: impactoMap[t.impacto] || t.impacto }))
}

export function getCompatDesc(chave, lang, fallbackKey) {
  const map = lang !== 'pt' ? COMPAT_EN : COMPAT_PT
  return map[chave] || fallbackKey
}

export function getAspectosAmor(lang) {
  return lang !== 'pt' ? ASPECTOS_EN : ASPECTOS_PT
}

export const TIPO_ICO = {
  ingresso: '🚪', trânsito: '→', retrógrado: '℞', sazonalidade: '🌀',
  eclipse: '🌑', quadratura: '⊞',
}

export const IMPACTO_COR = {
  alto: '#34D399', médio: '#60A5FA', baixo: '#9CA3AF',
  atenção: '#FBBf24', intenso: '#F87171', transformador: '#DFB76C',
  desafio: '#FB923C', padrão: '#9CA3AF', optimismo: '#34D399',
}

export const SIGNOS_LIST = ['Áries', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem', 'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes']

export const ELEM = {
  'Carneiro': 'Fogo', 'Áries': 'Fogo', 'Leão': 'Fogo', 'Sagitário': 'Fogo',
  'Touro': 'Terra', 'Virgem': 'Terra', 'Capricórnio': 'Terra',
  'Gémeos': 'Ar', 'Balança': 'Ar', 'Aquário': 'Ar',
  'Caranguejo': 'Água', 'Escorpião': 'Água', 'Peixes': 'Água',
}
