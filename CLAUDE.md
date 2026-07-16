# Back-office — Cours d'informatique pour seniors

Application de back-office pour un formateur qui donne des cours d'informatique
à domicile à des personnes âgées : gestion des clients, bilan numérique (quiz),
catalogue de cours (lecteur en diapositives + quiz), bibliothèque de contenus
commerciaux, et génération de diplômes.

## Structure du dépôt

- **`index.html`, `bilan-numerique.html`, `config.js`** — version statique
  d'origine (HTML/CSS/JS, dépendances via CDN, Supabase). `bilan-numerique.html`
  est un outil autonome **hors-ligne** (aucune connexion, rapport copiable) que
  l'on ouvre devant le client.
- **`app/`** — portage React de `index.html` : Vite + React + TypeScript +
  Tailwind v4 + shadcn/ui. C'est la base à faire évoluer.

## Règles de design (IMPORTANT — s'y conformer partout)

Le public est senior. Toute UI, existante ou nouvelle, doit respecter :

1. **Mode clair uniquement.** Pas de dark mode. Fond crème chaud, texte encre
   foncé. Ne pas ajouter de bascule de thème ni de styles sombres.
2. **Polices grandes et lisibles.** Taille de base **≥ 17px**, texte de contenu
   **16–17px minimum**. Ne jamais réduire le texte des champs/boutons sur
   desktop (pas de `md:text-sm`). Bon contraste (WCAG AA, 4.5:1 minimum).
3. **Gros boutons espacés.** Cibles tactiles hautes (**≥ 44px**, soit `h-11`/
   `h-12`), pleine largeur pour les actions principales, espacement généreux
   entre les éléments cliquables. `cursor-pointer` sur tout ce qui est cliquable.
4. **Animations fluides avec `motion`.** Utiliser la librairie
   [`motion`](https://motion.dev) (`import { motion } from "motion/react"`) pour
   les transitions. Rester **doux et court** (~0.25–0.3s, `easeOut`). Toujours
   respecter `prefers-reduced-motion` (voir `useReducedMotion`, helper
   `src/components/Motion.tsx`).
5. **Icônes :** `lucide-react` (jamais d'emoji comme icône).
6. **États visibles :** focus clavier net (anneau miel), survol avec transition
   douce (150–300ms).

### Palette de marque (déjà en variables CSS dans `app/src/index.css`)

| Rôle        | Couleur   |
| ----------- | --------- |
| Fond        | `#FBFAF7` |
| Texte       | `#22303C` |
| Bleu (CTA)  | `#33567F` |
| Miel (focus)| `#D99A2B` |
| Vert        | `#4E7A5A` |
| Rouge doux  | `#8C4A3E` |

Les jetons shadcn (`--primary`, `--background`, etc.) sont mappés sur cette
palette : utiliser les composants shadcn normalement, ils héritent du style.

## Lancer l'app React

```bash
cd app
npm install
npm run dev      # serveur de dev
npm run build    # tsc -b && vite build (doit passer avant tout commit)
```

## shadcn/ui

Composants dans `app/src/components/ui/`. La CLI shadcn (`npx shadcn@latest add …`)
récupère ses composants depuis `ui.shadcn.com` — **hôte bloqué par la politique
réseau de l'environnement cloud**. Sur cet environnement, ajouter les composants
à la main ; en local, la CLI fonctionne (le projet a déjà `components.json`,
style `new-york`, base `neutral`, alias `@/*`).

## Supabase

Configuration dans `app/src/lib/config.ts` (surchargée par les variables Vite
`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_EDGE_FUNCTION` dans un
`.env.local`). La clé `anon` est **publique** — sans danger dans le dépôt.
Tables : `clients`, `bilans`, `feuilles_route`, `progressions`, `cours`,
`contenus`. Génération IA (feuille de route, cours) via l'Edge Function
`generer-feuille-de-route`.
