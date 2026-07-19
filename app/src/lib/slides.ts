import type { Cours, CoursQuiz } from "./types"

// ============================================================
// Course slide builder (ported from index.html buildSlides).
// ============================================================

export type Slide =
  | { type: "texte"; titre: string; contenu: string }
  | { type: "situation"; contenu: string }
  | { type: "quiz"; item: CoursQuiz; num: number }
  | { type: "fin" }

function prettyTitle(t: string): string {
  t = t.trim()
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
}

export function buildSlides(c: Cours): Slide[] {
  const out: Slide[] = []
  ;(c.corps || "").split(/\n\s*\n/).forEach((raw) => {
    const b = raw.trim()
    if (!b) return
    const lines = b.split("\n")
    const m = lines[0].match(/^([^:a-z]{3,70}?)\s*:\s*(.*)$/)
    if (m) {
      out.push({
        type: "texte",
        titre: prettyTitle(m[1]),
        contenu:
          ((m[2] || "").trim() ? m[2].trim() + "\n" : "") +
          lines.slice(1).join("\n"),
      })
    } else {
      out.push({ type: "texte", titre: "À retenir", contenu: b })
    }
  })
  if (c.situation)
    out.push({
      type: "situation",
      contenu: c.situation.replace(/^MISE EN SITUATION\s*:\s*/, ""),
    })
  ;(c.quiz || []).forEach((item, i) =>
    out.push({ type: "quiz", item, num: i + 1 })
  )
  out.push({ type: "fin" })
  return out
}
