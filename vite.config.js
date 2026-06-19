import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

export default defineConfig({
  plugins: [react(), viteCommonjs()],

  define: {
    global: 'globalThis',
  },

  optimizeDeps: {
    include: ['@swisseph/browser'],
    esbuildOptions: {
      define: { global: 'globalThis' },
    },
  },

  build: {
    target: 'esnext',
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/@swisseph\/browser/],
    },
  },
})
