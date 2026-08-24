import type { APIRoute } from 'astro';
import { getTipeRumahList, getPublishedArtikelList } from '../lib/api';

export const GET: APIRoute = async () => {
  const siteUrl = 'https://grandbedahanresidence.com';
  const houseTypes = await getTipeRumahList();
  const articles = await getPublishedArtikelList();
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: `${siteUrl}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
    { url: `${siteUrl}/artikel/`, priority: '0.8', changefreq: 'daily', lastmod: today }
  ];

  const housePages = houseTypes.map((t) => ({
    url: `${siteUrl}/tipe-rumah/${t.slug}/`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: today
  }));

  const articlePages = articles.map((a) => ({
    url: `${siteUrl}/artikel/${a.slug}/`,
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: a.tanggal_publish ? a.tanggal_publish.split('T')[0] : today
  }));

  const allPages = [...staticPages, ...housePages, ...articlePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
};
