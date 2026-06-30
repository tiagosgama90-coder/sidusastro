import fs from 'fs'
import path from 'path'

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else if (/\.(js|jsx)$/.test(f)) out.push(p)
  }
  return out
}

const skip = new Set([
  path.normalize('src/lib/i18n/tarotArcana.js'),
  path.normalize('src/lib/i18n/astro.js'),
  path.normalize('src/lib/i18n/langUtil.js'),
])

let n = 0
for (const file of walk('src')) {
  const norm = path.normalize(file)
  if (skip.has(norm)) continue
  let s = fs.readFileSync(file, 'utf8')
  const orig = s
  s = s.replace(/lang === 'en' \?/g, "lang === 'pt' ?")
  s = s.replace(/lang === 'pt' \?/g, '__FLIP_PT__')
  s = s.replace(/__FLIP_PT__/g, "lang !== 'pt' ?")
  s = s.replace(/if \(lang === 'en'\)/g, "if (lang !== 'pt')")
  if (s !== orig) {
    fs.writeFileSync(file, s)
    n++
    console.log('updated', file)
  }
}
console.log('total', n)
