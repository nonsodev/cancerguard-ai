import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app',
      'ac7ab8534ec8.ngrok-free.app'
    ],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})