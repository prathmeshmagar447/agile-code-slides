
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['b163a9ce-d17f-44e1-ac61-f0e9d21f9833.lovableproject.com']
    port: 8080
  }
})
