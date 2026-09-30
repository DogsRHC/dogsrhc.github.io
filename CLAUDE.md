# Site des Dogs de Meudon (roller hockey)

Site vitrine du club, remplace l'ancien site Jimdo (dogs-rollerhockey.jimdofree.com).
Site statique Astro 7, aucun traceur, polices auto-hébergées. Seul JavaScript : la bascule de thème (quelques lignes).

## Commandes

- `npm run dev` : serveur local (http://localhost:4321). En tâche de fond : `npx astro dev --background`, puis `astro dev stop|status|logs`.
- `npm run build` : génère `dist/`. Échoue si une donnée de `src/content/` ne respecte pas son schéma.
- `npm run check` : types (`astro check`) + contrôles éditoriaux sur `dist/` (lancer après un build).
- `npm run check:release` : idem, mais échoue aussi s'il reste des « À COMPLÉTER ». C'est ce que lance la CI avant de publier.

## Où est quoi

- `src/content.config.ts` : schémas (Zod 4, `import { z } from 'astro/zod'`) de toutes les collections.
- `src/content/` : **tout le contenu éditable**, sans toucher au code :
  - `news/*.md` : actus (frontmatter `title`, `date`, `summary`, `image`, `imageAlt`, `draft`).
  - `seasons/AAAA-AAAA.yaml` : une saison par fichier (matchs, tournois, `honour: champion | vice-champion`).
    Le palmarès (bannières, « N titres ») est **calculé** depuis `honour` : ne jamais l'écrire en dur.
  - `trainings.yaml` + `venues.yaml` : créneaux et gymnases (référence par id).
  - `events.yaml` : agenda ; seuls les événements futurs (à la date du build) s'affichent.
  - `staff.yaml`, `players.yaml`, `partners.yaml`, `products.yaml`, `videos.yaml`, `photos.yaml`, `documents.yaml`.
- `src/config/site.ts` : identité du club, email, lien HelloAsso de la saison, réseaux, menu.
- `src/lib/data.ts` : accès aux collections, tris, calculs dérivés (palmarès, bilans V/N/D).
- `src/lib/format.ts` : formatage FR (dates en Europe/Paris), `href()` pour préfixer la base.
- `src/pages/*.md` avec `layout: …/Prose.astro` : pages de texte (règlement intérieur, mentions légales).
- `public/documents/` : PDF d'inscription. `src/assets/` : images (optimisées au build en webp).

## Règles éditoriales (vérifiées par `scripts/check-content.mjs` quand c'est automatisable)

- Tutoiement, ton simple de club. Pas de formules marketing, pas d'emoji dans les textes, pas de cartes à icônes.
- **Jamais de tiret cadratin (—) ni demi-cadratin (–)** dans un texte visible : parenthèses, virgule ou deux-points.
- Ne rien inventer : chaque fait (date, score, horaire, titre) vient du club. En cas de doute, demander.
- Le règlement intérieur est un texte voté en AG : ne pas le reformuler, seulement le mettre à jour sur décision du bureau.
- Données personnelles : prénom + nom et rôle pour le bureau ; les téléphones ne sont publiés que s'ils sont
  renseignés dans `staff.yaml` avec l'accord de la personne. Effectif : prénoms et numéros seulement.
- Aucun service tiers chargé par les pages (pas de Google Fonts, pas d'iframe YouTube, pas de carte intégrée) :
  vignettes vidéo stockées localement, liens OpenStreetMap.

## Liens internes

Toujours `href('/chemin/')` dans les `.astro` (gère un éventuel sous-dossier `BASE_PATH`). Les liens écrits
en dur dans les `.md` supposent un site servi à la racine d'un domaine.

## Déploiement

GitHub Pages via `.github/workflows/deploy.yml` (push sur `main`, tous les lundis, ou manuel).
Variables du dépôt : `SITE_URL` (ex. `https://www.domaine-du-club.fr`, active sitemap et balises canoniques)
et `BASE_PATH` (seulement sans domaine perso, ex. `/nom-du-depot`).

## Identité visuelle et thèmes

Deux directions artistiques en comparaison, basculées par le bouton « Clair | Sombre » de l'en-tête
(`src/components/ThemeToggle.astro`), mémorisées dans `localStorage` (`dogs-theme`), forçables par
`?theme=light|dark` dans l'URL. Le thème est posé sur `<html data-theme>` par un script inline de
`Base.astro`, avant l'affichage.

Les couleurs sont des **rôles** définis par thème dans `src/styles/global.css` : `--paper` (fond),
`--ice` (sections alternées), `--surface` (cartes), `--ink`/`--ink-soft` (texte), `--heading`, `--rule`
(filets épais), `--line`, `--accent` (rouge en texte), `--band` (bandeaux sombres), `--navy-deep` (pied).
Ne jamais écrire `color: var(--navy)` ou `background: #fff` sur un fond clair : utiliser le rôle,
sinon la DA sombre casse. Les littéraux ne sont légitimes que sur un fond fixe (bannière blanche, pastilles).
Quand le club aura choisi, soit on supprime l'autre thème, soit on garde les deux en suivant
`prefers-color-scheme` (une ligne dans le script de `Base.astro`).

Marine `#0e1a4b`, rouge `#b3141d`, bleu husky `#c9dbeb` (tirés du logo). Titres en Big Shoulders Display,
texte en Barlow. Motif récurrent : rayures de bas de maillot (`.stripes`). Palmarès en bannières de patinoire.
Le logo (`src/assets/logo-dogs.png`) a été détouré depuis un JPEG 960 px : remplacer par l'original vectoriel dès qu'on l'a.

## Licences

Projet propriétaire (`"license": "UNLICENSED"`, `"private": true`). Audit du 2026-09-30 (`npx license-checker`) :
tout est permissif sauf `sharp` (LGPL-3.0, libvips) et `lightningcss` (MPL-2.0), outils de build non livrés
dans `dist/` : acceptés à ce titre. Polices Big Shoulders Display et Barlow en OFL-1.1 (intégration web autorisée).
