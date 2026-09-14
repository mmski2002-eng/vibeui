import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type Variant = "default" | "soft" | "hero" | "warn" | "danger" | "outline"

const VARIANT: Record<Variant, string> = {
  default: "border-shell-border bg-shell-panel acc-shadow",
  soft: "border-shell-border bg-shell-panel-2",
  hero: "border-shell-accent-line bg-shell-panel acc-shadow acc-hero",
  warn: "border-shell-warn/40 bg-shell-warn-soft",
  danger: "border-shell-danger/40 bg-shell-danger-soft",
  outline: "border-shell-border bg-transparent",
}

/**
 * Панель кабинета. Один компонент на все роли: у пользователя, партнёра
 * и администратора поверхности одинаковые, отличается содержимое.
 *
 * `index` задаёт задержку появления: соседние панели поднимаются одна за
 * другой, а не разом.
 */
export function Panel({
  variant = "default",
  index,
  padded = true,
  className,
  children,
  as: Tag = "section",
}: {
  variant?: Variant
  index?: number
  padded?: boolean
  className?: string
  children: ReactNode
  as?: "section" | "div" | "aside" | "li" | "article"
}) {
  return (
    <Tag
      className={cn(
        "min-w-0 rounded-2xl border",
        VARIANT[variant],
        index !== undefined && "acc-reveal",
        padded && "p-5 sm:p-6",
        className,
      )}
      style={index !== undefined ? { ["--i" as string]: index } : undefined}
    >
      {children}
    </Tag>
  )
}

/** Шапка панели: заголовок слева, действие или подпись справа. */
export function PanelHeader({
  title,
  note,
  action,
  className,
}: {
  title: ReactNode
  note?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-2",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-shell-fg text-base font-semibold tracking-tight">
          {title}
        </h2>
        {note ? (
          <p className="text-shell-muted mt-1 max-w-2xl text-sm leading-relaxed">
            {note}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
