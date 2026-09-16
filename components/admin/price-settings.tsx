"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { INPUT_CLASS } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { setPlanPrices } from "@/lib/admin-actions"

type Values = { monthly: string; yearly: string; promoPercent: string }

/**
 * Две цены Pro и скидка по промокоду. Сохраняются вместе: витрина считает
 * скидку года от месяца, а цену по промокоду — от обеих.
 */
export function PriceSettings({
  monthly,
  yearly,
  promoPercent,
  defaults,
}: {
  monthly: string
  yearly: string
  promoPercent: string
  defaults: Values
}) {
  const t = ADMIN_TEXTS.payments
  const router = useRouter()
  const [values, setValues] = useState<Values>({
    monthly,
    yearly,
    promoPercent,
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string>()
  const [failed, setFailed] = useState(false)

  async function save() {
    setSaving(true)
    setFailed(false)
    setMessage(undefined)

    try {
      await setPlanPrices(values)
      setMessage(t.done)
      router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setSaving(false)
    }
  }

  const field = (key: keyof Values, label: string, max: number) => (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-shell-muted text-xs">
        {label}{" "}
        <span className="tabular-nums">
          ({t.pricesDefault} {defaults[key]})
        </span>
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        step={1}
        value={values[key]}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, [key]: event.target.value }))
        }
        className={`${INPUT_CLASS} w-36 tabular-nums`}
      />
    </label>
  )

  return (
    <div className="border-shell-border bg-shell-panel acc-reveal mb-6 rounded-xl border p-4 sm:p-5">
      <p className="text-shell-fg text-sm font-medium">{t.prices}</p>
      <p className="text-shell-muted mt-1 max-w-xl text-sm leading-relaxed">
        {t.pricesNote}
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        {field("monthly", t.priceMonthly, 1_000_000)}
        {field("yearly", t.priceYearly, 1_000_000)}
        {field("promoPercent", t.promoPercent, 90)}
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="acc-press border-shell-border bg-shell-panel text-shell-fg hover:border-shell-accent-line hover:bg-shell-elevated inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {saving ? t.pricesSaving : t.pricesSave}
        </button>
        {message ? (
          <span className="text-shell-muted text-xs">{message}</span>
        ) : null}
        {failed ? (
          <span className="text-xs text-red-500">{t.failed}</span>
        ) : null}
      </div>
      <p className="text-shell-muted mt-2 text-xs leading-relaxed">
        {t.promoPercentNote}
      </p>
    </div>
  )
}
