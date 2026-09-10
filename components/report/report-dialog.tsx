"use client"

import { useState } from "react"
import { Flag, X } from "lucide-react"

import { ReportForm } from "@/components/report/report-form"
import { REPORT_FORM_TEXTS } from "@/components/admin/texts"
import type { Locale } from "@/lib/i18n"

/**
 * «Сообщить о проблеме» на странице компонента.
 *
 * Раскрывается на месте, а не уводит на отдельную страницу: человек уже
 * стоит перед сломанным компонентом, и терять этот контекст нельзя — код
 * item'а подставляется сам.
 */
export function ReportDialog({
  locale,
  itemName,
  email,
}: {
  locale: Locale
  itemName: string
  email?: string
}) {
  const t = REPORT_FORM_TEXTS[locale]
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-shell-muted hover:text-shell-fg inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <Flag className="size-3.5" aria-hidden="true" />
        {t.trigger}
      </button>
    )
  }

  return (
    <section className="border-shell-border bg-shell-panel mt-4 rounded-2xl border p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-shell-fg font-medium">{t.title}</h2>
          <p className="text-shell-muted mt-1 font-mono text-xs">{itemName}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-shell-muted hover:text-shell-fg -mt-1 -mr-1 rounded-md p-1 transition-colors"
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">{t.close}</span>
        </button>
      </div>

      <ReportForm
        locale={locale}
        kind="component"
        itemName={itemName}
        email={email}
        compact
      />
    </section>
  )
}
