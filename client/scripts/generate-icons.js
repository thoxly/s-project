import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Простой SVG генератор для иконок PWA
const generateIcon = (size) => {
  const scale = size / 512 // Базовый размер 512px
  const fontSize = 256 * scale
  const strokeWidth = 8 * scale
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Фон -->
  <rect width="512" height="512" rx="80" fill="url(#gradient)"/>
  
  <!-- Буква С -->
  <text x="256" y="320" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white"
        stroke="rgba(255,255,255,0.3)"
        stroke-width="${strokeWidth}">С</text>
  
  <!-- Декоративные элементы -->
  <circle cx="128" cy="128" r="20" fill="rgba(255,255,255,0.2)"/>
  <circle cx="384" cy="128" r="15" fill="rgba(255,255,255,0.15)"/>
  <circle cx="128" cy="384" r="12" fill="rgba(255,255,255,0.1)"/>
  <circle cx="384" cy="384" r="18" fill="rgba(255,255,255,0.2)"/>
</svg>`
}

// Размеры иконок для PWA
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512]

// Создаем папку для иконок если её нет
const iconsDir = path.join(__dirname, '../public/icons')
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Генерируем иконки
iconSizes.forEach(size => {
  const svgContent = generateIcon(size)
  const filename = `icon-${size}x${size}.png`
  const filepath = path.join(iconsDir, filename)
  
  // Сохраняем как SVG (в реальном проекте нужно конвертировать в PNG)
  const svgFilename = `icon-${size}x${size}.svg`
  const svgFilepath = path.join(iconsDir, svgFilename)
  
  fs.writeFileSync(svgFilepath, svgContent)
  console.log(`Generated ${svgFilename}`)
})

console.log('All icons generated successfully!')
console.log('Note: In a real project, you would convert these SVG files to PNG format.')
