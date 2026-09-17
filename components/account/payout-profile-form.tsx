"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"

import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import { savePayoutProfile } from "@/lib/partner-actions"

const INPUT =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

export type PayoutProfileLabels = {
  inn: string
  innPlaceholder: string
  details: string
  detailsPlaceholder: string
  save: string
  saving: string
  saved: string
  failed: string
}

/** Реквизиты выплаты блогера: ИНН самозанятого и куда переводить. */
export function PayoutProfileForm({
  inn,
  details,
  labels: t,
}: {
  inn: string
  details: string
  labels: PayoutProfileLabels
}) {
  const router = useRouter()
  const toast = useToast()
  const [values, setValues] = useState({ inn, details })
  const [pending, setPending] = useState(false)

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={async (event) => {
        event.preventDefault()
        setPending(true)

        try {
          await savePayoutProfile(values)
          toast({ title: t.saved })
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
      <label className="flex min-w-0 flex-col gap-1">
        <span className="text-shell-muted text-xs">{t.inn}</span>
        <input
          value={values.inn}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, inn: event.target.value }))
          }
          placeholder={t.innPlaceholder}
          inputMode="numeric"
          maxLength={12}
          className={`${INPUT} w-44 flex-none font-mono tabular-nums`}
        />
      </label>
      <label className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-shell-muted text-xs">{t.details}</span>
        <input
          value={values.details}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, details: event.target.value }))
          }
          placeholder={t.detailsPlaceholder}
          maxLength={200}
          className={`${INPUT} sm:min-w-64`}
        />
      </label>
      <Button
        type="submit"
        pending={pending}
        icon={<Save className="size-4" aria-hidden="true" />}
      >
        {pending ? t.saving : t.save}
      </Button>
    </form>
  )
}
