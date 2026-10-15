import { resolve } from 'path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Clean URL rewrite middleware for Vite Dev & Preview Server (supports /siswa/:nis -> /siswa.html?nis=:nis)
function cleanUrlPlugin(): Plugin {
  const rewriteHandler = (req: { url?: string }, _res: unknown, next: () => void) => {
    if (!req.url) return next();
    const match = req.url.match(/^\/siswa\/([a-zA-Z0-9_-]+)(\?.*)?$/);
    if (match) {
      const nis = match[1];
      const query = match[2] ? match[2] + '&' : '?';
      req.url = `/siswa.html${query}nis=${nis}`;
    }
    next();
  };

  return {
    name: 'clean-url-rewrite',
    configureServer(server) {
      server.middlewares.use(rewriteHandler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewriteHandler);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), cleanUrlPlugin()],
  base: './', // Essential for GitHub Pages hosting (relative paths)
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        mutasi: resolve(import.meta.dirname, 'mutasi.html'),
        bukuInduk: resolve(import.meta.dirname, 'buku-induk.html'),
        cetakBuku: resolve(import.meta.dirname, 'cetak-buku.html'),
        kegiatan: resolve(import.meta.dirname, 'kegiatan.html'),
        siswa: resolve(import.meta.dirname, 'siswa.html'),
        pengaturan: resolve(import.meta.dirname, 'pengaturan.html'),
      },
    },
  },
})
