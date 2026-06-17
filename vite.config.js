import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  // viteCommonjs transforma ficheiros CJS dentro de pacotes ESM.
  // Necessário para @swisseph/browser cujo swisseph.js usa `exports` e `module`.
  plugins: [react(), viteCommonjs()],

  optimizeDeps: {
    include: ['@swisseph/browser'],
  },

  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/@swisseph\/browser/],
    },
  },
})
