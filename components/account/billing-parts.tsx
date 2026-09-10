"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2, RotateCw } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import type { Locale } from "@/lib/i18n"
import { cancelSubscription, resumeSubscription } from "@/lib/payment-actions"

export type PaymentRow = {
  id: string
  date: string
  amount: string
  status: keyof (typeof ACCOUNT_TEXTS)["ru"]["billing"]["status"]
}

const PAGE = 8

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
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true)
          setFailed(false)

          try {
            await (cancelled ? resumeSubscription() : cancelSubscription())
            router.refresh()
          } catch {
            setFailed(true)
          } finally {
            setPending(false)
          }
        }}
        className="border-shell-border text-shell-fg hover:border-shell-accent focus-visible:ring-shell-ring inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {cancelled ? t.resume : t.cancel}
      </button>

      {failed ? (
        <p role="alert" className="text-shell-accent-text text-sm">
          {ACCOUNT_TEXTS[locale].profile.failed}
        </p>
      ) : null}
    </div>
  )
}

/** Оплата ушла в ЮKassa и ещё не подтверждена: экран должен это говорить. */
export function PendingPayment({ locale }: { locale: Locale }) {
  const t = ACCOUNT_TEXTS[locale].billing
  const router = useRouter()
  const [pending, setPending] = useState(false)

  return (
    <section className="border-shell-accent/40 bg-shell-panel mt-6 rounded-2xl border p-5">
      <p className="text-shell-fg font-medium">{t.pendingTitle}</p>
      <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
        {t.pendingNote}
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setPending(true)
          router.refresh()
          window.setTimeout(() => setPending(false), 1500)
        }}
        className="border-shell-border text-shell-fg hover:border-shell-accent mt-4 inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors disabled:opacity-60"
      >
        <RotateCw
          className={`size-4 ${pending ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
        {t.refresh}
      </button>
    </section>
  )
}

/** История платежей: статус у каждого и продолжение списка. */
export function PaymentsList({
  locale,
  rows,
}: {
  locale: Locale
  rows: PaymentRow[]
}) {
  const t = ACCOUNT_TEXTS[locale].billing
  const [shown, setShown] = useState(PAGE)

  if (rows.length === 0) {
    return <p className="text-shell-muted mt-3 text-sm">{t.paymentsEmpty}</p>
  }

  return (
    <>
      <ul className="border-shell-border mt-3 divide-y divide-[var(--shell-divider)] rounded-2xl border">
        {rows.slice(0, shown).map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm"
          >
            <span className="text-shell-muted tabular-nums">{row.date}</span>
            <span className="flex items-baseline gap-3">
              <span
                className={
                  row.status === "succeeded"
                    ? "text-shell-muted"
                    : "text-shell-accent-text"
                }
              >
                {t.status[row.status]}
              </span>
              <span className="text-shell-fg font-medium tabular-nums">
                {row.amount}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {rows.length > shown ? (
        <button
          type="button"
          onClick={() => setShown((was) => was + PAGE)}
          className="border-shell-border text-shell-fg hover:border-shell-accent mt-3 inline-flex h-9 items-center rounded-lg border px-3 text-sm transition-colors"
        >
          {t.more}
        </button>
      ) : null}

      <p className="text-shell-muted mt-3 text-xs leading-relaxed">
        {t.paymentsNote}
      </p>
    </>
  )
}
