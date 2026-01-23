import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './www/demos',
  base: '/demos/',
  plugins: [react()],
  build: {
    outDir: '../../dist/demos/workflow-builder',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './www/demos/workflow-builder.html'
      }
    }
  },
  server: {
    port: 3001,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@': '/www/demos'
    }
  }
});
