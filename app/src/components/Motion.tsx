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

/**
 * Container that reveals its <StaggerItem> children one after another.
 * Use for lists of cards so they cascade in gently.
 */
export function Stagger({
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
      initial={reduce ? false : "hidden"}
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.25, ease: "easeOut" },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
