import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/app/' : '/',
  build: {
    outDir: 'dist/app',
    emptyOutDir: true,
  },
  plugins: [
    react(),
    {
      name: 'clean-and-copy-marketing',
      apply: 'build',
      buildStart() {
        const distRoot = resolve(__dirname, 'dist');
        if (existsSync(distRoot)) rmSync(distRoot, { recursive: true, force: true });
      },
      closeBundle() {
        const distRoot = resolve(__dirname, 'dist');
        const websiteSrc = resolve(__dirname, 'website');
        mkdirSync(distRoot, { recursive: true });
        cpSync(websiteSrc, distRoot, { recursive: true });
      },
    },
  ],
}));
