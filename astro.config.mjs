// @ts-check
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL publique du site (ex. https://dogsrhc.github.io) et sous-dossier éventuel
// (seulement pour une page GitHub sans domaine perso ni dépôt <orga>.github.io).
// Fournis par l'environnement de build pour ne rien figer dans le code.
const site = process.env.SITE_URL || undefined;
const base = process.env.BASE_PATH || '/';
// preview = version de travail : bandeau, pas d'indexation, pas de plan du site.
const preview = process.env.SITE_MODE === 'preview';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: site && !preview ? [sitemap()] : [],
  build: {
    format: 'directory',
  },
  env: {
    schema: {
      SITE_MODE: envField.enum({
        context: 'server',
        access: 'public',
        values: ['production', 'preview'],
        default: 'production',
      }),
    },
  },
});
