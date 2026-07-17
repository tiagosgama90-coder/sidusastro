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
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@swisseph/browser')) return 'swisseph'
          if (id.includes('/components/Tarot')) return 'tarot'
          if (id.includes('MandalaNatal') || id.includes('mandalaNatal')) return 'mandala'
          if (id.includes('FerramentasPremium')) return 'ferramentas'
          if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf'
        },
      },
    },
  },
})
