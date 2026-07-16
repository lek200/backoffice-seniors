import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * Badge tinted by the original palette tone classes
 * (prospect | actif | termine | decouvrir | progres | fort).
 */
export function ToneBadge({
  tone,
  className,
  children,
}: {
  tone: string
  className?: string
  children: ReactNode
}) {
  return (
    <Badge
      variant="outline"
      className={cn(`lvl-${tone} border-transparent`, className)}
    >
      {children}
    </Badge>
  )
}
