/**
 * Throwaway preview harness — renders the authenticated Shell with mock data
 * (no Supabase, no auth) so the UI and animations can be viewed/screenshotted.
 * NOT part of the shipped app.
 */
import { StrictMode, useState, type ReactNode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { Shell } from "./App"
import { Toaster } from "@/components/ui/sonner"
import {
  AppContext,
  type AppContextValue,
  type DiplomaPrefill,
  type TabName,
} from "@/context/AppContext"
import { CATALOG } from "@/lib/catalog"
import type { Client, Contenu } from "@/lib/types"

const MOCK_CLIENTS: Client[] = [
  {
    id: "c1",
    prenom: "Martine",
    nom: "Dupont",
    telephone: "06 12 34 56 78",
    appareil: "Tablette Samsung",
    statut: "actif",
    notes: "A peur des arnaques par SMS.",
    created_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "c2",
    prenom: "Robert",
    nom: "Lefèvre",
    telephone: "06 98 76 54 32",
    appareil: "Ordinateur portable HP",
    statut: "prospect",
    notes: null,
    created_at: "2026-06-10T10:00:00Z",
  },
  {
    id: "c3",
    prenom: "Simone",
    nom: "Bernard",
    telephone: null,
    appareil: "iPhone",
    statut: "termine",
    notes: null,
    created_at: "2026-05-20T10:00:00Z",
  },
  {
    id: "c4",
    prenom: "André",
    nom: "Moreau",
    telephone: "06 55 44 33 22",
    appareil: "Tablette iPad",
    statut: "actif",
    notes: null,
    created_at: "2026-06-15T10:00:00Z",
  },
]

const MOCK_CONTENUS: Contenu[] = [
  {
    id: "b1",
    categorie: "tarifs",
    titre: "Forfait 5 séances à domicile",
    corps: "5 séances d'une heure : 200 €. Déplacement inclus dans un rayon de 15 km.",
    created_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "b2",
    categorie: "anti_objections",
    titre: "« C'est trop cher »",
    corps: "Rappeler la valeur : autonomie retrouvée, sécurité face aux arnaques, lien avec la famille.",
    created_at: "2026-06-02T10:00:00Z",
  },
  {
    id: "b3",
    categorie: "scripts_b2b",
    titre: "Appel à une maison de retraite",
    corps: "Bonjour, je propose des ateliers numériques adaptés à vos résidents...",
    created_at: "2026-06-03T10:00:00Z",
  },
]

function PreviewProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabName>("clients")
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null)
  const [diplomaPrefill, setDiplomaPrefill] = useState<DiplomaPrefill | null>(
    null
  )
  const noop = async () => {}

  const value: AppContextValue = {
    clients: MOCK_CLIENTS,
    cours: CATALOG,
    contenus: MOCK_CONTENUS,
    loadClients: noop,
    loadCours: noop,
    loadContenus: noop,
    activeTab,
    setActiveTab,
    openCourse: (id) => {
      setPendingCourseId(id)
      setActiveTab("cours")
    },
    pendingCourseId,
    clearPendingCourse: () => setPendingCourseId(null),
    prepDiplome: (p) => {
      setDiplomaPrefill(p)
      setActiveTab("diplome")
    },
    diplomaPrefill,
    clearDiplomaPrefill: () => setDiplomaPrefill(null),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="mx-auto max-w-[760px] px-4 pt-5 pb-20">
      <PreviewProvider>
        <Shell />
      </PreviewProvider>
      <Toaster />
    </div>
  </StrictMode>
)
