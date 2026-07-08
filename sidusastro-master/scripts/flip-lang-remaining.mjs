import fs from 'fs'
import path from 'path'

const skip = new Set([
  path.normalize('src/lib/i18n/tarotArcana.js'),
])

function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f)
    if (fs.statSync(p).isDirectory()) walk(p, out)
    else if (/\.(js|jsx)$/.test(f)) out.push(p)
  }
  return out
}

let n = 0
for (const file of walk('src')) {
  if (skip.has(path.normalize(file))) continue
  let s = fs.readFileSync(file, 'utf8')
  const orig = s
  s = s.replace(/lang === 'en'/g, "lang !== 'pt'")
  if (s !== orig) {
    fs.writeFileSync(file, s)
    n++
    console.log('updated', file)
  }
}
console.log('total', n)
