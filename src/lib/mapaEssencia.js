/**
 * Secção 1 - A Tua Essência Central (Sol, Lua, Ascendente, Big 3).
 * Interpretação profunda e única por posição calculada.
 */
import { planetaPorNome, getTemaCasa } from './casasPlacidus.js'
import { translateSigno, translatePlaneta, translateAspecto } from './i18n/astro.js'
import { contentForLang } from './i18n/langUtil.js'
import { getMapaStatic } from './i18n/packs/mapaStatic.js'
import {
  SOL_ES, SOL_IT, SOL_DE, SOL_FR,
  LUA_ES, LUA_IT, LUA_DE, LUA_FR,
  ASC_ES, ASC_IT, ASC_DE, ASC_FR,
} from './i18n/packs/mapaEssenciaLocales.js'
import { glueBlocoCasa, glueBlocoGraus, glueBlocoAspectos, glueFaseLunar } from './i18n/packs/mapaEssenciaGlue.js'
import { comporInterpretacaoPlaneta } from './lexicon/compositor.js'

const ELEMENTO = {
  Carneiro: 'Fogo', Leão: 'Fogo', Sagitário: 'Fogo',
  Touro: 'Terra', Virgem: 'Terra', Capricórnio: 'Terra',
  Gémeos: 'Ar', Balança: 'Ar', Aquário: 'Ar',
  Caranguejo: 'Água', Escorpião: 'Água', Peixes: 'Água',
}

const MODALIDADE = {
  Carneiro: 'Cardinal', Caranguejo: 'Cardinal', Balança: 'Cardinal', Capricórnio: 'Cardinal',
  Touro: 'Fixo', Leão: 'Fixo', Escorpião: 'Fixo', Aquário: 'Fixo',
  Gémeos: 'Mutável', Virgem: 'Mutável', Sagitário: 'Mutável', Peixes: 'Mutável',
}

const ELEMENTO_EN = { Fogo: 'Fire', Terra: 'Earth', Ar: 'Air', Água: 'Water' }

function elemSigno(signo, lang) {
  const chave = normalizarSigno(signo)
  const { elemento } = getMapaStatic(lang)
  return elemento[chave] || ELEMENTO[chave]
}

function modSigno(signo, lang) {
  const chave = normalizarSigno(signo)
  const { modalidade } = getMapaStatic(lang)
  return modalidade[chave] || MODALIDADE[chave]
}

const REGENTE_ASC = {
  Carneiro: 'Marte', Touro: 'Vénus', Gémeos: 'Mercúrio', Caranguejo: 'Lua',
  Leão: 'Sol', Virgem: 'Mercúrio', Balança: 'Vénus', Escorpião: 'Marte',
  Sagitário: 'Júpiter', Capricórnio: 'Saturno', Aquário: 'Saturno', Peixes: 'Júpiter',
}

function normalizarSigno(nome) {
  if (!nome) return null
  const map = { Áries: 'Carneiro', Aries: 'Carneiro', Cancer: 'Caranguejo' }
  return map[nome] || nome
}

function sn(signo, lang) {
  return translateSigno(normalizarSigno(signo), lang) || signo || '-'
}

function nomeAspeto(str) {
  return (str || '').split(' ')[0]
}

function aspetosDe(planeta, aspetos) {
  return (aspetos || []).filter((a) =>
    nomeAspeto(a.planetaA) === planeta || nomeAspeto(a.planetaB) === planeta,
  )
}

function tp(nome, lang) {
  return translatePlaneta(nome, lang) || nome
}

function blocoCasa(casa, lang, prefixo = '') {
  if (!casa) return ''
  const t = getTemaCasa(casa, lang)
  if (!t) return ''
  return glueBlocoCasa(lang, casa, t, prefixo)
}

function blocoGraus(graus, signo, lang) {
  const g = parseFloat(graus) || 0
  return glueBlocoGraus(lang, g, sn(signo, lang), elemSigno(signo, lang))
}

function blocoAspectos(planeta, aspetos, planetas, lang) {
  const lista = aspetosDe(planeta, aspetos).slice(0, 4)
  if (!lista.length) return ''
  const partes = lista.map((a) => {
    const outro = nomeAspeto(a.planetaA) === planeta ? nomeAspeto(a.planetaB) : nomeAspeto(a.planetaA)
    const pOut = planetaPorNome(planetas, outro)
    const asp = translateAspecto(
      a.aspecto === 'Conjuncao' ? 'Conjunção' : a.aspecto,
      lang,
    ).toLowerCase()
    const signoOut = sn(pOut?.signo?.nome, lang)
    const casaOut = pOut?.casa
    const outroTr = tp(outro, lang)
    const orbeLbl = lang === 'pt' ? 'orbe' : 'orb'
    if (lang === 'pt') {
      return `${asp} ${outro} em ${signoOut}${casaOut ? ` (C${casaOut})` : ''} ${orbeLbl} ${a.orbe}`
    }
    return `${asp} ${outroTr} in ${signoOut}${casaOut ? ` (H${casaOut})` : ''} ${orbeLbl} ${a.orbe}`
  })
  return glueBlocoAspectos(lang, partes)
}

function faseLunar(lonSol, lonLua, lang) {
  if (lonSol == null || lonLua == null) return ''
  const diff = ((Number(lonLua) - Number(lonSol)) % 360 + 360) % 360
  return glueFaseLunar(lang, diff)
}

const SOL_PT = {
  Carneiro: 'O Sol em Carneiro é o arquétipo do guerreiro pioneiro. A tua identidade forma-se na acção directa - pensar demasiado paralisa-te; agir cura-te. Nasces com fome de existir e de abrir caminhos onde outros hesitam. A sombra é a impaciência e o ego ferido quando não és o primeiro; o dom é coragem autêntica que inspira. A vocação solar pede liderança sem tirania: iniciar projectos, defender causas, ser exemplo de presença viva.',
  Touro: 'O Sol em Touro busca identidade através da estabilidade, do prazer sensorial e do valor duradouro. Constróis a ti mesmo/a tijolo a tijolo - a pressa alheia irrita-te porque sabes que o que dura exige tempo. A sombra é a teimosia e o apego ao conforto; o dom é uma presença serena que ancora os outros. A vocação solar manifesta-se criando beleza, segurança e recursos tangíveis que perduram.',
  Gémeos: 'O Sol em Gémeos brilha através da mente curiosa e da palavra. A tua identidade é múltipla - não és uma pessoa só, és um constellation de ideias. A sombra é a dispersão e a superficialidade quando foges da profundidade; o dom é adaptabilidade e humor inteligente. A vocação solar passa por comunicar, conectar pontos, ensinar e traduzir mundos entre si.',
  Caranguejo: 'O Sol em Caranguejo define identidade pelo sentimento, pela memória e pelo pertencimento. Proteges o que amas com tenacidade silenciosa; a casa interior é sagrada. A sombra é o retraimento defensivo e o moodiness; o dom é empatia profunda e nutrição emocional. A vocação solar cuida, cria raízes, honra ancestralidade e transforma vulnerabilidade em força.',
  Leão: 'O Sol em Leão irradia criatividade, generosidade e necessidade de expressão autêntica. Precisas de palco - não por vaidade vazia, mas porque a alma expande quando és visto/a com verdade. A sombra é o drama quando o coração não é reconhecido; o dom é carisma magnético e lealdade real. A vocação solar lidera com o coração, cria, celebra e recorda aos outros que brilhar é direito.',
  Virgem: 'O Sol em Virgem constrói identidade através do serviço, do discernimento e do refinamento. Vês o que pode ser melhorado - em ti e no mundo - e isso é dom, não defeito. A sombra é a autocrítica paralisante; o dom é competência humilde e cura prática. A vocação solar organiza, purifica, aperfeiçoa processos e serve com excelência silenciosa.',
  Balança: 'O Sol em Balança encontra identidade na relação, na estética e na justiça. Não existes plenamente a sós - o espelho do outro completa-te. A sombra é a indecisão e a people-pleasing; o dom é diplomacia e senso de harmonia. A vocação solar cria pontes, acordos belos e ambientes onde a paz é possível.',
  Escorpião: 'O Sol em Escorpião forja identidade na profundidade, no mistério e na transformação. Não toleras superficialidade - a alma exige verdade nua. A sombra é o controlo e o ciúme; o dom é coragem psíquica e regeneração. A vocação solar investiga, cura, renasce e guia outros através de crises com integridade.',
  Sagitário: 'O Sol em Sagitário expande identidade através da fé, da viagem e da filosofia. Precisas de horizonte - literal ou metafórico - para respirar. A sombra é a dogmatização e a fuga quando a realidade aperta; o dom é optimismo visionário e honestidade directa. A vocação solar ensina, explora, publica verdades e inspira sentido.',
  Capricórnio: 'O Sol em Capricórnio edifica identidade com disciplina, responsabilidade e visão de legado. Montas montanhas passo a passo; o tempo é aliado, não inimigo. A sombra é o frio emocional e o workaholism; o dom é autoridade natural e persistência. A vocação solar constrói estruturas, lidera instituições e deixa marca duradoura.',
  Aquário: 'O Sol em Aquário define identidade pela originalidade, pela visão colectiva e pela liberdade intelectual. Pensas fora do rebanho porque o futuro te chama. A sombra é a distância emocional e a rebeldia por rebeldia; o dom é inovação humanitária. A vocação solar revoluciona sistemas, une comunidades e serve o bem comum.',
  Peixes: 'O Sol em Peixes dissolve fronteiras entre eu e o todo. Identidade fluida, compassiva, artística - sentes o que o mundo sente. A sombra é a fuga e a confusão de limites; o dom é imaginação e compaixão sem fronteiras. A vocação solar cura, cria arte, serve espiritualmente e traduz o invisível.',
}

const LUA_PT = {
  Carneiro: 'A Lua em Carneiro reage com impulso e independência emocional. Precisas de agir quando sentes - esperar esgota-te. Sob stress, tornas-te combativo/a ou isolado/a para proteger a vulnerabilidade. O conforto emocional vem da autonomia e da capacidade de recomeçar. Nutre-te com movimento, desafios e honestidade directa sobre o que sentes.',
  Touro: 'A Lua em Touro busca segurança sensorial - comida, toque, ritmo estável. Emoções mudam devagar mas com profundidade; abalos externos destabilizam-te quando perdes rotina. Sob stress, teimosia emocional. Nutre-te com natureza, prazer consciente e ambientes esteticamente harmoniosos.',
  Gémeos: 'A Lua em Gémeos processa emoções através da palavra e da variedade. Precisas de falar, escrever, ler para regulares o coração. Sob stress, mente acelera e sentimentos fragmentam-se. Nutre-te com conversas inteligentes, aprendizagem e mudança de cenário quando emocionalmente saturado/a.',
  Caranguejo: 'A Lua em Caranguejo é a Lua em domicílio emocional - sentes tudo intensamente, memória afectiva profunda. Lar e família (escolhida ou biológica) são bússola. Sob stress, retraimento e nostalgia. Nutre-te com intimidade segura, tradições, cuidado mútuo e permissão para sentir sem julgar.',
  Leão: 'A Lua em Leão precisa de calor, reconhecimento e expressão emocional dramática. O coração quer brilhar também na esfera privada. Sob stress, orgulho ferido ou teatralidade defensiva. Nutre-te com criatividade, romance, jogos e elogios sinceros.',
  Virgem: 'A Lua em Virgem regula emoções através da ordem, da utilidade e do corpo. Ansiedade surge quando o mundo parece caótico. Sob stress, crítica excessiva a ti e aos outros. Nutre-te com rotinas saudáveis, serviço significativo e listas que devolvem sensação de controlo.',
  Balança: 'A Lua em Balança equilibra emoções através da relação - sozinho/a sentes desequilíbrio. Conflito perturba profundamente; buscas harmonia. Sob stress, indecisão ou agradar em excesso. Nutre-te com beleza, parceria consciente e ambientes pacíficos.',
  Escorpião: 'A Lua em Escorpião sente com intensidade magnética - tudo ou nada emocionalmente. Lealdade absoluta; traição marca para sempre. Sob stress, ciúme, segredos ou transformação forçada. Nutre-te com verdade, intimidade profunda e rituais de purificação emocional.',
  Sagitário: 'A Lua em Sagitário precisa de liberdade emocional e sentido. Sentimentos expandem quando há horizonte; aprisionamento deprime. Sob stress, fuga ou sermão moralizador. Nutre-te com viagens, estudo, humor e conversas filosóficas.',
  Capricórnio: 'A Lua em Capricórnio contém emoções - maduro/a cedo, responsável emocionalmente antes da hora. Vulnerabilidade custa; estrutura protege. Sob stress, frieza ou workaholism emocional. Nutre-te com metas alcançadas, respeito ganho e tempo privado sem culpa.',
  Aquário: 'A Lua em Aquário processa emoções intelectualmente - distância como defesa, amizade como base afectiva. Sob stress, alienação ou rebeldia emocional. Nutre-te com causas colectivas, amizades autênticas e espaço para ser diferente.',
  Peixes: 'A Lua em Peixes absorve ambientes - fronteiras emocionais porosas, sonhos vívidos, compaixão ilimitada. Sob stress, confusão ou escapismo. Nutre-te com arte, meditação, água, silêncio e limites gentis.',
}

const ASC_PT = {
  Carneiro: 'Ascendente em Carneiro - entras no mundo com energia directa, corpo activo e olhar que desafia. A primeira impressão é de alguém pronto para agir; o corpo-veículo pede movimento. Integrar esta máscara é deixar de pedir desculpa pela tua iniciativa e usar a impaciência como motor criativo, não como arma.',
  Touro: 'Ascendente em Touro - presença calma, voz estável, estética natural. O mundo lê-te como confiável e sensorial; o corpo pede conforto e qualidade. Integrar é honrar o ritmo lento sem culpa e permitir prazer como forma de presença, não de preguiça.',
  Gémeos: 'Ascendente em Gémeos - entrada curiosa, verbal, inquieta. Pareces acessível e inteligente; o gesto e a palavra vêm antes da emoção profunda. Integrar é usar a versatilidade social sem perder profundidade interior.',
  Caranguejo: 'Ascendente em Caranguejo - abordagem protectora, olhar atento, sensibilidade visível. Causas impressão de cuidador/a; o corpo reage ao ambiente emocional. Integrar é mostrar vulnerabilidade sem medo de pareceres fraco/a.',
  Leão: 'Ascendente em Leão - presença magnética, postura real, calor imediato. Brilhas ao entrar numa sala; o corpo pede expressão. Integrar é brilhar sem performar - autenticidade como coroa.',
  Virgem: 'Ascendente em Virgem - entrada modesta, olhar analítico, detalhe no aspeto. Pareces competente e discreto/a; o corpo nota imperfeições. Integrar é aceitar o corpo imperfeito como templo funcional.',
  Balança: 'Ascendente em Balança - charme diplomático, estética cuidada, busca de equilíbrio visível. Encantador/a à primeira vista. Integrar é afirmar opinião mesmo quando desequilibra momentaneamente a paz.',
  Escorpião: 'Ascendente em Escorpião - magnetismo intenso, olhar penetrante, reserva estratégica. Intimidante ou fascinante - raramente indiferente. Integrar é usar profundidade sem manipular.',
  Sagitário: 'Ascendente em Sagitário - entrada optimista, riso fácil, postura aberta. Pareces aventureiro/a e honesto/a. Integrar é ancorar o entusiasmo sem perder a visão.',
  Capricórnio: 'Ascendente em Capricórnio - presença séria, competência visível, reserva inicial. Pareces mais velho/a ou responsável. Integrar é permitir leveza sem perder autoridade.',
  Aquário: 'Ascendente em Aquário - estilo único, distância amigável, originalidade imediata. Pareces independente e visionário/a. Integrar é ligar-te emocionalmente sem perder a diferença.',
  Peixes: 'Ascendente em Peixes - aura suave, olhar sonhador, empatia visível. Pareces artístico/a ou espiritual. Integrar é manter limites sem perder a compaixão.',
}

// EN versions - unique professional copy per sign
const SOL_EN = {
  Aries: 'Sun in Aries is the pioneer warrior archetype. Identity forms through direct action - overthinking paralyses you; action heals you. You are born hungry to exist and open paths where others hesitate. Shadow: impatience and wounded ego when not first; gift: authentic courage that inspires. Solar vocation asks leadership without tyranny: initiating projects, defending causes, embodying living presence.',
  Taurus: 'Sun in Taurus seeks identity through stability, sensory pleasure and lasting value. You build yourself brick by brick - others\' hurry irritates you because you know what endures takes time. Shadow: stubbornness and comfort attachment; gift: serene presence that anchors others. Solar vocation creates beauty, security and tangible resources that last.',
  Gemini: 'Sun in Gemini shines through curious mind and word. Identity is multiple - you are a constellation of ideas. Shadow: dispersion and superficiality when fleeing depth; gift: adaptability and intelligent humour. Solar vocation communicates, connects dots, teaches and translates worlds.',
  Cancer: 'Sun in Cancer defines identity through feeling, memory and belonging. You protect what you love with silent tenacity; inner home is sacred. Shadow: defensive withdrawal and moodiness; gift: deep empathy and emotional nourishment. Solar vocation cares, creates roots, honours ancestry and turns vulnerability into strength.',
  Leo: 'Sun in Leo radiates creativity, generosity and need for authentic expression. You need a stage - not empty vanity, but because soul expands when seen truthfully. Shadow: drama when heart is unrecognised; gift: magnetic charisma and real loyalty. Solar vocation leads with heart, creates, celebrates and reminds others that shining is a right.',
  Virgo: 'Sun in Virgo builds identity through service, discernment and refinement. You see what can improve - in you and the world - and that is gift, not flaw. Shadow: paralysing self-criticism; gift: humble competence and practical healing. Solar vocation organises, purifies, perfects processes and serves with quiet excellence.',
  Libra: 'Sun in Libra finds identity in relationship, aesthetics and justice. You do not fully exist alone - the other\'s mirror completes you. Shadow: indecision and people-pleasing; gift: diplomacy and sense of harmony. Solar vocation builds bridges, beautiful agreements and environments where peace is possible.',
  Scorpio: 'Sun in Scorpio forges identity in depth, mystery and transformation. You tolerate no superficiality - soul demands naked truth. Shadow: control and jealousy; gift: psychic courage and regeneration. Solar vocation investigates, heals, rebirths and guides others through crises with integrity.',
  Sagittarius: 'Sun in Sagittarius expands identity through faith, travel and philosophy. You need horizon - literal or metaphorical - to breathe. Shadow: dogmatism and escape when reality tightens; gift: visionary optimism and direct honesty. Solar vocation teaches, explores, publishes truths and inspires meaning.',
  Capricorn: 'Sun in Capricorn builds identity with discipline, responsibility and legacy vision. You climb mountains step by step; time is ally, not enemy. Shadow: emotional coldness and workaholism; gift: natural authority and persistence. Solar vocation builds structures, leads institutions and leaves lasting mark.',
  Aquarius: 'Sun in Aquarius defines identity through originality, collective vision and intellectual freedom. You think outside the herd because the future calls. Shadow: emotional distance and rebellion for its own sake; gift: humanitarian innovation. Solar vocation revolutionises systems, unites communities and serves the common good.',
  Pisces: 'Sun in Pisces dissolves boundaries between self and whole. Fluid, compassionate, artistic identity - you feel what the world feels. Shadow: escape and boundary confusion; gift: imagination and boundless compassion. Solar vocation heals, creates art, serves spiritually and translates the invisible.',
}

const LUA_EN = {
  Aries: 'Moon in Aries reacts with impulse and emotional independence. You must act when you feel - waiting drains you. Under stress you become combative or isolated to protect vulnerability. Emotional comfort comes from autonomy and ability to restart. Nourish yourself with movement, challenges and direct honesty about feelings.',
  Taurus: 'Moon in Taurus seeks sensory security - food, touch, stable rhythm. Emotions change slowly but deeply; external shocks destabilise when routine is lost. Under stress: emotional stubbornness. Nourish with nature, conscious pleasure and aesthetically harmonious environments.',
  Gemini: 'Moon in Gemini processes emotions through words and variety. You need to speak, write, read to regulate the heart. Under stress mind accelerates and feelings fragment. Nourish with intelligent conversation, learning and scenery change when emotionally saturated.',
  Cancer: 'Moon in Cancer is emotional home sign - you feel everything intensely, deep affective memory. Home and family (chosen or biological) are compass. Under stress: withdrawal and nostalgia. Nourish with safe intimacy, traditions, mutual care and permission to feel without judgment.',
  Leo: 'Moon in Leo needs warmth, recognition and dramatic emotional expression. Heart wants to shine in private sphere too. Under stress: wounded pride or defensive theatrics. Nourish with creativity, romance, play and sincere praise.',
  Virgo: 'Moon in Virgo regulates emotions through order, usefulness and body. Anxiety rises when world seems chaotic. Under stress: excessive criticism of self and others. Nourish with healthy routines, meaningful service and lists that restore sense of control.',
  Libra: 'Moon in Libra balances emotions through relationship - alone you feel off-centre. Conflict disturbs deeply; you seek harmony. Under stress: indecision or excessive pleasing. Nourish with beauty, conscious partnership and peaceful environments.',
  Scorpio: 'Moon in Scorpio feels with magnetic intensity - all or nothing emotionally. Absolute loyalty; betrayal marks forever. Under stress: jealousy, secrets or forced transformation. Nourish with truth, deep intimacy and emotional purification rituals.',
  Sagittarius: 'Moon in Sagittarius needs emotional freedom and meaning. Feelings expand with horizon; imprisonment depresses. Under stress: escape or moralising sermon. Nourish with travel, study, humour and philosophical conversation.',
  Capricorn: 'Moon in Capricorn contains emotions - mature early, emotionally responsible before time. Vulnerability costs; structure protects. Under stress: coldness or emotional workaholism. Nourish with achieved goals, earned respect and private time without guilt.',
  Aquarius: 'Moon in Aquarius processes emotions intellectually - distance as defence, friendship as affective base. Under stress: alienation or emotional rebellion. Nourish with collective causes, authentic friendships and space to be different.',
  Pisces: 'Moon in Pisces absorbs environments - porous emotional boundaries, vivid dreams, limitless compassion. Under stress: confusion or escapism. Nourish with art, meditation, water, silence and gentle limits.',
}

const ASC_EN = {
  Aries: 'Aries Ascendant - you enter the world with direct energy, active body and challenging gaze. First impression: someone ready to act; body-vehicle demands movement. Integration means stop apologising for initiative and use impatience as creative fuel, not weapon.',
  Taurus: 'Taurus Ascendant - calm presence, steady voice, natural aesthetics. World reads you as reliable and sensory; body asks comfort and quality. Integration honours slow rhythm without guilt and allows pleasure as presence, not laziness.',
  Gemini: 'Gemini Ascendant - curious, verbal, restless entry. You seem accessible and intelligent; gesture and word come before deep emotion. Integration uses social versatility without losing inner depth.',
  Cancer: 'Cancer Ascendant - protective approach, attentive gaze, visible sensitivity. You seem caregiver; body reacts to emotional environment. Integration shows vulnerability without fear of seeming weak.',
  Leo: 'Leo Ascendant - magnetic presence, regal posture, immediate warmth. You shine entering a room; body demands expression. Integration shines without performing - authenticity as crown.',
  Virgo: 'Virgo Ascendant - modest entry, analytical gaze, detail in appearance. You seem competent and discreet; body notices imperfections. Integration accepts imperfect body as functional temple.',
  Libra: 'Libra Ascendant - diplomatic charm, cared aesthetics, visible balance-seeking. Charming at first sight. Integration asserts opinion even when it momentarily unbalances peace.',
  Scorpio: 'Scorpio Ascendant - intense magnetism, penetrating gaze, strategic reserve. Intimidating or fascinating - rarely indifferent. Integration uses depth without manipulating.',
  Sagittarius: 'Sagittarius Ascendant - optimistic entry, easy laugh, open posture. You seem adventurous and honest. Integration anchors enthusiasm without losing vision.',
  Capricorn: 'Capricorn Ascendant - serious presence, visible competence, initial reserve. You seem older or responsible. Integration allows lightness without losing authority.',
  Aquarius: 'Aquarius Ascendant - unique style, friendly distance, immediate originality. You seem independent and visionary. Integration connects emotionally without losing difference.',
  Pisces: 'Pisces Ascendant - soft aura, dreamy gaze, visible empathy. You seem artistic or spiritual. Integration keeps boundaries without losing compassion.',
}

function textoEssencia(mapaPt, mapaEn, mapaLoc, signo, lang) {
  const chave = normalizarSigno(signo)
  if (lang === 'en') return mapaEn[sn(chave, 'en')] || ''
  if (lang === 'pt') return mapaPt[chave] || ''
  const loc = contentForLang(lang, mapaLoc)
  return loc?.[chave] || mapaEn[sn(chave, 'en')] || mapaPt[chave] || ''
}

const SOL_LOC = { es: SOL_ES, it: SOL_IT, de: SOL_DE, fr: SOL_FR }
const LUA_LOC = { es: LUA_ES, it: LUA_IT, de: LUA_DE, fr: LUA_FR }
const ASC_LOC = { es: ASC_ES, it: ASC_IT, de: ASC_DE, fr: ASC_FR }

function blocoRegenteAsc(asc, planetas, lang) {
  const chave = normalizarSigno(asc)
  const reg = REGENTE_ASC[chave]
  if (!reg) return ''
  const p = planetaPorNome(planetas, reg)
  const regLabel = tp(reg, lang)
  if (!p) {
    return contentForLang(lang, {
      pt: ` Regente do mapa: ${reg} (regente clássico de ${sn(asc, lang)}). Estuda este planeta no mapa completo para orientação de vida.`,
      en: ` Chart ruler: ${regLabel} (classic ruler of ${sn(asc, lang)}). Study this planet in your full chart for life direction.`,
      es: ` Regente del mapa: ${regLabel} (regente clásico de ${sn(asc, lang)}). Estudia este planeta en la carta completa para orientación de vida.`,
      it: ` Reggente della carta: ${regLabel} (reggente classico di ${sn(asc, lang)}). Studia questo pianeta nella carta completa per orientamento di vita.`,
      de: ` Herrscher des Horoskops: ${regLabel} (klassischer Herrscher von ${sn(asc, lang)}). Studiere diesen Planeten im vollen Horoskop für Lebensrichtung.`,
      fr: ` Maître de la carte : ${regLabel} (maître classique de ${sn(asc, lang)}). Étudie cette planète dans la carte complète pour l'orientation de vie.`,
    })
  }
  return contentForLang(lang, {
    pt: ` Regente do mapa ${reg} em ${sn(p.signo?.nome, lang)}${p.casa ? `, Casa ${p.casa}` : ''} orienta o teu caminho de vida - onde ${reg} vai, a história do Ascendente desenrola-se.`,
    en: ` Chart ruler ${regLabel} in ${sn(p.signo?.nome, lang)}${p.casa ? `, House ${p.casa}` : ''} steers your life path - where ${regLabel} goes, your Ascendant story unfolds.`,
    es: ` Regente del mapa ${regLabel} en ${sn(p.signo?.nome, lang)}${p.casa ? `, Casa ${p.casa}` : ''} orienta tu camino de vida: donde va ${regLabel}, se despliega la historia del Ascendente.`,
    it: ` Reggente della carta ${regLabel} in ${sn(p.signo?.nome, lang)}${p.casa ? `, Casa ${p.casa}` : ''} orienta il tuo cammino di vita: dove va ${regLabel}, si dispiega la storia dell'Ascendente.`,
    de: ` Herrscher ${regLabel} in ${sn(p.signo?.nome, lang)}${p.casa ? `, Haus ${p.casa}` : ''} lenkt deinen Lebensweg – wohin ${regLabel} geht, entfaltet sich die Aszendent-Geschichte.`,
    fr: ` Maître ${regLabel} en ${sn(p.signo?.nome, lang)}${p.casa ? `, Maison ${p.casa}` : ''} oriente ton chemin de vie : où va ${regLabel}, l'histoire de l'Ascendant se déploie.`,
  })
}

export function interpretarSolEssencia(pSol, mapaNatal, aspetos, planetas, lang = 'pt') {
  if (!pSol) return ''
  const signo = pSol.signo?.nome
  const rico = textoEssencia(SOL_PT, SOL_EN, SOL_LOC, signo, lang)
  return comporInterpretacaoPlaneta('Sol', pSol, aspetos, planetas, lang, rico)
}

export function interpretarLuaEssencia(pLua, mapaNatal, aspetos, planetas, lang = 'pt') {
  if (!pLua) return ''
  const signo = pLua.signo?.nome
  let rico = textoEssencia(LUA_PT, LUA_EN, LUA_LOC, signo, lang)
  const pSol = planetaPorNome(planetas, 'Sol')
  rico += faseLunar(pSol?.longitude, pLua.longitude, lang)
  return comporInterpretacaoPlaneta('Lua', pLua, aspetos, planetas, lang, rico)
}

export function interpretarAscEssencia(asc, mapaNatal, aspetos, planetas, lang = 'pt') {
  if (!asc) return ''
  let rico = textoEssencia(ASC_PT, ASC_EN, ASC_LOC, asc, lang)
  rico += blocoRegenteAsc(asc, planetas, lang)
  const mc = mapaNatal?.mc?.nome
  if (mc) {
    rico += contentForLang(lang, {
      pt: ` Eixo Ascendente–MC: o caminho público (MC em ${sn(mc, lang)}) filtra como a máscara ${sn(asc, lang)} serve a vocação.`,
      en: ` The Ascendant–MC axis: your public path (MC in ${sn(mc, lang)}) filters how your ${sn(asc, lang)} persona serves vocation.`,
      es: ` Eje Ascendente–MC: el camino público (MC en ${sn(mc, lang)}) filtra cómo la máscara ${sn(asc, lang)} sirve a la vocación.`,
      it: ` Asse Ascendente–MC: il cammino pubblico (MC in ${sn(mc, lang)}) filtra come la maschera ${sn(asc, lang)} serve la vocazione.`,
      de: ` Aszendent–MC-Achse: dein öffentlicher Weg (MC in ${sn(mc, lang)}) filtert, wie deine ${sn(asc, lang)}-Persona der Berufung dient.`,
      fr: ` Axe Ascendant–MC : ton chemin public (MC en ${sn(mc, lang)}) filtre comment ton persona ${sn(asc, lang)} sert la vocation.`,
    })
  }
  const casaTxt = contentForLang(lang, {
    pt: ' A 1.ª Casa é o teu limiar: a forma como entras nas salas, como o corpo fala antes das palavras e a máscara instintiva que usas quando o mundo te encontra pela primeira vez.',
    en: ' The 1st House is your threshold: how you enter rooms, how your body speaks before words, and the instinctive mask you wear when the world first meets you.',
    es: ' La 1.ª Casa es tu umbral: cómo entras en las salas, cómo el cuerpo habla antes que las palabras y la máscara instintiva cuando el mundo te encuentra por primera vez.',
    it: ' La 1ª Casa è la tua soglia: come entri nelle stanze, come il corpo parla prima delle parole e la maschera istintiva quando il mondo ti incontra per la prima volta.',
    de: ' Das 1. Haus ist deine Schwelle: wie du Räume betrittst, wie der Körper vor Worten spricht und die instinktive Maske, wenn die Welt dich zum ersten Mal trifft.',
    fr: ' La 1re Maison est ton seuil : comment tu entres dans les pièces, comment le corps parle avant les mots et le masque instinctif quand le monde te rencontre pour la première fois.',
  })
  return `${rico}\n\n${casaTxt}`
}

export function interpretarBig3Essencia(mapaNatal, planetas, aspetos, lang = 'pt') {
  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  if (!sol || !lua || !asc) {
    return contentForLang(lang, {
      pt: 'O triângulo Sol–Lua–Ascendente é a chave-mestra do teu mapa. Quando os três são conhecidos, a maturidade astrológica começa por honrar cada polo sem silenciar os outros.',
      en: 'The Sun–Moon–Ascendant triangle is the master key of your chart. When all three are known, astrological maturity begins with honouring each pole without silencing the others.',
      es: 'El triángulo Sol–Luna–Ascendente es la clave maestra de tu carta. Cuando los tres son conocidos, la madurez astrológica comienza honrando cada polo sin silenciar los otros.',
      it: 'Il triangolo Sole–Luna–Ascendente è la chiave maestra della tua carta. Quando i tre sono noti, la maturità astrologica inizia onorando ogni polo senza silenziare gli altri.',
      de: 'Das Sonne–Mond–Aszendent-Dreieck ist der Hauptschlüssel deines Horoskops. Wenn alle drei bekannt sind, beginnt astrologische Reife damit, jeden Pol zu ehren, ohne die anderen zu verstummen.',
      fr: 'Le triangle Soleil–Lune–Ascendant est la clé maîtresse de ta carte. Quand les trois sont connus, la maturité astrologique commence par honorer chaque pôle sans en faire taire d\'autres.',
    })
  }

  const eSol = ELEMENTO[normalizarSigno(sol)]
  const eLua = ELEMENTO[normalizarSigno(lua)]
  const eAsc = ELEMENTO[normalizarSigno(asc)]
  const mSol = MODALIDADE[normalizarSigno(sol)]
  const mLua = MODALIDADE[normalizarSigno(lua)]
  const ss = sn(sol, lang), sl = sn(lua, lang), sa = sn(asc, lang)
  const eSolL = elemSigno(sol, lang)
  const eLuaL = elemSigno(lua, lang)
  const eAscL = elemSigno(asc, lang)
  const mSolL = modSigno(sol, lang)
  const mLuaL = modSigno(lua, lang)
  const mAscL = modSigno(asc, lang)

  const partes = []
  partes.push(contentForLang(lang, {
    pt: `A tua assinatura psíquica: Sol em ${ss} (${eSolL}/${mSolL}), Lua em ${sl} (${eLuaL}/${mLuaL}), Ascendente em ${sa} (${eAscL}/${mAscL}). Esta combinação é estatisticamente rara na sua forma exacta - nenhum horóscopo genérico a captura.`,
    en: `Your psychic signature: Sun in ${ss} (${eSolL}/${mSolL}), Moon in ${sl} (${eLuaL}/${mLuaL}), Ascendant in ${sa} (${eAscL}/${mAscL}). This combination is statistically rare in its exact form - no generic horoscope captures it.`,
    es: `Tu firma psíquica: Sol en ${ss} (${eSolL}/${mSolL}), Luna en ${sl} (${eLuaL}/${mLuaL}), Ascendente en ${sa} (${eAscL}/${mAscL}). Esta combinación es estadísticamente rara en su forma exacta: ningún horóscopo genérico la captura.`,
    it: `La tua firma psichica: Sole in ${ss} (${eSolL}/${mSolL}), Luna in ${sl} (${eLuaL}/${mLuaL}), Ascendente in ${sa} (${eAscL}/${mAscL}). Questa combinazione è statisticamente rara nella sua forma esatta: nessun oroscopo generico la cattura.`,
    de: `Deine psychische Signatur: Sonne in ${ss} (${eSolL}/${mSolL}), Mond in ${sl} (${eLuaL}/${mLuaL}), Aszendent in ${sa} (${eAscL}/${mAscL}). Diese Kombination ist in exakter Form statistisch selten – kein generisches Horoskop erfasst sie.`,
    fr: `Ta signature psychique : Soleil en ${ss} (${eSolL}/${mSolL}), Lune en ${sl} (${eLuaL}/${mLuaL}), Ascendant en ${sa} (${eAscL}/${mAscL}). Cette combinaison est statistiquement rare dans sa forme exacte – aucun horoscope générique ne la capture.`,
  }))

  if (eSol === eLua && eLua === eAsc) {
    partes.push(contentForLang(lang, {
      pt: `Ênfase tripla em ${eSolL}: identidade, emoção e persona falam uma linguagem elemental - coerência poderosa, mas cuidado com pontos cegos nos outros elementos.`,
      en: `Triple ${eSolL} emphasis: identity, emotion and persona speak one elemental language - powerful coherence, but watch for blind spots in other elements.`,
      es: `Énfasis triple en ${eSolL}: identidad, emoción y persona hablan un lenguaje elemental: coherencia poderosa, pero cuidado con puntos ciegos en otros elementos.`,
      it: `Enfasi tripla su ${eSolL}: identità, emozione e persona parlano una lingua elementale: coerenza potente, ma attenzione ai punti ciechi negli altri elementi.`,
      de: `Dreifache ${eSolL}-Betonung: Identität, Emotion und Persona sprechen eine elementare Sprache – mächtige Kohärenz, aber Vorsicht vor blinden Flecken in anderen Elementen.`,
      fr: `Triple emphase ${eSolL} : identité, émotion et persona parlent une langue élémentaire – cohérence puissante, mais attention aux angles morts dans les autres éléments.`,
    }))
  } else if (eSol !== eLua) {
    const tensao = (eSol === 'Fogo' && eLua === 'Água') || (eSol === 'Água' && eLua === 'Fogo')
      ? contentForLang(lang, { pt: 'fogo vs água - acção vs sentimento', en: 'fire vs water - action vs feeling', es: 'fuego vs agua - acción vs sentimiento', it: 'fuoco vs acqua - azione vs sentimento', de: 'Feuer vs Wasser - Handeln vs Fühlen', fr: 'feu vs eau - action vs sentiment' })
      : (eSol === 'Ar' && eLua === 'Terra') || (eSol === 'Terra' && eLua === 'Ar')
        ? contentForLang(lang, { pt: 'ar vs terra - ideias vs concretude', en: 'air vs earth - ideas vs practicality', es: 'aire vs tierra - ideas vs concreción', it: 'aria vs terra - idee vs concretezza', de: 'Luft vs Erde - Ideen vs Konkretion', fr: 'air vs terre - idées vs concrétion' })
        : contentForLang(lang, { pt: 'ritmos elementais distintos', en: 'different elemental rhythms', es: 'ritmos elementales distintos', it: 'ritmi elementali distinti', de: 'verschiedene Elementrhythmen', fr: 'rythmes élémentaires distincts' })
    partes.push(contentForLang(lang, {
      pt: `Tensão Sol–Lua (${tensao}): diálogo interno entre quem queres ser e o que precisas para te sentires seguro/a. A integração é a tua obra-prima de vida.`,
      en: `Sun–Moon tension (${tensao}): inner dialogue between who you want to be and what you need to feel safe. Integration is your life masterpiece.`,
      es: `Tensión Sol–Luna (${tensao}): diálogo interno entre quien quieres ser y lo que necesitas para sentirte seguro/a. La integración es tu obra maestra de vida.`,
      it: `Tensione Sole–Luna (${tensao}): dialogo interno tra chi vuoi essere e ciò che ti serve per sentirti al sicuro. L'integrazione è il tuo capolavoro di vita.`,
      de: `Sonne–Mond-Spannung (${tensao}): innerer Dialog zwischen dem, wer du sein willst, und dem, was du brauchst, um dich sicher zu fühlen. Integration ist dein Lebensmeisterwerk.`,
      fr: `Tension Soleil–Lune (${tensao}) : dialogue intérieur entre qui tu veux être et ce dont tu as besoin pour te sentir en sécurité. L'intégration est ton chef-d'œuvre de vie.`,
    }))
  } else {
    partes.push(contentForLang(lang, {
      pt: `Sol e Lua partilham elemento (${eSolL}): eu consciente e emocional alinham-se - a autenticidade flui com mais facilidade.`,
      en: `Sun and Moon share element (${eSolL}): emotional and conscious selves align - authenticity flows more easily.`,
      es: `Sol y Luna comparten elemento (${eSolL}): yo consciente y emocional se alinean: la autenticidad fluye con más facilidad.`,
      it: `Sole e Luna condividono elemento (${eSolL}): sé conscio ed emotivo si allineano: l'autenticità fluisce più facilmente.`,
      de: `Sonne und Mond teilen Element (${eSolL}): bewusstes und emotionales Selbst richten sich aus – Authentizität fließt leichter.`,
      fr: `Soleil et Lune partagent l'élément (${eSolL}) : moi conscient et émotionnel s'alignent – l'authenticité coule plus facilement.`,
    }))
  }

  if (eAsc !== eSol) {
    partes.push(contentForLang(lang, {
      pt: `Ascendente (${eAscL}) filtra como o mundo lê o teu Sol (${eSolL}): és frequentemente percebido/a de forma diferente do núcleo íntimo - usa isto como profundidade estratégica, não contradição.`,
      en: `Ascendant (${eAscL}) filters how the world reads your Sun (${eSolL}): you are often perceived differently from your inner core - use this as strategic depth, not contradiction.`,
      es: `Ascendente (${eAscL}) filtra cómo el mundo lee tu Sol (${eSolL}): a menudo eres percibido/a de forma distinta al núcleo íntimo: úsalo como profundidad estratégica, no contradicción.`,
      it: `Ascendente (${eAscL}) filtra come il mondo legge il tuo Sole (${eSolL}): spesso sei percepito/a diversamente dal nucleo intimo: usalo come profondità strategica, non contraddizione.`,
      de: `Aszendent (${eAscL}) filtert, wie die Welt deine Sonne (${eSolL}) liest: du wirst oft anders wahrgenommen als dein innerer Kern – nutze das als strategische Tiefe, nicht Widerspruch.`,
      fr: `Ascendant (${eAscL}) filtre comment le monde lit ton Soleil (${eSolL}) : tu es souvent perçu(e) différemment du noyau intime – utilise cela comme profondeur stratégique, pas contradiction.`,
    }))
  }

  const solLuaAsp = (aspetos || []).find((a) => {
    const pa = nomeAspeto(a.planetaA)
    const pb = nomeAspeto(a.planetaB)
    return (pa === 'Sol' && pb === 'Lua') || (pa === 'Lua' && pb === 'Sol')
  })
  if (solLuaAsp) {
    const aspLabel = translateAspecto(solLuaAsp.aspecto, lang).toLowerCase()
    partes.push(contentForLang(lang, {
      pt: `Aspecto directo Sol–Lua (${aspLabel}): identidade e corpo emocional estão ligados - o que sentes molda quem és imediatamente.`,
      en: `Direct Sun–Moon aspect (${aspLabel}): your identity and emotional body are wired together - what you feel shapes who you are immediately.`,
      es: `Aspecto directo Sol–Luna (${aspLabel}): identidad y cuerpo emocional están ligados: lo que sientes moldea quién eres inmediatamente.`,
      it: `Aspetto diretto Sole–Luna (${aspLabel}): identità e corpo emotivo sono collegati: ciò che senti modella subito chi sei.`,
      de: `Direkter Sonne–Mond-Aspekt (${aspLabel}): Identität und emotioneller Körper sind verbunden – was du fühlst, formt sofort, wer du bist.`,
      fr: `Aspect direct Soleil–Lune (${aspLabel}) : identité et corps émotionnel sont liés – ce que tu ressens façonne immédiatement qui tu es.`,
    }))
  }

  if (mSol !== mLua) {
    partes.push(contentForLang(lang, {
      pt: `Ritmo modal: Sol ${mSolL}, Lua ${mLuaL} - aprende quando iniciar, sustentar ou adaptar; o teu calendário interior tem dois tempos.`,
      en: `Modal rhythm: Sun ${mSolL}, Moon ${mLuaL} - learn when to initiate, sustain or adapt; your inner calendar has two tempos.`,
      es: `Ritmo modal: Sol ${mSolL}, Luna ${mLuaL}: aprende cuándo iniciar, sostener o adaptar; tu calendario interior tiene dos tempos.`,
      it: `Ritmo modale: Sole ${mSolL}, Luna ${mLuaL}: impara quando iniziare, sostenere o adattarti; il tuo calendario interiore ha due tempi.`,
      de: `Modaler Rhythmus: Sonne ${mSolL}, Mond ${mLuaL} – lerne, wann initiieren, halten oder anpassen; dein innerer Kalender hat zwei Tempos.`,
      fr: `Rythme modal : Soleil ${mSolL}, Lune ${mLuaL} – apprends quand initier, soutenir ou t'adapter ; ton calendrier intérieur a deux tempos.`,
    }))
  }

  const reg = REGENTE_ASC[normalizarSigno(asc)]
  const pReg = planetaPorNome(planetas, reg)
  if (pReg) {
    const casaLbl = lang === 'pt' ? `Casa ${pReg.casa || '-'}` : `House ${pReg.casa || '-'}`
    partes.push(contentForLang(lang, {
      pt: `Planeta-guia da vida: ${reg} em ${sn(pReg.signo?.nome, lang)} (${casaLbl}) - segue os temas deste planeta para desbloquear a narrativa completa do mapa.`,
      en: `Life steering planet: ${tp(reg, lang)} in ${sn(pReg.signo?.nome, lang)} (${casaLbl}) - follow this planet's themes to unlock your chart's full narrative.`,
      es: `Planeta guía de la vida: ${tp(reg, lang)} en ${sn(pReg.signo?.nome, lang)} (${casaLbl}) - sigue los temas de este planeta para desbloquear la narrativa completa de la carta.`,
      it: `Pianeta guida della vita: ${tp(reg, lang)} in ${sn(pReg.signo?.nome, lang)} (${casaLbl}) - segui i temi di questo pianeta per sbloccare la narrativa completa della carta.`,
      de: `Lebenslenkplanet: ${tp(reg, lang)} in ${sn(pReg.signo?.nome, lang)} (${casaLbl}) – folge den Themen dieses Planeten, um die volle Horoskop-Erzählung zu entfalten.`,
      fr: `Planète guide de vie : ${tp(reg, lang)} en ${sn(pReg.signo?.nome, lang)} (${casaLbl}) – suis les thèmes de cette planète pour débloquer le récit complet de la carte.`,
    }))
  }

  return partes.join(' ')
}

const ESSENCIA_PLANETA = {
  pt: {
    Mercúrio: 'Mercúrio governa a mente concreta, a fala, a escrita e a forma como processas informação. É o mensageiro do mapa - traduz o céu em palavras que a vida compreende.',
    Vénus: 'Vénus descreve o que amas, o que valorizas e a forma como atraes e és atraído/a. É a gravidade do prazer, da beleza e do vínculo afetivo no teu mapa.',
    Marte: 'Marte é o guerreiro interior - desejo, coragem, raiva e impulso de agir. Mostra onde combates, onde conquistas e onde precisas de canalizar fogo sem te queimares.',
    Júpiter: 'Júpiter expande - fé, sentido, oportunidade e crescimento. Indica onde a vida te convida a confiar, a ousar e a ver mais longe do que o medo permite.',
    Saturno: 'Saturno é o mestre severo e amoroso - limites, tempo, responsabilidade e maturidade. Marca onde constróis trono através do esforço ou onde o medo te paralisa até aprenderes.',
  },
  en: {
    Mercury: 'Mercury governs concrete mind, speech, writing and how you process information. It is the chart\'s messenger - translating the sky into words life can understand.',
    Venus: 'Venus describes what you love, value and how you attract and are attracted. It is the gravity of pleasure, beauty and emotional bond in your chart.',
    Mars: 'Mars is the inner warrior - desire, courage, anger and drive to act. It shows where you fight, conquer and must channel fire without burning out.',
    Jupiter: 'Jupiter expands - faith, meaning, opportunity and growth. It shows where life invites you to trust, dare and see further than fear allows.',
    Saturn: 'Saturn is the strict and loving teacher - limits, time, responsibility and maturity. It marks where you build a throne through effort or where fear paralyses you until you learn.',
  },
  es: {
    Mercurio: 'Mercurio gobierna la mente concreta, el habla, la escritura y cómo procesas información. Es el mensajero de la carta: traduce el cielo en palabras que la vida comprende.',
    Venus: 'Venus describe lo que amas, valoras y cómo atraes y eres atraído/a. Es la gravedad del placer, la belleza y el vínculo afectivo en tu carta.',
    Marte: 'Marte es el guerrero interior: deseo, coraje, ira e impulso de actuar. Muestra dónde luchas, conquistas y debes canalizar el fuego sin quemarte.',
    Júpiter: 'Júpiter expande: fe, sentido, oportunidad y crecimiento. Indica dónde la vida te invita a confiar, arriesgar y ver más allá del miedo.',
    Saturno: 'Saturno es el maestro severo y amoroso: límites, tiempo, responsabilidad y madurez. Marca dónde construyes trono con esfuerzo o dónde el miedo te paraliza hasta aprender.',
  },
  it: {
    Mercurio: 'Mercurio governa la mente concreta, il parlare, la scrittura e come elabori informazioni. È il messaggero della carta: traduce il cielo in parole che la vita comprende.',
    Venere: 'Venere descrive ciò che ami, valorizzi e come attrai e sei attratto/a. È la gravità del piacere, della bellezza e del legame affettivo nella tua carta.',
    Marte: 'Marte è il guerriero interiore: desiderio, coraggio, rabbia e impulso ad agire. Mostra dove combatti, conquisti e devi canalizzare il fuoco senza bruciarti.',
    Giove: 'Giove espande: fede, senso, opportunità e crescita. Indica dove la vita ti invita a fidarti, osare e vedere oltre la paura.',
    Saturno: 'Saturno è il maestro severo e amorevole: limiti, tempo, responsabilità e maturità. Segna dove costruisci trono con sforzo o dove la paura ti paralizza finché impari.',
  },
  de: {
    Merkur: 'Merkur regiert den konkreten Geist, Sprache, Schreiben und wie du Information verarbeitest. Er ist der Bote des Horoskops – übersetzt den Himmel in Worte, die das Leben versteht.',
    Venus: 'Venus beschreibt, was du liebst, schätzt und wie du anziehst und angezogen wirst. Sie ist die Schwerkraft von Freude, Schönheit und emotionaler Bindung in deinem Horoskop.',
    Mars: 'Mars ist der innere Krieger – Wunsch, Mut, Wut und Handlungsdrang. Er zeigt, wo du kämpfst, siegst und Feuer kanalisieren musst, ohne auszubrennen.',
    Jupiter: 'Jupiter expandiert – Glaube, Sinn, Chance und Wachstum. Er zeigt, wo das Leben dich einlädt zu vertrauen, zu wagen und weiter zu sehen als die Angst erlaubt.',
    Saturn: 'Saturn ist der strenge und liebende Lehrer – Grenzen, Zeit, Verantwortung und Reife. Er markiert, wo du durch Mühe einen Thron baust oder wo Angst dich lähmt, bis du lernst.',
  },
  fr: {
    Mercure: 'Mercure gouverne l\'esprit concret, la parole, l\'écriture et comment tu traites l\'information. C\'est le messager de la carte – il traduit le ciel en mots que la vie comprend.',
    Vénus: 'Vénus décrit ce que tu aimes, valorises et comment tu attires et es attiré(e). C\'est la gravité du plaisir, de la beauté et du lien affectif dans ta carte.',
    Mars: 'Mars est le guerrier intérieur – désir, courage, colère et élan d\'agir. Il montre où tu combats, conquiers et dois canaliser le feu sans te brûler.',
    Jupiter: 'Jupiter expande – foi, sens, opportunité et croissance. Il indique où la vie t\'invite à faire confiance, oser et voir plus loin que la peur.',
    Saturne: 'Saturne est le maître strict et aimant – limites, temps, responsabilité et maturité. Il marque où tu construis un trône par l\'effort ou où la peur te paralyse jusqu\'à apprendre.',
  },
}

function introPlaneta(nome, lang) {
  const trNome = tp(nome, lang)
  const map = contentForLang(lang, ESSENCIA_PLANETA) || ESSENCIA_PLANETA.en
  return map[trNome] || map[nome] || contentForLang(lang, {
    pt: `${nome} colore uma dimensão vital do teu mapa.`,
    en: `${trNome} colours a vital dimension of your chart.`,
    es: `${trNome} colorea una dimensión vital de tu carta.`,
    it: `${trNome} colora una dimensione vitale della tua carta.`,
    de: `${trNome} färbt eine vitale Dimension deines Horoskops.`,
    fr: `${trNome} colore une dimension vitale de ta carte.`,
  })
}

export function interpretarPlanetaEssencia(nomePlaneta, p, mapaNatal, aspetos, planetas, lang = 'pt') {
  return comporInterpretacaoPlaneta(nomePlaneta, p, aspetos, planetas, lang)
}
