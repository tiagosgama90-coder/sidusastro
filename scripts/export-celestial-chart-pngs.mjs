import sharp from 'sharp'
import { copyFileSync, mkdirSync } from 'fs'

const src = '/opt/cursor/artifacts/assets/sidus-celestial-chart-transparent.png'
const dir = 'public/brand'
mkdirSync(dir, { recursive: true })

function keyToAlpha(data, info) {
  const { width, height, channels } = info
  const out = Buffer.alloc(width * height * 4)
  for (let i = 0; i < width * height; i += 1) {
    const si = i * channels
    const di = i * 4
    const r = data[si]
    const g = data[si + 1]
    const b = data[si + 2]
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const sat = max === 0 ? 0 : (max - min) / max
    const warmth = r - b

    out[di] = r
    out[di + 1] = g
    out[di + 2] = b

    let alpha = 255
    if (lum > 238 && sat < 0.08) alpha = 0
    else if (lum > 210 && sat < 0.06) alpha = Math.max(0, 255 - (lum - 200) * 18)
    else if (lum > 185 && sat < 0.05 && Math.abs(r - g) < 8 && Math.abs(g - b) < 8) {
      alpha = Math.max(0, 255 - (lum - 170) * 10)
    } else if (warmth > 4 && sat > 0.06) {
      alpha = 255
    }

    out[di + 3] = alpha
  }
  return out
}

async function exportSize(size, name) {
  const { data, info } = await sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = keyToAlpha(data, info)

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(`${dir}/${name}`)

  console.log('wrote', `${dir}/${name}`)
}

await exportSize(512, 'sidus-celestial-chart-512.png')
await exportSize(1024, 'sidus-celestial-chart-1024.png')
await exportSize(2048, 'sidus-celestial-chart-2048.png')
copyFileSync(src, `${dir}/sidus-celestial-chart-source.png`)
