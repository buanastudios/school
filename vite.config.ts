import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // Essential for GitHub Pages hosting (relative paths)
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        mutasi: resolve(import.meta.dirname, 'mutasi.html'),
        bukuInduk: resolve(import.meta.dirname, 'buku-induk.html'),
        cetakBuku: resolve(import.meta.dirname, 'cetak-buku.html'),
        siswa: resolve(import.meta.dirname, 'siswa.html'),
        pengaturan: resolve(import.meta.dirname, 'pengaturan.html'),
      },
    },
  },
})
