import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 5174,
    strictPort: true,
    host: true,
    cors: true,
    origin: 'https://tribal-types-mere-ef.trycloudflare.com'// 💥 IMPORTANT!
  }
  
});
