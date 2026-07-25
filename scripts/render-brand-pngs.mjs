/**
 * Gera og-image.png e apple-touch-icon.png a partir dos SVGs da marca.
 * Uso: node scripts/render-brand-pngs.mjs
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

async function svgToPng(svgPath, outPath, width, height) {
  const svg = readFileSync(svgPath, 'utf8')
  const html = `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:#000}</style></head><body>${svg}</body></html>`
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width, height } })
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.screenshot({ path: outPath, type: 'png', clip: { x: 0, y: 0, width, height } })
  await browser.close()
  console.log('Wrote', outPath)
}

const ogSvg = readFileSync(join(root, 'public/brand/sidus-og.svg'), 'utf8')
const iconSvg = readFileSync(join(root, 'public/brand/sidus-logo-stacked-blue.svg'), 'utf8')

async function main() {
  const browser = await chromium.launch()
  try {
    for (const [svg, out, w, h] of [
      [ogSvg, join(root, 'public/og-image.png'), 1200, 630],
      [iconSvg, join(root, 'public/apple-touch-icon.png'), 512, 512],
      [iconSvg, join(root, 'public/logo_grande.png'), 1024, 1024],
    ]) {
      const page = await browser.newPage({ viewport: { width: w, height: h } })
      await page.setContent(
        `<!DOCTYPE html><html><head><style>*{margin:0}html,body{width:${w}px;height:${h}px;overflow:hidden;background:#000}</style></head><body>${svg}</body></html>`,
        { waitUntil: 'domcontentloaded' },
      )
      await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: w, height: h } })
      await page.close()
      console.log('Wrote', out)
    }
  } finally {
    await browser.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
