import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  // 환경변수 로드
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://localhost:8080'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
        },
        '/oauth2/authorization': {
          target: apiBaseUrl,
          changeOrigin: true,
        },
        '/login/oauth2': {
          target: apiBaseUrl,
          changeOrigin: true,
        }
      },
    },
  }
});