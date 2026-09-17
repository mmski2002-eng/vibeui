"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Save } from "lucide-react"

import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import { savePayoutProfile } from "@/lib/partner-actions"

const INPUT =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-11 min-w-0 rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

export type PayoutProfileLabels = {
  inn: string
  innPlaceholder: string
  details: string
  detailsPlaceholder: string
  receipt: string
  receiptPlaceholder: string
  save: string
  saving: string
  saved: string
  failed: string
}

/** Реквизиты выплаты блогера: ИНН, куда переводить и ссылка на чек «Мой налог». */
export function PayoutProfileForm({
  inn,
  details,
  receipt,
  labels: t,
}: {
  inn: string
  details: string
  receipt: string
  labels: PayoutProfileLabels
}) {
  const router = useRouter()
  const toast = useToast()
  const [values, setValues] = useState({ inn, details, receipt })
  const [pending, setPending] = useState(false)

  const field =
    (key: keyof typeof values) => (event: ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [key]: event.target.value }))

  return (
    <form
      className="grid gap-3"
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
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-shell-muted text-xs">{t.inn}</span>
          <input
            value={values.inn}
            onChange={field("inn")}
            placeholder={t.innPlaceholder}
            inputMode="numeric"
            maxLength={12}
            className={`${INPUT} w-44 font-mono tabular-nums`}
          />
        </label>
        <label className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-shell-muted text-xs">{t.details}</span>
          <input
            value={values.details}
            onChange={field("details")}
            placeholder={t.detailsPlaceholder}
            maxLength={200}
            className={`${INPUT} w-full sm:min-w-64`}
          />
        </label>
      </div>

      <label className="flex min-w-0 flex-col gap-1">
        <span className="text-shell-muted text-xs">{t.receipt}</span>
        <input
          value={values.receipt}
          onChange={field("receipt")}
          placeholder={t.receiptPlaceholder}
          type="url"
          inputMode="url"
          maxLength={500}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={`${INPUT} w-full`}
        />
      </label>

      <Button
        type="submit"
        size="lg"
        pending={pending}
        icon={<Save className="size-4" aria-hidden="true" />}
        className="justify-self-start"
      >
        {pending ? t.saving : t.save}
      </Button>
    </form>
  )
}
