import type { ReactNode } from "react"

/**
 * Заголовок раздела. Один на все страницы кабинета и админки: раньше
 * каждая страница собирала свой `h1` заново и они разъезжались по
 * отступам.
 */
export function PageHeader({
  title,
  lead,
  eyebrow,
  action,
}: {
  title: ReactNode
  lead?: ReactNode
  /** Мелкая строка над заголовком: раздел, период, роль. */
  eyebrow?: ReactNode
  action?: ReactNode
}) {
  return (
    <header className="acc-reveal mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-shell-accent-text mb-1.5 text-xs font-medium tracking-wide uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h1>
        {lead ? (
          <p className="text-shell-muted mt-1.5 max-w-2xl text-sm leading-relaxed">
            {lead}
          </p>
        ) : null}
      </div>
      {action ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div>
      ) : null}
    </header>
  )
}
