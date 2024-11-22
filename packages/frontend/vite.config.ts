import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/knowledge-base-poc',
  define: {
    'process.env.YOUR_STRING_VARIABLE': JSON.stringify('test'),
  },
  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate' }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    exclude: [
      '@electric-sql/pglite',
      '@huggingface/transformers',
    ],
  },
})
