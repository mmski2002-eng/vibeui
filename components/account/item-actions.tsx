"use client"

import { useState, useTransition } from "react"
import { Check, Copy, Heart, Undo2 } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
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
    <Button
      size="sm"
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
      icon={
        copied ? (
          <Check className="text-shell-ok size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )
      }
    >
      {copied ? t.copied : (label ?? t.copy)}
    </Button>
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
  const toast = useToast()
  const [removed, setRemoved] = useState(false)
  const [pending, start] = useTransition()

  function toggle(next: boolean) {
    start(async () => {
      try {
        await setFavorite(itemName, next)
        setRemoved(!next)
        onRemoved?.(!next)

        if (!next) toast({ title: t.removed, tone: "info" })
      } catch {
        toast({ title: ACCOUNT_TEXTS[locale].profile.failed, tone: "danger" })
      }
    })
  }

  if (removed) {
    return (
      <Button
        size="sm"
        variant="ghost"
        pending={pending}
        onClick={() => toggle(true)}
        icon={<Undo2 className="size-4" aria-hidden="true" />}
      >
        {t.undo}
      </Button>
    )
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      pending={pending}
      onClick={() => toggle(false)}
      icon={<Heart className="size-4" aria-hidden="true" />}
    >
      {t.remove}
    </Button>
  )
}
