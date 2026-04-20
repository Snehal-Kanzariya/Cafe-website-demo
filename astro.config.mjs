// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        // @/ → src/  (used everywhere as "@/data/menu", "@/components/…", etc.)
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
});
