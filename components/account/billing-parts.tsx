"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { RotateCw } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Button } from "@/components/account/ui/button"
import { Panel } from "@/components/account/ui/panel"
import { useToast } from "@/components/account/ui/toast"
import type { Locale } from "@/lib/i18n"
import { cancelSubscription, resumeSubscription } from "@/lib/payment-actions"

/** Управление продлением. Ошибку показываем, а не глотаем перезагрузкой. */
export function RenewalButton({
  locale,
  cancelled,
}: {
  locale: Locale
  cancelled: boolean
}) {
  const t = ACCOUNT_TEXTS[locale].billing
  const router = useRouter()
  const toast = useToast()
  const [pending, setPending] = useState(false)

  return (
    <Button
      variant={cancelled ? "primary" : "secondary"}
      pending={pending}
      onClick={async () => {
        setPending(true)

        try {
          await (cancelled ? resumeSubscription() : cancelSubscription())
          toast({ title: cancelled ? t.resumed : t.cancelledToast })
          router.refresh()
        } catch {
          toast({
            title: ACCOUNT_TEXTS[locale].profile.failed,
            tone: "danger",
          })
        } finally {
          setPending(false)
        }
      }}
    >
      {cancelled ? t.resume : t.cancel}
    </Button>
  )
}

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
