import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
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

const MENTIONS = [
  "Assez bien",
  "Bien",
  "Très bien",
  "Très bien avec les félicitations du formateur",
]

export function DiplomeTab() {
  const { diplomaPrefill, clearDiplomaPrefill } = useApp()

  const [name, setName] = useState("")
  const [module, setModule] = useState("")
  const [formateur, setFormateur] = useState("")
  const [mention, setMention] = useState<string>("none")
  const [ville, setVille] = useState("")
  const [date, setDate] = useState("")

  // Apply a prefill coming from the Clients tab.
  useEffect(() => {
    if (diplomaPrefill) {
      setName(diplomaPrefill.name)
      setModule(diplomaPrefill.module)
      clearDiplomaPrefill()
    }
  }, [diplomaPrefill, clearDiplomaPrefill])

  const dateFr = (date ? new Date(date) : new Date()).toLocaleDateString(
    "fr-FR",
    { day: "numeric", month: "long", year: "numeric" }
  )
  const villeTxt = ville || "Versailles"

  return (
    <div>
      <h2 className="mb-3 text-xl font-bold">Générer un diplôme</h2>

      <Label>Prénom et nom de l'élève</Label>
      <Input
        className="mt-2 mb-2"
        placeholder="Ex : Martine Dupont"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Label>Module validé</Label>
      <Input
        className="mt-2 mb-2"
        placeholder="Ex : Gérer ses e-mails en toute confiance"
        value={module}
        onChange={(e) => setModule(e.target.value)}
      />
      <Label>Nom du formateur</Label>
      <Input
        className="mt-2 mb-2"
        placeholder="Ton nom"
        value={formateur}
        onChange={(e) => setFormateur(e.target.value)}
      />
      <Label>Mention</Label>
      <Select value={mention} onValueChange={setMention}>
        <SelectTrigger className="mt-2 mb-2 h-12 w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Sans mention</SelectItem>
          {MENTIONS.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Label>Fait à (ville)</Label>
      <Input
        className="mt-2 mb-2"
        placeholder="Ex : Versailles"
        value={ville}
        onChange={(e) => setVille(e.target.value)}
      />
      <Label>Date</Label>
      <Input
        className="mt-2 mb-2"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <Button
        variant="outline"
        className="mt-4 h-12 w-full text-base"
        onClick={() => window.print()}
      >
        Imprimer / Enregistrer en PDF
      </Button>

      <div className="diplome">
        <p className="d-eyebrow">Certificat de compétences numériques</p>
        <p className="d-org">Formation individuelle à domicile</p>
        <p className="d-title">Diplôme du Numérique</p>
        <div className="d-rule">
          <span>&#10022;</span>
        </div>
        <p className="d-sub">Le présent diplôme est décerné à</p>
        <p className="d-name">{name || "Prénom Nom"}</p>
        <div className="d-name-line" />
        <p className="d-module">
          qui a suivi avec assiduité et validé l'ensemble des épreuves du module
          <br />
          <strong>{module || "Titre du module"}</strong>
        </p>
        {mention !== "none" && (
          <p className="d-mention">
            obtenu avec la mention <strong>{mention}</strong>
          </p>
        )}
        <p className="d-lieu">
          Fait à {villeTxt}, le {dateFr}
        </p>
        <div className="d-footer">
          <div className="d-seal">
            <span className="seal-star">&#10022;</span>
            <span className="seal-txt">
              Inclusion
              <br />
              numérique
              <br />
              des aînés
            </span>
          </div>
          <div className="d-sign">
            Le formateur,
            <br />
            <span style={{ color: "#1E2A3D" }}>{formateur || "Formateur"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
