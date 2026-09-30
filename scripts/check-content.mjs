// Contrôles éditoriaux sur le site construit (dist/). À lancer après `astro build`.
//
//   node scripts/check-content.mjs            → signale les problèmes, échoue sur les erreurs
//   node scripts/check-content.mjs --release  → échoue aussi s'il reste des « À COMPLÉTER »
//
// Avec SITE_MODE=preview (version de travail) : les « À COMPLÉTER » restent des avertissements,
// mais chaque page DOIT porter la consigne noindex (une version de travail ne doit pas être indexée).
//
// Règles :
//  - pas de tiret cadratin (—) ni demi-cadratin (–) dans le texte visible : on écrit avec des
//    parenthèses, des virgules ou deux-points ;
//  - aucun marqueur « À COMPLÉTER » en ligne (bloquant pour une mise en production).
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const preview = process.env.SITE_MODE === 'preview';
const release = process.argv.includes('--release') && !preview;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

/** Texte visible d'une page : sans <script>, <style>, commentaires ni balises. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

const errors = [];
const warnings = [];
let pages = 0;

for await (const file of htmlFiles(DIST)) {
  pages++;
  const rel = relative(DIST, file);
  const html = await readFile(file, 'utf8');
  const text = visibleText(html);
  if (preview && !/<meta name="robots" content="noindex, nofollow"/.test(html)) {
    errors.push(`${rel} : version de travail sans balise noindex`);
  }
  for (const m of text.matchAll(/.{0,40}[—–].{0,40}/g)) {
    errors.push(`${rel} : tiret long dans « ${m[0].trim()} »`);
  }
  for (const m of text.matchAll(/.{0,30}À COMPLÉTER.{0,50}/g)) {
    (release ? errors : warnings).push(`${rel} : à compléter « ${m[0].trim()} »`);
  }
}

if (pages === 0) {
  console.error('Aucune page trouvée dans dist/. Lance `npm run build` avant.');
  process.exit(1);
}
for (const w of warnings) console.warn(`⚠ ${w}`);
for (const e of errors) console.error(`✗ ${e}`);
if (preview) console.log('Mode version de travail (SITE_MODE=preview).');
console.log(`${pages} pages vérifiées : ${errors.length} erreur(s), ${warnings.length} avertissement(s).`);
process.exit(errors.length ? 1 : 0);
