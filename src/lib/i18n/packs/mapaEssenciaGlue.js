/** Strings de colagem para mapaEssencia - 6 idiomas. */
import { contentForLang } from '../langUtil.js'

export function glueBlocoCasa(lang, casa, t, prefixo = '') {
  return contentForLang(lang, {
    pt: `${prefixo}A ${casa}ª Casa (${t.nome}) orienta esta energia para ${t.foco}. Honrar esta esfera da vida devolve vitalidade; negligenciá-la esgota a alma em silêncio.`,
    en: `${prefixo}House ${casa} (${t.nome}) directs this energy toward ${t.foco}. Honouring this life sphere restores vitality; neglecting it drains the soul quietly.`,
    es: `${prefixo}La Casa ${casa} (${t.nome}) orienta esta energía hacia ${t.foco}. Honrar esta esfera devuelve vitalidad; descuidarla agota el alma en silencio.`,
    it: `${prefixo}La Casa ${casa} (${t.nome}) orienta questa energia verso ${t.foco}. Onorare questa sfera restituisce vitalità; trascurarla prosciuga l'anima in silenzio.`,
    de: `${prefixo}Haus ${casa} (${t.nome}) lenkt diese Energie auf ${t.foco}. Diese Lebenssphäre zu ehren gibt Vitalität zurück; sie zu vernachlässigen erschöpft die Seele still.`,
    fr: `${prefixo}La Maison ${casa} (${t.nome}) oriente cette énergie vers ${t.foco}. Honorer cette sphère rend la vitalité ; la négliger épuise l'âme en silence.`,
  })
}

export function glueBlocoGraus(lang, g, s, elem) {
  const dec = g < 10 ? 'early' : g < 20 ? 'mid' : 'late'
  const bundles = {
    early: {
      pt: ` A ${g.toFixed(1)}° (${s}, decanato inicial), o impulso de ${elem} é cru, instintivo e pioneiro.`,
      en: ` At ${g.toFixed(1)}° (${s}, early decan), the ${elem} impulse is raw, instinctive and pioneering.`,
      es: ` A ${g.toFixed(1)}° (${s}, decanato inicial), el impulso de ${elem} es crudo, instintivo y pionero.`,
      it: ` A ${g.toFixed(1)}° (${s}, decanato iniziale), l'impulso di ${elem} è grezzo, istintivo e pionieristico.`,
      de: ` Bei ${g.toFixed(1)}° (${s}, frühes Dekan), ist der ${elem}-Impuls roh, instinktiv und pionierhaft.`,
      fr: ` À ${g.toFixed(1)}° (${s}, décan initial), l'élan ${elem} est brut, instinctif et pionnier.`,
    },
    mid: {
      pt: ` A ${g.toFixed(1)}° (${s}, decanato central), o tema de ${elem} está plenamente corporizado e testado no quotidiano.`,
      en: ` At ${g.toFixed(1)}° (${s}, mid-decan), the ${elem} theme is fully embodied and tested in daily life.`,
      es: ` A ${g.toFixed(1)}° (${s}, decanato central), el tema de ${elem} está plenamente encarnado y probado en lo cotidiano.`,
      it: ` A ${g.toFixed(1)}° (${s}, decanato centrale), il tema di ${elem} è pienamente incarnato e testato nel quotidiano.`,
      de: ` Bei ${g.toFixed(1)}° (${s}, mittleres Dekan), ist das ${elem}-Thema voll verkörpert und im Alltag geprüft.`,
      fr: ` À ${g.toFixed(1)}° (${s}, décan central), le thème ${elem} est pleinement incarné et éprouvé au quotidien.`,
    },
    late: {
      pt: ` A ${g.toFixed(1)}° (${s}, decanato final), a lição de ${elem} amadurece para sabedoria e desapego consciente.`,
      en: ` At ${g.toFixed(1)}° (${s}, late decan), the ${elem} lesson matures toward wisdom and conscious release.`,
      es: ` A ${g.toFixed(1)}° (${s}, decanato final), la lección de ${elem} madura hacia sabiduría y desapego consciente.`,
      it: ` A ${g.toFixed(1)}° (${s}, decanato finale), la lezione di ${elem} matura verso saggezza e distacco consapevole.`,
      de: ` Bei ${g.toFixed(1)}° (${s}, spätes Dekan), reift die ${elem}-Lektion zu Weisheit und bewusster Loslösung.`,
      fr: ` À ${g.toFixed(1)}° (${s}, décan final), la leçon ${elem} mûrit vers sagesse et lâcher-prise conscient.`,
    },
  }
  return contentForLang(lang, bundles[dec])
}

export function glueBlocoAspectos(lang, partes) {
  return contentForLang(lang, {
    pt: ` Aspectos do mapa que colorem esta posição: ${partes.join('; ')}.`,
    en: ` Chart aspects colouring this placement: ${partes.join('; ')}.`,
    es: ` Aspectos de la carta que colorean esta posición: ${partes.join('; ')}.`,
    it: ` Aspetti della carta che colorano questa posizione: ${partes.join('; ')}.`,
    de: ` Horoskop-Aspekte, die diese Position färben: ${partes.join('; ')}.`,
    fr: ` Aspects de la carte qui colorent cette position : ${partes.join('; ')}.`,
  })
}

const FASES = [
  { max: 45, label: { pt: 'Lua Nova', en: 'New Moon', es: 'Luna Nueva', it: 'Luna Nuova', de: 'Neumond', fr: 'Nouvelle Lune' },
    text: { pt: 'Sol e Lua na mesma fase - identidade e emoção nascem juntas; cada ciclo pessoal começa com intensidade interior antes de se mostrar ao mundo.',
      en: 'Sun and Moon in the same phase - identity and emotion are born together; each personal cycle begins with inner intensity before showing the world.',
      es: 'Sol y Luna en la misma fase: identidad y emoción nacen juntas; cada ciclo personal comienza con intensidad interior antes de mostrarse al mundo.',
      it: 'Sole e Luna nella stessa fase: identità ed emozione nascono insieme; ogni ciclo personale inizia con intensità interiore prima di mostrarsi al mondo.',
      de: 'Sonne und Mond in derselben Phase - Identität und Emotion werden zusammen geboren; jeder persönliche Zyklus beginnt mit innerer Intensität, bevor er sich der Welt zeigt.',
      fr: 'Soleil et Lune dans la même phase - identité et émotion naissent ensemble ; chaque cycle personnel commence par une intensité intérieure avant de se montrer au monde.' } },
  { max: 90, label: { pt: 'Lua Crescente', en: 'Waxing Crescent', es: 'Luna Creciente', it: 'Luna Crescente', de: 'Zunehmender Mond', fr: 'Premier croissant' },
    text: { pt: 'Fase crescente - constróis emoção e identidade em simultâneo; há entusiasmo para crescer, mas ainda precisas de proteger o broto até ganhar raízes.',
      en: 'Waxing phase - you build emotion and identity together; enthusiasm to grow, yet the sprout still needs protection until rooted.',
      es: 'Fase creciente: construyes emoción e identidad a la vez; hay entusiasmo por crecer, pero aún debes proteger el brote hasta echar raíces.',
      it: 'Fase crescente: costruisci emozione e identità insieme; entusiasmo per crescere, ma il germoglio ha ancora bisogno di protezione finché mette radici.',
      de: 'Zunehmende Phase - du baust Emotion und Identität gleichzeitig; Enthusiasmus zum Wachsen, doch der Spross braucht Schutz, bis er verwurzelt ist.',
      fr: 'Phase croissante - tu construis émotion et identité ensemble ; enthousiasme pour grandir, mais le bourgeon a encore besoin de protection jusqu\'à s\'enraciner.' } },
  { max: 135, label: { pt: 'Quarto Crescente', en: 'First Quarter', es: 'Cuarto Creciente', it: 'Primo Quarto', de: 'Erstes Viertel', fr: 'Premier quartier' },
    text: { pt: 'Quarto crescente - tensão criativa entre vontade consciente e necessidades emocionais; os obstáculos que surgem são treino de carácter.',
      en: 'First quarter - creative tension between conscious will and emotional needs; obstacles that arise are character training.',
      es: 'Cuarto creciente: tensión creativa entre voluntad consciente y necesidades emocionales; los obstáculos son entrenamiento de carácter.',
      it: 'Primo quarto: tensione creativa tra volontà conscia e bisogni emotivi; gli ostacoli sono allenamento del carattere.',
      de: 'Erstes Viertel - kreative Spannung zwischen bewusstem Willen und emotionalen Bedürfnissen; Hindernisse sind Charaktertraining.',
      fr: 'Premier quartier - tension créative entre volonté consciente et besoins émotionnels ; les obstacles sont un entraînement du caractère.' } },
  { max: 180, label: { pt: 'Lua Gibosa Crescente', en: 'Waxing Gibbous', es: 'Luna Gibosa Creciente', it: 'Gibbosa Crescente', de: 'Zunehmender Mond (gibbous)', fr: 'Gibbeuse croissante' },
    text: { pt: 'Gibosa crescente - refinamento antes da plenitude; aperfeiçoas o que nasceu, ajustando ego e coração antes da revelação pública.',
      en: 'Waxing gibbous - refinement before fullness; you polish what was born, adjusting ego and heart before public revelation.',
      es: 'Gibosa creciente: refinamiento antes de la plenitud; perfeccionas lo nacido, ajustando ego y corazón antes de la revelación pública.',
      it: 'Gibbosa crescente: rifinitura prima della pienezza; perfezioni ciò che è nato, aggiustando ego e cuore prima della rivelazione pubblica.',
      de: 'Zunehmend gibbous - Verfeinerung vor der Fülle; du polierst das Geborene, Ego und Herz vor öffentlicher Offenbarung ausrichtend.',
      fr: 'Gibbeuse croissante - raffinement avant la plénitude ; tu peaufines ce qui est né, ajustant ego et cœur avant la révélation publique.' } },
  { max: 225, label: { pt: 'Lua Cheia', en: 'Full Moon', es: 'Luna Llena', it: 'Luna Piena', de: 'Vollmond', fr: 'Pleine Lune' },
    text: { pt: 'Lua Cheia natal - Sol e Lua em polaridade máxima; vives com consciência ampliada das tuas dualidades internas. Relacionamentos e espelhos externos são centrais na tua biografia emocional.',
      en: 'Natal Full Moon - Sun and Moon at maximum polarity; you live with heightened awareness of inner dualities. Relationships and external mirrors are central to your emotional biography.',
      es: 'Luna Llena natal: Sol y Luna en polaridad máxima; vives con conciencia ampliada de tus dualidades internas. Relaciones y espejos externos son centrales en tu biografía emocional.',
      it: 'Luna Piena natale: Sole e Luna a polarità massima; vivi con consapevolezza amplificata delle dualità interiori. Relazioni e specchi esterni sono centrali nella tua biografia emotiva.',
      de: 'Geburts-Vollmond - Sonne und Mond in maximaler Polarität; du lebst mit erhöhter Bewusstheit innerer Dualitäten. Beziehungen und äußere Spiegel sind zentral für deine emotionale Biografie.',
      fr: 'Pleine Lune natale - Soleil et Lune en polarité maximale ; tu vis avec une conscience amplifiée de tes dualités intérieures. Relations et miroirs extérieurs sont centraux dans ta biographie émotionnelle.' } },
  { max: 270, label: { pt: 'Lua Gibosa Minguante', en: 'Waning Gibbous', es: 'Luna Gibosa Menguante', it: 'Gibbosa Minguente', de: 'Abnehmender Mond (gibbous)', fr: 'Gibbeuse décroissante' },
    text: { pt: 'Gibosa minguante - partilhas sabedoria emocional; ensinas o que aprendeste sentindo, mesmo quando o mundo ainda não pediu.',
      en: 'Waning gibbous - you share emotional wisdom; teaching what feeling taught you, even when the world has not yet asked.',
      es: 'Gibosa menguante: compartes sabiduría emocional; enseñas lo aprendido sintiendo, aunque el mundo aún no lo haya pedido.',
      it: 'Gibbosa minguente: condividi saggezza emotiva; insegni ciò che il sentire ti ha insegnato, anche quando il mondo non l\'ha ancora chiesto.',
      de: 'Abnehmend gibbous - du teilst emotionale Weisheit; lehrst, was das Fühlen dich lehrte, auch wenn die Welt es noch nicht verlangte.',
      fr: 'Gibbeuse décroissante - tu partages la sagesse émotionnelle ; tu enseignes ce que le ressenti t\'a appris, même quand le monde ne l\'a pas encore demandé.' } },
  { max: 315, label: { pt: 'Quarto Minguante', en: 'Last Quarter', es: 'Cuarto Menguante', it: 'Ultimo Quarto', de: 'Letztes Viertel', fr: 'Dernier quartier' },
    text: { pt: 'Quarto minguante - libertas padrões emocionais obsoletos; crises periódicas limpam identidade para renascer mais leve.',
      en: 'Last quarter - you release obsolete emotional patterns; periodic crises cleanse identity to reborn lighter.',
      es: 'Cuarto menguante: liberas patrones emocionales obsoletos; crisis periódicas limpian la identidad para renacer más ligero/a.',
      it: 'Ultimo quarto: liberi schemi emotivi obsoleti; crisi periodiche purificano l\'identità per rinascere più leggero/a.',
      de: 'Letztes Viertel - du löst veraltete emotionale Muster; periodische Krisen reinigen die Identität für leichtere Wiedergeburt.',
      fr: 'Dernier quartier - tu libères des schémas émotionnels obsolètes ; des crises périodiques purifient l\'identité pour renaître plus léger(ère).' } },
  { max: 360, label: { pt: 'Lua Minguante', en: 'Waning Crescent', es: 'Luna Menguante', it: 'Luna Minguente', de: 'Abnehmender Mond', fr: 'Dernier croissant' },
    text: { pt: 'Lua minguante - alma introspectiva que processa em silêncio; retiros emocionais não são fuga - são manutenção da tua psique.',
      en: 'Waning crescent - introspective soul processing in silence; emotional retreats are not escape - they maintain your psyche.',
      es: 'Luna menguante: alma introspectiva que procesa en silencio; retiros emocionales no son huida: mantienen tu psique.',
      it: 'Luna minguente: anima introspettiva che processa in silenzio; ritiri emotivi non sono fuga: mantengono la tua psiche.',
      de: 'Abnehmender Mond - introspektive Seele verarbeitet in Stille; emotionale Rückzüge sind keine Flucht - sie erhalten deine Psyche.',
      fr: 'Dernier croissant - âme introspective qui traite en silence ; les retraites émotionnelles ne sont pas fuite - elles entretiennent ta psyché.' } },
]

export function glueFaseLunar(lang, diff) {
  const fase = FASES.find((f) => diff < f.max) || FASES[FASES.length - 1]
  const label = contentForLang(lang, fase.label)
  const text = contentForLang(lang, fase.text)
  const prefix = contentForLang(lang, {
    pt: ' Fase lunar natal:', en: ' Natal lunar phase:', es: ' Fase lunar natal:',
    it: ' Fase lunare natale:', de: ' Geburtsphasen-Mond:', fr: ' Phase lunaire natale:',
  })
  return `${prefix} ${label}. ${text}`
}
