// Modèle de contenu du site. Chaque collection est validée au build :
// une donnée mal formée fait échouer `npm run build` avec un message explicite,
// plutôt que de produire une page fausse en silence.
import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const timeHHMM = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Heure attendue au format HH:MM');
const isoDate = z.coerce.date();

// Actus : un fichier Markdown par article dans src/content/news/
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(3),
      date: isoDate,
      summary: z.string().max(280).optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

// Un match. Le score peut manquer (match annulé, score jamais publié).
const match = z.object({
  date: isoDate.optional(),
  home: z.string(),
  away: z.string(),
  homeScore: z.number().int().nonnegative().optional(),
  awayScore: z.number().int().nonnegative().optional(),
  note: z.enum(['forfait', 'annulé', 'score non communiqué']).optional(),
});

// Saisons : un fichier YAML par saison dans src/content/seasons/ (ex. 2021-2022.yaml).
// Le palmarès de la page d'accueil est calculé à partir du champ `honour`.
const seasons = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/seasons' }),
  schema: z.object({
    startYear: z.number().int().min(1998).max(2100),
    division: z.string().optional(),
    honour: z.enum(['champion', 'vice-champion']).optional(),
    honourLabel: z.string().optional(),
    summary: z.string().optional(),
    competitions: z
      .array(
        z.object({
          name: z.string(),
          matches: z.array(match).default([]),
        }),
      )
      .default([]),
    tournaments: z.array(z.object({ name: z.string(), date: isoDate.optional(), result: z.string() })).default([]),
  }),
});

const venues = defineCollection({
  loader: file('src/content/venues.yaml'),
  schema: z.object({
    name: z.string(),
    street: z.string().optional(),
    postcode: z.string().regex(/^\d{5}$/),
    city: z.string(),
    district: z.string().optional(),
  }),
});

const trainings = defineCollection({
  loader: file('src/content/trainings.yaml'),
  schema: z.object({
    day: z.enum(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']),
    start: timeHHMM,
    end: timeHHMM,
    venue: reference('venues'),
    group: z.string().optional(),
  }),
});

// Agenda : matchs, tournois, AG... Seuls les événements à venir (date du build) s'affichent.
const events = defineCollection({
  loader: file('src/content/events.yaml'),
  schema: z.object({
    date: isoDate,
    time: timeHHMM.optional(),
    title: z.string(),
    kind: z.enum(['match', 'tournoi', 'club']),
    venue: reference('venues').optional(),
    place: z.string().optional(),
  }),
});

const staff = defineCollection({
  loader: file('src/content/staff.yaml'),
  schema: z.object({
    order: z.number().int(),
    role: z.string(),
    name: z.string(),
    email: z.email().optional(),
    // Numéro publié uniquement si renseigné ici (accord de la personne requis).
    phone: z.string().regex(/^0\d( \d\d){4}$/, 'Téléphone au format 06 12 34 56 78').optional(),
  }),
});

const players = defineCollection({
  loader: file('src/content/players.yaml'),
  schema: z.object({
    name: z.string(),
    number: z.number().int().min(0).max(99).optional(),
    position: z.enum(['gardien', 'défenseur', 'attaquant', 'coach']),
  }),
});

const partners = defineCollection({
  loader: file('src/content/partners.yaml'),
  schema: z.object({ order: z.number().int(), name: z.string(), url: z.url(), description: z.string() }),
});

const products = defineCollection({
  loader: file('src/content/products.yaml'),
  schema: ({ image }) =>
    z.object({
      order: z.number().int(),
      name: z.string(),
      price: z.number().positive(),
      image: image(),
      imageAlt: z.string(),
      available: z.boolean().default(true),
    }),
});

const videos = defineCollection({
  loader: file('src/content/videos.yaml'),
  schema: ({ image }) =>
    z.object({
      order: z.number().int(),
      group: z.string(),
      title: z.string(),
      youtubeId: z.string().regex(/^[\w-]{11}$/),
      thumbnail: image(),
    }),
});

const photos = defineCollection({
  loader: file('src/content/photos.yaml'),
  schema: ({ image }) => z.object({ order: z.number().int(), image: image(), alt: z.string(), caption: z.string().optional() }),
});

const documents = defineCollection({
  loader: file('src/content/documents.yaml'),
  schema: z.object({
    order: z.number().int(),
    title: z.string(),
    description: z.string(),
    // Chemin sous public/ (ex. documents/reglement-interieur.pdf)
    path: z.string().regex(/^documents\/[\w.-]+\.pdf$/),
  }),
});

export const collections = { news, seasons, venues, trainings, events, staff, players, partners, products, videos, photos, documents };
