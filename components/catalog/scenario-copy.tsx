"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Check, Copy, Loader2 } from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const BASE =
  "acc-press inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-shell-accent focus-visible:ring-offset-2 focus-visible:outline-none"
const PRIMARY = "bg-shell-accent text-shell-accent-fg hover:bg-shell-accent-deep"

/**
 * «Копировать сценарий для ИИ»: подписанная ссылка на бриф целой страницы.
 * Право проверяет сервер (`/api/scenario-link`): без входа — на вход, без
 * Pro — на тарифы. В буфер уходит короткая ссылка, как у одного блока.
 */
export function ScenarioCopy({
  slug,
  locale,
  labels,
  className,
}: {
  slug: string
  locale: Locale
  labels: { copy: string; copied: string; signIn: string }
  className?: string
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [state, setState] = useState<"idle" | "loading" | "copied" | "failed">("idle")

  if (!session) {
    return (
      <Link href={localePath(locale, "/signin")} className={cn(BASE, PRIMARY, className)}>
        {labels.signIn}
      </Link>
    )
  }

  async function copy() {
    if (state === "loading") return

    setState("loading")

    try {
      const query = new URLSearchParams({ slug })

      if (locale !== "ru") query.set("lang", locale)

      const response = await fetch(`/api/scenario-link?${query}`)

      if (!response.ok) {
        router.push(localePath(locale, "/pricing"))
        setState("idle")

        return
      }

      const data = await response.json()

      await navigator.clipboard.writeText(data.docUrl)
      setState("copied")
      window.setTimeout(() => setState("idle"), 2500)
    } catch {
      setState("failed")
      window.setTimeout(() => setState("idle"), 2500)
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={state === "loading"}
      className={cn(BASE, PRIMARY, state === "failed" && "bg-red-600 text-white", className)}
    >
      {state === "loading" ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : state === "copied" ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {state === "copied" ? labels.copied : labels.copy}
    </button>
  )
}
