import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://wetube-cmtu.onrender.com',
        secure: true,
      },
    },
  },
  plugins: [react()],
})
