"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet } from "lucide-react"

import { ADMIN_TEXTS } from "@/components/admin/texts"
import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import { recordPartnerPayout } from "@/lib/admin-actions"

const INPUT =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 min-w-0 rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

/** Запись факта выплаты блогеру: сумма и заметка. */
export function RecordPayoutForm({ partnerId }: { partnerId: string }) {
  const t = ADMIN_TEXTS.partners
  const router = useRouter()
  const toast = useToast()
  const [values, setValues] = useState({ amount: "", note: "" })
  const [pending, setPending] = useState(false)

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={async (event) => {
        event.preventDefault()
        setPending(true)

        try {
          await recordPartnerPayout({ partnerId, ...values })
          setValues({ amount: "", note: "" })
          toast({ title: t.payoutSaved })
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
        <span className="text-shell-muted text-xs">{t.payoutAmount}</span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={values.amount}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, amount: event.target.value }))
          }
          className={`${INPUT} w-32 tabular-nums`}
        />
      </label>
      <label className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-shell-muted text-xs">{t.payoutNote}</span>
        <input
          value={values.note}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, note: event.target.value }))
          }
          placeholder={t.payoutNotePlaceholder}
          maxLength={500}
          className={`${INPUT} sm:min-w-64 sm:flex-1`}
        />
      </label>
      <Button
        type="submit"
        pending={pending}
        disabled={!values.amount.trim()}
        icon={<Wallet className="size-4" aria-hidden="true" />}
      >
        {pending ? t.payoutSaving : t.payoutSave}
      </Button>
    </form>
  )
}
