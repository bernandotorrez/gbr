// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/cs-widget': {
          target: 'https://benixai.web.id',
          changeOrigin: true
        }
      }
    }
  },

  integrations: [react()],
  adapter: vercel()
});