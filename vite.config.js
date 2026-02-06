import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Configure HMR to use a different port
    hmr: {
      port: 5173,
    },
    // Proxy API requests to EdgeOne Pages Dev server
    proxy: {
      '/api': {
        target: 'http://localhost:8088',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
