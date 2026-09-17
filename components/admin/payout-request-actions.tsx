"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ThumbsUp, X } from "lucide-react"

import { ADMIN_TEXTS } from "@/components/admin/texts"
import { Button } from "@/components/account/ui/button"
import { useToast } from "@/components/account/ui/toast"
import { resolvePayoutRequest } from "@/lib/admin-actions"

const INPUT =
  "border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-9 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none transition-colors focus-visible:ring-2"

type Action = "approve" | "pay" | "reject"

/** Действия по заявке. Новую — согласовать; согласованную — выплатить с чеком. */
export function PayoutRequestActions({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const t = ADMIN_TEXTS.payouts
  const router = useRouter()
  const toast = useToast()
  const [receipt, setReceipt] = useState("")
  const [pending, setPending] = useState<Action | null>(null)

  async function resolve(action: Action) {
    setPending(action)

    try {
      await resolvePayoutRequest({ id, action, receipt, note: "" })
      toast({
        title:
          action === "approve"
            ? t.doneApproved
            : action === "pay"
              ? t.donePaid
              : t.doneRejected,
      })
      router.refresh()
    } catch (error) {
      toast({
        title:
          error instanceof Error && error.message ? error.message : t.failed,
        tone: "danger",
      })
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {status === "approved" ? (
        <input
          value={receipt}
          onChange={(event) => setReceipt(event.target.value)}
          placeholder={t.receiptPlaceholder}
          maxLength={500}
          inputMode="url"
          className={`${INPUT} sm:max-w-72`}
        />
      ) : null}

      {status === "pending" ? (
        <Button
          size="sm"
          variant="primary"
          pending={pending === "approve"}
          disabled={pending !== null}
          icon={<ThumbsUp className="size-4" aria-hidden="true" />}
          onClick={() => resolve("approve")}
        >
          {t.approve}
        </Button>
      ) : null}

      {status === "approved" ? (
        <Button
          size="sm"
          variant="primary"
          pending={pending === "pay"}
          disabled={pending !== null || !receipt.trim()}
          icon={<Check className="size-4" aria-hidden="true" />}
          onClick={() => resolve("pay")}
        >
          {t.markPaid}
        </Button>
      ) : null}

      <Button
        size="sm"
        variant="ghost"
        pending={pending === "reject"}
        disabled={pending !== null}
        icon={<X className="size-4" aria-hidden="true" />}
        onClick={() => resolve("reject")}
      >
        {t.reject}
      </Button>
    </div>
  )
}
