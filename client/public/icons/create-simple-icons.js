// Простой скрипт для создания базовых иконок
// В реальном проекте используйте sharp, canvas или другие библиотеки

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Создаем простые SVG иконки для каждого размера
sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="512" height="512" rx="80" fill="url(#gradient)"/>
    <text x="256" y="320" font-family="Arial, sans-serif" font-size="256" font-weight="bold" text-anchor="middle" fill="white">С</text>
  </svg>`;
  
  // В реальном проекте здесь была бы конвертация в PNG
  console.log(`Created icon-${size}x${size}.svg`);
});

console.log('Icons created! In a real project, convert these SVG files to PNG format.');
