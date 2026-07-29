import { Compass, Heart, Activity, BookOpen, Moon, Sparkles, Clock } from 'lucide-react'
import { contentForLang } from './langUtil.js'

const FERRAMENTAS_PT = [
  { id: 'bussola', nome: 'Bússola Cósmica', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar de Afinidades', sub: 'Prévia grátis · Sinastria Pro', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerologia', sub: 'Vibração espiritual do nome', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Interpretação de Sonhos', sub: 'Mimo de boas-vindas grátis', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Fluxo Vital', sub: 'Biorritmo', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Horas Iguais', sub: 'Mensagens angélicas', icon: Clock, premium: false },
  { id: 'diario', nome: 'Diário Astral', icon: BookOpen, premium: false },
]

const FERRAMENTAS_EN = [
  { id: 'bussola', nome: 'Cosmic Compass', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Affinity Radar', sub: 'Free preview · Pro synastry', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerology', sub: 'Spiritual name vibration', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Dream Interpretation', sub: 'Symbols & messages', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Vital Flow', sub: 'Biorhythm', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Mirror Hours', sub: 'Angelic messages', icon: Clock, premium: false },
  { id: 'diario', nome: 'Astral Journal', icon: BookOpen, premium: false },
]

const FERRAMENTAS_ES = [
  { id: 'bussola', nome: 'Brújula Cósmica', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar de Afinidades', sub: 'Vista previa gratis · Sinastría Pro', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerología', sub: 'Vibración espiritual del nombre', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Interpretación de Sueños', sub: 'Símbolos y mensajes', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Flujo Vital', sub: 'Biorritmo', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Horas Espejo', sub: 'Mensajes angélicos', icon: Clock, premium: false },
  { id: 'diario', nome: 'Diario Astral', icon: BookOpen, premium: false },
]

const FERRAMENTAS_IT = [
  { id: 'bussola', nome: 'Bussola Cosmica', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar delle Affinità', sub: 'Anteprima gratis · Sinastria Pro', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerologia', sub: 'Vibrazione spirituale del nome', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Interpretazione dei Sogni', sub: 'Simboli e messaggi', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Flusso Vitale', sub: 'Bioritmo', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Ore Specchio', sub: 'Messaggi angelici', icon: Clock, premium: false },
  { id: 'diario', nome: 'Diario Astrale', icon: BookOpen, premium: false },
]

const FERRAMENTAS_DE = [
  { id: 'bussola', nome: 'Kosmischer Kompass', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Affinitäts-Radar', sub: 'Kostenlose Vorschau · Pro-Synastrie', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerologie', sub: 'Spirituelle Namensschwingung', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Traumdeutung', sub: 'Symbole & Botschaften', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Vitaler Fluss', sub: 'Biorhythmus', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Spiegelstunden', sub: 'Engelsbotschaften', icon: Clock, premium: false },
  { id: 'diario', nome: 'Astraltagebuch', icon: BookOpen, premium: false },
]

const FERRAMENTAS_FR = [
  { id: 'bussola', nome: 'Boussole Cosmique', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar d\'Affinités', sub: 'Aperçu gratuit · Synastrie Pro', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numérologie', sub: 'Vibration spirituelle du nom', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Interprétation des Rêves', sub: 'Symboles et messages', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Flux Vital', sub: 'Biorythme', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Heures Miroirs', sub: 'Messages angéliques', icon: Clock, premium: false },
  { id: 'diario', nome: 'Journal Astral', icon: BookOpen, premium: false },
]

const BENEFICIOS_VIP_PT = [
  'Mapa Astral completo - efemérides Swiss Ephemeris, casas Placidus, PDF profissional enviado por email',
  'Céu de Hoje com fases da Lua em tempo real + Rádio do Céu ao Vivo (posições planetárias)',
  'Mapa de Numerologia completo - Caminho de Vida, Ano/Mês Pessoal, ciclos de vida e vibração de cada letra do nome',
  'Leituras de Tarot ilimitadas em todos os baralhos (Rider-Waite, Lenormand, Oracle…)',
  'Bússola Cósmica - trânsitos reais, eclipses por casa natal e calendário anual personalizado',
  'Radar de Afinidades - sinastria completa com radar visual, 4 pilares, laço cármico e mapa composto',
  'Chat ilimitado com o Oráculo Sidus - astrólogo profissional ligado ao teu mapa natal',
]

const BENEFICIOS_VIP_EN = [
  'Complete Natal Chart - Swiss Ephemeris, Placidus houses, professional PDF by email',
  'Today\'s Sky with real-time Moon phases + Live Sky Radio (planetary positions)',
  'Full Numerology Chart - Life Path, Personal Year/Month, life cycles and letter vibrations',
  'Unlimited Tarot readings across all decks',
  'Cosmic Compass - real transits, eclipses by natal house and personalized annual calendar',
  'Affinity Radar - full synastry with visual radar, 4 pillars, karmic bond and composite chart',
  'Unlimited chat with Oracle Sidus - professional astrologer linked to your natal chart',
]

const BENEFICIOS_VIP_ES = [
  'Carta Astral completa: Swiss Ephemeris, casas Placidus, PDF profesional por email',
  'Cielo de Hoy con fases lunares en tiempo real + Radio del Cielo en vivo',
  'Mapa de Numerología completo: Camino de Vida, Año/Mes Personal, ciclos y vibración de letras',
  'Lecturas de Tarot ilimitadas en todos los mazos',
  'Brújula Cósmica: tránsitos reales, eclipses por casa natal y calendario anual personalizado',
  'Radar de Afinidades: sinastría completa con radar visual, 4 pilares y carta compuesta',
  'Chat ilimitado con el Oráculo Sidus - astrólogo profesional ligado a tu carta natal',
]

const BENEFICIOS_VIP_IT = [
  'Carta Natale completa: Swiss Ephemeris, case Placidus, PDF professionale via email',
  'Cielo di Oggi con fasi lunari in tempo reale + Radio del Cielo in diretta',
  'Mappa di Numerologia completa: Percorso di Vita, Anno/Mese Personale, cicli e vibrazione delle lettere',
  'Letture Tarot illimitate su tutti i mazzi',
  'Bussola Cosmica: transiti reali, eclissi per casa natale e calendario annuale personalizzato',
  'Radar delle Affinità: sinastria completa con radar visivo, 4 pilastri e carta composita',
  'Chat illimitata con l\'Oracolo Sidus - astrologo professionista collegato alla tua carta natale',
]

const BENEFICIOS_VIP_DE = [
  'Vollständiges Geburtshoroskop: Swiss Ephemeris, Placidus-Häuser, professionelles PDF per E-Mail',
  'Himmel von Heute mit Echtzeit-Mondphasen + Live-Himmel-Radio',
  'Vollständige Numerologie-Karte: Lebensweg, Persönliches Jahr/Monat, Zyklen und Buchstabenvibrationen',
  'Unbegrenzte Tarot-Lesungen in allen Decks',
  'Kosmischer Kompass: echte Transite, Finsternisse nach Geburtshaus und persönlicher Jahreskalender',
  'Affinitäts-Radar: vollständige Synastrie mit visuellem Radar, 4 Säulen und Kompositkarte',
  'Unbegrenzter Chat mit Orakel Sidus - professioneller Astrologe mit deinem Geburtshoroskop',
]

const BENEFICIOS_VIP_FR = [
  'Carte Astrale complète : Swiss Ephemeris, maisons Placidus, PDF professionnel par email',
  'Ciel d\'Aujourd\'hui avec phases lunaires en temps réel + Radio du Ciel en direct',
  'Carte de Numérologie complète : Chemin de Vie, Année/Mois Personnel, cycles et vibration des lettres',
  'Lectures Tarot illimitées sur tous les jeux',
  'Boussole Cosmique : transits réels, éclipses par maison natale et calendrier annuel personnalisé',
  'Radar d\'Affinités : synastrie complète avec radar visuel, 4 piliers et carte composite',
  'Chat illimité avec l\'Oracle Sidus - astrologue professionnel lié à votre thème natal',
]

export function getFerramentas(lang) {
  return contentForLang(lang, {
    pt: FERRAMENTAS_PT, en: FERRAMENTAS_EN, es: FERRAMENTAS_ES,
    it: FERRAMENTAS_IT, de: FERRAMENTAS_DE, fr: FERRAMENTAS_FR,
  }) || FERRAMENTAS_EN
}

export function getBeneficiosVip(lang) {
  return contentForLang(lang, {
    pt: BENEFICIOS_VIP_PT, en: BENEFICIOS_VIP_EN, es: BENEFICIOS_VIP_ES,
    it: BENEFICIOS_VIP_IT, de: BENEFICIOS_VIP_DE, fr: BENEFICIOS_VIP_FR,
  }) || BENEFICIOS_VIP_EN
}
