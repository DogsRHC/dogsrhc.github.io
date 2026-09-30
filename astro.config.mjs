// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL publique du site (ex. https://www.lesdogs-meudon.fr) et sous-dossier éventuel
// (ex. /dogs-site pour une page GitHub sans domaine perso). Fournis par l'environnement
// de build pour ne rien figer dans le code.
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: site ? [sitemap()] : [],
  build: {
    format: 'directory',
  },
});
