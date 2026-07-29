import fs from 'fs'
import en from '../src/lib/i18n/en.js'
import es from '../src/lib/i18n/es.js'

const ES_FR = [
  ['Bienvenido a', 'Bienvenue sur'],
  ['Cuando naciste, el cielo dibujó tu carta astral', 'Quand vous êtes né(e), le ciel a tracé votre carte astrale'],
  ['Lee tu horóscopo personalizado', 'Lisez votre horoscope personnalisé'],
  ['¿Ya tienes una cuenta?', 'Vous avez déjà un compte ?'],
  ['Regístrate aquí', 'Connectez-vous ici'],
  ['Cálculos de alta precisión impulsados ​​por efemérides suizas.', 'Calculs de haute précision basés sur Swiss Ephemeris.'],
  ['cielo vivo', 'Ciel en direct'],
  ['Los tránsitos de hoy', 'Transits du jour'],
  ['Herramientas del cosmos', 'Outils du cosmos'],
  ['Salva y revela mi destino', 'Enregistrer et révéler mon destin'],
  ['Leyendo las estrellas...', 'Lecture des étoiles…'],
  ['Continuar iniciando sesión', 'Continuer pour se connecter'],
  ['Preguntas frecuentes sobre Sidus Astro', 'Questions fréquentes sur Sidus Astro'],
  ['Preguntas frecuentes', 'Questions fréquentes'],
  ['Hogar', 'Accueil'],
  ['Carta Astral', 'Carte astrale'],
  ['Tarot en línea', 'Tarot en ligne'],
  ['Herramientas', 'Outils'],
  ['Oráculo de conversación', 'Chat Oráculo'],
  ['Perfil', 'Profil'],
  ['Menú', 'Menu'],
  ['abrir menú', 'Ouvrir le menu'],
  ['Cerrar menú', 'Fermer le menu'],
  ['← Volver', '← Retour'],
  ['desconectar', 'Déconnexion'],
  ['Cargando el cosmos…', 'Chargement du cosmos…'],
  ['Verificando…', 'Vérification…'],
  ['Cerca', 'Fermer'],
  ['Ahorrar', 'Enregistrer'],
  ['Borrar', 'Supprimer'],
  ['días de vida', 'jours de vie'],
  ['Cookies y privacidad', 'Cookies et confidentialité'],
  ['política de privacidad', 'Politique de confidentialité'],
  ['aceptar todo', 'Tout accepter'],
  ['Sólo cookies esenciales', 'Cookies essentiels uniquement'],
  ['Iniciar sesión', 'Connexion'],
  ['Crear una cuenta', 'Créer un compte'],
  ['Correo electrónico', 'E-mail'],
  ['Contraseña', 'Mot de passe'],
  ['Continuar con Google', 'Continuer avec Google'],
  ['¿No tienes una cuenta?', 'Pas encore de compte ?'],
  ['Crea uno aquí', 'Créez-en un ici'],
  ['Complete todos los campos.', 'Remplissez tous les champs.'],
  ['Confirma que no eres un robot.', "Confirmez que vous n'êtes pas un robot."],
  ['Las contraseñas no coinciden.', 'Les mots de passe ne correspondent pas.'],
  ['no soy un robot', 'Je ne suis pas un robot'],
  ['✓ Verificado', '✓ Vérifié'],
  ['Bienvenido, {name}', 'Bienvenue, {name}'],
  ['Tu cielo en tiempo real', 'Votre ciel en temps réel'],
  ['En vivo', 'En direct'],
  ['Herramientas ocultas', 'Outils cachés'],
  ['Gratis', 'Gratuit'],
  ['Nueva lectura', 'Nouvelle lecture'],
  ['Invertida', 'Renversée'],
  ['Carta Natal', 'Carte natale'],
  ['Signo solar', 'Signe solaire'],
  ['Signo lunar', 'Signe lunaire'],
  ['Descendente', 'Descendant'],
  ['Fuego', 'Feu'],
  ['Tierra', 'Terre'],
  ['Agua', 'Eau'],
  ['Fijo', 'Fixe'],
  ['Mutável', 'Mutable'],
  ['Error desconocido', 'Erreur inconnue'],
  ['Cerrar', 'Fermer'],
  ['Donde el mapa del cielo se encuentra con la sabiduría de las cartas para guiar tus pasos.', 'Là où la carte du ciel rencontre la sagesse des cartes pour guider vos pas.'],
  ['Tu carta natal completa.Tu destino, decodificado.', 'Votre carte natale complète. Votre destin, décodé.'],
  ['Efemérides suizas · Casas Placidus · Oráculo AI · Tarot · Numerología: todo personalizado con tu Sol, Luna y Ascendente.', 'Swiss Ephemeris · maisons Placidus · Oráculo IA · Tarot · Numérologie - tout personnalisé avec votre Soleil, Lune et Ascendant.'],
  ['Utilizamos las cookies necesarias para que Sidus funcione', 'Nous utilisons les cookies nécessaires au fonctionnement de Sidus'],
  ['Puede aceptar todas las cookies o limitarlas a las esenciales (anuncios no personalizados).', 'Vous pouvez tout accepter ou limiter aux cookies essentiels (annonces non personnalisées).'],
  ['Tarot en línea', 'Tarot en ligne'],
  [' y ', ' et '],
  [' o ', ' ou '],
]

const EN_FR = [
  ['Welcome to', 'Bienvenue sur'],
  ['Home', 'Accueil'],
  ['Astral Chart', 'Carte astrale'],
  ['Tarot Online', 'Tarot en ligne'],
  ['Tools', 'Outils'],
  ['Chat Oracle', 'Chat Oráculo'],
  ['Profile', 'Profil'],
  ['Open menu', 'Ouvrir le menu'],
  ['Close menu', 'Fermer le menu'],
  ['← Back', '← Retour'],
  ['Sign out', 'Déconnexion'],
  ['Loading the cosmos…', 'Chargement du cosmos…'],
  ['Verifying…', 'Vérification…'],
  ['Save', 'Enregistrer'],
  ['Delete', 'Supprimer'],
  ['{count} days of life', '{count} jours de vie'],
  ['/ month', '/ mois'],
  ['/mo', '/mois'],
  ['Sign In', 'Connexion'],
  ['Create Account', 'Créer un compte'],
  ['Password', 'Mot de passe'],
  ["Don't have an account?", 'Pas encore de compte ?'],
  ['Already have an account?', 'Vous avez déjà un compte ?'],
  ['Sign in here', 'Connectez-vous ici'],
  ['Continue with Google', 'Continuer avec Google'],
  ['I am not a robot', 'Je ne suis pas un robot'],
  ['Live sky', 'Ciel en direct'],
  ["Today's transits", 'Transits du jour'],
  ['Frequently Asked Questions', 'Questions fréquentes'],
  ['Welcome, {name}', 'Bienvenue, {name}'],
  ['Your sky in real time', 'Votre ciel en temps réel'],
  ['Free', 'Gratuit'],
  ['Natal Chart', 'Carte natale'],
  ['New reading', 'Nouvelle lecture'],
  ['Reversed', 'Renversée'],
  [' and ', ' et '],
  [' or ', ' ou '],
]

function translateText(s, pairs) {
  let out = s
  for (const [a, b] of pairs) out = out.split(a).join(b)
  return out
}

function walk(enVal, esVal, key = '') {
  if (typeof enVal === 'string') {
    if (key === 'eyebrowBrand') return 'SIDUS'
    if (key === 'logoAlt') return 'Sidus'
    const src = esVal !== enVal ? esVal : enVal
    const pairs = esVal !== enVal ? ES_FR : EN_FR
    return translateText(src, pairs)
  }
  if (Array.isArray(enVal)) return enVal.map((v, i) => walk(v, esVal?.[i], key))
  if (enVal && typeof enVal === 'object') {
    const out = {}
    for (const k of Object.keys(enVal)) out[k] = walk(enVal[k], esVal?.[k], k)
    return out
  }
  return enVal
}

const fr = walk(en, es)
const serialized = JSON.stringify(fr, null, 2)
  .replace(/"([^"]+)":/g, (match, k) => (/^[a-zA-Z_$][\w$-]*$/.test(k) ? `${k}:` : match))

fs.writeFileSync(new URL('../src/lib/i18n/fr.js', import.meta.url), `export default ${serialized}\n`)
console.log('fr.js built')
