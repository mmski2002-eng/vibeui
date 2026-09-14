import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "ghost" | "danger"
type Size = "sm" | "md" | "lg"

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-shell-accent text-shell-accent-fg font-semibold hover:bg-shell-accent-deep",
  secondary:
    "border border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated",
  ghost: "text-shell-muted hover:bg-shell-elevated hover:text-shell-fg",
  danger:
    "border border-shell-danger/40 bg-transparent text-shell-danger hover:bg-shell-danger-soft",
}

const SIZE: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
}

const BASE =
  "acc-press inline-flex shrink-0 items-center justify-center rounded-lg font-medium whitespace-nowrap select-none focus-visible:ring-2 focus-visible:ring-shell-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"

/**
 * Кнопка кабинета. Один отклик на все действия: под курсором меняется тон,
 * при нажатии «садится», в ожидании крутит спиннер, не меняя ширины.
 */
export function Button({
  variant = "secondary",
  size = "md",
  pending,
  icon,
  className,
  children,
  ...rest
}: ComponentProps<"button"> & {
  variant?: Variant
  size?: Size
  pending?: boolean
  icon?: ReactNode
}) {
  return (
    <button
      type="button"
      {...rest}
      disabled={rest.disabled || pending}
      aria-busy={pending || undefined}
      className={cn(BASE, VARIANT[variant], SIZE[size], className)}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}

/** Та же кнопка, но ссылка: переходы в каталог, на тариф, к списку. */
export function ButtonLink({
  variant = "secondary",
  size = "md",
  icon,
  className,
  children,
  ...rest
}: ComponentProps<typeof Link> & {
  variant?: Variant
  size?: Size
  icon?: ReactNode
}) {
  return (
    <Link
      {...rest}
      className={cn(BASE, VARIANT[variant], SIZE[size], className)}
    >
      {icon}
      {children}
    </Link>
  )
}
