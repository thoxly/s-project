import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production Vite config - полностью отключает HMR и WebSocket
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    hmr: false,
    websocket: false,
    strictPort: true,
    allowedHosts: 'all'
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Отключаем sourcemap для production
    minify: 'esbuild', // Используем esbuild вместо terser
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  },
  publicDir: 'public'
})
