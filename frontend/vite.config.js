import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://hmovie.onrender.com', // Backend URL
        changeOrigin: true,                   // Thay đổi origin thành target
        secure: true,                         // Xác nhận HTTPS
      },
    },
  },
});