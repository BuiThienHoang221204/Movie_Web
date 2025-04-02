import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'https://hmovie.onrender.com',
  //       changeOrigin: true,
  //       secure: true,
  //     },
  //     '/auth': {
  //       target: 'https://hmovie.onrender.com',
  //       changeOrigin: true,
  //       secure: true,
  //     },
  //   },
  // },
});