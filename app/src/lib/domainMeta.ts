import { BookOpen, Globe, Hand, Mail, ShieldCheck, type LucideIcon } from "lucide-react"

// Visual identity for each course domain: an icon + a soft gradient
// used on the colored tiles across the catalog and the lesson player.
interface DomainMeta {
  icon: LucideIcon
  gradient: string
}

const MAP: Record<string, DomainMeta> = {
  "Prise en main": {
    icon: Hand,
    gradient: "linear-gradient(150deg, #4a6fa0, #33567f)",
  },
  "Internet au quotidien": {
    icon: Globe,
    gradient: "linear-gradient(150deg, #4f93a6, #3e7a8c)",
  },
  "E-mails et démarches": {
    icon: Mail,
    gradient: "linear-gradient(150deg, #5e9270, #4e7a5a)",
  },
  "Sécurité et confiance": {
    icon: ShieldCheck,
    gradient: "linear-gradient(150deg, #a86152, #8c4a3e)",
  },
}

const FALLBACK: DomainMeta = {
  icon: BookOpen,
  gradient: "linear-gradient(150deg, #6a758a, #4a5468)",
}

export function domainMeta(domaine: string): DomainMeta {
  return MAP[domaine] ?? FALLBACK
}
