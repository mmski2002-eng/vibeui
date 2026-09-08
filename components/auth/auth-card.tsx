import Link from "next/link"
import type { ReactNode } from "react"

/**
 * Рамка для форм входа, регистрации и восстановления. Одна на все четыре
 * страницы: они отличаются полями, а не оформлением.
 */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <main className="flex flex-1 items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="text-shell-muted hover:text-shell-fg mb-8 inline-block text-sm transition-colors"
        >
          ← На витрину
        </Link>
        <div className="border-shell-border bg-shell-panel rounded-2xl border p-7">
          <h1 className="text-shell-fg text-xl font-semibold tracking-tight">
            {title}
          </h1>
          {description ? (
            <p className="text-shell-muted mt-2 text-sm leading-relaxed">
              {description}
            </p>
          ) : null}
          <div className="mt-6">{children}</div>
        </div>
        {footer ? (
          <div className="text-shell-muted mt-5 text-center text-sm">
            {footer}
          </div>
        ) : null}
      </div>
    </main>
  )
}

/** Поле формы: подпись, ввод и место под ошибку — одинаково на всех формах. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <label className="mb-4 block">
      <span className="text-shell-fg mb-1.5 block text-sm font-medium">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="text-shell-muted mt-1.5 block text-xs">{hint}</span>
      ) : null}
    </label>
  )
}

export const INPUT_CLASS =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

export const SUBMIT_CLASS =
  "bg-shell-accent text-shell-accent-fg focus-visible:ring-shell-ring inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
