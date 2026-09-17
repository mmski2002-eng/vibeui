"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Lock, Save } from "lucide-react"

import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import { savePayoutReceipt, savePayoutRequisites } from "@/lib/partner-actions"

const INPUT =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-11 min-w-0 rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

export type PayoutProfileLabels = {
  inn: string
  innPlaceholder: string
  card: string
  cardPlaceholder: string
  receipt: string
  receiptPlaceholder: string
  warning: string
  locked: string
  save: string
  saving: string
  saved: string
  failed: string
}

/**
 * Реквизиты выплаты блогера. ИНН и номер карты фиксируются один раз: после
 * сохранения поля становятся справкой, а смену делает только поддержка (см.
 * проверку в `savePayoutRequisites`). Ссылка на чек «Мой налог» — отдельно и
 * всегда редактируема: она меняется от выплаты к выплате.
 */
export function PayoutProfileForm({
  inn,
  card,
  receipt,
  locked,
  labels: t,
}: {
  inn: string
  card: string
  receipt: string
  locked: boolean
  labels: PayoutProfileLabels
}) {
  const router = useRouter()
  const toast = useToast()

  const [req, setReq] = useState({ inn, card })
  const [reqPending, setReqPending] = useState(false)
  const [rcpt, setRcpt] = useState(receipt)
  const [rcptPending, setRcptPending] = useState(false)

  const reqField =
    (key: keyof typeof req) => (event: ChangeEvent<HTMLInputElement>) =>
      setReq((prev) => ({ ...prev, [key]: event.target.value }))

  async function run(
    action: () => Promise<void>,
    setPending: (value: boolean) => void,
  ) {
    setPending(true)

    try {
      await action()
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
  }

  return (
    <div className="grid gap-5">
      {locked ? (
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
            <span>
              <span className="text-shell-muted">{t.inn}: </span>
              <span className="text-shell-fg font-mono">{inn}</span>
            </span>
            <span>
              <span className="text-shell-muted">{t.card}: </span>
              <span className="text-shell-fg font-mono">{card}</span>
            </span>
          </div>
          <p className="text-shell-muted flex items-center gap-1.5 text-xs">
            <Lock className="size-3 shrink-0" aria-hidden="true" />
            {t.locked}
          </p>
        </div>
      ) : (
        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            void run(() => savePayoutRequisites(req), setReqPending)
          }}
        >
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-shell-muted text-xs">{t.inn}</span>
              <input
                value={req.inn}
                onChange={reqField("inn")}
                placeholder={t.innPlaceholder}
                inputMode="numeric"
                maxLength={12}
                className={`${INPUT} w-44 font-mono tabular-nums`}
              />
            </label>
            <label className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-shell-muted text-xs">{t.card}</span>
              <input
                value={req.card}
                onChange={reqField("card")}
                placeholder={t.cardPlaceholder}
                inputMode="numeric"
                maxLength={23}
                className={`${INPUT} w-full font-mono tabular-nums sm:min-w-64`}
              />
            </label>
          </div>
          <p className="text-shell-muted text-xs text-pretty">{t.warning}</p>
          <Button
            type="submit"
            size="lg"
            pending={reqPending}
            icon={<Save className="size-4" aria-hidden="true" />}
            className="justify-self-start"
          >
            {reqPending ? t.saving : t.save}
          </Button>
        </form>
      )}

      <form
        className="grid gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          void run(() => savePayoutReceipt({ receipt: rcpt }), setRcptPending)
        }}
      >
        <label className="flex min-w-0 flex-col gap-1">
          <span className="text-shell-muted text-xs">{t.receipt}</span>
          <input
            value={rcpt}
            onChange={(event) => setRcpt(event.target.value)}
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
          pending={rcptPending}
          icon={<Save className="size-4" aria-hidden="true" />}
          className="justify-self-start"
        >
          {rcptPending ? t.saving : t.save}
        </Button>
      </form>
    </div>
  )
}
