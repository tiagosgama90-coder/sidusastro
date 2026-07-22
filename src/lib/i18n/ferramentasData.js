import { Compass, Heart, Activity, BookOpen, Moon, Sparkles, Clock } from 'lucide-react'
import { contentForLang } from './langUtil.js'

const FERRAMENTAS_PT = [
  { id: 'bussola', nome: 'Bússola Cósmica', sub: 'Trânsitos reais · Ptolomeu · Robert Hand', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar de Afinidades', sub: 'Prévia grátis · Sinastria Pro', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerologia', sub: 'Vibração espiritual do nome', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Interpretação de Sonhos', sub: 'Símbolos e mensagens', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Fluxo Vital', sub: 'Biorritmo', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Horas Iguais', sub: 'Mensagens angélicas', icon: Clock, premium: false },
  { id: 'diario', nome: 'Diário Astral', icon: BookOpen, premium: false },
]

const FERRAMENTAS_EN = [
  { id: 'bussola', nome: 'Cosmic Compass', sub: 'Real transits · Ptolemy · Robert Hand', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Affinity Radar', sub: 'Free preview · Pro synastry', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerology', sub: 'Spiritual name vibration', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Dream Interpretation', sub: 'Symbols & messages', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Vital Flow', sub: 'Biorhythm', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Mirror Hours', sub: 'Angelic messages', icon: Clock, premium: false },
  { id: 'diario', nome: 'Astral Journal', icon: BookOpen, premium: false },
]

const FERRAMENTAS_ES = [
  { id: 'bussola', nome: 'Brújula Cósmica', sub: 'Tránsitos reales · Ptolomeo · Robert Hand', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar de Afinidades', sub: 'Vista previa gratis · Sinastría Pro', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerología', sub: 'Vibración espiritual del nombre', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Interpretación de Sueños', sub: 'Símbolos y mensajes', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Flujo Vital', sub: 'Biorritmo', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Horas Espejo', sub: 'Mensajes angélicos', icon: Clock, premium: false },
  { id: 'diario', nome: 'Diario Astral', icon: BookOpen, premium: false },
]

const FERRAMENTAS_IT = [
  { id: 'bussola', nome: 'Bussola Cosmica', sub: 'Transiti reali · Tolomeo · Robert Hand', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar delle Affinità', sub: 'Anteprima gratis · Sinastria Pro', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerologia', sub: 'Vibrazione spirituale del nome', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Interpretazione dei Sogni', sub: 'Simboli e messaggi', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Flusso Vitale', sub: 'Bioritmo', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Ore Specchio', sub: 'Messaggi angelici', icon: Clock, premium: false },
  { id: 'diario', nome: 'Diario Astrale', icon: BookOpen, premium: false },
]

const FERRAMENTAS_DE = [
  { id: 'bussola', nome: 'Kosmischer Kompass', sub: 'Echte Transite · Ptolemäus · Robert Hand', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Affinitäts-Radar', sub: 'Kostenlose Vorschau · Pro-Synastrie', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerologie', sub: 'Spirituelle Namensschwingung', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Traumdeutung', sub: 'Symbole & Botschaften', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Vitaler Fluss', sub: 'Biorhythmus', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Spiegelstunden', sub: 'Engelsbotschaften', icon: Clock, premium: false },
  { id: 'diario', nome: 'Astraltagebuch', icon: BookOpen, premium: false },
]

const FERRAMENTAS_FR = [
  { id: 'bussola', nome: 'Boussole Cosmique', sub: 'Transits réels · Ptolémée · Robert Hand', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar d\'Affinités', sub: 'Aperçu gratuit · Synastrie Pro', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numérologie', sub: 'Vibration spirituelle du nom', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Interprétation des Rêves', sub: 'Symboles et messages', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Flux Vital', sub: 'Biorythme', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Heures Miroirs', sub: 'Messages angéliques', icon: Clock, premium: false },
  { id: 'diario', nome: 'Journal Astral', icon: BookOpen, premium: false },
]

const BENEFICIOS_VIP_PT = [
  'Mapa Astral completo - efemérides, Placidus, PDF profissional + email',
  'Fases da Lua em tempo real no Céu de Hoje',
  'Mapa de Numerologia com vibração espiritual do nome',
  'Leituras de Tarot ilimitadas em todos os baralhos',
  'Bússola Cósmica com trânsitos reais, eclipses por casa e interpretação Robert Hand',
  'Radar de Afinidades e Sinastria completa',
  'Chat ilimitado com o Oráculo Sidus - astrólogo profissional',
  'Alertas de trânsitos planetários em tempo real',
]

const BENEFICIOS_VIP_EN = [
  'Complete Natal Chart - ephemerides, Placidus, professional PDF + email',
  'Real-time Moon phases in Today\'s Sky',
  'Numerology Chart with spiritual name vibration',
  'Unlimited Tarot readings across all decks',
  'Cosmic Compass with real transits, house eclipses and Robert Hand interpretation',
  'Affinity Radar and full Synastry',
  'Unlimited chat with Oracle Sidus - professional astrologer',
  'Real-time planetary transit alerts',
]

const BENEFICIOS_VIP_ES = [
  'Carta Astral completa: efemérides, Placidus, PDF profesional + email',
  'Fases lunares en tiempo real en el Cielo de Hoy',
  'Mapa de Numerología con vibración espiritual del nombre',
  'Lecturas de Tarot ilimitadas en todos los mazos',
  'Brújula Cósmica con tránsitos reales, eclipses por casa e interpretación Robert Hand',
  'Radar de Afinidades y Sinastría completa',
  'Chat ilimitado con el Oráculo Sidus - astrólogo profesional',
  'Alertas de tránsitos planetarios en tiempo real',
]

const BENEFICIOS_VIP_IT = [
  'Carta Natale completa: effemeridi, Placidus, PDF professionale + email',
  'Fasi lunari in tempo reale nel Cielo di Oggi',
  'Mappa di Numerologia con vibrazione spirituale del nome',
  'Letture Tarot illimitate su tutti i mazzi',
  'Bussola Cosmica con transiti reali, eclissi per casa e interpretazione Robert Hand',
  'Radar delle Affinità e Sinastria completa',
  'Chat illimitata con l\'Oracolo Sidus - astrologo professionista',
  'Avvisi sui transiti planetari in tempo reale',
]

const BENEFICIOS_VIP_DE = [
  'Vollständiges Geburtshoroskop - Ephemeriden, Placidus, professionelles PDF + E-Mail',
  'Mondphasen in Echtzeit im Himmel von Heute',
  'Numerologie-Karte mit spiritueller Namensschwingung',
  'Unbegrenzte Tarot-Lesungen in allen Decks',
  'Kosmischer Kompass mit echten Transiten, Haus-Finsternissen und Robert-Hand-Deutung',
  'Affinitäts-Radar und vollständige Synastrie',
  'Unbegrenzter Chat mit Orakel Sidus - professioneller Astrologe',
  'Echtzeit-Warnungen bei Planetentransiten',
]

const BENEFICIOS_VIP_FR = [
  'Carte Astrale complète - éphémérides, Placidus, PDF professionnel + email',
  'Phases lunaires en temps réel dans le Ciel d\'Aujourd\'hui',
  'Carte de Numérologie avec vibration spirituelle du nom',
  'Lectures Tarot illimitées sur tous les jeux',
  'Boussole Cosmique avec transits réels, éclipses par maison et interprétation Robert Hand',
  'Radar d\'Affinités et Synastrie complète',
  'Chat illimité avec l\'Oracle Sidus - astrologue professionnel',
  'Alertes de transits planétaires en temps réel',
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
