import fs from 'node:fs'
import path from 'node:path'

const dir = path.join(process.cwd(), 'public/guia')
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
  const p = path.join(dir, f)
  const raw = fs.readFileSync(p, 'utf8')
  let c = raw.includes('Ã©') ? Buffer.from(raw, 'latin1').toString('utf8') : raw
  c = c.replace(/^\uFEFF/, '').replace(/^\uFFFD/, '')
  if (!c.startsWith('<!')) c = c.replace(/^[^<]*/, '')
  fs.writeFileSync(p, c, 'utf8')
  console.log(f, c.includes('é') ? 'ok' : 'check')
}
