/** Frases curtas Sol/Lua por signo - leitura grátis memorável (1ª frase da essência). */
import { contentForLang } from './i18n/langUtil.js'

const SOL_PT = {
  Carneiro: 'A tua identidade forma-se na acção directa - pensar demasiado paralisa-te; agir cura-te.',
  Touro: 'Constróis a ti mesmo/a tijolo a tijolo - o que dura exige tempo e presença serena.',
  Gémeos: 'A tua identidade é múltipla - és uma constelação de ideias em movimento.',
  Caranguejo: 'Proteges o que amas com tenacidade silenciosa; a casa interior é sagrada.',
  Leão: 'Precisas de palco - a alma expande quando és visto/a com verdade.',
  Virgem: 'Vês o que pode ser melhorado - em ti e no mundo - e isso é dom, não defeito.',
  Balança: 'Não existes plenamente a sós - o espelho do outro completa-te.',
  Escorpião: 'Não toleras superficialidade - a alma exige verdade nua.',
  Sagitário: 'Precisas de horizonte - literal ou metafórico - para respirar.',
  Capricórnio: 'Montas montanhas passo a passo; o tempo é aliado, não inimigo.',
  Aquário: 'Pensas fora do rebanho porque o futuro te chama.',
  Peixes: 'Identidade fluida e compassiva - sentes o que o mundo sente.',
}

const LUA_PT = {
  Carneiro: 'Precisas de agir quando sentes - esperar esgota-te.',
  Touro: 'Segurança sensorial ancora-te - ritmo estável, toque, beleza.',
  Gémeos: 'Processas emoções através da palavra - falar regula o coração.',
  Caranguejo: 'Sentes tudo intensamente - lar e memória são bússola.',
  Leão: 'O coração quer brilhar também na esfera privada.',
  Virgem: 'Regulas emoções através da ordem - rotinas devolvem calma.',
  Balança: 'Equilibras emoções através da relação - a harmonia nutre-te.',
  Escorpião: 'Sentes com intensidade magnética - lealdade absoluta.',
  Sagitário: 'Precisas de liberdade emocional e sentido para expandir.',
  Capricórnio: 'Vulnerabilidade custa; estrutura e metas protegem-te.',
  Aquário: 'Processas emoções intelectualmente - amizade é base afectiva.',
  Peixes: 'Absorves ambientes - fronteiras emocionais porosas, sonhos vívidos.',
}

const SOL_EN = {
  Aries: 'Identity forms through direct action - overthinking paralyses you; action heals you.',
  Taurus: 'You build yourself brick by brick - what endures takes time.',
  Gemini: 'Identity is multiple - you are a constellation of ideas.',
  Cancer: 'You protect what you love with silent tenacity; inner home is sacred.',
  Leo: 'You need a stage - soul expands when seen truthfully.',
  Virgo: 'You see what can improve - in you and the world - and that is gift.',
  Libra: 'You do not fully exist alone - the other\'s mirror completes you.',
  Scorpio: 'You tolerate no superficiality - soul demands naked truth.',
  Sagittarius: 'You need horizon - literal or metaphorical - to breathe.',
  Capricorn: 'You climb mountains step by step; time is ally.',
  Aquarius: 'You think outside the herd because the future calls.',
  Pisces: 'Fluid, compassionate identity - you feel what the world feels.',
}

const LUA_EN = {
  Aries: 'You must act when you feel - waiting drains you.',
  Taurus: 'Sensory security anchors you - stable rhythm, touch, beauty.',
  Gemini: 'You process emotions through words - speaking regulates the heart.',
  Cancer: 'You feel everything intensely - home and memory are compass.',
  Leo: 'Heart wants to shine in private sphere too.',
  Virgo: 'You regulate emotions through order - routines restore calm.',
  Libra: 'You balance emotions through relationship - harmony nourishes you.',
  Scorpio: 'You feel with magnetic intensity - absolute loyalty.',
  Sagittarius: 'You need emotional freedom and meaning to expand.',
  Capricorn: 'Vulnerability costs; structure and goals protect you.',
  Aquarius: 'You process emotions intellectually - friendship is affective base.',
  Pisces: 'You absorb environments - porous boundaries, vivid dreams.',
}

const SOL_ES = {
  Aries: 'Tu identidad se forma en la acción directa - pensar demasiado te paraliza; actuar te cura.',
  Tauro: 'Te construyes ladrillo a ladrillo - lo que perdura exige tiempo y presencia serena.',
  Géminis: 'Tu identidad es múltiple - eres una constelación de ideas en movimiento.',
  Cancer: 'Proteges lo que amas con tenacidad silenciosa; el hogar interior es sagrado.',
  Leo: 'Necesitas un escenario - el alma se expande cuando eres visto con verdad.',
  Virgo: 'Ves lo que puede mejorar - en ti y en el mundo - y eso es don, no defecto.',
  Libra: 'No existes plenamente a solas - el espejo del otro te completa.',
  Escorpio: 'No toleras la superficialidad - el alma exige verdad desnuda.',
  Sagitario: 'Necesitas horizonte - literal o metafórico - para respirar.',
  Capricornio: 'Subes montañas paso a paso; el tiempo es aliado, no enemigo.',
  Acuario: 'Piensas fuera del rebaño porque el futuro te llama.',
  Piscis: 'Identidad fluida y compasiva - sientes lo que el mundo siente.',
}

const LUA_ES = {
  Aries: 'Necesitas actuar cuando sientes - esperar te agota.',
  Tauro: 'La seguridad sensorial te ancla - ritmo estable, tacto, belleza.',
  Géminis: 'Procesas emociones a través de la palabra - hablar regula el corazón.',
  Cancer: 'Sientes todo intensamente - el hogar y la memoria son brújula.',
  Leo: 'El corazón quiere brillar también en la esfera privada.',
  Virgo: 'Regulas emociones a través del orden - las rutinas devuelven calma.',
  Libra: 'Equilibras emociones a través de la relación - la armonía te nutre.',
  Escorpio: 'Sientes con intensidad magnética - lealtad absoluta.',
  Sagitario: 'Necesitas libertad emocional y sentido para expandirte.',
  Capricornio: 'La vulnerabilidad cuesta; la estructura y las metas te protegen.',
  Acuario: 'Procesas emociones intelectualmente - la amistad es base afectiva.',
  Piscis: 'Absorbes ambientes - fronteras emocionales porosas, sueños vívidos.',
}

const SOL_IT = {
  Ariete: 'La tua identità si forma nell\'azione diretta - pensare troppo ti paralizza; agire ti guarisce.',
  Toro: 'Ti costruisci mattone su mattone - ciò che dura richiede tempo e presenza serena.',
  Gemelli: 'La tua identità è multipla - sei una costellazione di idee in movimento.',
  Cancro: 'Proteggi ciò che ami con tenacia silenziosa; la casa interiore è sacra.',
  Leone: 'Hai bisogno di un palcoscenico - l\'anima si espande quando sei visto con verità.',
  Vergine: 'Vedi cosa può migliorare - in te e nel mondo - e questo è dono, non difetto.',
  Bilancia: 'Non esisti pienamente da solo - lo specchio dell\'altro ti completa.',
  Scorpione: 'Non tolleri la superficialità - l\'anima esige verità nuda.',
  Sagittario: 'Hai bisogno di orizzonte - letterale o metaforico - per respirare.',
  Capricorno: 'Sali montagne passo dopo passo; il tempo è alleato, non nemico.',
  Acquario: 'Pensi fuori dal gregge perché il futuro ti chiama.',
  Pesci: 'Identità fluida e compassionevole - senti ciò che il mondo sente.',
}

const LUA_IT = {
  Ariete: 'Devi agire quando senti - aspettare ti esaurisce.',
  Toro: 'La sicurezza sensoriale ti ancora - ritmo stabile, tatto, bellezza.',
  Gemelli: 'Elabori le emozioni attraverso le parole - parlare regola il cuore.',
  Cancro: 'Senti tutto intensamente - casa e memoria sono bussola.',
  Leone: 'Il cuore vuole brillare anche nella sfera privata.',
  Vergine: 'Regoli le emozioni attraverso l\'ordine - le routine restituiscono calma.',
  Bilancia: 'Bilanci le emozioni attraverso la relazione - l\'armonia ti nutre.',
  Scorpione: 'Senti con intensità magnetica - lealtà assoluta.',
  Sagittario: 'Hai bisogno di libertà emotiva e significato per espanderti.',
  Capricorno: 'La vulnerabilità costa; struttura e obiettivi ti proteggono.',
  Acquario: 'Elabori le emozioni intellettualmente - l\'amicizia è base affettiva.',
  Pesci: 'Assorbi gli ambienti - confini emotivi porosi, sogni vividi.',
}

const SOL_DE = {
  Widder: 'Deine Identität formt sich durch direktes Handeln - zu viel Nachdenken lähmt dich; Handeln heilt dich.',
  Stier: 'Du baust dich Stein für Stein auf - was Bestand hat, braucht Zeit und stille Präsenz.',
  Zwillinge: 'Deine Identität ist vielfältig - du bist eine Konstellation von Ideen in Bewegung.',
  Krebs: 'Du beschützt, was du liebst, mit stiller Zähigkeit; das innere Zuhause ist heilig.',
  Löwe: 'Du brauchst eine Bühne - die Seele expandiert, wenn du wahrhaftig gesehen wirst.',
  Jungfrau: 'Du siehst, was verbessert werden kann - in dir und der Welt - und das ist Gabe, nicht Makel.',
  Waage: 'Du existierst nicht vollständig allein - der Spiegel des anderen vollendet dich.',
  Skorpion: 'Du erträgst keine Oberflächlichkeit - die Seele verlangt nackte Wahrheit.',
  Schütze: 'Du brauchst Horizont - wörtlich oder metaphorisch - um zu atmen.',
  Steinbock: 'Du steigst Berge Schritt für Schritt; die Zeit ist Verbündeter, nicht Feind.',
  Wassermann: 'Du denkst außerhalb der Herde, weil die Zukunft ruft.',
  Fische: 'Fließende, mitfühlende Identität - du fühlst, was die Welt fühlt.',
}

const LUA_DE = {
  Widder: 'Du musst handeln, wenn du fühlst - Warten zehrt an dir.',
  Stier: 'Sinnliche Sicherheit verankert dich - stabiler Rhythmus, Berührung, Schönheit.',
  Zwillinge: 'Du verarbeitest Emotionen durch Worte - Sprechen reguliert das Herz.',
  Krebs: 'Du fühlst alles intensiv - Zuhause und Erinnerung sind Kompass.',
  Löwe: 'Das Herz will auch in der privaten Sphäre leuchten.',
  Jungfrau: 'Du regulierst Emotionen durch Ordnung - Routinen geben Ruhe zurück.',
  Waage: 'Du balancierst Emotionen durch Beziehung - Harmonie nährt dich.',
  Skorpion: 'Du fühlst mit magnetischer Intensität - absolute Loyalität.',
  Schütze: 'Du brauchst emotionale Freiheit und Sinn, um dich zu entfalten.',
  Steinbock: 'Verletzlichkeit kostet; Struktur und Ziele schützen dich.',
  Wassermann: 'Du verarbeitest Emotionen intellektuell - Freundschaft ist affektive Basis.',
  Fische: 'Du nimmst Umgebungen auf - poröse Grenzen, lebhafte Träume.',
}

const SOL_FR = {
  Bélier: 'Ton identité se forme dans l\'action directe - trop penser te paralyse ; agir te guérit.',
  Taureau: 'Tu te construis brique par brique - ce qui dure exige du temps et une présence sereine.',
  Gémeaux: 'Ton identité est multiple - tu es une constellation d\'idées en mouvement.',
  Cancer: 'Tu protèges ce que tu aimes avec une ténacité silencieuse ; le foyer intérieur est sacré.',
  Lion: 'Tu as besoin d\'une scène - l\'âme s\'élargit quand tu es vu avec vérité.',
  Vierge: 'Tu vois ce qui peut être amélioré - en toi et dans le monde - et c\'est un don, pas un défaut.',
  Balance: 'Tu n\'existes pas pleinement seul - le miroir de l\'autre te complète.',
  Scorpion: 'Tu ne supportes pas la superficialité - l\'âme exige la vérité nue.',
  Sagittaire: 'Tu as besoin d\'horizon - littéral ou métaphorique - pour respirer.',
  Capricorne: 'Tu gravisses les montagnes pas à pas ; le temps est allié, pas ennemi.',
  Verseau: 'Tu penses en dehors du troupeau parce que le futur t\'appelle.',
  Poissons: 'Identité fluide et compatissante - tu ressens ce que le monde ressent.',
}

const LUA_FR = {
  Bélier: 'Tu dois agir quand tu ressens - attendre t\'épuise.',
  Taureau: 'La sécurité sensorielle t\'ancre - rythme stable, toucher, beauté.',
  Gémeaux: 'Tu traites les émotions par les mots - parler régule le cœur.',
  Cancer: 'Tu ressens tout intensément - le foyer et la mémoire sont boussole.',
  Lion: 'Le cœur veut briller aussi dans la sphère privée.',
  Vierge: 'Tu régules les émotions par l\'ordre - les routines rendent le calme.',
  Balance: 'Tu équilibres les émotions par la relation - l\'harmonie te nourrit.',
  Scorpion: 'Tu ressens avec une intensité magnétique - loyauté absolue.',
  Sagittaire: 'Tu as besoin de liberté émotionnelle et de sens pour t\'épanouir.',
  Capricorne: 'La vulnérabilité coûte ; la structure et les objectifs te protègent.',
  Verseau: 'Tu traites les émotions intellectuellement - l\'amitié est base affective.',
  Poissons: 'Tu absorbes les environnements - frontières poreuses, rêves vifs.',
}

const SIGNO_MAP = {
  Áries: 'Carneiro', Aries: 'Carneiro', Ariete: 'Carneiro', Widder: 'Carneiro', Bélier: 'Carneiro',
  Tauro: 'Touro', Taurus: 'Touro', Stier: 'Touro', Taureau: 'Touro',
  Géminis: 'Gémeos', Gemini: 'Gémeos', Gemelli: 'Gémeos', Zwillinge: 'Gémeos', Gémeaux: 'Gémeos',
  Cáncer: 'Caranguejo', Cancer: 'Caranguejo', Cancro: 'Caranguejo', Krebs: 'Caranguejo',
  Leo: 'Leão', León: 'Leão', Leone: 'Leão', Löwe: 'Leão', Lion: 'Leão',
  Virgo: 'Virgem', Vergine: 'Virgem', Jungfrau: 'Virgem', Vierge: 'Virgem',
  Libra: 'Balança', Bilancia: 'Balança', Waage: 'Balança', Balance: 'Balança',
  Escorpio: 'Escorpião', Scorpio: 'Escorpião', Scorpione: 'Escorpião', Skorpion: 'Escorpião', Scorpion: 'Escorpião',
  Sagitario: 'Sagitário', Sagittarius: 'Sagitário', Sagittario: 'Sagitário', Schütze: 'Sagitário', Sagittaire: 'Sagitário',
  Capricornio: 'Capricórnio', Capricorn: 'Capricórnio', Capricorno: 'Capricórnio', Steinbock: 'Capricórnio', Capricorne: 'Capricórnio',
  Acuario: 'Aquário', Aquarius: 'Aquário', Acquario: 'Aquário', Wassermann: 'Aquário', Verseau: 'Aquário',
  Piscis: 'Peixes', Pisces: 'Peixes', Pesci: 'Peixes', Fische: 'Peixes', Poissons: 'Peixes',
}

function normSigno(nome) {
  if (!nome) return null
  return SIGNO_MAP[nome] || nome
}

function pickPack(lang) {
  switch (lang) {
    case 'pt': return { sol: SOL_PT, lua: LUA_PT }
    case 'en': return { sol: SOL_EN, lua: LUA_EN }
    case 'es': return { sol: SOL_ES, lua: LUA_ES }
    case 'it': return { sol: SOL_IT, lua: LUA_IT }
    case 'de': return { sol: SOL_DE, lua: LUA_DE }
    case 'fr': return { sol: SOL_FR, lua: LUA_FR }
    default: return { sol: SOL_EN, lua: LUA_EN }
  }
}

/** Índice determinístico da carta do dia (0–77, baralho completo). */
export function indiceCartaDoDia(date = new Date()) {
  const iso = date.toISOString().slice(0, 10)
  const [ano, mes, dia] = iso.split('-').map(Number)
  return (ano * 1000 + (mes - 1) * 31 + dia) % 78
}

export function fraseSol(signoNome, lang = 'pt') {
  const key = normSigno(signoNome)
  const { sol } = pickPack(lang)
  return sol[key] || sol.Carneiro || sol.Aries || ''
}

export function fraseLua(signoNome, lang = 'pt') {
  const key = normSigno(signoNome)
  const { lua } = pickPack(lang)
  return lua[key] || lua.Caranguejo || lua.Cancer || ''
}

/** Frase do dia variável (rotação por data + signo). */
export function frasePersonalizadaDia(tipo, signoNome, lang = 'pt') {
  const base = tipo === 'lua' ? fraseLua(signoNome, lang) : fraseSol(signoNome, lang)
  if (!base) return ''
  const iso = new Date().toISOString().slice(0, 10)
  const variantes = contentForLang(lang, {
    pt: ['Hoje: ', 'O cosmos diz: ', 'Para ti hoje: '],
    en: ['Today: ', 'The cosmos says: ', 'For you today: '],
    es: ['Hoy: ', 'El cosmos dice: ', 'Para ti hoy: '],
    it: ['Oggi: ', 'Il cosmo dice: ', 'Per te oggi: '],
    de: ['Heute: ', 'Der Kosmos sagt: ', 'Für dich heute: '],
    fr: ["Aujourd'hui : ", 'Le cosmos dit : ', "Pour toi aujourd'hui : "],
  })
  const idx = (iso.charCodeAt(8) + (signoNome?.length || 0)) % variantes.length
  return `${variantes[idx]}${base}`
}
