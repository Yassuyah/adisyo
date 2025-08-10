import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Prod'da "beyaz ekran" yaşamamak için base mutlaka './' olmalı.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173,
    strictPort: true
  }
})
