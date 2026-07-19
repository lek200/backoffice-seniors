import { useCallback, useEffect, useState } from "react"
import { ChevronRight, Search } from "lucide-react"
import { toast } from "sonner"

import { Stagger, StaggerItem } from "@/components/Motion"
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
import { CONFIG } from "@/lib/config"
import { LABELS, NIVEAUX, NIVEAU_CLS, levelOf, nivReco } from "@/lib/domains"
import { sb } from "@/lib/supabase"
import type { Bilan, FeuilleRoute, Progression, Statut } from "@/lib/types"

const STATUTS: Statut[] = ["prospect", "actif", "termine"]

const STATUT_COLOR: Record<Statut, string> = {
  actif: "#4e7a5a",
  prospect: "#8c4a3e",
  termine: "#33567f",
}

function frDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR")
}

function initials(prenom: string, nom: string | null) {
  return `${prenom.charAt(0)}${(nom ?? "").charAt(0)}`.toUpperCase() || "?"
}

function StatCard({
  n,
  label,
  color,
}: {
  n: number
  label: string
  color: string
}) {
  return (
    <div className="bg-card rounded-2xl border border-[color:var(--line)] px-4 py-3.5 shadow-[var(--shadow-card)]">
      <div className="text-[26px] font-extrabold tracking-tight" style={{ color }}>
        {n}
      </div>
      <div className="text-muted-foreground text-[12.5px] font-semibold">
        {label}
      </div>
    </div>
  )
}

export function ClientsTab() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (selectedId) {
    return (
      <ClientDetail id={selectedId} onBack={() => setSelectedId(null)} />
    )
  }
  return <ClientsList onOpen={setSelectedId} />
}

// ------------------------------------------------------------
// List view
// ------------------------------------------------------------
function ClientsList({ onOpen }: { onOpen: (id: string) => void }) {
  const { clients, cours, loadClients } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState("")

  const [prenom, setPrenom] = useState("")
  const [nom, setNom] = useState("")
  const [tel, setTel] = useState("")
  const [appareil, setAppareil] = useState("")
  const [statut, setStatut] = useState<Statut>("prospect")

  async function createClient() {
    if (!prenom.trim()) {
      toast("Le prénom est obligatoire")
      return
    }
    const { error } = await sb.from("clients").insert({
      prenom: prenom.trim(),
      nom: nom.trim(),
      telephone: tel.trim(),
      appareil: appareil.trim(),
      statut,
    })
    if (error) {
      toast.error("Erreur à l'enregistrement")
      return
    }
    toast.success("Client ajouté")
    setPrenom("")
    setNom("")
    setTel("")
    setAppareil("")
    setStatut("prospect")
    setShowForm(false)
    loadClients()
  }

  const q = query.toLowerCase()
  const list = q
    ? clients.filter((c) =>
        `${c.prenom} ${c.nom ?? ""} ${c.telephone ?? ""} ${c.appareil ?? ""}`
          .toLowerCase()
          .includes(q)
      )
    : clients

  const nbActifs = clients.filter((c) => c.statut === "actif").length

  return (
    <div>
      <div className="mb-5 grid grid-cols-3 gap-3">
        <StatCard n={clients.length} label="Clients suivis" color="var(--blue)" />
        <StatCard n={nbActifs} label="Parcours actifs" color="var(--green)" />
        <StatCard n={cours.length} label="Cours disponibles" color="#b47d1e" />
      </div>

      <Button
        variant="outline"
        className="mb-4 h-12 w-full text-base"
        onClick={() => setShowForm((v) => !v)}
      >
        Ajouter un client
      </Button>

      {showForm && (
        <Card className="mb-3">
          <CardContent className="flex flex-col gap-2">
            <Label>Prénom (obligatoire)</Label>
            <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            <Label className="mt-2">Nom</Label>
            <Input value={nom} onChange={(e) => setNom(e.target.value)} />
            <Label className="mt-2">Téléphone</Label>
            <Input
              type="tel"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
            />
            <Label className="mt-2">Appareil principal</Label>
            <Input
              placeholder="Ex : tablette Samsung"
              value={appareil}
              onChange={(e) => setAppareil(e.target.value)}
            />
            <Label className="mt-2">Statut</Label>
            <Select
              value={statut}
              onValueChange={(v) => setStatut(v as Statut)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="termine">Terminé</SelectItem>
              </SelectContent>
            </Select>
            <Button className="mt-4 h-12 text-base" onClick={createClient}>
              Enregistrer
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="relative mb-4">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          className="h-12 pl-10"
          placeholder="Rechercher un client (nom, téléphone, appareil)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {!clients.length ? (
        <p className="text-muted-foreground text-sm">
          Aucun client pour le moment. Ajoute le premier.
        </p>
      ) : !list.length ? (
        <p className="text-muted-foreground text-sm">
          Aucun client ne correspond à cette recherche.
        </p>
      ) : (
        <Stagger className="flex flex-col gap-3">
          {list.map((c) => {
            const color = STATUT_COLOR[c.statut]
            return (
              <StaggerItem key={c.id}>
                <Card
                  className="hover:border-primary cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] motion-reduce:transform-none"
                  onClick={() => onOpen(c.id)}
                >
                  <CardContent className="flex items-center gap-4">
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-[17px] font-extrabold"
                      style={{ background: `${color}22`, color }}
                    >
                      {initials(c.prenom, c.nom)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[16.5px] font-bold">
                        {c.prenom} {c.nom}
                      </h3>
                      <p className="text-muted-foreground truncate text-sm">
                        {c.appareil || "Appareil non renseigné"}
                        {c.telephone ? ` · ${c.telephone}` : ""}
                      </p>
                    </div>
                    <ToneBadge tone={c.statut}>{c.statut}</ToneBadge>
                    <ChevronRight className="size-5 shrink-0 text-[#c7cdd4]" />
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </Stagger>
      )}
    </div>
  )
}

// ------------------------------------------------------------
// Detail view
// ------------------------------------------------------------
function ClientDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const { clients, cours, loadClients, openCourse, prepDiplome } = useApp()
  const client = clients.find((c) => c.id === id)

  const [bilans, setBilans] = useState<Bilan[]>([])
  const [routes, setRoutes] = useState<FeuilleRoute[]>([])
  const [progs, setProgs] = useState<Progression[]>([])

  const [statut, setStatut] = useState<Statut>(client?.statut ?? "prospect")
  const [notes, setNotes] = useState(client?.notes ?? "")
  const [generating, setGenerating] = useState(false)

  const refreshDetail = useCallback(async () => {
    const [{ data: b }, { data: r }, { data: p }] = await Promise.all([
      sb
        .from("bilans")
        .select("*")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      sb
        .from("feuilles_route")
        .select("*")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
      sb
        .from("progressions")
        .select("*")
        .eq("client_id", id)
        .order("created_at", { ascending: false }),
    ])
    setBilans((b as Bilan[]) || [])
    setRoutes((r as FeuilleRoute[]) || [])
    setProgs((p as Progression[]) || [])
  }, [id])

  useEffect(() => {
    setStatut(client?.statut ?? "prospect")
    setNotes(client?.notes ?? "")
  }, [client?.statut, client?.notes])

  useEffect(() => {
    refreshDetail()
  }, [refreshDetail])

  if (!client) {
    return (
      <div>
        <BackLink onClick={onBack} />
        <p className="text-muted-foreground text-sm">Client introuvable.</p>
      </div>
    )
  }

  async function saveClient() {
    const { error } = await sb
      .from("clients")
      .update({ statut, notes })
      .eq("id", id)
    if (error) {
      toast.error("Erreur")
      return
    }
    toast.success("Modifications enregistrées")
    loadClients()
  }

  async function generateRoadmap() {
    if (!bilans.length) {
      toast("Aucun bilan trouvé")
      return
    }
    setGenerating(true)
    const b = bilans[0]
    const bilanTxt = b.scores
      .map(
        (d) =>
          `${d.domaine} — ${d.score}/8 (${levelOf(d.score).label})\n` +
          d.questions.map((qq) => `  · ${qq.q} → ${LABELS[qq.reponse]}`).join("\n")
      )
      .join("\n\n")

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
            prenom: client!.prenom,
            appareil: client!.appareil,
            bilan: bilanTxt,
            notes: b.notes,
          }),
        }
      )
      const out = await res.json()
      if (out.error) throw new Error(out.error)
      const { error } = await sb.from("feuilles_route").insert({
        client_id: id,
        contenu: out.feuille_de_route,
        premier_cours: out.premier_cours,
      })
      if (error) throw error
      toast.success("Feuille de route générée")
      refreshDetail()
    } catch (e) {
      toast.error("Erreur de génération : " + (e as Error).message)
    } finally {
      setGenerating(false)
    }
  }

  // Recommended courses from the latest bilan.
  const reco = bilans.length
    ? bilans[0].scores
        .map((d) => {
          const niv = nivReco(d.score)
          const cr = cours.find(
            (k) => k.domaine === d.domaine && k.niveau === niv
          )
          return cr ? { cr, domaine: d.domaine, score: d.score, niv } : null
        })
        .filter(Boolean)
    : []

  // Unlocked diplomas: every published course of a domain is done.
  const doneIds = new Set(progs.map((p) => p.cours_id))
  const domainesPub = [
    ...new Set(cours.filter((k) => k.statut === "publie").map((k) => k.domaine)),
  ]
  const unlocked = domainesPub.filter((dom) => {
    const pubs = cours.filter((k) => k.domaine === dom && k.statut === "publie")
    return pubs.length && pubs.every((k) => doneIds.has(k.id))
  })

  return (
    <div>
      <BackLink onClick={onBack} />

      <Card>
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold">
              {client.prenom} {client.nom}
            </h2>
            <ToneBadge tone={client.statut}>{client.statut}</ToneBadge>
          </div>
          <p className="text-muted-foreground text-sm">
            {client.appareil || ""}
            {client.telephone ? ` · ${client.telephone}` : ""}
          </p>
          <Label className="mt-2">Statut</Label>
          <Select value={statut} onValueChange={(v) => setStatut(v as Statut)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUTS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label className="mt-2">Notes</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Button size="sm" className="mt-3 w-fit" onClick={saveClient}>
            Enregistrer les modifications
          </Button>
        </CardContent>
      </Card>

      <h3 className="mt-5 mb-2 text-base font-bold">Bilans</h3>
      {bilans.length ? (
        <>
          {bilans.map((b) => (
            <Card key={b.id} className="mb-3">
              <CardContent className="flex flex-col gap-2">
                <p className="text-muted-foreground text-sm">
                  {frDate(b.created_at)}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {b.scores.map((d) => {
                    const lv = levelOf(d.score)
                    return (
                      <ToneBadge key={d.domaine} tone={lv.cls}>
                        {d.domaine} : {d.score}/8
                      </ToneBadge>
                    )
                  })}
                </div>
                {b.notes && (
                  <p className="text-muted-foreground text-sm">
                    Notes : {b.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
          <Button
            className="h-12 w-full text-base"
            disabled={generating}
            onClick={generateRoadmap}
          >
            {generating
              ? "Génération en cours (30 à 60 s)..."
              : "Générer la feuille de route (IA)"}
          </Button>

          {reco.length > 0 && (
            <>
              <h3 className="mt-6 mb-2 text-base font-bold">
                Cours recommandés
              </h3>
              <p className="text-muted-foreground mb-2.5 text-sm">
                Calculés depuis le dernier bilan. Pour revoir un point fort à la
                demande de l'élève, tous les cours restent dans l'onglet Cours.
              </p>
              {reco.map((r) => (
                <Card
                  key={r!.cr.id}
                  className="hover:border-primary mb-3 cursor-pointer transition-all hover:-translate-y-0.5 motion-reduce:transform-none"
                  onClick={() => openCourse(r!.cr.id)}
                >
                  <CardContent className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-base font-bold">{r!.cr.titre}</h3>
                      <ToneBadge tone={NIVEAU_CLS[r!.niv]}>
                        {NIVEAUX[r!.niv]}
                      </ToneBadge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {r!.domaine} — score {r!.score}/8
                    </p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </>
      ) : (
        <p className="text-muted-foreground text-sm">
          Aucun bilan. Va dans l'onglet Bilan pour en faire un.
        </p>
      )}

      <h3 className="mt-6 mb-2 text-base font-bold">Feuilles de route</h3>
      {routes.length ? (
        routes.map((r) => (
          <Card key={r.id} className="mb-3">
            <CardContent className="flex flex-col gap-2">
              <p className="text-muted-foreground text-sm">
                {frDate(r.created_at)}
              </p>
              <h3 className="text-base font-bold">Programme</h3>
              <pre className="pre-wrap text-[15px] leading-relaxed">
                {r.contenu}
              </pre>
              {r.premier_cours && (
                <>
                  <h3 className="mt-2 text-base font-bold">Premier cours</h3>
                  <pre className="pre-wrap text-[15px] leading-relaxed">
                    {r.premier_cours}
                  </pre>
                </>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground text-sm">
          Aucune feuille de route générée.
        </p>
      )}

      <h3 className="mt-6 mb-2 text-base font-bold">Parcours et progression</h3>
      {progs.length ? (
        <>
          {progs.map((p) => {
            const cr = cours.find((k) => k.id === p.cours_id)
            return (
              <Card key={p.id} className="mb-3">
                <CardContent className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-[15px] font-bold">
                      {cr ? cr.titre : "Cours supprimé"}
                    </h3>
                    {p.total_quiz ? (
                      <ToneBadge tone="fort">
                        Quiz : {p.score_quiz} / {p.total_quiz}
                      </ToneBadge>
                    ) : (
                      <ToneBadge tone="termine">Terminé</ToneBadge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {frDate(p.created_at)}
                    {cr ? ` · ${cr.domaine}` : ""}
                  </p>
                </CardContent>
              </Card>
            )
          })}

          {unlocked.length > 0 && (
            <>
              <h3 className="mt-5 mb-2 text-base font-bold">Diplômes</h3>
              {unlocked.map((dom) => (
                <Card
                  key={dom}
                  className="mb-3"
                  style={{ borderLeft: "4px solid var(--green)" }}
                >
                  <CardContent className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-[15px] font-bold">
                        Diplôme débloqué : {dom}
                      </h3>
                      <Button
                        size="sm"
                        onClick={() =>
                          prepDiplome({
                            name: `${client.prenom} ${client.nom ?? ""}`.trim(),
                            module: `Parcours ${dom}`,
                          })
                        }
                      >
                        Préparer le diplôme
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Tous les cours publiés du domaine sont terminés.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </>
      ) : (
        <p className="text-muted-foreground text-sm">
          Aucun cours terminé pour l'instant. La progression s'enregistre sur le
          dernier écran de chaque cours, dans l'onglet Cours.
        </p>
      )}
    </div>
  )
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-muted-foreground mb-3 inline-block cursor-pointer py-1.5 text-sm underline"
    >
      ← Retour aux clients
    </button>
  )
}
