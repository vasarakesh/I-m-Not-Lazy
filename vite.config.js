import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-website',
      closeBundle() {
        const dest = resolve(__dirname, 'dist/website');
        mkdirSync(dest, { recursive: true });
        cpSync(resolve(__dirname, 'website'), dest, { recursive: true });
      },
    },
  ],
});
