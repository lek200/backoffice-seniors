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
import { sb } from "@/lib/supabase"

const CATEGORIES = [
  { value: "anti_objections", label: "Anti-objections" },
  { value: "scripts_b2b", label: "Scripts B2B" },
  { value: "modules", label: "Modules de cours" },
  { value: "quiz", label: "Quiz" },
  { value: "tarifs", label: "Tarifs et offres" },
]

export function BiblioTab() {
  const { contenus, loadContenus } = useApp()
  const [cat, setCat] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  const [titre, setTitre] = useState("")
  const [corps, setCorps] = useState("")

  const list = useMemo(() => {
    let l = contenus
    if (cat !== "all") l = l.filter((c) => c.categorie === cat)
    const q = query.toLowerCase()
    if (q)
      l = l.filter((c) => `${c.titre} ${c.corps}`.toLowerCase().includes(q))
    return l
  }, [contenus, cat, query])

  async function createContent() {
    if (cat === "all") {
      toast("Choisis d'abord une catégorie précise")
      return
    }
    if (!titre.trim() || !corps.trim()) {
      toast("Titre et contenu obligatoires")
      return
    }
    const { error } = await sb
      .from("contenus")
      .insert({ categorie: cat, titre: titre.trim(), corps: corps.trim() })
    if (error) {
      toast.error("Erreur")
      return
    }
    toast.success("Contenu ajouté")
    setTitre("")
    setCorps("")
    setShowForm(false)
    loadContenus()
  }

  async function deleteContent(id: string) {
    if (!confirm("Supprimer définitivement ce contenu ?")) return
    const { error } = await sb.from("contenus").delete().eq("id", id)
    if (error) {
      toast.error("Erreur à la suppression")
      return
    }
    toast.success("Contenu supprimé")
    loadContenus()
  }

  return (
    <div>
      <h2 className="mb-3 text-xl font-bold">Bibliothèque</h2>
      <p className="text-muted-foreground mb-3 text-sm">
        Tes contenus de travail : argumentaires, scripts d'appel, offres, notes
        personnelles. Toujours sous la main, même en clientèle. Appuie sur un
        titre pour l'ouvrir.
      </p>
      <div className="relative mb-3">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          className="h-12 pl-10"
          placeholder="Rechercher dans la bibliothèque..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Label>Catégorie</Label>
      <Select value={cat} onValueChange={setCat}>
        <SelectTrigger className="mt-2 h-12 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les catégories</SelectItem>
          {CATEGORIES.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        className="mt-4 h-12 w-full text-base"
        onClick={() => setShowForm((v) => !v)}
      >
        Ajouter un contenu
      </Button>

      {showForm && (
        <Card className="mt-3">
          <CardContent className="flex flex-col gap-2">
            <Label>Titre</Label>
            <Input value={titre} onChange={(e) => setTitre(e.target.value)} />
            <Label className="mt-2">Contenu</Label>
            <Textarea
              className="min-h-40"
              value={corps}
              onChange={(e) => setCorps(e.target.value)}
            />
            <Button className="mt-4 h-12 text-base" onClick={createContent}>
              Enregistrer
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {!list.length ? (
          <p className="text-muted-foreground text-sm">
            Rien ici pour le moment. La bibliothèque est ton classeur commercial
            : demande la Partie 2 à Claude (tarifs, scripts B2B, parrainage) et
            colle chaque contenu ici, ou ajoute tes propres notes.
          </p>
        ) : (
          list.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex flex-col gap-2">
                <div
                  className="flex cursor-pointer flex-wrap items-center justify-between gap-2"
                  onClick={() =>
                    setOpenId((cur) => (cur === c.id ? null : c.id))
                  }
                >
                  <h3 className="text-base font-bold">{c.titre}</h3>
                  <ToneBadge tone="termine">{c.categorie}</ToneBadge>
                </div>
                {openId === c.id && (
                  <pre className="pre-wrap text-[15px] leading-relaxed">
                    {c.corps}
                  </pre>
                )}
                <button
                  onClick={() => deleteContent(c.id)}
                  className="text-muted-foreground w-fit cursor-pointer text-sm underline"
                >
                  Supprimer
                </button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
