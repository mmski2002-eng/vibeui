"use client"

import { Check, Loader2 } from "lucide-react"
import { useEffect, useRef, useState, type MouseEvent } from "react"

import {
  GATE_BASE,
  GATE_VARIANTS,
  GatePopover,
  type GateReason,
  LockedCopyButton,
} from "@/components/catalog/pro-gate"
import { useSession } from "@/lib/auth-client"
import { type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

type CopyState = "idle" | "loading" | "copied" | "failed"

/**
 * «Копировать для ИИ». Ссылка не статическая: по клику выдаётся подписанная
 * `/c`-ссылка на сутки (один раз проверяются вход, подписка и лимит), и в
 * буфер уходит именно она — агент откроет её и получит инструкцию.
 *
 * Закрыто — кнопка остаётся кнопкой копирования с замком: клик показывает
 * поповер, что нужно (войти, Pro или исчерпан лимит), а не подменяет её чужой
 * ссылкой. Так человек видит, что здесь копируют, и почему сейчас нельзя.
 */
export function CopyForAi({
  name,
  params,
  label,
  copiedLabel,
  locale,
  variant = "primary",
  className,
  pro = false,
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
  /** Закрытый item: у не-Pro кнопка показывает поповер, а не копирует. */
  pro?: boolean
  onCopied?: () => void
}) {
  const { data: session } = useSession()
  const [state, setState] = useState<CopyState>("idle")
  // На закрытом item'е исходим из «нет Pro» и подтверждаем право запросом:
  // страница статична и на сервере сессию не знает. Ошибка — в пользу платящего.
  const [access, setAccess] = useState<"pro" | "nopro">(pro ? "nopro" : "pro")
  // Отказ сервера на лету (лимит, нет Pro, вышла сессия): поповер у кнопки
  // с причиной из ответа.
  const [denied, setDenied] = useState<{
    anchor: DOMRect
    reason: GateReason
  } | null>(null)
  const button = useRef<HTMLButtonElement>(null)
  const en = locale === "en"

  useEffect(() => {
    if (!pro || !session) return

    let live = true

    fetch("/api/entitlement")
      .then((response) => response.json())
      .then((data) => {
        if (live) setAccess(data?.pro ? "pro" : "nopro")
      })
      .catch(() => {
        if (live) setAccess("pro")
      })

    return () => {
      live = false
    }
  }, [pro, session])

  if (!session) {
    return (
      <LockedCopyButton
        label={label}
        reason="signin"
        locale={locale}
        variant={variant}
        className={className}
      />
    )
  }

  if (access === "nopro") {
    return (
      <LockedCopyButton
        label={label}
        reason="pro"
        locale={locale}
        variant={variant}
        className={className}
      />
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
        const reason = await response
          .json()
          .then((data: { reason?: GateReason }) => data?.reason)
          .catch(() => undefined)
        const anchor = button.current?.getBoundingClientRect()

        if (anchor) setDenied({ anchor, reason: reason ?? "limit" })
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
    <>
      <button
        ref={button}
        type="button"
        onClick={copy}
        disabled={state === "loading"}
        className={cn(
          GATE_BASE,
          state === "failed"
            ? "border-destructive text-destructive"
            : GATE_VARIANTS[variant],
          state === "copied" && "copy-flash",
          className,
        )}
      >
        {state === "copied" ? (
          <Check className="copy-check size-4" aria-hidden="true" />
        ) : state === "loading" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {/* Ключ по состоянию: новая подпись монтируется заново и проявляется,
            а не подменяется скачком. */}
        <span key={state} className="copy-label">
          {state === "copied"
            ? (copiedLabel ?? (en ? "Copied" : "Скопировано"))
            : state === "failed"
              ? en
                ? "Copy failed"
                : "Не вышло"
              : label}
        </span>
      </button>
      {denied ? (
        <GatePopover
          anchor={denied.anchor}
          reason={denied.reason}
          locale={locale}
          onClose={() => setDenied(null)}
        />
      ) : null}
    </>
  )
}
