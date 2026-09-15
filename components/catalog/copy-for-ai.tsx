"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type MouseEvent } from "react"

import { useSession } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type CopyState = "idle" | "loading" | "copied" | "failed"

const BASE =
  "focus-visible:ring-shell-ring inline-flex h-9 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"

const VARIANTS = {
  primary:
    "bg-shell-accent text-shell-accent-fg border-shell-accent hover:bg-shell-accent-deep hover:border-shell-accent-deep active:scale-[0.98]",
  secondary:
    "border-shell-border text-shell-fg hover:bg-shell-elevated hover:border-shell-border-strong active:scale-[0.98]",
}

/**
 * «Копировать для ИИ». Ссылка не статическая: по клику выдаётся подписанная
 * `/c`-ссылка на сутки (один раз проверяются вход, подписка и лимит), и в
 * буфер уходит именно она — агент откроет её и получит инструкцию. Без входа
 * кнопка ведёт на «Войти», при исчерпанном лимите или закрытом item'е — на
 * оформление Pro.
 */
export function CopyForAi({
  name,
  params,
  label,
  copiedLabel,
  locale,
  variant = "primary",
  className,
  onCopied,
}: {
  name: string
  /** Значения контролов, дописываются к ссылке (подпись их не покрывает). */
  params?: string
  label: string
  copiedLabel?: string
  locale: Locale
  variant?: "primary" | "secondary"
  className?: string
  onCopied?: () => void
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [state, setState] = useState<CopyState>("idle")
  const en = locale === "en"

  if (!session) {
    return (
      <Link
        href={localePath(locale, "/signin")}
        className={cn(BASE, VARIANTS[variant], className)}
      >
        {en ? "Sign in" : "Войти"}
      </Link>
    )
  }

  async function copy(event: MouseEvent<HTMLButtonElement>) {
    if (state === "loading") {
      return
    }

    // Подложка кадра, на которой человек смотрел блок: тёмная или светлая.
    // «Как у оболочки» доводится до конкретной — агент получает то, что
    // видели, а не абстрактное «auto». Читается до await: после него
    // currentTarget уже пуст.
    const surface = event.currentTarget.closest<HTMLElement>(
      "[data-preview-theme]",
    )?.dataset.previewTheme
    const theme =
      surface === "light" || surface === "dark"
        ? surface
        : document.documentElement.dataset.shellTheme === "light"
          ? "light"
          : "dark"

    setState("loading")

    try {
      const response = await fetch(
        `/api/registry-source?name=${encodeURIComponent(name)}`,
      )

      if (!response.ok) {
        // Вошёл, но лимит исчерпан или item закрыт — на тариф.
        router.push(localePath(locale, "/pricing"))
        setState("idle")
        return
      }

      const data = await response.json()
      const query = new URLSearchParams(params)

      query.set("theme", theme)

      const url = `${data.docUrl}&${query}`

      await navigator.clipboard.writeText(url)
      setState("copied")
      onCopied?.()
      window.setTimeout(() => setState("idle"), 2000)
    } catch {
      setState("failed")
      window.setTimeout(() => setState("idle"), 2000)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={state === "loading"}
      className={cn(
        BASE,
        state === "failed" ? "border-destructive text-destructive" : VARIANTS[variant],
        className,
      )}
    >
      {state === "copied"
        ? (copiedLabel ?? (en ? "Copied" : "Скопировано"))
        : state === "failed"
          ? en
            ? "Copy failed"
            : "Не вышло"
          : label}
    </button>
  )
}
