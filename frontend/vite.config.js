import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://we-tube-server-psi.vercel.app/'?'https://we-tube-server-psi.vercel.app/':'http://localhost:8000',
        secure: true,
      },
    },
  },
  plugins: [react()],
})
