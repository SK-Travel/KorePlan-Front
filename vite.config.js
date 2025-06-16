import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://14.63.178.142:8080',
        changeOrigin: true,
      },
      '/oauth2': {
        target: 'http://14.63.178.142:8080',
        changeOrigin: true,
      },
      '/login/oauth2': {
        target: 'http://14.63.178.142:8080',
        changeOrigin: true,
      }
    },
  },
});