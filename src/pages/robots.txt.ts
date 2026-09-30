// robots.txt : tout fermer en version de travail, tout ouvrir (avec le plan du site) en production.
import type { APIRoute } from 'astro';
import { SITE_MODE } from 'astro:env/server';

export const GET: APIRoute = ({ site }) => {
  const lines =
    SITE_MODE === 'preview'
      ? ['User-agent: *', 'Disallow: /']
      : ['User-agent: *', 'Allow: /', ...(site ? [`Sitemap: ${new URL('sitemap-index.xml', site).href}`] : [])];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
