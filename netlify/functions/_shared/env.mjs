/** Lê env vars no Netlify Functions (secretas exigem Netlify.env, não process.env). */
export function env(key) {
  if (typeof Netlify !== 'undefined' && Netlify?.env?.get) {
    const v = Netlify.env.get(key)
    if (v != null && v !== '') return v
  }
  return process.env[key]
}
