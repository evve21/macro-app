import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load env file dari folder root
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
      plugins: [react()],
      base: '/macro-app/', // Nama repository kamu
      define: {
        // Ini memastikan app tidak error jika API_KEY kosong saat build
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          // Mengarahkan @ ke folder utama
          '@': path.resolve(__dirname, './'),
        }
      },
      build: {
        outDir: 'dist',
      }
    };
});
