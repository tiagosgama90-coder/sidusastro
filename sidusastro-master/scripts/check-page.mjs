import { chromium } from 'playwright'

const urls = [
  'http://localhost:4173/login',
  'http://localhost:4173/home',
  'http://localhost:4173/',
  'https://sidusastro.com/login',
  'https://sidusastro.com/home',
]

const browser = await chromium.launch()
for (const url of urls) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`CON: ${msg.text()}`)
  })
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(3000)
    const body = await page.textContent('body')
    console.log('---')
    console.log('URL:', url)
    console.log('ERROR_UI:', body?.includes('Algo correu mal'))
    console.log('TITLE:', await page.title())
    if (errors.length) console.log('ERRORS:', errors.join('\n'))
    else console.log('ERRORS: none')
  } catch (e) {
    console.log('URL:', url, 'FAIL:', e.message)
  }
  await page.close()
}
await browser.close()
