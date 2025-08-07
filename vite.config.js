import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',      // ← Bu satır çok önemli: tüm asset yönlendirmeleri relative olacak
  plugins: [react()]
})