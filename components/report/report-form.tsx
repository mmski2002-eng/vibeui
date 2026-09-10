"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { REPORT_FORM_TEXTS } from "@/components/admin/texts"
import { authClient } from "@/lib/auth-client"
import { createReport } from "@/lib/report-actions"
import type { ReportKind } from "@/lib/report-types"
import type { Locale } from "@/lib/i18n"

/**
 * Форма обращения. Одна на три случая: жалоба на компонент, вопрос в
 * поддержку и претензия по правам — отличаются полями, а не поведением.
 *
 * Поле-приманка `company` скрыто от людей и заполняется ботами: дешёвая
 * защита, которая не мешает человеку, в отличие от капчи.
 */
export function ReportForm({
  locale,
  kind,
  itemName,
  email,
  compact,
}: {
  locale: Locale
  kind: ReportKind
  /** Код компонента: подставляется формой на странице item'а. */
  itemName?: string
  /** Почта аккаунта: для вошедшего поле не нужно. */
  email?: string
  compact?: boolean
}) {
  const t = REPORT_FORM_TEXTS[locale]
  const session = authClient.useSession()
  // Вошедшего про почту не спрашиваем: адрес всё равно возьмётся из сессии
  // на сервере, а лишнее поле раздражает ровно там, где человек уже сердит.
  const known = email ?? session.data?.user.email
  const [state, setState] = useState<"idle" | "pending" | "sent">("idle")
  const [error, setError] = useState<string>()

  if (state === "sent") {
    return (
      <div className={compact ? "" : "border-shell-border rounded-2xl border p-5"}>
        <p className="text-shell-fg font-medium">{t.sent}</p>
        <p className="text-shell-muted mt-2 text-sm leading-relaxed">
          {t.sentNote}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)

        if (String(form.get("company") ?? "").length > 0) {
          // Приманка заполнена: молча делаем вид, что всё отправлено.
          setState("sent")

          return
        }

        setError(undefined)
        setState("pending")

        try {
          const subject =
            kind === "component"
              ? `${String(form.get("reason") ?? "")} · ${itemName ?? ""}`
              : String(form.get("subject") ?? "")

          const result = await createReport({
            kind,
            subject,
            message: String(form.get("message") ?? ""),
            email: known ?? String(form.get("email") ?? ""),
            itemName,
            locale,
          })

          if (!result.ok) {
            setError(result.reason === "rate" ? t.tooOften : t.required)
            setState("idle")

            return
          }

          setState("sent")
        } catch {
          setError(t.failed)
          setState("idle")
        }
      }}
    >
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      {kind === "component" ? (
        <Field label={t.reason}>
          <select name="reason" className={INPUT_CLASS} defaultValue="broken">
            {Object.entries(t.reasons).map(([key, label]) => (
              <option key={key} value={label}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <Field label={t.subject}>
          <input
            className={INPUT_CLASS}
            type="text"
            name="subject"
            required
            maxLength={200}
          />
        </Field>
      )}

      {known ? null : (
        <Field label={t.email}>
          <input
            className={INPUT_CLASS}
            type="email"
            name="email"
            required
            autoComplete="email"
          />
        </Field>
      )}

      <Field label={t.message} hint={t.messageHint}>
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={4000}
          rows={5}
          className="border-shell-border bg-shell-elevated text-shell-fg focus-visible:border-shell-accent focus-visible:ring-shell-ring w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
        />
      </Field>

      {error ? (
        <p role="alert" className="text-shell-accent-text mb-4 text-sm">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className={SUBMIT_CLASS}
        disabled={state === "pending"}
      >
        {state === "pending" ? (
          <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {state === "pending" ? t.sending : t.send}
      </button>
    </form>
  )
}
