import type { ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"

/**
 * Smooth entrance animation used across the app (senior-friendly:
 * short, gentle, and disabled when the OS asks for reduced motion).
 */
export function FadeIn({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
