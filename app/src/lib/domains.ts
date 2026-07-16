// ============================================================
// Bilan quiz domains + shared helpers (ported from index.html).
// ============================================================

export interface Domain {
  name: string
  questions: string[]
}

export const DOMAINS: Domain[] = [
  {
    name: "Prise en main",
    questions: [
      "Allumer et déverrouiller votre appareil, vous le faites ?",
      "Cliquer ou appuyer exactement où vous voulez sur l'écran ?",
      "Écrire un petit texte avec le clavier ?",
      "Régler le son ou la taille des lettres à l'écran ?",
    ],
  },
  {
    name: "Internet au quotidien",
    questions: [
      "Ouvrir Internet et aller sur un site que vous connaissez ?",
      "Chercher une information sur Google (une recette, un horaire...) ?",
      "Revenir en arrière quand vous êtes perdu sur une page ?",
      "Retrouver une photo ou un document enregistré dans l'appareil ?",
    ],
  },
  {
    name: "E-mails et démarches",
    questions: [
      "Lire et envoyer un e-mail ?",
      "Ouvrir ou envoyer une pièce jointe (photo, document) ?",
      "Vous connecter à un compte en ligne (Ameli, impôts, banque...) ?",
      "Faire un achat ou un paiement sur Internet ?",
    ],
  },
  {
    name: "Sécurité et confiance",
    questions: [
      "Repérer un e-mail ou un SMS qui sent l'arnaque ?",
      "Gérer vos mots de passe sans les perdre ?",
      "Faire les mises à jour quand l'appareil les propose ?",
      "Savoir quoi faire (et qui appeler) en cas de doute ?",
    ],
  },
]

export const LABELS = ["Jamais fait", "Essayé mais difficile", "Sans problème"]

/** Flattened list of all quiz questions, in order. */
export interface FlatQuestion {
  di: number
  qi: number
  q: string
  domain: string
}

export const B_FLAT: FlatQuestion[] = DOMAINS.flatMap((d, di) =>
  d.questions.map((q, qi) => ({ di, qi, q, domain: d.name }))
)

export type LevelClass = "decouvrir" | "progres" | "fort"

export interface Level {
  cls: LevelClass
  label: string
}

export function levelOf(sum: number): Level {
  if (sum <= 3) return { cls: "decouvrir", label: "À découvrir ensemble" }
  if (sum <= 6) return { cls: "progres", label: "En bonne voie" }
  return { cls: "fort", label: "Point fort" }
}

export const NIVEAUX: Record<number, string> = {
  1: "Découverte",
  2: "Pratique",
  3: "Perfectionnement",
}

export const NIVEAU_CLS: Record<number, LevelClass> = {
  1: "decouvrir",
  2: "progres",
  3: "fort",
}

/** Recommended course level from a domain score. */
export function nivReco(score: number): 1 | 2 | 3 {
  return score <= 3 ? 1 : score <= 6 ? 2 : 3
}

const TILE_COLORS = [
  "#33567F",
  "#4E7A5A",
  "#8A6112",
  "#8C4A3E",
  "#5B4A7F",
  "#3E7A8C",
  "#7F4A33",
  "#556B2F",
]

export function tileColor(name: string): string {
  let h = 0
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return TILE_COLORS[h % TILE_COLORS.length]
}
