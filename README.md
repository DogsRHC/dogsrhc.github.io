# Les Dogs de Meudon, site du club

Site du club de roller hockey Les Dogs (Meudon-la-Forêt, depuis 1998).

## Mettre à jour le contenu

Tout le contenu est dans `src/content/`, en fichiers texte :

| Je veux…                         | Fichier                                   |
| -------------------------------- | ----------------------------------------- |
| publier une actu                 | ajouter un `.md` dans `src/content/news/` |
| ajouter un score                 | `src/content/seasons/2026-2027.yaml`      |
| marquer un titre de champion     | `honour: champion` dans le fichier saison |
| annoncer un match, un tournoi    | `src/content/events.yaml`                 |
| changer un horaire ou un gymnase | `trainings.yaml`, `venues.yaml`           |
| changer le lien HelloAsso        | `src/config/site.ts`                      |

Chaque fichier est vérifié à la construction du site : une date mal écrite ou un champ oublié
bloque la publication avec un message qui dit quoi corriger.

## Développement

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/
npm run check    # types + contrôles éditoriaux
```

Code propriétaire de l'association, tous droits réservés.
