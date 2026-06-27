import { Compass, Heart, Activity, BookOpen, Moon, Sparkles, Clock } from 'lucide-react'

const FERRAMENTAS_PT = [
  { id: 'bussola', nome: 'Bússola Cósmica 2026', navNome: 'Bússola', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar de Afinidades', navNome: 'Sinastria', sub: 'Prévia grátis · Sinastria Pro', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Mapa de Numerologia', navNome: 'Numerologia', sub: 'Vibração espiritual do nome', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Interpretação de Sonhos', navNome: 'Sonhos', sub: 'Símbolos e mensagens', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Fluxo Vital', navNome: 'Biorritmo', sub: 'Biorritmo', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Horas Iguais', navNome: 'Horas', sub: 'Mensagens angélicas', icon: Clock, premium: false },
  { id: 'diario', nome: 'Diário Astral', navNome: 'Diário', icon: BookOpen, premium: false },
]

const FERRAMENTAS_EN = [
  { id: 'bussola', nome: 'Cosmic Compass 2026', navNome: 'Compass', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Affinity Radar', navNome: 'Synastry', sub: 'Free preview · Pro synastry', icon: Heart, premium: false },
  { id: 'numerologia', nome: 'Numerology Chart', navNome: 'Numbers', sub: 'Spiritual name vibration', icon: Sparkles, premium: true },
  { id: 'sonhos', nome: 'Dream Interpretation', navNome: 'Dreams', sub: 'Symbols & messages', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Vital Flow', navNome: 'Biorhythm', sub: 'Biorhythm', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Mirror Hours', navNome: 'Hours', sub: 'Angelic messages', icon: Clock, premium: false },
  { id: 'diario', nome: 'Astral Journal', navNome: 'Journal', icon: BookOpen, premium: false },
]

const BENEFICIOS_VIP_PT = [
  'Mapa Astral completo — efemérides, Placidus, PDF profissional + email',
  'Fases da Lua em tempo real no Céu de Hoje',
  'Mapa de Numerologia com vibração espiritual do nome',
  'Leituras de Tarot ilimitadas em todos os baralhos',
  'Bússola Cósmica 2026 com previsões mensais',
  'Radar de Afinidades e Sinastria completa',
  'Chat ilimitado com o Oráculo Sidus — astrólogo profissional',
  'Alertas de trânsitos planetários em tempo real',
]

const BENEFICIOS_VIP_EN = [
  'Complete Natal Chart — ephemerides, Placidus, professional PDF + email',
  'Real-time Moon phases in Today\'s Sky',
  'Numerology Chart with spiritual name vibration',
  'Unlimited Tarot readings across all decks',
  'Cosmic Compass 2026 with monthly forecasts',
  'Affinity Radar and full Synastry',
  'Unlimited chat with Oracle Sidus — professional astrologer',
  'Real-time planetary transit alerts',
]

export function getFerramentas(lang) {
  return lang === 'en' ? FERRAMENTAS_EN : FERRAMENTAS_PT
}

export function getBeneficiosVip(lang) {
  return lang === 'en' ? BENEFICIOS_VIP_EN : BENEFICIOS_VIP_PT
}
