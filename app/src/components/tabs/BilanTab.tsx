import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"

import { ToneBadge } from "@/components/ToneBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApp } from "@/context/AppContext"
import { B_FLAT, DOMAINS, levelOf } from "@/lib/domains"
import { sb } from "@/lib/supabase"
import type { BilanDomainScore } from "@/lib/types"

type Phase = "setup" | "quiz" | "end"

const ANSWER_LABELS = [
  "Je ne l'ai jamais fait",
  "J'ai déjà essayé, mais c'est difficile",
  "Je le fais sans problème",
]

export function BilanTab() {
  const { clients } = useApp()
  const [phase, setPhase] = useState<Phase>("setup")
  const [clientId, setClientId] = useState<string>("")
  const [search, setSearch] = useState("")
  const [idx, setIdx] = useState(0)
  const [scores, setScores] = useState<number[]>([])
  const [notes, setNotes] = useState("")

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return q
      ? clients.filter((c) =>
          `${c.prenom} ${c.nom ?? ""}`.toLowerCase().includes(q)
        )
      : clients
  }, [clients, search])

  function startBilan() {
    if (!clientId) {
      toast("Sélectionne un client")
      return
    }
    setIdx(0)
    setScores([])
    setPhase("quiz")
  }

  function answer(v: number) {
    const next = [...scores]
    next[idx] = v
    setScores(next)
    if (idx < B_FLAT.length - 1) setIdx(idx + 1)
    else setPhase("end")
  }

  async function saveBilan() {
    const payload: BilanDomainScore[] = DOMAINS.map((d, di) => {
      let sum = 0
      const questions = d.questions.map((q, qi) => {
        const v = scores[di * 4 + qi]
        sum += v
        return { q, reponse: v }
      })
      return { domaine: d.name, score: sum, questions }
    })
    const { error } = await sb
      .from("bilans")
      .insert({ client_id: clientId, scores: payload, notes })
    if (error) {
      toast.error("Erreur à l'enregistrement")
      return
    }
    toast.success("Bilan enregistré")
    setNotes("")
    setPhase("setup")
  }

  // ---- setup ----
  if (phase === "setup") {
    return (
      <div>
        <h2 className="mb-3 text-xl font-bold">Nouveau bilan numérique</h2>
        <Label>Pour quel client ?</Label>
        <div className="relative my-2">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            className="h-12 pl-10"
            placeholder="Filtrer les clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger className="h-12 w-full">
            <SelectValue placeholder="Choisir un client" />
          </SelectTrigger>
          <SelectContent>
            {filtered.length ? (
              filtered.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.prenom} {c.nom}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>
                Aucun client trouvé
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Button className="mt-4 h-12 w-full text-base" onClick={startBilan}>
          Commencer le bilan
        </Button>
      </div>
    )
  }

  // ---- quiz ----
  if (phase === "quiz") {
    const item = B_FLAT[idx]
    return (
      <div>
        <p className="text-muted-foreground mb-1 text-right text-sm">
          {idx + 1} / {B_FLAT.length}
        </p>
        <div className="bg-border mb-5 h-[7px] overflow-hidden rounded-full">
          <div
            className="h-full rounded-full transition-[width] duration-300"
            style={{
              width: `${(idx / B_FLAT.length) * 100}%`,
              background: "var(--honey)",
            }}
          />
        </div>
        <span
          className="mb-3 inline-block rounded-full px-3 py-1.5 text-sm font-semibold"
          style={{ background: "var(--accent)", color: "var(--blue)" }}
        >
          {item.domain}
        </span>
        <p className="mb-5 text-xl leading-snug font-bold">{item.q}</p>
        <div className="flex flex-col gap-2.5">
          {ANSWER_LABELS.map((label, i) => (
            <button
              key={i}
              onClick={() => answer(i)}
              className="hover:border-primary flex min-h-14 items-center gap-3 rounded-xl border bg-card p-4 text-left text-base font-medium transition-colors hover:bg-[#f7f9fc]"
            >
              <span className={`answer-dot a${i}`} />
              <span>{label}</span>
            </button>
          ))}
        </div>
        {idx > 0 && (
          <button
            onClick={() => setIdx(idx - 1)}
            className="text-muted-foreground mt-3 inline-block cursor-pointer py-1.5 text-sm underline"
          >
            ← Question précédente
          </button>
        )}
      </div>
    )
  }

  // ---- end ----
  return (
    <div>
      <h2 className="mb-3 text-xl font-bold">Bilan terminé</h2>
      <Card className="mb-3">
        <CardContent className="flex flex-wrap gap-1.5">
          {DOMAINS.map((d, di) => {
            let sum = 0
            d.questions.forEach((_, qi) => (sum += scores[di * 4 + qi]))
            const lv = levelOf(sum)
            return (
              <ToneBadge key={d.name} tone={lv.cls}>
                {d.name} : {sum}/8 — {lv.label}
              </ToneBadge>
            )
          })}
        </CardContent>
      </Card>
      <Label>
        Notes de séance (blocages précis, objectifs de l'élève...)
      </Label>
      <Textarea
        className="mt-2"
        placeholder="Ex : bloque sur les pièces jointes, a peur des arnaques..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button className="mt-4 h-12 w-full text-base" onClick={saveBilan}>
        Enregistrer le bilan
      </Button>
    </div>
  )
}
