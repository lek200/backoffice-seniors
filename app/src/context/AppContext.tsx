import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { toast } from "sonner"

import { CATALOG } from "@/lib/catalog"
import { sb } from "@/lib/supabase"
import type { Client, Contenu, Cours } from "@/lib/types"

/** Built-in catalog first, then any Supabase courses not already covered. */
function mergeCatalog(dbCours: Cours[]): Cours[] {
  const ids = new Set(CATALOG.map((c) => c.id))
  return [...CATALOG, ...dbCours.filter((c) => !ids.has(c.id))]
}

export type TabName = "clients" | "bilan" | "cours" | "biblio" | "diplome"

export interface DiplomaPrefill {
  name: string
  module: string
}

export interface AppContextValue {
  clients: Client[]
  cours: Cours[]
  contenus: Contenu[]
  loadClients: () => Promise<void>
  loadCours: () => Promise<void>
  loadContenus: () => Promise<void>

  activeTab: TabName
  setActiveTab: (t: TabName) => void

  /** Open a course in the Cours player (switches tab). */
  openCourse: (id: string) => void
  pendingCourseId: string | null
  clearPendingCourse: () => void

  /** Prefill and jump to the Diplôme tab. */
  prepDiplome: (prefill: DiplomaPrefill) => void
  diplomaPrefill: DiplomaPrefill | null
  clearDiplomaPrefill: () => void
}

// Exported so a mock provider (e.g. the preview harness) can supply a value.
// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [cours, setCours] = useState<Cours[]>(CATALOG)
  const [contenus, setContenus] = useState<Contenu[]>([])
  const [activeTab, setActiveTab] = useState<TabName>("clients")
  const [pendingCourseId, setPendingCourseId] = useState<string | null>(null)
  const [diplomaPrefill, setDiplomaPrefill] = useState<DiplomaPrefill | null>(
    null
  )

  const loadClients = useCallback(async () => {
    const { data, error } = await sb
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) {
      toast.error("Erreur de chargement clients")
      return
    }
    setClients((data as Client[]) || [])
  }, [])

  const loadCours = useCallback(async () => {
    const { data, error } = await sb
      .from("cours")
      .select("*")
      .order("domaine")
      .order("niveau")
    setCours(mergeCatalog(error ? [] : ((data as Cours[]) || [])))
  }, [])

  const loadContenus = useCallback(async () => {
    const { data, error } = await sb
      .from("contenus")
      .select("*")
      .order("created_at")
    if (error) {
      toast.error("Erreur de chargement")
      return
    }
    setContenus((data as Contenu[]) || [])
  }, [])

  // Initial load once the provider mounts (user is authenticated by then).
  useEffect(() => {
    loadClients()
    loadCours()
    loadContenus()
  }, [loadClients, loadCours, loadContenus])

  const openCourse = useCallback((id: string) => {
    setPendingCourseId(id)
    setActiveTab("cours")
  }, [])

  const prepDiplome = useCallback((prefill: DiplomaPrefill) => {
    setDiplomaPrefill(prefill)
    setActiveTab("diplome")
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      clients,
      cours,
      contenus,
      loadClients,
      loadCours,
      loadContenus,
      activeTab,
      setActiveTab,
      openCourse,
      pendingCourseId,
      clearPendingCourse: () => setPendingCourseId(null),
      prepDiplome,
      diplomaPrefill,
      clearDiplomaPrefill: () => setDiplomaPrefill(null),
    }),
    [
      clients,
      cours,
      contenus,
      loadClients,
      loadCours,
      loadContenus,
      activeTab,
      openCourse,
      pendingCourseId,
      prepDiplome,
      diplomaPrefill,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
