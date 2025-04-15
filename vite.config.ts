import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'chart': ['chart.js', 'react-chartjs-2'],
          'xlsx': ['xlsx'],
          'pdf': ['pdfjs-dist'],
          'react-vendor': ['react', 'react-dom'],
          'parser-vendor': ['papaparse'],
          'dropzone': ['react-dropzone']
        }
      }
    }
  }
});