"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"

const LABELS = {
  ru: { out: "Выйти", pending: "Выходим…" },
  en: { out: "Sign out", pending: "Signing out…" },
} satisfies Record<Locale, { out: string; pending: string }>

export function SignOutButton({
  locale = "ru",
  compact,
}: {
  locale?: Locale
  /** Иконка вместо подписи: в узкой карточке пользователя слов и так много. */
  compact?: boolean
}) {
  const router = useRouter()
  const t = LABELS[locale]
  const [pending, setPending] = useState(false)

  return (
    <button
      type="button"
      disabled={pending}
      title={t.out}
      onClick={async () => {
        setPending(true)

        try {
          await authClient.signOut()
        } finally {
          // Даже если запрос не дошёл, кука сессии уже могла погаснуть:
          // оставлять человека на закрытой странице в любом случае нельзя.
          router.push(localePath(locale, "/"))
          router.refresh()
        }
      }}
      className={
        compact
          ? "border-shell-border text-shell-muted hover:border-shell-accent hover:text-shell-fg focus-visible:ring-shell-ring inline-flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
          : "border-shell-border text-shell-muted hover:border-shell-accent hover:text-shell-fg focus-visible:ring-shell-ring inline-flex h-9 items-center rounded-lg border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
      }
    >
      {compact ? (
        <>
          <LogOut className="size-4" aria-hidden="true" />
          <span className="sr-only">{t.out}</span>
        </>
      ) : (
        <span>{pending ? t.pending : t.out}</span>
      )}
    </button>
  )
}
