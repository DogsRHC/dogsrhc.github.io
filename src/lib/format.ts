// Petites fonctions de formatage partagées. Toutes déterministes (fuseau Europe/Paris figé).

const TZ = 'Europe/Paris';

/** Préfixe un chemin interne avec la base du site (utile si le site est servi dans un sous-dossier). */
export function href(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `${base}/${path.replace(/^\//, '')}`;
}

export function formatDate(date: Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: TZ, ...opts }).format(date);
}

/** "20:30" → "20h30" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':');
  return `${Number(h)}h${m}`;
}

/** 2021 → "2021-2022" */
export function seasonLabel(startYear: number): string {
  return `${startYear}-${startYear + 1}`;
}

/** 2021 → "2021-22", format court des bannières */
export function seasonShort(startYear: number): string {
  return `${startYear}-${String(startYear + 1).slice(2)}`;
}

export function formatPrice(eur: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(eur);
}

const DAY_ORDER = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
export const dayIndex = (day: string) => DAY_ORDER.indexOf(day);

/** Lien OpenStreetMap vers une adresse (pas de carte intégrée : aucun traceur tiers). */
export function mapUrl(query: string): string {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

/** Numéro "06 12 34 56 78" → "tel:+33612345678" */
export function telHref(phone: string): string {
  return `tel:+33${phone.replace(/\s/g, '').slice(1)}`;
}
