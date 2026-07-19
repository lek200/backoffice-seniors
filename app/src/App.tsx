import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import {
  Award,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Library,
  LogOut,
  Users,
  type LucideIcon,
} from "lucide-react"
import type { Session } from "@supabase/supabase-js"

import { Login } from "@/components/Login"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { BilanTab } from "@/components/tabs/BilanTab"
import { BiblioTab } from "@/components/tabs/BiblioTab"
import { ClientsTab } from "@/components/tabs/ClientsTab"
import { CoursTab } from "@/components/tabs/CoursTab"
import { DiplomeTab } from "@/components/tabs/DiplomeTab"
import { AppProvider, useApp, type TabName } from "@/context/AppContext"
import { sb } from "@/lib/supabase"

const TABS: { value: TabName; label: string; icon: LucideIcon }[] = [
  { value: "clients", label: "Clients", icon: Users },
  { value: "bilan", label: "Bilan", icon: ClipboardCheck },
  { value: "cours", label: "Cours", icon: BookOpen },
  { value: "biblio", label: "Bibliothèque", icon: Library },
  { value: "diplome", label: "Diplôme", icon: Award },
]

function TabPanel({ tab }: { tab: TabName }) {
  switch (tab) {
    case "clients":
      return <ClientsTab />
    case "bilan":
      return <BilanTab />
    case "cours":
      return <CoursTab />
    case "biblio":
      return <BiblioTab />
    case "diplome":
      return <DiplomeTab />
  }
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = sb.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <div className="mx-auto max-w-[760px] px-4 pt-5 pb-20">
      {!ready ? null : session ? (
        <AppProvider>
          <Shell />
        </AppProvider>
      ) : (
        <Login />
      )}
      <Toaster />
    </div>
  )
}

export function Shell() {
  const { activeTab, setActiveTab } = useApp()
  const reduce = useReducedMotion()

  async function logout() {
    await sb.auth.signOut()
  }

  return (
    <section>
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-white"
            style={{
              background:
                "linear-gradient(150deg, #3d6390 0%, var(--blue) 45%, var(--blue-deep) 100%)",
              boxShadow: "0 8px 20px -10px rgba(51,86,127,0.7)",
            }}
          >
            <GraduationCap className="size-6" />
          </div>
          <div>
            <h1 className="text-[22px] leading-tight font-extrabold tracking-tight">
              Back-office
            </h1>
            <p className="text-muted-foreground text-sm">
              Cours d'informatique pour seniors
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </Button>
      </header>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabName)}
        className="mt-5"
      >
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1.5 rounded-2xl border border-[color:var(--line)] bg-white/70 p-1.5 shadow-[var(--shadow-card)] backdrop-blur">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_8px_18px_-10px_rgba(51,86,127,0.8)] min-h-11 flex-1 gap-2 rounded-xl px-3 py-2.5 text-[15px] font-semibold"
              >
                <Icon className="size-[18px]" />
                <span>{t.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {/* Smooth transition each time the active tab changes. */}
      <div className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={reduce ? false : { opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -14 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <TabPanel tab={activeTab} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
