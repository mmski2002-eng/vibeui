"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import type { Locale } from "@/lib/i18n"

export function CopyLink({
  url,
  locale = "ru",
}: {
  url: string
  locale?: Locale
}) {
  const t = ACCOUNT_TEXTS[locale].referrals
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="border-shell-border bg-shell-elevated text-shell-fg min-w-0 flex-1 overflow-x-auto rounded-lg border px-3 py-2.5 font-mono text-xs whitespace-nowrap">
        {url}
      </code>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
          } catch {
            // Буфер закрыт политикой браузера: ссылка на экране, её можно
            // выделить руками — ломать раздел незачем.
          }
        }}
        className="bg-shell-accent text-shell-accent-fg focus-visible:ring-shell-ring inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:outline-none"
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {copied ? t.copied : t.copy}
      </button>
    </div>
  )
}
