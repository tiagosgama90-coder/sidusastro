import { Compass, Heart, Activity, BookOpen, Moon, Sparkles, Clock } from 'lucide-react'

const FERRAMENTAS_PT = [
  { id: 'bussola', nome: 'Bússola Cósmica 2026', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Radar de Afinidades', sub: 'Sinastria', icon: Heart, premium: true },
  { id: 'numerologia', nome: 'Mapa de Numerologia', sub: 'Caminho de vida', icon: Sparkles, premium: false },
  { id: 'sonhos', nome: 'Interpretação de Sonhos', sub: 'Símbolos e mensagens', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Fluxo Vital', sub: 'Biorritmo', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Horas Iguais', sub: 'Mensagens angélicas', icon: Clock, premium: false },
  { id: 'diario', nome: 'Diário Astral', icon: BookOpen, premium: false },
]

const FERRAMENTAS_EN = [
  { id: 'bussola', nome: 'Cosmic Compass 2026', icon: Compass, premium: true },
  { id: 'sinastria', nome: 'Affinity Radar', sub: 'Synastry', icon: Heart, premium: true },
  { id: 'numerologia', nome: 'Numerology Chart', sub: 'Life path', icon: Sparkles, premium: false },
  { id: 'sonhos', nome: 'Dream Interpretation', sub: 'Symbols & messages', icon: Moon, premium: false },
  { id: 'biorritmo', nome: 'Vital Flow', sub: 'Biorhythm', icon: Activity, premium: false },
  { id: 'horasIguais', nome: 'Mirror Hours', sub: 'Angelic messages', icon: Clock, premium: false },
  { id: 'diario', nome: 'Astral Journal', icon: BookOpen, premium: false },
]

const BENEFICIOS_VIP_PT = [
  'Mapa Astral completo — efemérides, Placidus, PDF profissional + email',
  'Fases da Lua em tempo real no Céu de Hoje',
  'Leituras de Tarot ilimitadas em todos os baralhos',
  'Bússola Cósmica 2026 com previsões mensais',
  'Radar de Afinidades e Sinastria completa',
  'Chat ilimitado com o Oráculo Sírius — astrólogo profissional',
  'Alertas de trânsitos planetários em tempo real',
]

const BENEFICIOS_VIP_EN = [
  'Complete Natal Chart — ephemerides, Placidus, professional PDF + email',
  'Real-time Moon phases in Today\'s Sky',
  'Unlimited Tarot readings across all decks',
  'Cosmic Compass 2026 with monthly forecasts',
  'Affinity Radar and full Synastry',
  'Unlimited chat with Oracle Sirius — professional astrologer',
  'Real-time planetary transit alerts',
]

export function getFerramentas(lang) {
  return lang === 'en' ? FERRAMENTAS_EN : FERRAMENTAS_PT
}

export function getBeneficiosVip(lang) {
  return lang === 'en' ? BENEFICIOS_VIP_EN : BENEFICIOS_VIP_PT
}
