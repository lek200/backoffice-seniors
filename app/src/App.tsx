import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"

import { Login } from "@/components/Login"
import { FadeIn } from "@/components/Motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/sonner"
import { BilanTab } from "@/components/tabs/BilanTab"
import { BiblioTab } from "@/components/tabs/BiblioTab"
import { ClientsTab } from "@/components/tabs/ClientsTab"
import { CoursTab } from "@/components/tabs/CoursTab"
import { DiplomeTab } from "@/components/tabs/DiplomeTab"
import { AppProvider, useApp, type TabName } from "@/context/AppContext"
import { sb } from "@/lib/supabase"

const TABS: { value: TabName; label: string }[] = [
  { value: "clients", label: "Clients" },
  { value: "bilan", label: "Bilan" },
  { value: "cours", label: "Cours" },
  { value: "biblio", label: "Bibliothèque" },
  { value: "diplome", label: "Diplôme" },
]

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

function Shell() {
  const { activeTab, setActiveTab } = useApp()

  async function logout() {
    await sb.auth.signOut()
  }

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Back-office</h1>
        <Button variant="outline" size="sm" onClick={logout}>
          Déconnexion
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabName)}
        className="mt-5"
      >
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-2xl p-1.5">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground min-h-11 flex-1 rounded-xl px-3 py-2.5 text-[15px] font-semibold"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="clients" className="mt-6">
          <FadeIn>
            <ClientsTab />
          </FadeIn>
        </TabsContent>
        <TabsContent value="bilan" className="mt-6">
          <FadeIn>
            <BilanTab />
          </FadeIn>
        </TabsContent>
        <TabsContent value="cours" className="mt-6">
          <FadeIn>
            <CoursTab />
          </FadeIn>
        </TabsContent>
        <TabsContent value="biblio" className="mt-6">
          <FadeIn>
            <BiblioTab />
          </FadeIn>
        </TabsContent>
        <TabsContent value="diplome" className="mt-6">
          <FadeIn>
            <DiplomeTab />
          </FadeIn>
        </TabsContent>
      </Tabs>
    </section>
  )
}
