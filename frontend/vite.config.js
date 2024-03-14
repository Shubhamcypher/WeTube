import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        
        cors: true, // Enable CORS for preflight requests (OPTIONS)
      },
    },
  },
  plugins: [react()],
})
