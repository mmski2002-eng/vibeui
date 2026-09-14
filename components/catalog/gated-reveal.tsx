"use client"

import Link from "next/link"
import { useState } from "react"

import { CodeBlock } from "@/components/code-block"
import { CopyButton } from "@/components/copy-button"
import { useSession } from "@/lib/auth-client"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"

type RevealState = "idle" | "loading" | "ok" | "denied" | "error"

/**
 * «Показать код» / «Копировать для ИИ» без утечки в статику. Полезное тело —
 * исходник или инструкция для агента — не встраивается в страницу, а
 * забирается по закрытому адресу (`/f`, `/c`) при первом раскрытии. Сервер
 * отвечает 401 без входа и без Pro: тогда вместо кода показываем, куда идти.
 *
 * Страница остаётся статической и индексируемой (в разметке кода нет), а
 * доступ решается на лету — тем же 401, что и у shadcn CLI.
 */
export function GatedReveal({
  id,
  url,
  summary,
  note,
  copyLabel,
  asCode = false,
  locale,
}: {
  id?: string
  url: string
  summary: string
  note: string
  copyLabel: string
  asCode?: boolean
  locale: Locale
}) {
  const t = getDictionary(locale)
  const en = locale === "en"
  const { data: session } = useSession()
  const [state, setState] = useState<RevealState>("idle")
  const [text, setText] = useState("")

  async function load() {
    if (state === "loading" || state === "ok") {
      return
    }

    setState("loading")

    try {
      const response = await fetch(url)

      if (response.ok) {
        setText(await response.text())
        setState("ok")
      } else {
        setState(response.status === 401 ? "denied" : "error")
      }
    } catch {
      setState("error")
    }
  }

  return (
    <details
      id={id}
      className="border-shell-border mt-4 scroll-mt-20 rounded-xl border"
      onToggle={(event) => {
        if (event.currentTarget.open) {
          void load()
        }
      }}
    >
      <summary className="text-shell-fg cursor-pointer px-4 py-3 text-sm font-medium select-none marker:content-none [&::-webkit-details-marker]:hidden">
        {summary}
      </summary>
      <div className="border-shell-border border-t p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-shell-muted max-w-2xl text-sm text-pretty">
            {note}
          </p>
          {state === "ok" ? (
            <CopyButton value={text} label={copyLabel} />
          ) : null}
        </div>

        {state === "ok" ? (
          asCode ? (
            <CodeBlock code={text} />
          ) : (
            <pre className="bg-shell-elevated border-shell-border text-shell-fg max-h-96 overflow-auto rounded-lg border p-4 text-xs leading-relaxed whitespace-pre-wrap">
              {text}
            </pre>
          )
        ) : state === "denied" ? (
          <div className="border-shell-accent/40 bg-shell-accent/10 flex flex-col items-start gap-3 rounded-lg border p-4">
            <p className="text-shell-fg text-sm">
              {session
                ? en
                  ? "Available on Pro."
                  : "Доступно по подписке Pro."
                : en
                  ? "Sign in to open it — free, no card."
                  : "Войдите, чтобы открыть — бесплатно и без карты."}
            </p>
            <Link
              href={localePath(locale, session ? "/pricing" : "/signin")}
              className="bg-shell-accent text-shell-accent-fg hover:bg-shell-accent-deep focus-visible:ring-shell-ring inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              {session
                ? en
                  ? "Get Pro"
                  : "Оформить Pro"
                : en
                  ? "Sign in"
                  : "Войти"}
            </Link>
          </div>
        ) : state === "error" ? (
          <p className="text-shell-muted text-sm">{t.item.noSource}</p>
        ) : (
          <p className="text-shell-muted text-sm">{t.card.loading}</p>
        )}
      </div>
    </details>
  )
}
