// Informations générales du club, utilisées dans tout le site.
// Pour le contenu qui change souvent (actus, résultats, horaires, agenda), voir src/content/.

export const site = {
  name: 'Les Dogs',
  fullName: 'Les Dogs de Meudon Roller Hockey Club',
  // Nom de l'association tel qu'il figure sur HelloAsso.
  legalName: 'Les Dogs Street Hockey Club',
  founded: 1998,
  city: 'Meudon',
  district: 'Meudon-la-Forêt',
  description:
    'Club de roller hockey de Meudon-la-Forêt depuis 1998. Entraînements le mardi soir et le samedi après-midi, équipe engagée en championnat régional.',

  email: 'info.dogsrhc@gmail.com',

  // Saison ouverte aux inscriptions et lien du formulaire d'adhésion.
  registration: {
    season: '2026-2027',
    open: true,
    url: 'https://www.helloasso.com/associations/les-dogs-street-hockey-club/adhesions/adhesion-saison-2026-2027',
    minimumAge: 16,
  },

  social: {
    facebook: 'https://www.facebook.com/LesDogsDeMeudon',
    instagram: 'https://www.instagram.com/lesdogs_streethockey/',
  },

  // Album photo complet (hébergé hors du site).
  fullAlbumUrl: 'https://www.dropbox.com/sh/ipjuu6t94oimzy1/AABJm-Uajgpc55ETT9Q_GdfRa',
} as const;

export type NavItem = { href: string; label: string };

export const nav: NavItem[] = [
  { href: '/club/', label: 'Le club' },
  { href: '/entrainements/', label: 'Entraînements' },
  { href: '/resultats/', label: 'Résultats' },
  { href: '/actus/', label: 'Actus' },
  { href: '/photos/', label: 'Photos' },
  { href: '/boutique/', label: 'Boutique' },
  { href: '/contact/', label: 'Contact' },
];
