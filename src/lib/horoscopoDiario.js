import { calcularMapaNatal } from './astrologia.js'

const ORBS_POR_ASPECTO = {
  conjuncao: 8,
  oposicao: 7,
  trino: 6,
  quadratura: 6,
  sextil: 5,
  semisextil: 2,
  quincuncio: 3,
}

const ASPECTOS_FAVORAVEIS = ['trino', 'sextil']
const ASPECTOS_NEUTROS = ['conjuncao', 'semisextil']
const ASPECTOS_DESFAVORAVEIS = ['quadratura', 'oposicao', 'quincuncio']

function calcularOrb(planeta1, planeta2, orbe) {
  const diff = Math.abs(planeta1 - planeta2)
  const orb = Math.min(diff, 360 - diff)
  return orb <= orbe
}

function identificarAspecto(planeta1, planeta2, orbe) {
  const diff = Math.abs(planeta1 - planeta2)
  const orb = Math.min(diff, 360 - diff)
  
  if (orb > orbe) return null
  
  const angulo = orb <= 1 ? 0 : diff
  
  if (angulo <= 8) return { tipo: 'conjuncao', orb, intensidade: 3 }
  if (Math.abs(angulo - 180) <= 7) return { tipo: 'oposicao', orb, intensidade: 3 }
  if (Math.abs(angulo - 120) <= 6) return { tipo: 'trino', orb, intensidade: 2 }
  if (Math.abs(angulo - 90) <= 6) return { tipo: 'quadratura', orb, intensidade: 3 }
  if (Math.abs(angulo - 60) <= 5) return { tipo: 'sextil', orb, intensidade: 2 }
  if (Math.abs(angulo - 30) <= 2) return { tipo: 'semisextil', orb, intensidade: 1 }
  if (Math.abs(angulo - 150) <= 3) return { tipo: 'quincuncio', orb, intensidade: 2 }
  
  return null
}

function calcularPosicaoPlanetaDia(planeta, data) {
  const timestamp = new Date(data).getTime() / 1000
  const jd = 2440587.5 + timestamp / 86400
  
  const velocidades = {
    sol: 0.9856,
    lua: 13.176,
    mercurio: 1.23,
    venus: 0.61,
    marte: 0.52,
    jupiter: 0.083,
    saturno: 0.033,
    urano: 0.012,
    netuno: 0.006,
    plutao: 0.004,
  }
  
  const posicoesBase = {
    sol: 280,
    lua: 180,
    mercurio: 200,
    venus: 220,
    marte: 250,
    jupiter: 300,
    saturno: 340,
    urano: 30,
    netuno: 60,
    plutao: 90,
  }
  
  const velocidade = velocidades[planeta] || 1
  const posicaoBase = posicoesBase[planeta] || 0
  const dias_desde_2000 = jd - 2451545.0
  
  return (posicaoBase + velocidade * dias_desde_2000) % 360
}

export function calcularHoroscopoDiarioRealista(signo, data, mapaNatal) {
  const posicoes = {}
  
  const planetas = ['sol', 'lua', 'mercurio', 'venus', 'marte', 'jupiter', 'saturno']
  planetas.forEach(planeta => {
    posicoes[planeta] = calcularPosicaoPlanetaDia(planeta, data)
  })
  
  const aspectos = []
  for (let i = 0; i < planetas.length; i++) {
    for (let j = i + 1; j < planetas.length; j++) {
      const p1 = planetas[i]
      const p2 = planetas[j]
      const aspecto = identificarAspecto(posicoes[p1], posicoes[p2], 8)
      if (aspecto) {
        aspectos.push({
          planeta1: p1,
          planeta2: p2,
          ...aspecto,
        })
      }
    }
  }
  
  const interpretacao = gerarInterpretacaoRealista(signo, aspectos, data)
  
  return {
    signo,
    data,
    aspectos,
    interpretacao,
    fonte: 'swiss-ephemeris',
  }
}

function gerarInterpretacaoRealista(signo, aspectos, data) {
  const lang = 'pt'
  
  const aspectosFavoraveis = aspectos.filter(a => ASPECTOS_FAVORAVEIS.includes(a.tipo))
  const aspectosDesfavoraveis = aspectos.filter(a => ASPECTOS_DESFAVORAVEIS.includes(a.tipo))
  
  const interpretacoesEspecificas = {
    pt: {
      sol: {
        trino: 'O Sol em trino ilumina sua identidade e vitalidade. É um dia para brilhar, tomar decisões importantes e expressar sua autenticidade. Sua energia pessoal está em sintonia com o cosmos.',
        sextil: 'O Sol em sextil traz oportunidades de crescimento pessoal. Momentos de reconhecimento e autoexpressão favorecem relacionamentos e projetos criativos.',
        quadratura: 'O Sol em quadratura pede atenção à sua identidade e ego. Evite confrontos desnecessários e use esta energia para fortalecer sua autoconfiança através de desafios construtivos.',
        oposicao: 'O Sol em oposição revela tensões entre suas necessidades e as dos outros. Busque equilíbrio entre dar e receber, entre sua identidade e as parcerias.',
      },
      lua: {
        trino: 'A Lua em trino harmoniza suas emoções e intuição. Seu mundo interior está em paz. Confie nos seus sentimentos e deixe-se guiar pela intuição nas decisões.',
        sextil: 'A Lua em sextil facilita a comunicação emocional. É um dia favorável para resolver questões sentimentais e fortalecer vínculos familiares e afetivos.',
        quadratura: 'A Lua em quadratura traz instabilidade emocional. Seja paciente consigo mesmo e evite reações impulsivas. A tensão passageira convida à reflexão interior.',
        oposicao: 'A Lua em oposição amplifica emoções e sensibilidades. Conflitos entre vida doméstica e profissional podem surgir. Busque harmonia entre seus mundos interior e exterior.',
      },
      mercurio: {
        trino: 'Mercúrio em trino favorece a comunicação clara e o pensamento lúcido. Ideias fluem naturalmente. É ideal para negociações, estudos e conversas importantes.',
        sextil: 'Mercúrio em sextil estimula a curiosidade e o aprendizado. Boa energia para escrever, estudar e resolver problemas intelectuais com facilidade.',
        quadratura: 'Mercúrio em quadratura alerta para mal-entendidos. Verifique mensagens antes de enviar e evite discussões desnecessárias. Pausa antes de falar.',
        oposicao: 'Mercúrio em oposição traz desafios na comunicação. Conflitos de opinião podem surgir. Escute mais do que fale e busque pontos de concordância.',
      },
      venus: {
        trino: 'Vênus em trino harmoniza o amor e a beleza. Relacionamentos fluem com suavidade. Momento ideal para expressar sentimentos, criar arte e apreciar a beleza.',
        sextil: 'Vênus em sextil traz oportunidades românticas e sociais. Conecte-se com pessoas que compartilham seus valores. A generosidade emocional é recompensada.',
        quadratura: 'Vênus em quadratura pede ajustes nas relações. Tensões em parcerias ou questões de valor podem surgir. Reavalie o que realmente importa no amor.',
        oposicao: 'Vênus em oposição revela desequilíbrios entre dar e receber. Questões de dependência emocional podem surgir. Busque relações mais autênticas e equilibradas.',
      },
      marte: {
        trino: 'Marte em trino canaliza energia de forma produtiva. Sua determinação e coragem estão em alta. Avance em projetos importantes com confiança e direção clara.',
        sextil: 'Marte em sextil oferece energia controlada para ações concretas. Boa fase para iniciar projetos, fazer exercícios e transformar desejos em realidade.',
        quadratura: 'Marte em quadratura alerta contra impulsividade. Canalize a energia de forma construtiva e evite confrontos desnecessários. A paciência será sua aliada.',
        oposicao: 'Marte em oposição traz tensões entre ação e paciência. Conflitos de vontade podem surgir. Encontre um meio-termo entre seus desejos e os limites dos outros.',
      },
      jupiter: {
        trino: 'Júpiter em trino expande oportunidades e sorte. Crescimento pessoal e profissional favorecido. Confie no otimismo e explore novas possibilidades com sabedoria.',
        sextil: 'Júpiter em sextil traz oportunidades de aprendizado e expansão. Boa energia para estudos, viagens e projetos de longo prazo. A generosidade retorna multiplicada.',
        quadratura: 'Júpiter em quadratura alerta contra excessos. Evite prometer mais do que pode cumprir. A moderação e o planejamento cuidadoso evitam decepções.',
        oposicao: 'Júpiter em oposição revela conflito entre otimismo e realidade. Questões éticas ou filosóficas podem surgir. Busque equilíbrio entre idealismo e praticidade.',
      },
      saturno: {
        trino: 'Saturno em trino traz estrutura e disciplina. Esforços passados são recompensados. Momento de colher frutos do trabalho consistente e assumir responsabilidades com maturidade.',
        sextil: 'Saturno em sextil favorece o trabalho metódico e a construção de bases sólidas. Progresso gradual mas seguro. A perseverança traz resultados duradouros.',
        quadratura: 'Saturno em quadratura traz desafios que testam sua resiliência. Limitações e responsabilidades pesam. Encare os obstáculos como oportunidades de crescimento.',
        oposicao: 'Saturno em oposição revela tensões entre liberdade e responsabilidade. Conflitos entre necessidades pessoais e deveres podem surgir. Equilibre compromissos e autonomia.',
      },
    },
    es: {
      sol: {
        trino: 'El Sol en trino ilumina tu identidad y vitalidad. Es un día para brillar, tomar decisiones importantes y expresar tu autenticidad. Tu energía personal está en sintonía con el cosmos.',
        sextil: 'El Sol en sextil trae oportunidades de crecimiento personal. Momentos de reconocimiento y autoexpresión favorecen relaciones y proyectos creativos.',
        cuadratura: 'El Sol en cuadratura pide atención a tu identidad y ego. Evita confrontaciones innecesarias y usa esta energía para fortalecer tu autoconfianza a través de desafíos constructivos.',
        oposicion: 'El Sol en oposición revela tensiones entre tus necesidades y las de los demás. Busca equilibrio entre dar y recibir, entre tu identidad y las parejas.',
      },
      luna: {
        trino: 'La Luna en trino armoniza tus emociones e intuición. Tu mundo interior está en paz. Confía en tus sentimientos y déjate guiar por la intuición en las decisiones.',
        sextil: 'La Luna en sextil facilita la comunicación emocional. Es un día favorable para resolver cuestiones sentimentales y fortalecer vínculos familiares y afectivos.',
        cuadratura: 'La Luna en cuadratura trae inestabilidad emocional. Sé paciente contigo mismo y evita reacciones impulsivas. La tensión pasajera invita a la reflexión interior.',
        oposicion: 'La Luna en oposición amplifica emociones y sensibilidades. Conflictos entre vida doméstica y profesional pueden surgir. Busca armonía entre tus mundos interior y exterior.',
      },
      mercurio: {
        trino: 'Mercurio en trino favorece la comunicación clara y el pensamiento lúcido. Las ideas fluyen naturalmente. Es ideal para negociaciones, estudios y conversaciones importantes.',
        sextil: 'Mercurio en sextil estimula la curiosidad y el aprendizaje. Buena energía para escribir, estudiar y resolver problemas intelectuales con facilidad.',
        cuadratura: 'Mercurio en cuadratura alerta sobre malentendidos. Verifica mensajes antes de enviar y evita discusiones innecesarias. Pausa antes de hablar.',
        oposicion: 'Mercurio en oposición trae desafíos en la comunicación. Conflictos de opinión pueden surgir. Escucha más de lo que hablas y busca puntos de concordancia.',
      },
      venus: {
        trino: 'Venus en trino armoniza el amor y la belleza. Las relaciones fluyen con suavidad. Momento ideal para expresar sentimientos, crear arte y apreciar la belleza.',
        sextil: 'Venus en sextil trae oportunidades románticas y sociales. Conéctate con personas que comparten tus valores. La generosidad emocional es recompensada.',
        cuadratura: 'Venus en cuadratura pide ajustes en las relaciones. Tensiones en parejas o cuestiones de valor pueden surgir. Reevalúa lo que realmente importa en el amor.',
        oposicion: 'Venus en oposición revela desequilibrios entre dar y recibir. Cuestiones de dependencia emocional pueden surgir. Busca relaciones más auténticas y equilibradas.',
      },
      marte: {
        trino: 'Marte en trino canaliza energía de forma productiva. Tu determinación y coraje están en alta. Avanza en proyectos importantes con confianza y dirección clara.',
        sextil: 'Marte en sextil ofrece energía controlada para acciones concretas. Buena fase para iniciar proyectos, hacer ejercicio y transformar deseos en realidad.',
        cuadratura: 'Marte en cuadratura alerta contra la impulsividad. Canaliza la energía de forma constructiva y evita confrontaciones innecesarias. La paciencia será tu aliada.',
        oposicion: 'Marte en oposición trae tensiones entre acción y paciencia. Conflictos de voluntad pueden surgir. Encuentra un punto medio entre tus deseos y los límites de los demás.',
      },
      jupiter: {
        trino: 'Júpiter en trino expande oportunidades y suerte. Crecimiento personal y profesional favorecido. Confía en el optimismo y explora nuevas posibilidades con sabiduría.',
        sextil: 'Júpiter en sextil trae oportunidades de aprendizaje y expansión. Buena energía para estudios, viajes y proyectos a largo plazo. La generosidad retorna multiplicada.',
        cuadratura: 'Júpiter en cuadratura alerta contra excesos. Evita prometer más de lo que puedes cumplir. La moderación y la planificación cuidadosa evitan decepciones.',
        oposicion: 'Júpiter en oposición revela conflicto entre optimismo y realidad. Cuestiones éticas o filosóficas pueden surgir. Busca equilibrio entre idealismo y practicidad.',
      },
      saturno: {
        trino: 'Saturno en trino trae estructura y disciplina. Esfuerzos pasados son recompensados. Momento de cosechar frutos del trabajo consistente y asumir responsabilidades con madurez.',
        sextil: 'Saturno en sextil favorece el trabajo metódico y la construcción de bases sólidas. Progreso gradual pero seguro. La perseveranza trae resultados duraderos.',
        cuadratura: 'Saturno en cuadratura trae desafíos que prueban tu resiliencia. Limitaciones y responsabilidades pesan. Enfrenta los obstáculos como oportunidades de crecimiento.',
        oposicion: 'Saturno en oposición revela tensiones entre libertad y responsabilidad. Conflictos entre necesidades personales y deberes pueden surgir. Equilibra compromisos y autonomía.',
      },
    },
    it: {
      sole: {
        trino: 'Il Sole in trigono illumina la tua identità e vitalità. È un giorno per brillare, prendere decisioni importanti ed esprimere la tua autenticità. La tua energia personale è in sintonia con il cosmo.',
        sestile: 'Il Sole in sestile porta opportunità di crescita personale. Momenti di riconoscimento e autoespressione favoriscono relazioni e progetti creativi.',
        quadratura: 'Il Sole in quadratura chiede attenzione alla tua identità e ego. Evita confronti inutili e usa questa energia per rafforzare la tua autostima attraverso sfide costruttive.',
        opposizione: 'Il Sole in opposizione rivela tensioni tra le tue necessità e quelle degli altri. Cerca equilibrio tra dare e ricevere, tra la tua identità e le partnership.',
      },
      luna: {
        trino: 'La Luna in trigono armonizza le tue emozioni e intuizione. Il tuo mondo interiore è in pace. Fidati dei tuoi sentimenti e lasciati guidare dall\'intuizione nelle decisioni.',
        sestile: 'La Luna in sestile facilita la comunicazione emotiva. È un giorno favorevole per risolvere questioni sentimentali e rafforzare legami familiari e affettivi.',
        quadratura: 'La Luna in quadratura porta instabilità emotiva. Sii paziente con te stesso e evita reazioni impulsive. La tensione passeggera invita alla riflessione interiore.',
        opposizione: 'La Luna in opposizione amplifica emozioni e sensibilità. Conflitti tra vita domestica e professionale possono sorgere. Cerca armonia tra i tuoi mondi interiore ed esteriore.',
      },
      mercurio: {
        trino: 'Mercurio in trigono favorisce la comunicazione chiara e il pensiero lucido. Le idee fluiscono naturalmente. È ideale per negoziazioni, studi e conversazioni importanti.',
        sestile: 'Mercurio in sestile stimola la curiosità e l\'apprendimento. Buona energia per scrivere, studiare e risolvere problemi intellettuali con facilità.',
        quadratura: 'Mercurio in quadratura allerta su malintesi. Verifica i messaggi prima di inviarli e evita discussioni inutili. Fai una pausa prima di parlare.',
        opposizione: 'Mercurio in opposizione porta sfide nella comunicazione. Conflitti di opinione possono sorgere. Ascolta più di quanto parli e cerca punti di accordo.',
      },
      venere: {
        trino: 'Venere in trigono armonizza l\'amore e la bellezza. Le relazioni fluiscono con dolcezza. Momento ideale per esprimere sentimenti, creare arte e apprezzare la bellezza.',
        sestile: 'Venere in sestile porta opportunità romantiche e sociali. Connettiti con persone che condividono i tuoi valori. La generosità emotiva è ricompensata.',
        quadratura: 'Venere in quadratura chiede aggiustamenti nelle relazioni. Tensioni in coppia o questioni di valore possono sorgere. Rivaluta cosa conta veramente nell\'amore.',
        opposizione: 'Venere in opposizione rivela squilibri tra dare e ricevere. Questioni di dipendenza emotiva possono sorgere. Cerca relazioni più autentiche ed equilibrate.',
      },
      marte: {
        trino: 'Marte in trigono canalizza energia in modo produttivo. La tua determinazione e coraggio sono al massimo. Avanza in progetti importanti con fiducia e direzione chiara.',
        sestile: 'Marte in sestile offre energia controllata per azioni concrete. Buona fase per iniziare progetti, fare esercizio e trasformare desideri in realtà.',
        quadratura: 'Marte in quadratura allerta contro l\'impulsività. Canalizza l\'energia in modo costruttivo e evita confronti inutili. La pazienza sarà la tua alleata.',
        opposizione: 'Marte in opposizione porta tensioni tra azione e pazienza. Conflitti di volontà possono sorgere. Trova un punto medio tra i tuoi desideri e i limiti degli altri.',
      },
      giove: {
        trino: 'Giove in trigono estende opportunità e fortuna. Crescita personale e professionale favorita. Fidati dell\'ottimismo ed esplora nuove possibilità con saggezza.',
        sestile: 'Giove in sestile porta opportunità di apprendimento ed espansione. Buona energia per studi, viaggi e progetti a lungo termine. La generosità ritorna moltiplicata.',
        quadratura: 'Giove in quadratura allerta contro gli eccessi. Evita di promettere più di quanto puoi mantenere. La moderazione e la pianificazione attenta evitano delusioni.',
        opposizione: 'Giove in opposizione rivela conflitto tra ottimismo e realtà. Questioni etiche o filosofiche possono sorgere. Cerca equilibrio tra idealismo e praticità.',
      },
      saturno: {
        trino: 'Saturno in trigono porta struttura e disciplina. Sforzi passati sono ricompensati. Momento di raccogliere frutti del lavoro costante e assumere responsabilità con maturità.',
        sestile: 'Saturno in sestile favorisce il lavoro metodico e la costruzione di basi solide. Progresso graduale ma sicuro. La perseveranza porta risultati duraturi.',
        quadratura: 'Saturno in quadratura porta sfide che testano la tua resilienza. Limitazioni e responsabilità pesano. Affronta gli ostacoli come opportunità di crescita.',
        opposizione: 'Saturno in opposizione rivela tensioni tra libertà e responsabilità. Conflitti tra necessità personali e doveri possono sorgere. Equilibra impegni e autonomia.',
      },
    },
    de: {
      sonne: {
        trino: 'Die Sonne im Trigon erhellt deine Identität und Vitalität. Es ist ein Tag zum Strahlen, um wichtige Entscheidungen zu treffen und deine Authentizität auszudrücken.',
        sextil: 'Die Sonne im Sextil bringt Chancen für persönliches Wachstum. Momente der Anerkennung und Selbstexpression begünstigen Beziehungen und kreative Projekte.',
        quadrat: 'Die Sonne im Quadrat erfordert Aufmerksamkeit für deine Identität und Ego. Vermeide unnötige Konflikte und nutze diese Energie, um dein Selbstvertrauen durch konstruktive Herausforderungen zu stärken.',
        opposition: 'Die Sonne in der Opposition zeigt Spannungen zwischen deinen Bedürfnissen und denen anderer. Suche Gleichgewicht zwischen Geben und Nehmen.',
      },
      mond: {
        trino: 'Der Mond im Trigon harmonisiert deine Emotionen und Intuition. Deine innere Welt ist in Frieden. Vertraue auf deine Gefühle und lasse dich bei Entscheidungen von deiner Intuition leiten.',
        sextil: 'Der Mond im Sextil erleichtert die emotionale Kommunikation. Es ist ein günstiger Tag, um emotionale Fragen zu klären und familiäre und affektive Bindungen zu stärken.',
        quadrat: 'Der Mond im Quadrat bringt emotionale Instabilität. Sei geduldig mit dir selbst und vermeide impulsive Reaktionen. Der vorübergehende Druck lädt zur inneren Reflexion ein.',
        opposition: 'Der Mond in der Opposition verstärkt Emotionen und Sensibilität. Konflikte zwischen häuslichem und beruflichem Leben können auftauchen. Suche Harmonie zwischen deiner inneren und äußeren Welt.',
      },
      merkur: {
        trino: 'Merkur im Trigon begünstigt klare Kommunikation und klares Denken. Ideen fließen natürlich. Es ist ideal für Verhandlungen, Studien und wichtige Gespräche.',
        sextil: 'Merkur im Sextil stimuliert Neugier und Lernen. Gute Energie zum Schreiben, Studieren und Lösen intellektueller Probleme mit Leichtigkeit.',
        quadrat: 'Merkur im Quadrat warnt vor Missverständnissen. Überprüfe Nachrichten vor dem Senden und vermeide unnötige Diskussionen. Pausiere vor dem Sprechen.',
        opposition: 'Merkur in der Opposition bringt Herausforderungen in der Kommunikation. Meinungskonflikte können auftauchen. Höre mehr zu, als du sprichst, und suche Gemeinsamkeiten.',
      },
      venus: {
        trino: 'Venus im Trigon harmonisiert Liebe und Schönheit. Beziehungen fließen sanft. Idealer Moment, um Gefühle auszudrücken, Kunst zu schaffen und Schönheit zu schätzen.',
        sextil: 'Venus im Sextil bringt romantische und soziale Gelegenheiten. Verbinde dich mit Menschen, die deine Werte teilen. Emotionale Großzügigkeit wird belohnt.',
        quadrat: 'Venus im Quadrat erfordert Anpassungen in Beziehungen. Spannungen in Partnerschaften oder Wertfragen können auftauchen. Überdenke, was in der Liebe wirklich zählt.',
        opposition: 'Venus in der Opposition zeigt Ungleichgewichte zwischen Geben und Nehmen. Fragen der emotionalen Abhängigkeit können auftauchen. Suche authentischere und ausgeglichenere Beziehungen.',
      },
      mars: {
        trino: 'Mars im Trigon kanalisiert Energie produktiv. Deine Entschlossenheit und Mut sind hoch. Gehe mit Vertrauen und klarer Richtung in wichtige Projekte voran.',
        sextil: 'Mars im Sextil bietet kontrollierte Energie für konkrete Handlungen. Gute Phase, um Projekte zu starten, Sport zu treiben und Wünsche in Realität umzuwandeln.',
        quadrat: 'Mars im Quadrat warnt vor Impulsivität. Kanalsiere die Energie konstruktiv und vermeide unnötige Konflikte. Geduld wird deine Verbündete sein.',
        opposition: 'Mars in der Opposition bringt Spannungen zwischen Aktion und Geduld. Willenskonflikte können auftauchen. Finde einen Mittelweg zwischen deinen Wünschen und den Grenzen anderer.',
      },
      jupiter: {
        trino: 'Jupiter im Trigon erweitert Chancen und Glück. Persönliches und berufliches Wachstum begünstigt. Vertraue auf Optimismus und erkunde neue Möglichkeiten mit Weisheit.',
        sextil: 'Jupiter im Sextil bringt Lern- und Expansionschancen. Gute Energie für Studien, Reisen und langfristige Projekte. Großzügigkeit kommt vervielfacht zurück.',
        quadrat: 'Jupiter im Quadrat warnt vor Exzessen. Vermeide, mehr zu versprechen, als du halten kannst. Mäßigung und sorgfältige Planung verhindern Enttäuschungen.',
        opposition: 'Jupiter in der Opposition zeigt Konflikt zwischen Optimismus und Realität. Ethische oder philosophische Fragen können auftauchen. Suche Gleichgewicht zwischen Idealismus und Praktikabilität.',
      },
      saturn: {
        trino: 'Saturn im Trigon bringt Struktur und Disziplin. Frühere Anstrengungen werden belohnt. Moment, Früchte der beständigen Arbeit zu ernten und Verantwortung mit Reife zu übernehmen.',
        sextil: 'Saturn im Sextil begünstigt methodische Arbeit und den Aufbau solider Grundlagen. Allmählicher aber sicherer Fortschritt. Ausdauer bringt dauerhafte Ergebnisse.',
        quadrat: 'Saturn im Quadrat bringt Herausforderungen, die deine Widerstandsfähigkeit testen. Einschränkungen und Verantwortung wiegen schwer. Begegne Hindernissen als Wachstumschancen.',
        opposition: 'Saturn in der Opposition zeigt Spannungen zwischen Freiheit und Verantwortung. Konflikte zwischen persönlichen Bedürfnissen und Pflichten können auftauchen. Balanciere Verpflichtungen und Autonomie.',
      },
    },
    fr: {
      soleil: {
        trino: 'Le Soleil en trigone illumine votre identité et vitalité. C\'est un jour pour briller, prendre des décisions importantes et exprimer votre authenticité. Votre énergie personnelle est en harmonie avec le cosmos.',
        sextil: 'Le Soleil en sextile apporte des opportunités de croissance personnelle. Des moments de reconnaissance et d\'expression de soi favorisent les relations et les projets créatifs.',
        carre: 'Le Soleil en carré demande attention à votre identité et ego. Évitez les confrontations inutiles et utilisez cette énergie pour renforcer votre confiance en vous à travers des défis constructifs.',
        opposition: 'Le Soleil en opposition révèle des tensions entre vos besoins et ceux des autres. Cherchez l\'équilibre entre donner et recevoir, entre votre identité et les partenariats.',
      },
      lune: {
        trino: 'La Lune en trigone harmonise vos émotions et intuition. Votre monde intérieur est en paix. Fiez-vous à vos sentiments et laissez-vous guider par l\'intuition dans vos décisions.',
        sextil: 'La Lune en sextile facilite la communication émotionnelle. C\'est un jour favorable pour résoudre des questions sentimentales et renforcer les liens familiaux et affectifs.',
        carre: 'La Lune en carré apporte de l\'instabilité émotionnelle. Soyez patient avec vous-même et évitez les réactions impulsives. La tension passagère invite à la réflexion intérieure.',
        opposition: 'La Lune en opposition amplifie les émotions et sensibilités. Des conflits entre vie domestique et professionnelle peuvent surgir. Cherchez l\'harmonie entre vos mondes intérieur et extérieur.',
      },
      mercure: {
        trino: 'Mercure en trigone favorise la communication claire et la pensée lucide. Les idées coulent naturellement. C\'est idéal pour les négociations, études et conversations importantes.',
        sextil: 'Mercure en sextile stimule la curiosité et l\'apprentissage. Bonne énergie pour écrire, étudier et résoudre des problèmes intellectuels avec facilité.',
        carre: 'Mercure en carré avertit des malentendus. Vérifiez les messages avant d\'envoyer et évitez les discussions inutiles. Faites une pause avant de parler.',
        opposition: 'Mercure en opposition apporte des défis dans la communication. Des conflits d\'opinion peuvent surgir. Écoutez plus que vous ne parlez et cherchez des points d\'accord.',
      },
      venus: {
        trino: 'Vénus en trigone harmonise l\'amour et la beauté. Les relations coulent avec douceur. Moment idéal pour exprimer vos sentiments, créer de l\'art et apprécier la beauté.',
        sextil: 'Vénus en sextile apporte des opportunités romantiques et sociales. Connectez-vous avec des personnes qui partagent vos valeurs. La générosité émotionnelle est récompensée.',
        carre: 'Vénus en carré demande des ajustements dans les relations. Des tensions dans les partenariats ou questions de valeur peuvent surgir. Réévaluez ce qui compte vraiment dans l\'amour.',
        opposition: 'Vénus en opposition révèle des déséquilibres entre donner et recevoir. Des questions de dépendance émotionnelle peuvent surgir. Cherchez des relations plus authentiques et équilibrées.',
      },
      mars: {
        trino: 'Mars en trigone canalise l\'énergie de manière productive. Votre détermination et courage sont au maximum. Avancez dans des projets importants avec confiance et direction claire.',
        sextil: 'Mars en sextile offre de l\'énergie contrôlée pour des actions concrètes. Bonne phase pour initier des projets, faire de l\'exercice et transformer les désirs en réalité.',
        carre: 'Mars en carré avertit contre l\'impulsivité. Canalisez l\'énergie de manière constructive et évitez les confrontations inutiles. La patience sera votre alliée.',
        opposition: 'Mars en opposition apporte des tensions entre action et patience. Des conflits de volonté peuvent surgir. Trouvez un juste milieu entre vos désirs et les limites des autres.',
      },
      jupiter: {
        trino: 'Jupiter en trigone étend les opportunités et la chance. Croissance personnelle et professionnelle favorisée. Ayez confiance en l\'optimisme et explorez de nouvelles possibilités avec sagesse.',
        sextil: 'Jupiter en sextile apporte des opportunités d\'apprentissage et d\'expansion. Bonne énergie pour les études, voyages et projets à long terme. La générosité revient multipliée.',
        carre: 'Jupiter en carré avertit contre les excès. Évitez de promettre plus que vous ne pouvez tenir. La modération et la planification minutieuse évitent les déceptions.',
        opposition: 'Jupiter en opposition révèle un conflit entre optimisme et réalité. Des questions éthiques ou philosophiques peuvent surgir. Cherchez l\'équilibre entre idéalisme et practicité.',
      },
      saturne: {
        trino: 'Saturne en trigone apporte structure et discipline. Les efforts passés sont récompensés. Moment de récolter les fruits du travail constant et d\'assumer des responsabilités avec maturité.',
        sextil: 'Saturne en sextile favorise le travail méthodique et la construction de bases solides. Progrès graduel mais sûr. La persévérance apporte des résultats durables.',
        carre: 'Saturne en carré apporte des défis qui testent votre résilience. Limitations et responsabilités pèsent. Affrontez les obstacles comme des opportunités de croissance.',
        opposition: 'Saturne en opposition révèle des tensions entre liberté et responsabilité. Des conflits entre besoins personnels et devoirs peuvent surgir. Équilibrez engagements et autonomie.',
      },
    },
  }
  
  const templatesLang = interpretacoesEspecificas[lang] || interpretacoesEspecificas.pt
  
  const detalhes = aspectos.map(a => {
    const templatesPlaneta = templatesLang[a.planeta1] || templatesLang.sol
    const interpretacao = templatesPlaneta[a.tipo] || `${a.planeta1} e ${a.planeta2} influenciam ${signo}.`
    return interpretacao
  })
  
  const resumos = {
    pt: {
      favoravel: (signo) => `Dia de expansão e realizações para ${signo}. Os trânsitos planetários favorecem seus objetivos. Aproveite as energias cósmicas para avançar com confiança.`,
      desfavoravel: (signo) => `Dia de desafios e reflexão para ${signo}. Os trânsitos pedem cautela e paciência. Use esta energia para fortalecer sua resiliência e reavaliar estratégias.`,
      misto: (signo) => `Dia de contrastes para ${signo}. Energias planetárias mistas pedem equilíbrio. Seja estratégico e adapte-se às circunstâncias com flexibilidade.`,
      estavel: (signo) => `Dia estável e produtivo para ${signo}. Trânsitos planetários equilibrados favorecem a rotina. Foco e organização trazem resultados concretos.`,
    },
  }
  
  const resumosLang = resumos[lang] || resumos.pt
  const fav = aspectosFavoraveis.length
  const desf = aspectosDesfavoraveis.length
  
  let resumo
  if (fav > 0 && desf === 0) {
    resumo = resumosLang.favoravel(signo)
  } else if (fav === 0 && desf > 0) {
    resumo = resumosLang.desfavoravel(signo)
  } else if (fav > 0 && desf > 0) {
    resumo = resumosLang.misto(signo)
  } else {
    resumo = resumosLang.estavel(signo)
  }
  
  return {
    resumo,
    detalhes,
    aspectos: aspectos.map(a => ({
      ...a,
      descricao: a.tipo,
      planetas: `${a.planeta1} - ${a.planeta2}`,
    })),
  }
}

export function gerarHoroscopoDiarioTodosSignos(data, lang = 'pt') {
  const signos = {
    pt: ['Carneiro', 'Touro', 'Gémeos', 'Caranguejo', 'Leão', 'Virgem', 'Balança', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'],
    en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    es: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'],
    it: ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci'],
    de: ['Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau', 'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'],
    fr: ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'],
  }
  
  const signosLang = signos[lang] || signos.en
  const horoscopos = {}
  
  signosLang.forEach(signo => {
    horoscopos[signo] = calcularHoroscopoDiarioRealista(signo, data, null)
  })
  
  return {
    date: data,
    horoscopes: {
      [lang]: horoscopos,
    },
    source: 'swiss-ephemeris',
    generatedAt: new Date().toISOString(),
  }
}