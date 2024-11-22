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
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 20 * 1000 * 1000,
      }
    }),
  ],
  esbuild: {
    format: 'esm',
  },
  worker: {
    format: 'iife',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    exclude: [
      '@morten-olsen/knowledge-base',
      '@electric-sql/pglite',
      '@huggingface/transformers',
    ],
  },
})
