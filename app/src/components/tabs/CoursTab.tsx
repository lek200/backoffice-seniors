import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ChevronRight, Search } from "lucide-react"
import { toast } from "sonner"

import { Stagger, StaggerItem } from "@/components/Motion"
import { ToneBadge } from "@/components/ToneBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApp } from "@/context/AppContext"
import { NIVEAUX, NIVEAU_CLS } from "@/lib/domains"
import { domainMeta } from "@/lib/domainMeta"
import { buildSlides, type Slide } from "@/lib/slides"
import { CONFIG } from "@/lib/config"
import { sb } from "@/lib/supabase"
import type { Cours } from "@/lib/types"
import { cn } from "@/lib/utils"

export function CoursTab() {
  const { cours, pendingCourseId, clearPendingCourse } = useApp()
  const [playerId, setPlayerId] = useState<string | null>(null)

  // Open a course requested from another tab.
  useEffect(() => {
    if (pendingCourseId) {
      setPlayerId(pendingCourseId)
      clearPendingCourse()
    }
  }, [pendingCourseId, clearPendingCourse])

  const current = playerId ? cours.find((c) => c.id === playerId) : null

  if (current) {
    return <CoursPlayer cours={current} onBack={() => setPlayerId(null)} />
  }
  return <CoursList onOpen={setPlayerId} />
}

// ------------------------------------------------------------
// Catalog
// ------------------------------------------------------------
function CoursList({ onOpen }: { onOpen: (id: string) => void }) {
  const { cours, loadCours } = useApp()
  const [query, setQuery] = useState("")
  const [domaine, setDomaine] = useState<string>("all")

  const domaines = useMemo(
    () => [...new Set(cours.map((c) => c.domaine))],
    [cours]
  )

  const list = useMemo(() => {
    let l = cours
    if (domaine !== "all") l = l.filter((c) => c.domaine === domaine)
    const q = query.toLowerCase()
    if (q)
      l = l.filter((c) =>
        `${c.titre} ${c.domaine} ${c.corps ?? ""}`.toLowerCase().includes(q)
      )
    return l
  }, [cours, domaine, query])

  const nbDomaines = domaines.length

  return (
    <div>
      <h2 className="text-[22px] font-bold tracking-tight">Catalogue de cours</h2>
      <p className="text-muted-foreground mb-4 text-[15px]">
        {cours.length} cours · {nbDomaines} domaines · 3 niveaux
      </p>
      <div className="relative mb-3">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          className="h-12 pl-10"
          placeholder="Rechercher un cours (Excel, imprimante, arnaque...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Label>Domaine</Label>
      <Select value={domaine} onValueChange={setDomaine}>
        <SelectTrigger className="mt-2 h-12 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            Tous les domaines ({cours.length} cours)
          </SelectItem>
          {domaines.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-4 flex flex-col gap-3">
        {!cours.length ? (
          <p className="text-muted-foreground text-sm">
            Aucun cours en base. Exécute cours.sql et extension.sql dans
            Supabase.{" "}
            <button className="underline" onClick={() => loadCours()}>
              Recharger
            </button>
          </p>
        ) : !list.length ? (
          <p className="text-muted-foreground text-sm">
            Aucun cours ne correspond à cette recherche.
          </p>
        ) : (
          <Stagger className="flex flex-col gap-3">
            {list.map((c) => {
              const meta = domainMeta(c.domaine)
              const Icon = meta.icon
              return (
                <StaggerItem key={c.id}>
                  <Card
                    className="hover:border-primary cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] motion-reduce:transform-none"
                    onClick={() => onOpen(c.id)}
                  >
                    <CardContent className="flex items-center gap-4">
                      <div
                        className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-[inset_0_-2px_6px_rgba(0,0,0,0.12)]"
                        style={{ background: meta.gradient }}
                      >
                        <Icon className="size-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[16.5px] font-bold">{c.titre}</h3>
                        <p className="text-muted-foreground truncate text-sm">
                          {c.domaine}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {c.statut !== "publie" && (
                          <ToneBadge tone="prospect">À générer</ToneBadge>
                        )}
                        <ToneBadge tone={NIVEAU_CLS[c.niveau]}>
                          {NIVEAUX[c.niveau]}
                        </ToneBadge>
                      </div>
                      <ChevronRight className="size-5 shrink-0 text-[#c7cdd4]" />
                    </CardContent>
                  </Card>
                </StaggerItem>
              )
            })}
          </Stagger>
        )}
      </div>
    </div>
  )
}

// ------------------------------------------------------------
// Slide player
// ------------------------------------------------------------
interface QuizResult {
  choice: number
  correct: boolean
}

function CoursPlayer({ cours, onBack }: { cours: Cours; onBack: () => void }) {
  const { clients, loadCours, openCourse } = useApp()
  const published = cours.statut === "publie"

  const slides = useMemo<Slide[]>(
    () => (published ? buildSlides(cours) : []),
    [published, cours]
  )
  const [idx, setIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const [quizResults, setQuizResults] = useState<Record<number, QuizResult>>({})
  const [generating, setGenerating] = useState(false)
  const [progClient, setProgClient] = useState<string>(clients[0]?.id ?? "")
  const reduce = useReducedMotion()

  function goTo(nextIdx: number, direction: number) {
    setDir(direction)
    setIdx(nextIdx)
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    setIdx(0)
    setQuizResults({})
    window.scrollTo({ top: 0 })
  }, [cours.id])

  async function generateCours() {
    setGenerating(true)
    try {
      const { data: session } = await sb.auth.getSession()
      const res = await fetch(
        `${CONFIG.SUPABASE_URL}/functions/v1/${CONFIG.EDGE_FUNCTION}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${session.session?.access_token}`,
          },
          body: JSON.stringify({
            type: "cours",
            titre: cours.titre,
            domaine: cours.domaine,
            niveau: cours.niveau,
            description: cours.corps,
          }),
        }
      )
      const out = await res.json()
      if (out.error) throw new Error(out.error)
      const { error } = await sb
        .from("cours")
        .update({
          corps: out.corps,
          quiz: out.quiz,
          situation: out.situation,
          statut: "publie",
        })
        .eq("id", cours.id)
      if (error) throw error
      toast.success("Cours généré et publié")
      await loadCours()
      openCourse(cours.id) // re-open with fresh data
    } catch (e) {
      toast.error("Génération impossible : " + (e as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  const meta = domainMeta(cours.domaine)
  const HeaderIcon = meta.icon

  const Header = (
    <>
      <BackLink onClick={onBack} />
      <div className="my-2 flex items-center gap-3.5">
        <div
          className="flex size-[54px] shrink-0 items-center justify-center rounded-2xl text-white shadow-[inset_0_-2px_6px_rgba(0,0,0,0.12)]"
          style={{ background: meta.gradient }}
        >
          <HeaderIcon className="size-7" />
        </div>
        <div>
          <span
            className="inline-block rounded-full px-3 py-1 text-sm font-semibold"
            style={{ background: "var(--accent)", color: "var(--blue)" }}
          >
            {cours.domaine} · {NIVEAUX[cours.niveau]}
          </span>
          <h2 className="mt-2 text-lg font-bold">{cours.titre}</h2>
        </div>
      </div>
    </>
  )

  if (!published) {
    return (
      <div>
        {Header}
        <Card className="slide-card">
          <CardContent className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">
              Fiche du catalogue, cours pas encore rédigé
            </h3>
            <pre className="pre-wrap text-[15px] leading-relaxed">
              {cours.corps || ""}
            </pre>
            <p className="text-muted-foreground text-sm">
              Deux façons de le créer : le bouton ci-dessous (nécessite l'Edge
              Function déployée et des crédits API), ou demande à Claude de
              rédiger ce cours et colle le SQL fourni dans Supabase.
            </p>
            <Button
              className="h-12 text-base"
              disabled={generating}
              onClick={generateCours}
            >
              {generating
                ? "Génération en cours (30 à 60 s)..."
                : "Générer ce cours (IA)"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const total = slides.length
  const s = slides[idx]
  const pct = Math.round((idx / (total - 1)) * 100)

  return (
    <div>
      {Header}
      <p className="text-muted-foreground mb-1.5 text-right text-[13px] font-semibold">
        {pct}% · écran {idx + 1} sur {total}
      </p>
      <div className="bg-border mb-5 h-[7px] overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, background: "var(--honey)" }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={idx}
          initial={reduce ? false : { opacity: 0, x: dir * 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -28 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <SlideBody
            slide={s}
            cours={cours}
            quizResults={quizResults}
            onAnswer={(num, res) =>
              setQuizResults((prev) =>
                prev[num] !== undefined ? prev : { ...prev, [num]: res }
              )
            }
            clients={clients}
            progClient={progClient}
            setProgClient={setProgClient}
          />
        </motion.div>
      </AnimatePresence>

      <div className="mt-4 flex gap-2.5">
        {idx > 0 && (
          <Button
            variant="outline"
            className="h-12 flex-1 text-base"
            onClick={() => goTo(idx - 1, -1)}
          >
            Précédent
          </Button>
        )}
        <Button
          className="h-12 flex-1 text-base"
          onClick={() =>
            idx < total - 1 ? goTo(idx + 1, 1) : goTo(0, -1)
          }
        >
          {idx === total - 1 ? "Revenir au début" : "Suivant"}
        </Button>
      </div>
    </div>
  )
}

function SlideBody({
  slide,
  cours,
  quizResults,
  onAnswer,
  clients,
  progClient,
  setProgClient,
}: {
  slide: Slide
  cours: Cours
  quizResults: Record<number, QuizResult>
  onAnswer: (num: number, res: QuizResult) => void
  clients: { id: string; prenom: string; nom: string | null }[]
  progClient: string
  setProgClient: (v: string) => void
}) {
  if (slide.type === "texte") {
    return (
      <Card>
        <CardContent className="flex flex-col gap-3.5">
          <h3 className="text-xl font-bold">{slide.titre}</h3>
          <pre className="pre-wrap text-[17px] leading-relaxed">
            {slide.contenu}
          </pre>
        </CardContent>
      </Card>
    )
  }

  if (slide.type === "situation") {
    return (
      <Card className="slide-situation">
        <CardContent className="flex flex-col gap-3.5">
          <h3 className="text-xl font-bold">Mise en situation</h3>
          <pre className="pre-wrap text-[17px] leading-relaxed">
            {slide.contenu}
          </pre>
        </CardContent>
      </Card>
    )
  }

  if (slide.type === "quiz") {
    const it = slide.item
    const prev = quizResults[slide.num]
    const answered = prev !== undefined
    return (
      <Card>
        <CardContent className="flex flex-col gap-3.5">
          <h3 className="text-xl font-bold">Question {slide.num}</h3>
          <p className="text-lg font-semibold">{it.q}</p>
          <div className="flex flex-col gap-2.5">
            {it.options.map((o, oi) => {
              let borderColor: string | undefined
              let background: string | undefined
              if (answered) {
                if (oi === it.bonne) {
                  borderColor = "var(--green)"
                  background = "var(--green-soft)"
                } else if (oi === prev.choice) {
                  borderColor = "#D9A79F"
                  background = "var(--red-soft)"
                }
              }
              return (
                <button
                  key={oi}
                  disabled={answered}
                  onClick={() =>
                    onAnswer(slide.num, {
                      choice: oi,
                      correct: oi === it.bonne,
                    })
                  }
                  className={cn(
                    "flex min-h-14 items-center gap-3 rounded-xl border bg-card p-4 text-left text-base font-medium transition-colors",
                    !answered && "hover:border-primary hover:bg-[#f7f9fc]",
                    answered && "cursor-default"
                  )}
                  style={{ borderColor, background }}
                >
                  <span className="answer-dot" />
                  <span>{o}</span>
                </button>
              )
            })}
          </div>
          {answered && (
            <p
              className="text-sm"
              style={{
                color: prev.correct ? "var(--green)" : "var(--red-ink)",
              }}
            >
              {prev.correct
                ? it.bravo || "Bonne réponse !"
                : it.aide || "Regardez la bonne réponse en vert."}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  // fin
  const totalQ = (cours.quiz || []).length
  const done = Object.keys(quizResults).length
  const good = Object.values(quizResults).filter((r) => r.correct).length

  async function saveProgression() {
    if (!progClient) {
      toast("Ajoute d'abord un client")
      return
    }
    const { error } = await sb.from("progressions").insert({
      client_id: progClient,
      cours_id: cours.id,
      score_quiz: good,
      total_quiz: totalQ,
    })
    if (error) {
      toast.error(
        "Erreur : la table progressions existe ? Exécute extension.sql"
      )
      return
    }
    toast.success("Progression enregistrée")
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3.5 text-center">
        <h3 className="text-xl font-bold">Cours terminé, bravo !</h3>
        {totalQ ? (
          <>
            <p
              className="text-[44px] font-bold"
              style={{ color: "var(--blue)" }}
            >
              {good} / {totalQ}
            </p>
            <p className="text-muted-foreground text-sm">
              bonnes réponses au quiz
              {done < totalQ ? ` (${totalQ - done} sans réponse)` : ""}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">
            Ce cours ne comporte pas de quiz.
          </p>
        )}
        <Label className="text-left">Enregistrer la progression pour</Label>
        <Select value={progClient} onValueChange={setProgClient}>
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder="Choisir un client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.prenom} {c.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button className="h-12 text-base" onClick={saveProgression}>
          Enregistrer la progression
        </Button>
      </CardContent>
    </Card>
  )
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-muted-foreground mb-3 inline-block cursor-pointer py-1.5 text-sm underline"
    >
      ← Quitter le cours
    </button>
  )
}
