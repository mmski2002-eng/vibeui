import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Пустое состояние: иконка в кольце, заголовок, пояснение и действие.
 * Одно на все списки кабинета — пустая история и пустое избранное не
 * должны выглядеть как две разные ошибки.
 */
export function EmptyState({
  icon,
  title,
  note,
  action,
  index,
  compact,
}: {
  icon: ReactNode
  title: ReactNode
  note?: ReactNode
  action?: ReactNode
  index?: number
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        "border-shell-border flex flex-col items-center rounded-2xl border border-dashed text-center",
        compact ? "px-5 py-8" : "px-6 py-12",
        index !== undefined && "acc-reveal",
      )}
      style={index !== undefined ? { ["--i" as string]: index } : undefined}
    >
      <span className="bg-shell-elevated text-shell-muted flex size-11 items-center justify-center rounded-full [&>svg]:size-5">
        {icon}
      </span>
      <p className="text-shell-fg mt-4 text-sm font-medium">{title}</p>
      {note ? (
        <p className="text-shell-muted mx-auto mt-1.5 max-w-sm text-sm leading-relaxed">
          {note}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
