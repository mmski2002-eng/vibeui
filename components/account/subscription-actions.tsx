"use client"

import { useState } from "react"

import { cancelSubscription, resumeSubscription } from "@/lib/payment-actions"

export function SubscriptionActions({ cancelled }: { cancelled: boolean }) {
  const [pending, setPending] = useState(false)

  return (
    <button
      type="button"
      disabled={pending}
      onClick={async () => {
        setPending(true)
        await (cancelled ? resumeSubscription() : cancelSubscription())
        setPending(false)
        window.location.reload()
      }}
      className="border-shell-border text-shell-muted hover:border-shell-accent hover:text-shell-fg mt-4 inline-flex h-9 items-center rounded-lg border px-3 text-sm transition-colors disabled:opacity-60"
    >
      {cancelled ? "Возобновить продление" : "Отключить продление"}
    </button>
  )
}
