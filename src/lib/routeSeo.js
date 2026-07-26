/** Meta title/description por rota e idioma (SEO indexável no cliente). */
import { PASSO_TO_PATH } from './routes.js'
import { applySocialShareMeta } from './socialShare.js'

const SITE = 'Sidusastro'
const BASE_URL = 'https://sidusastro.com'

const SEO = {
  login: {
    pt: { title: 'Mapa Astral Grátis · Login', description: 'Calcula o teu mapa astral com Swiss Ephemeris. Tarot, Chat Oráculo e horóscopo personalizado ao teu Sol, Lua e Ascendente.' },
    en: { title: 'Free Natal Chart · Sign In', description: 'Calculate your birth chart with Swiss Ephemeris. Tarot, Chat Oracle and horoscope tailored to your Sun, Moon and Ascendant.' },
    es: { title: 'Carta Natal Gratis · Entrar', description: 'Calcula tu carta natal con Swiss Ephemeris. Tarot, Chat Oráculo y horóscopo personalizado a tu Sol, Luna y Ascendente.' },
    it: { title: 'Tema Natale Gratis · Accedi', description: 'Calcola il tuo tema natale con Swiss Ephemeris. Tarocchi, Chat Oracolo e oroscopo personalizzato.' },
    de: { title: 'Gratis Geburtshoroskop · Anmelden', description: 'Berechne dein Geburtshoroskop mit Swiss Ephemeris. Tarot, Chat-Orakel und personalisiertes Horoskop.' },
    fr: { title: 'Thème Natal Gratuit · Connexion', description: 'Calcule ton thème natal avec Swiss Ephemeris. Tarot, Chat Oráculo et horoscope personnalisé.' },
  },
  home: {
    pt: { title: 'Horóscopo do Dia · Início', description: 'O teu céu em tempo real: fases da Lua, trânsitos, carta do dia e leitura personalizada ao teu mapa natal.' },
    en: { title: 'Daily Horoscope · Home', description: 'Your sky in real time: moon phases, transits, daily card and reading tailored to your natal chart.' },
    es: { title: 'Horóscopo del Día · Inicio', description: 'Tu cielo en tiempo real: fases lunares, tránsitos, carta del día y lectura personalizada.' },
    it: { title: 'Oroscopo del Giorno · Home', description: 'Il tuo cielo in tempo reale: fasi lunari, transiti, carta del giorno e lettura personalizzata.' },
    de: { title: 'Tageshoroskop · Start', description: 'Dein Himmel in Echtzeit: Mondphasen, Transite, Tageskarte und personalisierte Deutung.' },
    fr: { title: 'Horoscope du Jour · Accueil', description: 'Ton ciel en temps réel : phases lunaires, transits, carte du jour et lecture personnalisée.' },
  },
  mapa: {
    pt: { title: 'Mapa Astral Completo · PDF', description: 'Mapa natal profissional: Sol, Lua, Ascendente, 10 planetas, casas Placidus, aspectos e relatório PDF interpretado.' },
    en: { title: 'Full Natal Chart · PDF', description: 'Professional birth chart: Sun, Moon, Ascendant, 10 planets, Placidus houses, aspects and interpreted PDF report.' },
    es: { title: 'Carta Natal Completa · PDF', description: 'Carta natal profesional: Sol, Luna, Ascendente, 10 planetas, casas Placidus, aspectos e informe PDF.' },
    it: { title: 'Tema Natale Completo · PDF', description: 'Tema natale professionale: Sole, Luna, Ascendente, 10 pianeti, case Placidus e report PDF.' },
    de: { title: 'Vollständiges Geburtshoroskop · PDF', description: 'Professionelles Horoskop: Sonne, Mond, Aszendent, 10 Planeten, Placidus-Häuser und PDF-Bericht.' },
    fr: { title: 'Thème Natal Complet · PDF', description: 'Thème natal professionnel : Soleil, Lune, Ascendant, 10 planètes, maisons Placidus et rapport PDF.' },
  },
  tarot: {
    pt: { title: 'Tarot Online · Leitura Diária', description: 'Tarot online gratuito e leituras profundas. Arcanos Maiores personalizados ao teu mapa astral.' },
    en: { title: 'Online Tarot · Daily Reading', description: 'Free online tarot and deep readings. Major Arcana personalised to your birth chart.' },
    es: { title: 'Tarot Online · Lectura Diaria', description: 'Tarot online gratis y lecturas profundas. Arcanos Mayores personalizados a tu carta natal.' },
    it: { title: 'Tarocchi Online · Lettura Giornaliera', description: 'Tarocchi online gratuiti e letture profonde personalizzate al tuo tema natale.' },
    de: { title: 'Online Tarot · Tageslegung', description: 'Kostenloses Online-Tarot und tiefe Legungen personalisiert zu deinem Horoskop.' },
    fr: { title: 'Tarot en Ligne · Tirage du Jour', description: 'Tarot en ligne gratuit et tirages profonds personnalisés à ton thème natal.' },
  },
  ferramentas: {
    pt: { title: 'Ferramentas Astrológicas', description: 'Sinastria, numerologia, biorritmo, horas iguais, sonhos e bússola cósmica - tudo ligado ao teu mapa.' },
    en: { title: 'Astrology Tools', description: 'Synastry, numerology, biorhythm, angel numbers, dreams and cosmic compass - all linked to your chart.' },
    es: { title: 'Herramientas Astrológicas', description: 'Sinastría, numerología, biorritmo, horas iguales, sueños y brújula cósmica.' },
    it: { title: 'Strumenti Astrologici', description: 'Sinastria, numerologia, bioritmo, ore uguali, sogni e bussola cosmica.' },
    de: { title: 'Astrologische Werkzeuge', description: 'Synastrie, Numerologie, Biorhythmus, Engelszahlen, Träume und kosmischer Kompass.' },
    fr: { title: 'Outils Astrologiques', description: 'Synastrie, numérologie, biorhythme, heures miroirs, rêves et boussole cosmique.' },
  },
  chat: {
    pt: { title: 'Chat Oráculo', description: 'Chat de orientação astrológica personalizada ao teu mapa - amor, carreira e trânsitos.' },
    en: { title: 'Chat Oracle', description: 'Astrological guidance chat personalised to your natal chart - love, career and transits.' },
    es: { title: 'Chat Oráculo', description: 'Chat de orientación astrológica personalizada a tu carta natal - amor, carrera y tránsitos.' },
    it: { title: 'Chat Oracolo', description: 'Chat di orientamento astrologico personalizzata sul tuo tema natale - amore, carriera e transiti.' },
    de: { title: 'Chat-Orakel', description: 'Astrologischer Beratungs-Chat personalisiert zu deinem Geburtshoroskop - Liebe, Karriere und Transite.' },
    fr: { title: 'Chat Oráculo', description: 'Chat d\'orientation astrologique personnalisé à ton thème natal - amour, carrière et transits.' },
  },
  privacidade: {
    pt: { title: 'Política de Privacidade', description: 'Como o Sidusastro protege os teus dados de nascimento e informação pessoal.' },
    en: { title: 'Privacy Policy', description: 'How Sidusastro protects your birth data and personal information.' },
    es: { title: 'Política de Privacidad', description: 'Cómo Sidusastro protege tus datos de nacimiento e información personal.' },
    it: { title: 'Informativa sulla Privacy', description: 'Come Sidusastro protegge i tuoi dati di nascita e informazioni personali.' },
    de: { title: 'Datenschutz', description: 'Wie Sidusastro deine Geburtsdaten und persönlichen Informationen schützt.' },
    fr: { title: 'Politique de Confidentialité', description: 'Comment Sidusastro protège tes données de naissance et informations personnelles.' },
  },
  vipPromo: {
    pt: { title: 'VIP por Divulgação · Parceiros', description: 'Ganha Sidus VIP vitalício ao divulgar o Sidusastro nas redes sociais. Programa de parceiros com aprovação em 48h.' },
    en: { title: 'VIP for Promotion · Partners', description: 'Earn lifetime Sidus VIP by promoting Sidusastro on social media. Partner program reviewed within 48h.' },
    es: { title: 'VIP por Divulgación', description: 'Gana Sidus VIP vitalicio al promocionar Sidusastro en redes sociales.' },
    it: { title: 'VIP per Promozione', description: 'Ottieni Sidus VIP a vita promuovendo Sidusastro sui social.' },
    de: { title: 'VIP für Werbung', description: 'Erhalte lebenslangen Sidus VIP durch Bewerbung von Sidusastro in sozialen Medien.' },
    fr: { title: 'VIP pour Promotion', description: 'Gagne Sidus VIP à vie en promouvant Sidusastro sur les réseaux sociaux.' },
  },
}

const DEFAULT = {
  pt: { title: 'O Seu Guia Cósmico', description: 'Mapa astral, tarot online, Chat Oráculo e ferramentas astrológicas personalizadas.' },
  en: { title: 'Your Cosmic Guide', description: 'Natal chart, online tarot, Chat Oracle and personalised astrology tools.' },
  es: { title: 'Tu Guía Cósmica', description: 'Carta natal, tarot online, Chat Oráculo y herramientas astrológicas personalizadas.' },
  it: { title: 'La Tua Guida Cosmica', description: 'Tema natale, tarocchi online, Chat Oracolo e strumenti astrologici personalizzati.' },
  de: { title: 'Dein Kosmischer Guide', description: 'Geburtshoroskop, Online-Tarot, Chat-Orakel und personalisierte Astrologie-Tools.' },
  fr: { title: 'Ton Guide Cosmique', description: 'Thème natal, tarot en ligne, Chat Oráculo et outils astrologiques personnalisés.' },
}

function setMeta(attr, key, value) {
  if (!value) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export function getRouteSeo(passo, lang = 'pt') {
  const L = SEO[passo]?.[lang] || SEO[passo]?.en || DEFAULT[lang] || DEFAULT.pt
  return L
}

export function applyRouteSeo(passo, lang = 'pt') {
  const L = getRouteSeo(passo, lang)
  const title = `${SITE} - ${L.title}`
  document.title = title
  setMeta('name', 'description', L.description)
  const path = PASSO_TO_PATH[passo] || '/'
  const canonical = lang && lang !== 'pt'
    ? `${BASE_URL}/${lang}${path === '/' ? '' : path}`
    : `${BASE_URL}${path}`

  const localeMap = { pt: 'pt_PT', en: 'en_GB', es: 'es_ES', it: 'it_IT', de: 'de_DE', fr: 'fr_FR' }
  applySocialShareMeta({
    title,
    description: L.description,
    url: canonical,
    type: 'website',
    locale: localeMap[lang] || 'pt_PT',
  })
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', canonical)
}
