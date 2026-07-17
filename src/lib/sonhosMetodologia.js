/**
 * Base metodológica interna para interpretação de sonhos.
 * Psicologia espiritual integrativa: sonho como linguagem da alma,
 * símbolos bíblico-psicológicos, sombra, criança interior, conversão e cura.
 * Nunca expor nomes de autores ao utilizador.
 */

export const PRINCIPIOS_PT = `
PRINCÍPIOS FUNDAMENTAIS (obrigatórios em cada interpretação):
1. O sonho é linguagem da alma - liga consciente e inconsciente; não é adivinhação nem previsão.
2. O sonho processa o dia e o cansaço da alma; diagnostica o estado espiritual actual, não o futuro.
3. O sentimento dominante no sonho é a chave hermenêutica - o mesmo símbolo muda com paz, medo, vergonha ou alegria.
4. Pesadelos são alertas misericordiosos: o inconsciente mostra o que evitamos para podermos curar, não para castigar.
5. Toda imagem convida à integração da sombra - o que rejeitamos no sonho é parte nossa a acolher com compaixão.
6. A criança no sonho aponta feridas de infância, vulnerabilidade sagrada ou potencial novo a proteger.
7. Figuras parentais espelham relação com autoridade, imagem do sagrado e maturidade interior - não previsões sobre os pais.
8. Morte, enterro, incêndio de casa = morte simbólica de actitudes, hábitos ou ilusões - nunca anunciar falecimento.
9. Sexualidade e nudez no sonho = energia vital, desejo de intimidade ou vergonha de ser visto - raramente literal.
10. Igreja, templo, cruz, oração = relação com o sagrado e com o que carregamos como fardo redentor.
11. A cura passa por conversão de actitude: honestidade, perdão, pequeno gesto concreto, silêncio e escrita - não superstição.
12. Pergunta final sempre aberta, pastoral, que convida à meditação interior - nunca resposta fechada.
`.trim()

export const PRINCIPIOS_EN = `
CORE PRINCIPLES (mandatory in every interpretation):
1. Dreams are the language of the soul - they link conscious and unconscious; never fortune-telling or prediction.
2. Dreams process daily life and soul fatigue; they diagnose present spiritual state, not the future.
3. The dominant feeling is the hermeneutic key - the same symbol shifts with peace, fear, shame or joy.
4. Nightmares are merciful alerts: the unconscious shows what we avoid so we may heal, not to punish.
5. Every image invites shadow integration - what we reject in the dream is part of us to welcome with compassion.
6. The child in dreams points to childhood wounds, sacred vulnerability or new potential to protect.
7. Parental figures mirror relationship with authority, the sacred image and inner maturity - not predictions about parents.
8. Death, burial, burning house = symbolic death of attitudes, habits or illusions - never announce physical death.
9. Sexuality and nudity in dreams = vital energy, longing for intimacy or shame of being seen - rarely literal.
10. Church, temple, cross, prayer = relationship with the sacred and burdens carried as redemptive weight.
11. Healing comes through attitude conversion: honesty, forgiveness, one concrete small gesture, silence and writing - not superstition.
12. Final question always open, pastoral, inviting inner meditation - never a closed answer.
`.trim()

export const PASSOS_PT = `
CAMINHO HERMENÊUTICO (segue esta ordem mental ao interpretar):
A) Acolhe o relato sem julgar - cada imagem, pessoa, lugar e acção tem dignidade simbólica.
B) Identifica o sentimento dominante e como cada símbolo o amplifica ou contrasta.
C) Liga o sonho à vida acordada: que conflito, cansaço, relação ou decisão actual o sonho espelha?
D) Extrai o apelo de conversão: que actitude velha pede para morrer? que gesto de cura é possível amanhã?
E) Formula uma pergunta de meditação que devolva responsabilidade à alma do sonhador - sem moralismo.
`.trim()

export const PASSOS_EN = `
HERMENEUTIC PATH (follow this mental order when interpreting):
A) Welcome the report without judging - every image, person, place and action has symbolic dignity.
B) Identify the dominant feeling and how each symbol amplifies or contrasts it.
C) Link the dream to waking life: which conflict, fatigue, relationship or current decision does it mirror?
D) Extract the call to conversion: which old attitude asks to die? which healing gesture is possible tomorrow?
E) Formulate one meditation question that returns responsibility to the dreamer's soul - without moralism.
`.trim()

/** Símbolos com leitura em paz vs medo - núcleo da matriz hermenêutica. */
export const MATRIZ_SIMBOLOS = [
  { chave: 'água/mar/rio/chuva', paz: 'purificação, baptismo interior, fluir emocional acolhido pelo Espírito', medo: 'emoções ou exigências externas a sufocar a fé e o descanso da alma' },
  { chave: 'tempestade/inundação', paz: 'lavagem necessária antes de novo ciclo', medo: 'caos psíquico, sobrecarga, sensação de afogamento em responsabilidades' },
  { chave: 'animais/feras', paz: 'instintos e paixões criadas pelo Criador a integrar com amor', medo: 'impulsos reprimidos (raiva, sexualidade, cansaço) que pedem reconhecimento, não negação' },
  { chave: 'cão', paz: 'lealdade, protecção, companheirismo fiel', medo: 'instinto agressivo ou dependência mal integrada' },
  { chave: 'gato', paz: 'independência, intuição feminina, mistério acolhido', medo: 'isolamento defensivo ou sensualidade temida' },
  { chave: 'cavalo', paz: 'energia vital, força para a missão', medo: 'paixão descontrolada ou poder que assusta' },
  { chave: 'serpente', paz: 'sabedoria curativa das profundezas, renovação', medo: 'medo do instinto, traição interior ou tentação não integrada' },
  { chave: 'pássaro/voar', paz: 'espírito livre, mensagem do alto, elevação sã', medo: 'fuga da realidade, idealismo que evita deveres terrenos' },
  { chave: 'queda/vertigem', paz: 'humildade salutar, descida necessária ao chão', medo: 'medo de perder controlo, orgulho ou perfeccionismo ferido' },
  { chave: 'escada/ascensão', paz: 'crescimento espiritual disciplinado', medo: 'esforço espiritual que vira fardo de meritocracia' },
  { chave: 'casa/lar/cômodos', paz: 'estrutura da alma em ordem; cada divisão = área da vida', medo: 'caos interior; porta trancada = segredo; cave = sombra; sótão = ideal inatingível' },
  { chave: 'morte/enterro/caixão', paz: 'deixar morrer o velho eu, luto necessário, transição', medo: 'resistência à mudança; medo projectado - reafirmar: não é morte física' },
  { chave: 'deserto/noite/escuridão', paz: 'noite escura fecunda, silêncio antes do renascimento', medo: 'solidão espiritual, sensação de abandono a acolher com paciência' },
  { chave: 'jardim/parque/flores', paz: 'alma a florescer, paraíso interior, descanso no Criador', medo: 'jardim murado ou seco = desejo de paz bloqueado por culpa' },
  { chave: 'montanha', paz: 'encontro com o transcendente, meta espiritual', medo: 'fardo pesado, meta inatingível que esgota' },
  { chave: 'ponte/estrada/viagem', paz: 'travessia de fase, passagem consciente', medo: 'estrada bloqueada = medo de mudança; ponte partida = transição não assumida' },
  { chave: 'perseguição/fuga', paz: 'raro - pode ser chamado a correr para um dever evitado', medo: 'sombra perseguidora: parte rejeitada do eu que quer integração' },
  { chave: 'bebé/criança', paz: 'potencial novo, pureza, renascimento interior', medo: 'criança ferida, abandono, necessidade de cuidado parental interior' },
  { chave: 'pais/avós/família', paz: 'raízes, bênção, sabedoria herdada', medo: 'feridas de autoridade, culpa, padrões familiares a perdoar' },
  { chave: 'casamento/festa', paz: 'união de opostos interiores, celebração da alma', medo: 'compromisso forçado ou papel social que sufoca o verdadeiro eu' },
  { chave: 'igreja/templo/oração', paz: 'sede do sagrado, encontro com o silêncio de Deus', medo: 'culpa religiosa, rigidez, imagem de Deus punitiva a curar' },
  { chave: 'cruz', paz: 'caminho de transformação, carga redentora assumida com amor', medo: 'sofrimento sem sentido, martírio ou auto-punição' },
  { chave: 'fogo', paz: 'purificação, entusiasmo do Espírito', medo: 'paixão destrutiva, raiva, burnout' },
  { chave: 'comida/fome/banquete', paz: 'nutrição espiritual, Eucaristia simbólica da alma', medo: 'carência afectiva, vazio que se tenta encher sem Deus interior' },
  { chave: 'dinheiro/ouro', paz: 'valor interior reconhecido', medo: 'medo de escassez, autoestima ligada ao ter' },
  { chave: 'dentes/perder dentes', paz: 'renovação, mudança de fase', medo: 'ansiedade de imagem, perda de poder de expressão' },
  { chave: 'nudez', paz: 'autenticidade, vulnerabilidade aceite', medo: 'vergonha de ser visto, medo de exposição' },
  { chave: 'estranho/desconhecido', paz: 'faceta nova da personalidade a conhecer', medo: 'ameaça projectada do que não aceitamos em nós' },
  { chave: 'prisão/muro/cerca', paz: 'limite protector temporário', medo: 'autolimitação, culpa, padrão que aprisiona' },
  { chave: 'chave/porta', paz: 'acesso a nova consciência, convite a entrar', medo: 'porta trancada = medo de mudança; chave perdida = recurso interior esquecido' },
  { chave: 'espelho', paz: 'auto-reconhecimento honesto', medo: 'imagem distorcida, auto-rejeição' },
  { chave: 'hospital/médico', paz: 'processo de cura acompanhado, cuidado da psique', medo: 'doença simbólica não aceite, medo da vulnerabilidade' },
  { chave: 'escola/exame', paz: 'aprendizagem de lição de vida', medo: 'auto-julgamento severo, medo de falhar perante os outros' },
  { chave: 'guerra/batalha', paz: 'coragem para defender valores', medo: 'conflito interior não resolvido entre partes da personalidade' },
  { chave: 'avião/aeroporto', paz: 'transição elevada de fase de vida', medo: 'ateragem forçada = retorno às responsabilidades evitadas' },
  { chave: 'carro/conduzir', paz: 'autonomia e direcção da vida', medo: 'perder o volante = impotência, vida conduzida por outros' },
]

export const CAMINHOS_CURA_PT = `
CAMINHOS DE CURA (escolhe 1–2 concretos na secção 3):
- Dez minutos de silêncio com a imagem central do sonho; deixa que ela fale sem forçar significado.
- Escrita livre: "O que neste sonho me pede perdão?" - contigo ou com alguém evocado.
- Gestão de sombra: nomeia em voz baixa o que temeste no sonho e pergunta "Que parte minha és?"
- Criança interior: coloca a mão no peito e diz à criança do sonho que ela é bem-vinda.
- Pequeno gesto de reconciliação amanhã - uma mensagem, um pedido de desculpa, um limite saudável.
- Repete uma frase bíblica de misericórdia (sem citar fonte): "Não temas, estou contigo."
- Evita números da sorte, datas proféticas ou previsões - a cura é actitude, não superstição.
`.trim()

export const CAMINHOS_CURA_EN = `
HEALING PATHS (choose 1–2 concrete ones in section 3):
- Ten minutes of silence with the dream's central image; let it speak without forcing meaning.
- Free writing: "What in this dream asks for forgiveness?" - toward yourself or someone evoked.
- Shadow work: quietly name what you feared in the dream and ask "Which part of me are you?"
- Inner child: hand on heart and tell the dream child they are welcome.
- One small reconciling gesture tomorrow - a message, an apology, a healthy boundary.
- Repeat a phrase of mercy (without citing source): "Do not fear, I am with you."
- Avoid lucky numbers, prophetic dates or predictions - healing is attitude, not superstition.
`.trim()

/** Bloco compacto para injetar no system prompt (PT). */
export function blocoMetodologiaPrompt(lang = 'pt') {
  const isPt = lang === 'pt'
  const principios = isPt ? PRINCIPIOS_PT : PRINCIPIOS_EN
  const passos = isPt ? PASSOS_PT : PASSOS_EN
  const cura = isPt ? CAMINHOS_CURA_PT : CAMINHOS_CURA_EN
  const matriz = MATRIZ_SIMBOLOS.map((s) =>
    isPt
      ? `• ${s.chave}: com paz/aceitação → ${s.paz}; com medo/tensão → ${s.medo}`
      : `• ${s.chave}: with peace/acceptance → ${s.paz}; with fear/tension → ${s.medo}`,
  ).join('\n')

  return `${principios}\n\n${passos}\n\nMATRIZ DE SÍMBOLOS (aplica conforme sentimento do sonho):\n${matriz}\n\n${cura}`
}

/** Interpretação local enriquecida por símbolo detectado. */
export function expandirSimboloMetodologia(tema, resumo, medo) {
  const t = (tema + ' ' + resumo).toLowerCase()
  for (const s of MATRIZ_SIMBOLOS) {
    const keys = s.chave.split('/')
    if (keys.some((k) => t.includes(k.trim()))) {
      return medo ? s.medo : s.paz
    }
  }
  return medo
    ? 'convite a olhar a sombra com misericórdia - o que evitas na vida acordada regressa para integração'
    : 'mensagem de alinhamento e processamento saudável da experiência recente'
}
