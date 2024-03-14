import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://wetube-cmtu.onrender.com/',
        
        cors: true, // Enable CORS for preflight requests (OPTIONS)
      },
    },
  },
  plugins: [react()],
})
