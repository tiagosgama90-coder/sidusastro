/**
 * Secção 1 - A Tua Essência Central (Sol, Lua, Ascendente, Big 3).
 * Interpretação profunda e única por posição calculada.
 */
import { planetaPorNome, getTemaCasa } from './casasPlacidus.js'
import { translateSigno, translatePlaneta, translateAspecto } from './i18n/astro.js'

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
  const e = ELEMENTO[normalizarSigno(signo)]
  return lang === 'en' ? (ELEMENTO_EN[e] || e) : e
}

function modSigno(signo, lang) {
  const m = MODALIDADE[normalizarSigno(signo)]
  if (lang === 'en') {
    const map = { Cardinal: 'cardinal', Fixo: 'fixed', Mutável: 'mutable' }
    return map[m] || m
  }
  return m
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
  if (lang === 'en') {
    return `${prefixo}House ${casa} (${t.nome}) directs this energy toward ${t.foco}. Honouring this life sphere restores vitality; neglecting it drains the soul quietly.`
  }
  return `${prefixo}A ${casa}ª Casa (${t.nome}) orienta esta energia para ${t.foco}. Honrar esta esfera da vida devolve vitalidade; negligenciá-la esgota a alma em silêncio.`
}

function blocoGraus(graus, signo, lang) {
  const g = parseFloat(graus) || 0
  const s = sn(signo, lang)
  const elem = elemSigno(signo, lang)
  if (lang === 'en') {
    if (g < 10) return ` At ${g.toFixed(1)}° (${s}, early decan), the ${elem} impulse is raw, instinctive and pioneering.`
    if (g < 20) return ` At ${g.toFixed(1)}° (${s}, mid-decan), the ${elem} theme is fully embodied and tested in daily life.`
    return ` At ${g.toFixed(1)}° (${s}, late decan), the ${elem} lesson matures toward wisdom and conscious release.`
  }
  if (g < 10) return ` A ${g.toFixed(1)}° (${s}, decanato inicial), o impulso de ${elem} é cru, instintivo e pioneiro.`
  if (g < 20) return ` A ${g.toFixed(1)}° (${s}, decanato central), o tema de ${elem} está plenamente corporizado e testado no quotidiano.`
  return ` A ${g.toFixed(1)}° (${s}, decanato final), a lição de ${elem} amadurece para sabedoria e desapego consciente.`
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
    if (lang === 'en') {
      return `${asp} ${outroTr} in ${signoOut}${casaOut ? ` (H${casaOut})` : ''} orb ${a.orbe}`
    }
    return `${asp} ${outro} em ${signoOut}${casaOut ? ` (C${casaOut})` : ''} orbe ${a.orbe}`
  })
  if (lang === 'en') return ` Chart aspects colouring this placement: ${partes.join('; ')}.`
  return ` Aspectos do mapa que colorem esta posição: ${partes.join('; ')}.`
}

function faseLunar(lonSol, lonLua, lang) {
  if (lonSol == null || lonLua == null) return ''
  const diff = ((Number(lonLua) - Number(lonSol)) % 360 + 360) % 360
  let fasePt, faseEn, textoPt, textoEn
  if (diff < 45) {
    fasePt = 'Lua Nova'; faseEn = 'New Moon'
    textoPt = 'Sol e Lua na mesma fase - identidade e emoção nascem juntas; cada ciclo pessoal começa com intensidade interior antes de se mostrar ao mundo.'
    textoEn = 'Sun and Moon in the same phase - identity and emotion are born together; each personal cycle begins with inner intensity before showing the world.'
  } else if (diff < 90) {
    fasePt = 'Lua Crescente'; faseEn = 'Waxing Crescent'
    textoPt = 'Fase crescente - constróis emoção e identidade em simultâneo; há entusiasmo para crescer, mas ainda precisas de proteger o broto até ganhar raízes.'
    textoEn = 'Waxing phase - you build emotion and identity together; enthusiasm to grow, yet the sprout still needs protection until rooted.'
  } else if (diff < 135) {
    fasePt = 'Quarto Crescente'; faseEn = 'First Quarter'
    textoPt = 'Quarto crescente - tensão criativa entre vontade consciente e necessidades emocionais; os obstáculos que surgem são treino de carácter.'
    textoEn = 'First quarter - creative tension between conscious will and emotional needs; obstacles that arise are character training.'
  } else if (diff < 180) {
    fasePt = 'Lua Gibosa Crescente'; faseEn = 'Waxing Gibbous'
    textoPt = 'Gibosa crescente - refinamento antes da plenitude; aperfeiçoas o que nasceu, ajustando ego e coração antes da revelação pública.'
    textoEn = 'Waxing gibbous - refinement before fullness; you polish what was born, adjusting ego and heart before public revelation.'
  } else if (diff < 225) {
    fasePt = 'Lua Cheia'; faseEn = 'Full Moon'
    textoPt = 'Lua Cheia natal - Sol e Lua em polaridade máxima; vives com consciência ampliada das tuas dualidades internas. Relacionamentos e espelhos externos são centrais na tua biografia emocional.'
    textoEn = 'Natal Full Moon - Sun and Moon at maximum polarity; you live with heightened awareness of inner dualities. Relationships and external mirrors are central to your emotional biography.'
  } else if (diff < 270) {
    fasePt = 'Lua Gibosa Minguante'; faseEn = 'Waning Gibbous'
    textoPt = 'Gibosa minguante - partilhas sabedoria emocional; ensinas o que aprendeste sentindo, mesmo quando o mundo ainda não pediu.'
    textoEn = 'Waning gibbous - you share emotional wisdom; teaching what feeling taught you, even when the world has not yet asked.'
  } else if (diff < 315) {
    fasePt = 'Quarto Minguante'; faseEn = 'Last Quarter'
    textoPt = 'Quarto minguante - libertas padrões emocionais obsoletos; crises periódicas limpam identidade para renascer mais leve.'
    textoEn = 'Last quarter - you release obsolete emotional patterns; periodic crises cleanse identity to reborn lighter.'
  } else {
    fasePt = 'Lua Minguante'; faseEn = 'Waning Crescent'
    textoPt = 'Lua minguante - alma introspectiva que processa em silêncio; retiros emocionais não são fuga - são manutenção da tua psique.'
    textoEn = 'Waning crescent - introspective soul processing in silence; emotional retreats are not escape - they maintain your psyche.'
  }
  return lang === 'en'
    ? ` Natal lunar phase: ${faseEn} (${diff.toFixed(0)}° Sun–Moon). ${textoEn}`
    : ` Fase lunar natal: ${fasePt} (${diff.toFixed(0)}° Sol–Lua). ${textoPt}`
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

function textoEssencia(mapaPt, mapaEn, signo, lang) {
  const chave = normalizarSigno(signo)
  if (lang === 'en') {
    return mapaEn[sn(chave, 'en')] || ''
  }
  return mapaPt[chave] || ''
}

function blocoRegenteAsc(asc, planetas, lang) {
  const chave = normalizarSigno(asc)
  const reg = REGENTE_ASC[chave]
  if (!reg) return ''
  const p = planetaPorNome(planetas, reg)
  const regLabel = tp(reg, lang)
  if (!p) {
    return lang === 'en'
      ? ` Chart ruler: ${regLabel} (classic ruler of ${sn(asc, lang)}). Study this planet in your full chart for life direction.`
      : ` Regente do mapa: ${reg} (regente clássico de ${sn(asc, lang)}). Estuda este planeta no mapa completo para orientação de vida.`
  }
  if (lang === 'en') {
    return ` Chart ruler ${regLabel} in ${sn(p.signo?.nome, lang)}${p.casa ? `, House ${p.casa}` : ''} (${(p.signo?.graus || '0')}°) steers your life path - where ${regLabel} goes, your Ascendant story unfolds.`
  }
  return ` Regente do mapa ${reg} em ${sn(p.signo?.nome, lang)}${p.casa ? `, Casa ${p.casa}` : ''} (${(p.signo?.graus || '0')}°) orienta o teu caminho de vida - onde ${reg} vai, a história do Ascendente desenrola-se.`
}

export function interpretarSolEssencia(pSol, mapaNatal, aspetos, planetas, lang = 'pt') {
  if (!pSol) return ''
  const signo = pSol.signo?.nome
  let t = textoEssencia(SOL_PT, SOL_EN, signo, lang)
  t += blocoGraus(pSol.signo?.graus, signo, lang)
  t += blocoCasa(pSol.casa, lang, lang === 'en' ? ' ' : ' ')
  t += blocoAspectos('Sol', aspetos, planetas, lang)
  const elem = elemSigno(signo, lang)
  const mod = modSigno(signo, lang)
  if (lang === 'en') {
    t += ` Element ${elem}, ${mod} modality - your solar will expresses through ${mod} ${elem.toLowerCase()} rhythm.`
  } else {
    t += ` Elemento ${elem}, modalidade ${mod} - a tua vontade solar expressa-se no ritmo ${mod.toLowerCase()} de ${elem}.`
  }
  return t
}

export function interpretarLuaEssencia(pLua, mapaNatal, aspetos, planetas, lang = 'pt') {
  if (!pLua) return ''
  const signo = pLua.signo?.nome
  let t = textoEssencia(LUA_PT, LUA_EN, signo, lang)
  t += blocoGraus(pLua.signo?.graus, signo, lang)
  t += blocoCasa(pLua.casa, lang, lang === 'en' ? ' ' : ' ')
  t += blocoAspectos('Lua', aspetos, planetas, lang)
  const pSol = planetaPorNome(planetas, 'Sol')
  t += faseLunar(pSol?.longitude, pLua.longitude, lang)
  return t
}

export function interpretarAscEssencia(asc, mapaNatal, aspetos, planetas, lang = 'pt') {
  if (!asc) return ''
  let t = textoEssencia(ASC_PT, ASC_EN, asc, lang)
  const pAsc = mapaNatal?.ascendente
  t += blocoGraus(pAsc?.graus, asc, lang)
  t += blocoRegenteAsc(asc, planetas, lang)
  const mc = mapaNatal?.mc?.nome
  if (mc) {
    t += lang === 'en'
      ? ` Ascendant–MC axis: public path (MC in ${sn(mc, lang)}) filters how your ${sn(asc, lang)} mask serves vocation.`
      : ` Eixo Ascendente–MC: o caminho público (MC em ${sn(mc, lang)}) filtra como a máscara ${sn(asc, lang)} serve a vocação.`
  }
  return t
}

export function interpretarBig3Essencia(mapaNatal, planetas, aspetos, lang = 'pt') {
  const sol = mapaNatal?.solar?.nome
  const lua = mapaNatal?.lunar?.nome
  const asc = mapaNatal?.ascendente?.nome
  if (!sol || !lua || !asc) {
    return lang === 'en'
      ? 'The Sun–Moon–Ascendant triangle is the master key of your chart. When all three are known, astrological maturity begins with honouring each pole without silencing the others.'
      : 'O triângulo Sol–Lua–Ascendente é a chave-mestra do teu mapa. Quando os três são conhecidos, a maturidade astrológica começa por honrar cada polo sem silenciar os outros.'
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

  const partes = []
  if (lang === 'en') {
    partes.push(`Your psychic signature: Sun in ${ss} (${eSolL}/${mSolL}), Moon in ${sl} (${eLuaL}/${mLuaL}), Ascendant in ${sa} (${eAscL}/${modSigno(asc, lang)}). This combination is statistically rare in its exact form - no generic horoscope captures it.`)
  } else {
    partes.push(`A tua assinatura psíquica: Sol em ${ss} (${eSol}/${mSol}), Lua em ${sl} (${eLua}/${mLua}), Ascendente em ${sa} (${eAsc}). Esta combinação é estatisticamente rara na sua forma exacta - nenhum horóscopo genérico a captura.`)
  }

  if (eSol === eLua && eLua === eAsc) {
    partes.push(lang === 'en'
      ? `Triple ${eSolL} emphasis: identity, emotion and persona speak one elemental language - powerful coherence, but watch for blind spots in other elements.`
      : `Ênfase tripla em ${eSol}: identidade, emoção e persona falam uma linguagem elemental - coerência poderosa, mas cuidado com pontos cegos nos outros elementos.`)
  } else if (eSol !== eLua) {
    const tensao = (eSol === 'Fogo' && eLua === 'Água') || (eSol === 'Água' && eLua === 'Fogo')
      ? (lang === 'en' ? 'fire vs water - action vs feeling' : 'fogo vs água - acção vs sentimento')
      : (eSol === 'Ar' && eLua === 'Terra') || (eSol === 'Terra' && eLua === 'Ar')
        ? (lang === 'en' ? 'air vs earth - ideas vs practicality' : 'ar vs terra - ideias vs concretude')
        : (lang === 'en' ? 'different elemental rhythms' : 'ritmos elementais distintos')
    partes.push(lang === 'en'
      ? `Sun–Moon tension (${tensao}): inner dialogue between who you want to be and what you need to feel safe. Integration is your life masterpiece.`
      : `Tensão Sol–Lua (${tensao}): diálogo interno entre quem queres ser e o que precisas para te sentires seguro/a. A integração é a tua obra-prima de vida.`)
  } else {
    partes.push(lang === 'en'
      ? `Sun and Moon share element (${eSolL}): emotional and conscious selves align - authenticity flows more easily.`
      : `Sol e Lua partilham elemento (${eSol}): eu consciente e emocional alinham-se - a autenticidade flui com mais facilidade.`)
  }

  if (eAsc !== eSol) {
    partes.push(lang === 'en'
      ? `Ascendant (${eAscL}) filters how the world reads your Sun (${eSolL}): you are often perceived differently from your inner core - use this as strategic depth, not contradiction.`
      : `Ascendente (${eAsc}) filtra como o mundo lê o teu Sol (${eSol}): és frequentemente percebido/a de forma diferente do núcleo íntimo - usa isto como profundidade estratégica, não contradição.`)
  }

  const solLuaAsp = (aspetos || []).find((a) => {
    const pa = nomeAspeto(a.planetaA)
    const pb = nomeAspeto(a.planetaB)
    return (pa === 'Sol' && pb === 'Lua') || (pa === 'Lua' && pb === 'Sol')
  })
  if (solLuaAsp) {
    const aspLabel = translateAspecto(solLuaAsp.aspecto, lang).toLowerCase()
    partes.push(lang === 'en'
      ? `Direct Sun–Moon aspect (${aspLabel}, orb ${solLuaAsp.orbe}): your identity and emotional body are wired together - what you feel shapes who you are immediately.`
      : `Aspecto directo Sol–Lua (${solLuaAsp.aspecto}, orbe ${solLuaAsp.orbe}): identidade e corpo emocional estão ligados - o que sentes molda quem és imediatamente.`)
  }

  if (mSol !== mLua) {
    partes.push(lang === 'en'
      ? `Modal rhythm: Sun ${mSolL}, Moon ${mLuaL} - learn when to initiate, sustain or adapt; your inner calendar has two tempos.`
      : `Ritmo modal: Sol ${mSol}, Lua ${mLua} - aprende quando iniciar, sustentar ou adaptar; o teu calendário interior tem dois tempos.`)
  }

  const reg = REGENTE_ASC[normalizarSigno(asc)]
  const pReg = planetaPorNome(planetas, reg)
  if (pReg) {
    partes.push(lang === 'en'
      ? `Life steering planet: ${tp(reg, lang)} in ${sn(pReg.signo?.nome, lang)} (House ${pReg.casa || '-'}) - follow this planet's themes to unlock your chart's full narrative.`
      : `Planeta-guia da vida: ${reg} em ${sn(pReg.signo?.nome, lang)} (Casa ${pReg.casa || '-'}) - segue os temas deste planeta para desbloquear a narrativa completa do mapa.`)
  }

  return partes.join(' ')
}
