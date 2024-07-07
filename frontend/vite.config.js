import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://we-tube-a4dz.vercel.app/',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
})
