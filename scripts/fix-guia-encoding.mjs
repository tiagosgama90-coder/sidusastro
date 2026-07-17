import fs from 'node:fs'
import path from 'node:path'

const reps = [
  ['Ã©', 'é'], ['Ã£', 'ã'], ['Ã§', 'ç'], ['Ã¡', 'á'], ['Ã³', 'ó'], ['Ãª', 'ê'],
  ['Ã­', 'í'], ['Ãº', 'ú'], ['Ãµ', 'õ'], ['Ã¢', 'â'], ['Ã‰', 'É'],
  ['â€”', '—'], ['â€“', '–'], ['â€œ', '"'], ['â€\u009d', '"'], ['Â«', '«'], ['Â»', '»'],
  ['Â·', '·'], ['âœ¦', '✦'], ['â†\u0092', '→'], ['Â°', '°'], ['â€™', "'"],
  ['SeleÃ§Ã£o', 'Selecção'], ['grÃ¡tis', 'grátis'], ['ComeÃ§ar', 'Começar'],
  ['PolÃ­tica', 'Política'], ['astronÃ³mico', 'astronómico'], ['interpretaÃ§Ã£o', 'interpretação'],
  ['posiÃ§Ã£o', 'posição'], ['distribuiÃ§Ã£o', 'distribuição'], ['reacÃ§Ãµes', 'reacções'],
  ['situaÃ§Ãµes', 'situações'], ['contemporÃ¢nea', 'contemporânea'],
  ['Ã¢ngulos', 'ângulos'], ['tensÃµes', 'tensões'], ['fusÃµes', 'fusões'], ['motivaÃ§Ã£o', 'motivação'],
  ['ciÃªncia', 'ciência'], ['arquetÃ­pica', 'arquetípica'], ['portuguÃªs', 'português'],
  ['orÃ¡culo', 'oráculo'], ['horÃ³scopo', 'horóscopo'], ['trÃ¢nsitos', 'trânsitos'],
]

const dir = path.join(process.cwd(), 'public/guia')
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
  const p = path.join(dir, f)
  let c = fs.readFileSync(p, 'utf8')
  for (const [a, b] of reps) c = c.split(a).join(b)
  fs.writeFileSync(p, c, 'utf8')
  console.log(f, c.includes('Ã') ? 'still has mojibake' : 'ok')
}
