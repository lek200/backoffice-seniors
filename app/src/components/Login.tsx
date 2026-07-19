import { useState } from "react"
import { GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sb } from "@/lib/supabase"

export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [busy, setBusy] = useState(false)

  async function login() {
    setBusy(true)
    setErr("")
    const { error } = await sb.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    setBusy(false)
    if (error) {
      setErr("Connexion impossible. Vérifie e-mail et mot de passe.")
    }
    // On success, the auth listener in App swaps to the app view.
  }

  return (
    <section className="mt-10">
      <div
        className="flex size-14 items-center justify-center rounded-2xl text-white"
        style={{
          background:
            "linear-gradient(150deg, #3d6390 0%, var(--blue) 45%, var(--blue-deep) 100%)",
          boxShadow: "0 10px 24px -12px rgba(51,86,127,0.75)",
        }}
      >
        <GraduationCap className="size-7" />
      </div>
      <h1 className="mt-4 text-[28px] font-extrabold tracking-tight">
        Back-office
      </h1>
      <p className="text-muted-foreground">
        Cours d'informatique pour seniors · version 3
      </p>
      <Card className="mt-6">
        <CardContent className="flex flex-col gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              login()
            }}
            className="flex flex-col gap-2"
          >
            <Label htmlFor="login-email">E-mail</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Label htmlFor="login-pass" className="mt-2">
              Mot de passe
            </Label>
            <Input
              id="login-pass"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="mt-4 h-12 text-base" disabled={busy}>
              {busy ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          {err && (
            <p className="mt-2 text-sm" style={{ color: "var(--red-ink)" }}>
              {err}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
