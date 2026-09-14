"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Button } from "@/components/account/ui/button"
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
      <code className="border-shell-border bg-shell-elevated text-shell-fg min-w-0 flex-1 overflow-x-auto rounded-lg border px-3 py-2.5 font-mono text-sm whitespace-nowrap">
        {url}
      </code>
      <Button
        variant="primary"
        size="lg"
        icon={
          copied ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )
        }
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
      >
        {copied ? t.copied : t.copy}
      </Button>
    </div>
  )
}
