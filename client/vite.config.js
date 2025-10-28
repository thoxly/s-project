import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"development"'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@mui/material', '@mui/icons-material']
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // Allow external connections for tuna tunnel
    hmr: {
      port: 5173,
      host: 'localhost'
    },
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ru.tuna.am', // Allow all tuna.am subdomains
      'all' // Fallback to allow all hosts
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  publicDir: 'public'
})
