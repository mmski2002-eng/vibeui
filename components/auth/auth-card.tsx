import Link from "next/link"
import type { ReactNode } from "react"

import { AUTH_TEXTS } from "@/components/auth/texts"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { localePath, type Locale } from "@/lib/i18n"

/**
 * Рамка форм входа, регистрации, восстановления и подтверждения почты.
 *
 * На большом экране слева стоит витрина из настоящих компонентов каталога, а
 * не декоративная картинка: страница входа в библиотеку UI, на которой нет
 * ни одного UI-компонента, обещает меньше, чем продукт умеет. На телефоне
 * витрина скрыта — там дорог каждый экран до поля ввода.
 */
const SHOWCASE = ["button-003", "badge-001", "avatar-001"]

export function AuthCard({
  locale,
  title,
  // Заголовок необязателен: экран подтверждения почты меняет его вместе с
  // состоянием ссылки и рисует сам.
  description,
  children,
  footer,
  showcase = true,
}: {
  locale: Locale
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  /** Витрина слева. Выключается там, где она сбивает с шага. */
  showcase?: boolean
}) {
  const t = AUTH_TEXTS[locale]

  return (
    <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
      <div className="grid w-full max-w-5xl items-start gap-10 lg:grid-cols-[minmax(0,1fr)_26rem]">
        {showcase ? (
          <section
            aria-hidden="true"
            className="hidden lg:block lg:pt-14 select-none"
          >
            <p className="text-shell-fg text-2xl leading-tight font-semibold tracking-tight text-balance">
              {t.showcaseTitle}
            </p>
            <p className="text-shell-muted mt-3 max-w-md text-sm leading-relaxed">
              {t.showcaseNote}
            </p>

            <ul className="mt-8 grid gap-3">
              {SHOWCASE.map((slug) => (
                <li
                  key={slug}
                  className="border-shell-border bg-shell overflow-hidden rounded-xl border"
                >
                  <div className="bg-preview-surface pointer-events-none flex h-28 items-center justify-center overflow-hidden">
                    <CatalogThumbnail slug={slug} locale={locale} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mx-auto w-full max-w-md lg:mx-0">
          <Link
            href={localePath(locale, "/")}
            className="text-shell-muted hover:text-shell-fg mb-6 inline-block text-sm transition-colors"
          >
            {t.back}
          </Link>
          <div className="border-shell-border bg-shell-panel rounded-2xl border p-6 sm:p-7">
            {title ? (
              <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
                {title}
              </h1>
            ) : null}
            {description ? (
              <p className="text-shell-muted mt-2 text-sm leading-relaxed">
                {description}
              </p>
            ) : null}
            <div className={title ? "mt-6" : ""}>{children}</div>
          </div>
          {footer ? (
            <div className="text-shell-muted mt-5 text-center text-sm">
              {footer}
            </div>
          ) : null}
        </div>
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
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-11 w-full rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

export const SUBMIT_CLASS =
  "bg-shell-accent text-shell-accent-fg focus-visible:ring-shell-ring inline-flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
