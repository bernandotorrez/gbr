// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // ⚠️ Ganti dengan domain produksi Anda yang sebenarnya
  site: 'https://grandbedahanresidence.com',

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

  integrations: [
    react(),
    sitemap({
      // Prioritas halaman untuk crawler
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Filter halaman yang tidak perlu diindeks
      filter: (page) => !page.includes('/404') && !page.includes('/admin'),
      // Kustomisasi priority per halaman
      customPages: [],
      serialize(item) {
        // Halaman utama → priority tertinggi
        if (item.url === 'https://grandbedahanresidence.com/') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }
        // Halaman tipe rumah
        if (item.url.includes('/tipe-rumah/')) {
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }
        // Halaman artikel
        if (item.url.includes('/artikel/')) {
          return { ...item, priority: 0.8, changefreq: 'monthly' };
        }
        return item;
      },
    }),
  ],
  adapter: vercel()
});