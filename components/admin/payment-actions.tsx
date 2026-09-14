"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

import { ADMIN_TEXTS } from "@/components/admin/texts"
import {
  markRefunded,
  replayPayment,
  setReceiptUrl,
  syncPayment,
} from "@/lib/admin-actions"

/**
 * Три операции над платежом. Каждая объясняет последствие до нажатия:
 * администратор работает с чужими деньгами, и «нажми и посмотри» здесь не
 * годится.
 */
export function PaymentActions({
  paymentId,
  receiptUrl,
}: {
  paymentId: string
  receiptUrl: string | null
}) {
  const t = ADMIN_TEXTS.payments
  const router = useRouter()
  const [pending, setPending] = useState<string>()
  const [message, setMessage] = useState<string>()
  const [failed, setFailed] = useState(false)
  const [reason, setReason] = useState("")
  const [receipt, setReceipt] = useState(receiptUrl ?? "")

  async function run(name: string, action: () => Promise<unknown>) {
    setPending(name)
    setFailed(false)
    setMessage(undefined)

    try {
      const result = await action()
      setMessage(typeof result === "string" ? result : t.done)
      router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setPending(undefined)
    }
  }

  return (
    <div className="border-shell-border bg-shell-panel acc-shadow acc-reveal mt-6 grid gap-4 rounded-2xl border p-5">
      <div className="border-shell-border border-b pb-4">
        <p className="text-shell-fg text-sm font-medium">{t.receipt}</p>
        <p className="text-shell-muted mt-1 max-w-xl text-sm leading-relaxed">
          {t.receiptNote}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="url"
            value={receipt}
            onChange={(event) => setReceipt(event.target.value)}
            placeholder={t.receiptPlaceholder}
            className="border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none sm:max-w-md"
          />
          <button
            type="button"
            disabled={pending === "receipt" || receipt === (receiptUrl ?? "")}
            onClick={() =>
              run("receipt", () => setReceiptUrl({ paymentId, url: receipt }))
            }
            className="acc-press border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium disabled:opacity-60"
          >
            {pending === "receipt" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {pending === "receipt" ? t.receiptSaving : t.receiptSave}
          </button>
        </div>
      </div>

      <Action
        title={t.sync}
        note={t.syncNote}
        busy={pending === "sync"}
        label={pending === "sync" ? t.syncing : t.sync}
        onRun={() => run("sync", () => syncPayment({ paymentId }))}
      />

      <Action
        title={t.replay}
        note={t.replayNote}
        busy={pending === "replay"}
        label={pending === "replay" ? t.replaying : t.replay}
        onRun={() => run("replay", () => replayPayment({ paymentId }))}
      />

      <div className="border-shell-border border-t pt-4">
        <p className="text-shell-fg text-sm font-medium">{t.markRefunded}</p>
        <p className="text-shell-muted mt-1 max-w-xl text-sm leading-relaxed">
          {t.markRefundedNote}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={t.reason}
            className="border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none sm:max-w-xs"
          />
          <button
            type="button"
            disabled={pending === "refund" || reason.trim().length < 3}
            onClick={() =>
              run("refund", () => markRefunded({ paymentId, reason }))
            }
            className="acc-press border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium disabled:opacity-60"
          >
            {pending === "refund" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {t.markRefunded}
          </button>
        </div>
      </div>

      {message ? (
        <p role="status" className="text-shell-muted text-sm">
          {message}
        </p>
      ) : null}
      {failed ? (
        <p role="alert" className="text-shell-accent-text text-sm">
          {t.failed}
        </p>
      ) : null}
    </div>
  )
}

function Action({
  title,
  note,
  label,
  busy,
  onRun,
}: {
  title: string
  note: string
  label: string
  busy: boolean
  onRun: () => void
}) {
  return (
    <div>
      <p className="text-shell-fg text-sm font-medium">{title}</p>
      <p className="text-shell-muted mt-1 max-w-xl text-sm leading-relaxed">
        {note}
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={onRun}
        className="acc-press border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated mt-3 inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {label}
      </button>
    </div>
  )
}
