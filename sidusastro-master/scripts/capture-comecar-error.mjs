import { chromium } from 'playwright'

const url = process.argv[2] || 'https://sidusastro.com/comecar'

const browser = await chromium.launch()
const page = await browser.newPage()
const errors = []

page.on('pageerror', (e) => errors.push(`PAGE: ${e.message}\n${e.stack || ''}`))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CON: ${msg.text()}`)
})

await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(5000)

const body = await page.textContent('body')
console.log('URL:', url)
console.log('ERROR_UI:', body?.includes('Algo correu mal'))
console.log('TITLE:', await page.title())
if (errors.length) {
  console.log('--- ERRORS ---')
  errors.forEach((e) => console.log(e))
} else {
  console.log('ERRORS: none captured (may need auth session)')
}

await browser.close()
