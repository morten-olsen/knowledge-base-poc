import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/knowledge-base-poc',
  plugins: [
    react(),
  ],
  optimizeDeps: {
    exclude: [
      '@electric-sql/pglite',
      '@huggingface/transformers',
    ],
  },
})
