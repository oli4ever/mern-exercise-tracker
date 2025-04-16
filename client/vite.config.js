import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: './dist',  // Build to dist folder
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html') // Simplified path resolution
    }
  }
})