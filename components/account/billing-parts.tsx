"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { RotateCw } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Button } from "@/components/account/ui/button"
import { Panel } from "@/components/account/ui/panel"
import type { Locale } from "@/lib/i18n"

/** Оплата ушла в ЮKassa и ещё не подтверждена: экран должен это говорить. */
export function PendingPayment({ locale }: { locale: Locale }) {
  const t = ACCOUNT_TEXTS[locale].billing
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <Panel variant="warn" index={0} className="mb-6">
      <p className="text-shell-fg font-medium">{t.pendingTitle}</p>
      <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
        {t.pendingNote}
      </p>
      <Button
        size="sm"
        className="mt-4"
        pending={pending}
        icon={<RotateCw className="size-4" aria-hidden="true" />}
        onClick={() => {
          setPending(true)
          router.refresh()
          window.setTimeout(() => setPending(false), 1500)
        }}
      >
        {t.refresh}
      </Button>
    </Panel>
  )
}
