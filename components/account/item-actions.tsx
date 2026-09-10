"use client"

import { useState, useTransition } from "react"
import { Check, Copy, Heart, Loader2 } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { setFavorite } from "@/lib/account-actions"
import type { Locale } from "@/lib/i18n"

/**
 * Копирование ссылки для агента прямо из кабинета: раньше за ней надо было
 * идти на страницу компонента, хотя всё, что человек делает в избранном, —
 * это забирает компонент в работу.
 */
export function CopyItemLink({
  url,
  locale,
  label,
}: {
  url: string | null
  locale: Locale
  label?: string
}) {
  const t = ACCOUNT_TEXTS[locale].favorites
  const [copied, setCopied] = useState(false)

  if (!url) return null

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2000)
        } catch {
          // Буфер может быть закрыт политикой браузера — тогда человек
          // копирует ссылку со страницы компонента, ломать кабинет незачем.
        }
      }}
      className="border-shell-border text-shell-fg hover:border-shell-accent focus-visible:ring-shell-ring inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      {copied ? (
        <Check className="text-shell-accent-text size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {copied ? t.copied : (label ?? t.copy)}
    </button>
  )
}

/**
 * Удаление из избранного с возвратом. Без отмены человек боится нажимать:
 * список собирается неделями, а промах стоит одного клика.
 */
export function RemoveFavorite({
  itemName,
  locale,
  onRemoved,
}: {
  itemName: string
  locale: Locale
  onRemoved?: (removed: boolean) => void
}) {
  const t = ACCOUNT_TEXTS[locale].favorites
  const [removed, setRemoved] = useState(false)
  const [pending, start] = useTransition()

  function toggle(next: boolean) {
    start(async () => {
      try {
        await setFavorite(itemName, next)
        setRemoved(!next)
        onRemoved?.(!next)
      } catch {
        // Состояние не меняем: карточка останется на месте, и повторное
        // нажатие — единственное, что нужно сделать человеку.
      }
    })
  }

  if (removed) {
    return (
      <span className="text-shell-muted inline-flex h-9 items-center gap-2 text-sm">
        {t.removed}
        <button
          type="button"
          disabled={pending}
          onClick={() => toggle(true)}
          className="text-shell-accent-text hover:underline disabled:opacity-60"
        >
          {t.undo}
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => toggle(false)}
      className="border-shell-border text-shell-muted hover:border-shell-accent hover:text-shell-fg focus-visible:ring-shell-ring inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Heart className="size-4" aria-hidden="true" />
      )}
      {t.remove}
    </button>
  )
}
