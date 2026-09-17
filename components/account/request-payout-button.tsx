"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownToLine } from "lucide-react"

import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import { requestPayout } from "@/lib/partner-actions"

/** Кнопка «Запросить вывод». Причина недоступности — в подсказке рядом. */
export function RequestPayoutButton({
  disabled,
  labels: t,
}: {
  disabled: boolean
  labels: { button: string; sending: string; done: string; failed: string }
}) {
  const router = useRouter()
  const toast = useToast()
  const [pending, setPending] = useState(false)

  return (
    <Button
      variant="primary"
      pending={pending}
      disabled={disabled}
      icon={<ArrowDownToLine className="size-4" aria-hidden="true" />}
      onClick={async () => {
        setPending(true)

        try {
          await requestPayout()
          toast({ title: t.done })
          router.refresh()
        } catch (error) {
          toast({
            title:
              error instanceof Error && error.message ? error.message : t.failed,
            tone: "danger",
          })
        } finally {
          setPending(false)
        }
      }}
    >
      {pending ? t.sending : t.button}
    </Button>
  )
}
