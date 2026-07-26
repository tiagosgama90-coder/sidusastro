/**
 * Gera PNGs da marca Sidus (OG, ícones, transparentes para vídeo).
 * Uso: node scripts/render-brand-pngs.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const brandDir = join(root, 'public/brand')

mkdirSync(brandDir, { recursive: true })

async function renderSvg(browser, svg, outPath, w, h, transparent = false) {
  const bg = transparent ? 'transparent' : '#0B071E'
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  await page.setContent(
    `<!DOCTYPE html><html><head><style>*{margin:0}html,body{width:${w}px;height:${h}px;overflow:hidden;background:${bg}}</style></head><body>${svg}</body></html>`,
    { waitUntil: 'domcontentloaded' },
  )
  await page.screenshot({
    path: outPath,
    type: 'png',
    omitBackground: transparent,
    clip: { x: 0, y: 0, width: w, height: h },
  })
  await page.close()
  console.log('Wrote', outPath)
}

async function main() {
  const mark = readFileSync(join(brandDir, 'sidus-constellation-mark.svg'), 'utf8')
  const horizontal = readFileSync(join(brandDir, 'sidus-logo-horizontal.svg'), 'utf8')
  const stacked = readFileSync(join(brandDir, 'sidus-logo-stacked.svg'), 'utf8')
  const og = readFileSync(join(brandDir, 'sidus-og.svg'), 'utf8')

  const browser = await chromium.launch()
  try {
    await renderSvg(browser, og, join(root, 'public/og-image.png'), 1200, 630, false)
    await renderSvg(browser, stacked, join(root, 'public/apple-touch-icon.png'), 512, 512, false)
    await renderSvg(browser, mark, join(brandDir, 'sidus-constellation-mark-512.png'), 512, 512, true)
    await renderSvg(browser, mark, join(brandDir, 'sidus-constellation-mark-1024.png'), 1024, 1024, true)
    await renderSvg(browser, horizontal, join(brandDir, 'sidus-logo-horizontal-1024.png'), 1024, 256, true)
    await renderSvg(browser, stacked, join(brandDir, 'sidus-logo-stacked-1024.png'), 1024, 1024, true)
    await renderSvg(browser, mark, join(brandDir, 'sidus-constellation-mark-gold-on-black-1024.png'), 1024, 1024, false)
  } finally {
    await browser.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
