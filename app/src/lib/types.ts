// ============================================================
// Domain types mirroring the Supabase tables.
// ============================================================

export type Statut = "prospect" | "actif" | "termine"

export interface Client {
  id: string
  prenom: string
  nom: string | null
  telephone: string | null
  appareil: string | null
  statut: Statut
  notes: string | null
  created_at: string
}

/** One answered question inside a saved bilan score. */
export interface BilanQuestion {
  q: string
  reponse: number // 0 | 1 | 2
}

/** Per-domain score block stored in bilans.scores (jsonb). */
export interface BilanDomainScore {
  domaine: string
  score: number
  questions: BilanQuestion[]
}

export interface Bilan {
  id: string
  client_id: string
  scores: BilanDomainScore[]
  notes: string | null
  created_at: string
}

export interface FeuilleRoute {
  id: string
  client_id: string
  contenu: string
  premier_cours: string | null
  created_at: string
}

export interface Progression {
  id: string
  client_id: string
  cours_id: string
  score_quiz: number
  total_quiz: number
  created_at: string
}

/** A quiz question inside a course (cours.quiz jsonb). */
export interface CoursQuiz {
  q: string
  options: string[]
  bonne: number
  bravo?: string
  aide?: string
}

export interface Cours {
  id: string
  titre: string
  domaine: string
  niveau: 1 | 2 | 3
  corps: string | null
  situation: string | null
  quiz: CoursQuiz[] | null
  statut: string // 'publie' | other
}

export type ContenuCategorie =
  | "anti_objections"
  | "scripts_b2b"
  | "modules"
  | "quiz"
  | "tarifs"

export interface Contenu {
  id: string
  categorie: string
  titre: string
  corps: string
  created_at: string
}
