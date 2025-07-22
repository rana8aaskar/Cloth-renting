import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/server': { 
        target: 'http://localhost:3000',
        secure: false,
      }
    }
  },
  plugins: [
    tailwindcss()
  ],
  build: {
    rollupOptions: {
      external: ['bcryptjs'] // 👈 prevent bundling bcryptjs
    }
  }
})
