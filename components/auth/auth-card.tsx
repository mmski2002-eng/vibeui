import Link from "next/link"
import type { ReactNode } from "react"

import { AUTH_TEXTS } from "@/components/auth/texts"
import { localePath, type Locale } from "@/lib/i18n"

/**
 * Рамка форм входа, регистрации, восстановления и подтверждения почты.
 *
 * Сцена всегда тёмная (класс auth-stage переопределяет токены оболочки):
 * точечная сетка, два плывущих оранжевых пятна и одна стеклянная карточка
 * по центру. Ничего, кроме формы: человек уже решил войти, продавать ему
 * нечего, а форма целиком должна помещаться в окно ноутбука.
 */
export function AuthCard({
  locale,
  title,
  // Заголовок необязателен: экран подтверждения почты меняет его вместе с
  // состоянием ссылки и рисует сам.
  description,
  children,
  footer,
  tabs,
}: {
  locale: Locale
  title?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  /** Оставлен ради старых вызовов: витрины у рамки больше нет. */
  showcase?: boolean
  /** Переключатель «Вход / Регистрация» над формой; какая вкладка активна. */
  tabs?: "signin" | "signup"
}) {
  const t = AUTH_TEXTS[locale]

  return (
    <main className="auth-stage bg-shell text-shell-fg relative isolate flex flex-1 items-center justify-center overflow-hidden px-4 py-5 sm:py-6">
      {/* Фон: точечная сетка с растворением к краям и два пятна света. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:22px_22px] [mask-image:radial-gradient(70%_70%_at_50%_45%,#000_30%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="auth-glow-a pointer-events-none absolute -top-40 left-1/2 -z-10 size-[34rem] -translate-x-[70%] rounded-full bg-[#ff5900]/25 blur-[110px] motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="auth-glow-b pointer-events-none absolute -bottom-48 left-1/2 -z-10 size-[30rem] translate-x-[10%] rounded-full bg-[#ff5900]/15 blur-[120px] motion-reduce:animate-none"
      />

      <div className="auth-rise w-full max-w-[26rem] motion-reduce:animate-none">
        <div className="relative rounded-2xl border border-white/10 bg-[#151515]/85 p-5 shadow-[0_40px_120px_-40px_rgba(255,89,0,0.45),0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-xl sm:p-6">
          <div
            className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#ff5900] to-transparent"
            aria-hidden="true"
          />
          {tabs ? (
            <nav
              aria-label={t.tabsLabel}
              className="mb-5 grid grid-cols-2 gap-1 rounded-xl border border-white/10 bg-black/30 p-1"
            >
              <Tab href={localePath(locale, "/signin")} active={tabs === "signin"}>
                {t.tabSignIn}
              </Tab>
              <Tab href={localePath(locale, "/signup")} active={tabs === "signup"}>
                {t.tabSignUp}
              </Tab>
            </nav>
          ) : null}
          {title ? (
            <h1 className="text-shell-fg text-xl font-semibold tracking-tight sm:text-2xl">
              {title}
            </h1>
          ) : null}
          {description ? (
            <p className="text-shell-muted mt-1.5 text-sm leading-relaxed">
              {description}
            </p>
          ) : null}
          <div className={title ? "mt-5" : ""}>{children}</div>
        </div>
        <div className="text-shell-muted mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
          <Link
            href={localePath(locale, "/")}
            className="hover:text-shell-fg transition-colors"
          >
            {t.back}
          </Link>
          {footer ? <span>{footer}</span> : null}
        </div>
      </div>
    </main>
  )
}

function Tab({
  href,
  active,
  children,
}: {
  href: string
  active: boolean
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "bg-shell-accent text-shell-accent-fg inline-flex h-9 items-center justify-center rounded-lg text-sm font-semibold shadow-[0_8px_24px_-8px_rgba(255,89,0,0.8)]"
          : "text-shell-muted hover:text-shell-fg focus-visible:ring-shell-ring inline-flex h-9 items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
      }
    >
      {children}
    </Link>
  )
}

/**
 * Поле формы: подпись, ввод и место под ошибку — одинаково на всех формах.
 * icon встаёт слева внутри поля, aside — справа от подписи («Забыли пароль?»).
 */
export function Field({
  label,
  hint,
  icon,
  aside,
  children,
}: {
  label: string
  hint?: string
  icon?: ReactNode
  aside?: ReactNode
  children: ReactNode
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-shell-fg block text-sm font-medium">{label}</span>
        {aside}
      </span>
      {icon ? (
        <span className="relative block [&_input]:pl-10">
          <span
            className="text-shell-muted pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 [&_svg]:size-4"
            aria-hidden="true"
          >
            {icon}
          </span>
          {children}
        </span>
      ) : (
        children
      )}
      {hint ? (
        <span className="text-shell-muted mt-1.5 block text-xs">{hint}</span>
      ) : null}
    </label>
  )
}

export const INPUT_CLASS =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring/40 focus-visible:shadow-[0_0_0_4px_rgba(255,89,0,0.12)] h-10 w-full rounded-lg border px-3 text-sm outline-none transition-[border-color,box-shadow] focus-visible:ring-2"

export const SUBMIT_CLASS =
  "bg-shell-accent text-shell-accent-fg focus-visible:ring-shell-ring inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-[background-color,box-shadow,transform] hover:bg-shell-accent-deep hover:shadow-[0_12px_32px_-8px_rgba(255,89,0,0.7)] focus-visible:ring-2 focus-visible:outline-none active:translate-y-px disabled:opacity-60 disabled:shadow-none"
