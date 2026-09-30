// Accès aux collections, avec les tris et calculs dérivés au même endroit.
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { dayIndex } from './format';

export type Season = CollectionEntry<'seasons'>;
export type Match = Season['data']['competitions'][number]['matches'][number];

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function getNews() {
  const all = await getCollection('news', (e) => import.meta.env.DEV || !e.data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Saisons de la plus récente à la plus ancienne. */
export async function getSeasons() {
  const all = await getCollection('seasons');
  return all.sort((a, b) => b.data.startYear - a.data.startYear);
}

/** Palmarès calculé à partir des saisons (source unique : le champ `honour`). */
export async function getHonours() {
  const seasons = await getSeasons();
  const withHonour = seasons.filter((s) => s.data.honour).sort((a, b) => a.data.startYear - b.data.startYear);
  return {
    titles: withHonour.filter((s) => s.data.honour === 'champion'),
    runnersUp: withHonour.filter((s) => s.data.honour === 'vice-champion'),
  };
}

/** Bilan victoires / nuls / défaites de Meudon sur une liste de matchs joués. */
export function record(matches: Match[], us = 'Meudon') {
  let w = 0, d = 0, l = 0;
  for (const m of matches) {
    if (m.homeScore === undefined || m.awayScore === undefined || m.note === 'annulé') continue;
    const ours = m.home === us ? m.homeScore : m.awayScore;
    const theirs = m.home === us ? m.awayScore : m.homeScore;
    if (ours > theirs) w++;
    else if (ours < theirs) l++;
    else d++;
  }
  return { w, d, l, played: w + d + l };
}

export function outcome(m: Match, us = 'Meudon'): 'V' | 'N' | 'D' | null {
  if (m.homeScore === undefined || m.awayScore === undefined || m.note === 'annulé') return null;
  const ours = m.home === us ? m.homeScore : m.awayScore;
  const theirs = m.home === us ? m.awayScore : m.homeScore;
  return ours > theirs ? 'V' : ours < theirs ? 'D' : 'N';
}

export async function getTrainings() {
  const all = await getCollection('trainings');
  const sorted = all.sort((a, b) => dayIndex(a.data.day) - dayIndex(b.data.day) || a.data.start.localeCompare(b.data.start));
  return Promise.all(
    sorted.map(async (t) => {
      const venue = await getEntry(t.data.venue);
      if (!venue) throw new Error(`Lieu inconnu "${t.data.venue.id}" dans trainings.yaml (${t.id})`);
      return { ...t.data, id: t.id, venue: venue.data, venueId: venue.id };
    }),
  );
}

export async function getVenues() {
  return getCollection('venues');
}

/** Événements à venir à la date du build (le site est reconstruit chaque semaine). */
export async function getUpcomingEvents(now = new Date()) {
  const today = new Date(now.toISOString().slice(0, 10));
  const all = await getCollection('events', (e) => e.data.date >= today);
  const sorted = all.sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf());
  return Promise.all(
    sorted.map(async (e) => {
      const venue = e.data.venue ? await getEntry(e.data.venue) : undefined;
      return { ...e.data, id: e.id, venueName: venue?.data.name ?? e.data.place };
    }),
  );
}

export const getStaff = async () => (await getCollection('staff')).sort(byOrder);
export const getPartners = async () => (await getCollection('partners')).sort(byOrder);
export const getProducts = async () => (await getCollection('products')).sort(byOrder);
export const getVideos = async () => (await getCollection('videos')).sort(byOrder);
export const getPhotos = async () => (await getCollection('photos')).sort(byOrder);
export const getDocuments = async () => (await getCollection('documents')).sort(byOrder);

const POSITION_ORDER = ['coach', 'gardien', 'défenseur', 'attaquant'] as const;
export async function getRoster() {
  const players = await getCollection('players');
  return POSITION_ORDER.map((position) => ({
    position,
    players: players.filter((p) => p.data.position === position).sort((a, b) => (a.data.number ?? 100) - (b.data.number ?? 100)),
  })).filter((g) => g.players.length > 0);
}
