/** Templates de aspectos por planeta — chaves canónicas (sol, lua, …) e tipos (trino, sextil, …). */

const CONJ = {
  pt: (p) => `${p} em conjunção intensifica o dia — foco e presença consciente.`,
  en: (p) => `${p} conjunct energy intensifies the day — focus with conscious presence.`,
  es: (p) => `${p} en conjunción intensifica el día — enfoque y presencia consciente.`,
  it: (p) => `${p} in congiunzione intensifica la giornata — focus e presenza consapevole.`,
  de: (p) => `${p} in Konjunktion verstärkt den Tag — Fokus und bewusste Präsenz.`,
  fr: (p) => `${p} en conjonction intensifie la journée — focus et présence consciente.`,
}

function pack(lang, planets) {
  const c = CONJ[lang] || CONJ.en
  const out = {}
  for (const [key, aspects] of Object.entries(planets)) {
    out[key] = { ...aspects, conjuncao: aspects.conjuncao || c(key) }
  }
  return out
}

const EN = pack('en', {
  sol: {
    trino: 'The Sun trine illuminates identity and vitality. A day to shine and express authenticity.',
    sextil: 'The Sun sextile brings opportunities for personal growth and recognition.',
    quadratura: 'The Sun square asks attention to ego — avoid unnecessary conflict; build confidence through constructive challenges.',
    oposicao: 'The Sun opposition reveals tension between your needs and others — seek balance.',
  },
  lua: {
    trino: 'The Moon trine harmonises emotions and intuition — trust your feelings.',
    sextil: 'The Moon sextile eases emotional communication and strengthens bonds.',
    quadratura: 'The Moon square brings emotional instability — be patient with yourself.',
    oposicao: 'The Moon opposition amplifies sensitivity — balance inner and outer worlds.',
  },
  mercurio: {
    trino: 'Mercury trine favours clear communication and lucid thinking.',
    sextil: 'Mercury sextile stimulates curiosity and learning.',
    quadratura: 'Mercury square warns of misunderstandings — pause before speaking.',
    oposicao: 'Mercury opposition brings communication challenges — listen more than you speak.',
  },
  venus: {
    trino: 'Venus trine harmonises love and beauty — relationships flow smoothly.',
    sextil: 'Venus sextile brings romantic and social opportunities.',
    quadratura: 'Venus square asks for adjustments in relationships.',
    oposicao: 'Venus opposition reveals imbalance between giving and receiving.',
  },
  marte: {
    trino: 'Mars trine channels energy productively — determination is high.',
    sextil: 'Mars sextile offers controlled energy for concrete action.',
    quadratura: 'Mars square warns against impulsiveness — patience is your ally.',
    oposicao: 'Mars opposition brings tension between action and patience.',
  },
  jupiter: {
    trino: 'Jupiter trine expands opportunities and optimism.',
    sextil: 'Jupiter sextile brings learning and expansion chances.',
    quadratura: 'Jupiter square warns against excess — moderation avoids disappointment.',
    oposicao: 'Jupiter opposition reveals conflict between optimism and reality.',
  },
  saturno: {
    trino: 'Saturn trine brings structure — past efforts are rewarded.',
    sextil: 'Saturn sextile favours methodical work and solid foundations.',
    quadratura: 'Saturn square tests resilience — face obstacles as growth.',
    oposicao: 'Saturn opposition reveals tension between freedom and duty.',
  },
})

const PT = pack('pt', {
  sol: {
    trino: 'O Sol em trino ilumina a identidade e vitalidade. Dia para brilhar e expressar autenticidade.',
    sextil: 'O Sol em sextil traz oportunidades de crescimento pessoal.',
    quadratura: 'O Sol em quadratura pede atenção ao ego — evita conflitos desnecessários.',
    oposicao: 'O Sol em oposição revela tensão entre as tuas necessidades e as dos outros.',
  },
  lua: {
    trino: 'A Lua em trino harmoniza emoções e intuição — confia nos sentimentos.',
    sextil: 'A Lua em sextil facilita comunicação emocional.',
    quadratura: 'A Lua em quadratura traz instabilidade emocional — sê paciente.',
    oposicao: 'A Lua em oposição amplifica sensibilidades — equilibra mundos interior e exterior.',
  },
  mercurio: {
    trino: 'Mercúrio em trino favorece comunicação clara e pensamento lúcido.',
    sextil: 'Mercúrio em sextil estimula curiosidade e aprendizagem.',
    quadratura: 'Mercúrio em quadratura alerta para mal-entendidos — pausa antes de falar.',
    oposicao: 'Mercúrio em oposição traz desafios na comunicação.',
  },
  venus: {
    trino: 'Vénus em trino harmoniza amor e beleza.',
    sextil: 'Vénus em sextil traz oportunidades românticas e sociais.',
    quadratura: 'Vénus em quadratura pede ajustes nas relações.',
    oposicao: 'Vénus em oposição revela desequilíbrios entre dar e receber.',
  },
  marte: {
    trino: 'Marte em trino canaliza energia de forma produtiva.',
    sextil: 'Marte em sextil oferece energia controlada para acções concretas.',
    quadratura: 'Marte em quadratura alerta contra impulsividade.',
    oposicao: 'Marte em oposição traz tensões entre acção e paciência.',
  },
  jupiter: {
    trino: 'Júpiter em trino expande oportunidades e optimismo.',
    sextil: 'Júpiter em sextil traz oportunidades de aprendizagem.',
    quadratura: 'Júpiter em quadratura alerta contra excessos.',
    oposicao: 'Júpiter em oposição revela conflito entre optimismo e realidade.',
  },
  saturno: {
    trino: 'Saturno em trino traz estrutura — esforços passados são recompensados.',
    sextil: 'Saturno em sextil favorece trabalho metódico.',
    quadratura: 'Saturno em quadratura traz desafios que testam resiliência.',
    oposicao: 'Saturno em oposição revela tensões entre liberdade e responsabilidade.',
  },
})

const ES = pack('es', {
  sol: {
    trino: 'El Sol en trino ilumina identidad y vitalidad. Día para brillar y expresar autenticidad.',
    sextil: 'El Sol en sextil trae oportunidades de crecimiento personal.',
    quadratura: 'El Sol en cuadratura pide atención al ego — evita conflictos innecesarios.',
    oposicao: 'El Sol en oposición revela tensiones entre tus necesidades y las de los demás.',
  },
  lua: {
    trino: 'La Luna en trino armoniza emociones e intuición.',
    sextil: 'La Luna en sextil facilita comunicación emocional.',
    quadratura: 'La Luna en cuadratura trae inestabilidad emocional.',
    oposicao: 'La Luna en oposición amplifica sensibilidades.',
  },
  mercurio: {
    trino: 'Mercurio en trino favorece comunicación clara.',
    sextil: 'Mercurio en sextil estimula curiosidad y aprendizaje.',
    quadratura: 'Mercurio en cuadratura alerta sobre malentendidos.',
    oposicao: 'Mercurio en oposición trae desafíos en la comunicación.',
  },
  venus: {
    trino: 'Venus en trino armoniza amor y belleza.',
    sextil: 'Venus en sextil trae oportunidades románticas.',
    quadratura: 'Venus en cuadratura pide ajustes en las relaciones.',
    oposicao: 'Venus en oposición revela desequilibrios.',
  },
  marte: {
    trino: 'Marte en trino canaliza energía de forma productiva.',
    sextil: 'Marte en sextil ofrece energía controlada.',
    quadratura: 'Marte en cuadratura alerta contra impulsividad.',
    oposicao: 'Marte en oposición trae tensiones entre acción y paciencia.',
  },
  jupiter: {
    trino: 'Júpiter en trino expande oportunidades.',
    sextil: 'Júpiter en sextil trae aprendizaje y expansión.',
    quadratura: 'Júpiter en cuadratura alerta contra excesos.',
    oposicao: 'Júpiter en oposición revela conflicto entre optimismo y realidad.',
  },
  saturno: {
    trino: 'Saturno en trino trae estructura y disciplina.',
    sextil: 'Saturno en sextil favorece trabajo metódico.',
    quadratura: 'Saturno en cuadratura trae desafíos de resiliencia.',
    oposicao: 'Saturno en oposición revela tensiones entre libertad y deber.',
  },
})

const IT = pack('it', {
  sol: {
    trino: 'Il Sole in trigono illumina identità e vitalità.',
    sextil: 'Il Sole in sestile porta opportunità di crescita.',
    quadratura: 'Il Sole in quadratura chiede attenzione all\'ego.',
    oposicao: 'Il Sole in opposizione rivela tensioni relazionali.',
  },
  lua: {
    trino: 'La Luna in trigono armonizza emozioni e intuizione.',
    sextil: 'La Luna in sestile facilita comunicazione emotiva.',
    quadratura: 'La Luna in quadratura porta instabilità emotiva.',
    oposicao: 'La Luna in opposizione amplifica sensibilità.',
  },
  mercurio: {
    trino: 'Mercurio in trigono favorisce comunicazione chiara.',
    sextil: 'Mercurio in sestile stimola curiosità.',
    quadratura: 'Mercurio in quadratura allerta su malintesi.',
    oposicao: 'Mercurio in opposizione porta sfide comunicative.',
  },
  venus: {
    trino: 'Venere in trigono armonizza amore e bellezza.',
    sextil: 'Venere in sestile porta opportunità romantiche.',
    quadratura: 'Venere in quadratura chiede aggiustamenti nelle relazioni.',
    oposicao: 'Venere in opposizione rivela squilibri.',
  },
  marte: {
    trino: 'Marte in trigono canalizza energia produttivamente.',
    sextil: 'Marte in sestile offre energia controllata.',
    quadratura: 'Marte in quadratura allerta contro impulsività.',
    oposicao: 'Marte in opposizione porta tensioni.',
  },
  jupiter: {
    trino: 'Giove in trigono estende opportunità.',
    sextil: 'Giove in sestile porta apprendimento.',
    quadratura: 'Giove in quadratura allerta contro eccessi.',
    oposicao: 'Giove in opposizione rivela conflitto tra ottimismo e realtà.',
  },
  saturno: {
    trino: 'Saturno in trigono porta struttura.',
    sextil: 'Saturno in sestile favorisce lavoro metodico.',
    quadratura: 'Saturno in quadratura testa resilienza.',
    oposicao: 'Saturno in opposizione rivela tensioni tra libertà e dovere.',
  },
})

const DE = pack('de', {
  sol: {
    trino: 'Die Sonne im Trigon erhellt Identität und Vitalität.',
    sextil: 'Die Sonne im Sextil bringt Chancen für persönliches Wachstum.',
    quadratura: 'Die Sonne im Quadrat erfordert Aufmerksamkeit für das Ego.',
    oposicao: 'Die Sonne in Opposition zeigt Spannungen zwischen Bedürfnissen.',
  },
  lua: {
    trino: 'Der Mond im Trigon harmonisiert Emotionen und Intuition.',
    sextil: 'Der Mond im Sextil erleichtert emotionale Kommunikation.',
    quadratura: 'Der Mond im Quadrat bringt emotionale Instabilität.',
    oposicao: 'Der Mond in Opposition verstärkt Sensibilität.',
  },
  mercurio: {
    trino: 'Merkur im Trigon begünstigt klare Kommunikation.',
    sextil: 'Merkur im Sextil stimuliert Neugier.',
    quadratura: 'Merkur im Quadrat warnt vor Missverständnissen.',
    oposicao: 'Merkur in Opposition bringt Kommunikationsherausforderungen.',
  },
  venus: {
    trino: 'Venus im Trigon harmonisiert Liebe und Schönheit.',
    sextil: 'Venus im Sextil bringt romantische Gelegenheiten.',
    quadratura: 'Venus im Quadrat erfordert Anpassungen in Beziehungen.',
    oposicao: 'Venus in Opposition zeigt Ungleichgewichte.',
  },
  marte: {
    trino: 'Mars im Trigon kanalisiert Energie produktiv.',
    sextil: 'Mars im Sextil bietet kontrollierte Energie.',
    quadratura: 'Mars im Quadrat warnt vor Impulsivität.',
    oposicao: 'Mars in Opposition bringt Spannungen.',
  },
  jupiter: {
    trino: 'Jupiter im Trigon erweitert Chancen.',
    sextil: 'Jupiter im Sextil bringt Lernmöglichkeiten.',
    quadratura: 'Jupiter im Quadrat warnt vor Exzessen.',
    oposicao: 'Jupiter in Opposition zeigt Optimismus-Realitäts-Konflikt.',
  },
  saturno: {
    trino: 'Saturn im Trigon bringt Struktur.',
    sextil: 'Saturn im Sextil begünstigt methodische Arbeit.',
    quadratura: 'Saturn im Quadrat testet Widerstandsfähigkeit.',
    oposicao: 'Saturn in Opposition zeigt Freiheits-Verantwortungs-Spannung.',
  },
})

const FR = pack('fr', {
  sol: {
    trino: 'Le Soleil en trigone illumine identité et vitalité.',
    sextil: 'Le Soleil en sextile apporte des opportunités de croissance.',
    quadratura: 'Le Soleil en carré demande attention à l\'ego.',
    oposicao: 'Le Soleil en opposition révèle des tensions relationnelles.',
  },
  lua: {
    trino: 'La Lune en trigone harmonise émotions et intuition.',
    sextil: 'La Lune en sextile facilite communication émotionnelle.',
    quadratura: 'La Lune en carré apporte instabilité émotionnelle.',
    oposicao: 'La Lune en opposition amplifie sensibilités.',
  },
  mercurio: {
    trino: 'Mercure en trigone favorise communication claire.',
    sextil: 'Mercure en sextile stimule curiosité.',
    quadratura: 'Mercure en carré avertit des malentendus.',
    oposicao: 'Mercure en opposition apporte défis communication.',
  },
  venus: {
    trino: 'Vénus en trigone harmonise amour et beauté.',
    sextil: 'Vénus en sextile apporte opportunités romantiques.',
    quadratura: 'Vénus en carré demande ajustements relationnels.',
    oposicao: 'Vénus en opposition révèle déséquilibres.',
  },
  marte: {
    trino: 'Mars en trigone canalise énergie productivement.',
    sextil: 'Mars en sextile offre énergie contrôlée.',
    quadratura: 'Mars en carré avertit contre impulsivité.',
    oposicao: 'Mars en opposition apporte tensions.',
  },
  jupiter: {
    trino: 'Jupiter en trigone étend opportunités.',
    sextil: 'Jupiter en sextile apporte apprentissage.',
    quadratura: 'Jupiter en carré avertit contre excès.',
    oposicao: 'Jupiter en opposition révèle conflit optimisme-réalité.',
  },
  saturno: {
    trino: 'Saturne en trigone apporte structure.',
    sextil: 'Saturne en sextile favorise travail méthodique.',
    quadratura: 'Saturne en carré teste résilience.',
    oposicao: 'Saturne en opposition révèle tension liberté-devoir.',
  },
})

export const HOROSCOPO_TEMPLATES = { pt: PT, en: EN, es: ES, it: IT, de: DE, fr: FR }

const PLANET_ALIASES = {
  sole: 'sol', sonne: 'sol', soleil: 'sol',
  luna: 'lua', mond: 'lua', lune: 'lua',
  giove: 'jupiter', venere: 'venus', mars: 'marte', saturne: 'saturno',
  mercure: 'mercurio', merkur: 'mercurio',
}

const ASPECT_ALIASES = {
  cuadratura: 'quadratura', oposicion: 'oposicao', sestile: 'sextil',
  quadrat: 'quadratura', carre: 'quadratura', opposition: 'oposicao',
  trigon: 'trino', square: 'quadratura', sextile: 'sextil', conjunction: 'conjuncao',
}

export function normPlanetaKey(p) {
  const key = String(p || '').toLowerCase()
  return PLANET_ALIASES[key] || key
}

export function normAspectoKey(t) {
  const key = String(t || '').toLowerCase()
  return ASPECT_ALIASES[key] || key
}

const FALLBACK_LINE = {
  pt: (p1, p2, signo) => `${p1} e ${p2} influenciam ${signo} hoje.`,
  en: (p1, p2, signo) => `${p1} and ${p2} influence ${signo} today.`,
  es: (p1, p2, signo) => `${p1} y ${p2} influyen en ${signo} hoy.`,
  it: (p1, p2, signo) => `${p1} e ${p2} influenzano ${signo} oggi.`,
  de: (p1, p2, signo) => `${p1} und ${p2} beeinflussen ${signo} heute.`,
  fr: (p1, p2, signo) => `${p1} et ${p2} influencent ${signo} aujourd'hui.`,
}

export function linhaAspectoHoroscopo(planeta1, tipo, lang, signo, planeta2) {
  const packLang = HOROSCOPO_TEMPLATES[lang] || HOROSCOPO_TEMPLATES.en
  const p = normPlanetaKey(planeta1)
  const t = normAspectoKey(tipo)
  const templates = packLang[p] || packLang.sol || {}
  const line = templates[t]
  if (line) return line
  const fb = FALLBACK_LINE[lang] || FALLBACK_LINE.en
  return fb(planeta1, planeta2, signo)
}

export const RESUMOS_HOROSCOPO = {
  pt: {
    favoravel: (s) => `Dia de expansão e realizações para ${s}. Os trânsitos favorecem os teus objectivos.`,
    desfavoravel: (s) => `Dia de desafios e reflexão para ${s}. Os trânsitos pedem cautela e paciência.`,
    misto: (s) => `Dia de contrastes para ${s}. Energias mistas pedem equilíbrio estratégico.`,
    estavel: (s) => `Dia estável e produtivo para ${s}. Foco e organização trazem resultados.`,
  },
  en: {
    favoravel: (s) => `A day of expansion and achievement for ${s}. Transits favour your goals.`,
    desfavoravel: (s) => `A day of challenges and reflection for ${s}. Transits ask for caution and patience.`,
    misto: (s) => `A day of contrasts for ${s}. Mixed energies call for strategic balance.`,
    estavel: (s) => `A stable, productive day for ${s}. Focus and organisation bring results.`,
  },
  es: {
    favoravel: (s) => `Día de expansión y logros para ${s}. Los tránsitos favorecen tus objetivos.`,
    desfavoravel: (s) => `Día de desafíos y reflexión para ${s}. Los tránsitos piden cautela.`,
    misto: (s) => `Día de contrastes para ${s}. Energías mixtas piden equilibrio.`,
    estavel: (s) => `Día estable y productivo para ${s}. El foco trae resultados concretos.`,
  },
  it: {
    favoravel: (s) => `Giorno di espansione per ${s}. I transiti favoriscono i tuoi obiettivi.`,
    desfavoravel: (s) => `Giorno di sfide per ${s}. I transiti chiedono cautela.`,
    misto: (s) => `Giorno di contrasti per ${s}. Energie miste chiedono equilibrio.`,
    estavel: (s) => `Giorno stabile e produttivo per ${s}. Focus e organizzazione portano risultati.`,
  },
  de: {
    favoravel: (s) => `Tag der Expansion für ${s}. Transite begünstigen deine Ziele.`,
    desfavoravel: (s) => `Tag der Herausforderungen für ${s}. Transite verlangen Vorsicht.`,
    misto: (s) => `Tag der Kontraste für ${s}. Gemischte Energien verlangen Balance.`,
    estavel: (s) => `Stabiler, produktiver Tag für ${s}. Fokus bringt Ergebnisse.`,
  },
  fr: {
    favoravel: (s) => `Jour d'expansion pour ${s}. Les transits favorisent tes objectifs.`,
    desfavoravel: (s) => `Jour de défis pour ${s}. Les transits demandent prudence.`,
    misto: (s) => `Jour de contrastes pour ${s}. Énergies mixtes demandent équilibre.`,
    estavel: (s) => `Jour stable et productif pour ${s}. Concentration et organisation apportent des résultats.`,
  },
}
