"use client"

import Link from "next/link"
import { useState } from "react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { authClient } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"

export function SignUpForm({ locale }: { locale: Locale }) {
  const t = AUTH_TEXTS[locale]
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  if (sent) {
    return (
      <p className="text-shell-muted text-sm leading-relaxed">{t.verifySent}</p>
    )
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setError(undefined)
        setPending(true)

        const form = new FormData(event.currentTarget)
        const { error: failure } = await authClient.signUp.email({
          name: String(form.get("name")),
          email: String(form.get("email")),
          password: String(form.get("password")),
        })

        setPending(false)

        if (failure) {
          setError(failure.status === 422 ? t.emailTaken : t.signUpFailed)

          return
        }

        setSent(true)
      }}
    >
      <Field label={t.name}>
        <input
          className={INPUT_CLASS}
          type="text"
          name="name"
          autoComplete="name"
          required
          maxLength={60}
          autoFocus
        />
      </Field>
      <Field label={t.email}>
        <input
          className={INPUT_CLASS}
          type="email"
          name="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field label={t.password} hint={t.passwordHint}>
        <input
          className={INPUT_CLASS}
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={128}
        />
      </Field>

      <label className="mb-4 flex items-start gap-2.5 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          className="accent-shell-accent mt-0.5 size-4 shrink-0"
        />
        <span className="text-shell-muted leading-relaxed">
          {t.consent}{" "}
          <Link
            href={localePath(locale, "/legal/offer")}
            className="text-shell-fg underline"
          >
            {t.offer}
          </Link>{" "}
          {t.consentAnd}{" "}
          <Link
            href={localePath(locale, "/legal/privacy")}
            className="text-shell-fg underline"
          >
            {t.privacy}
          </Link>
        </span>
      </label>

      {error ? (
        <p role="alert" className="text-shell-accent mb-4 text-sm">
          {error}
        </p>
      ) : null}

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? t.creating : t.create}
      </button>
    </form>
  )
}
