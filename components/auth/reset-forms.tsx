"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { authClient } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"

/** Шаг первый: запросить письмо со ссылкой. */
export function ResetRequestForm({ locale }: { locale: Locale }) {
  const t = AUTH_TEXTS[locale]
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  if (sent) {
    return (
      <div className="grid gap-3">
        <p className="text-shell-muted text-sm leading-relaxed">
          {t.resetSent}
        </p>
        <p className="border-shell-border text-shell-muted rounded-xl border border-dashed p-3 text-sm leading-relaxed">
          {t.spamHint}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setPending(true)

        const form = new FormData(event.currentTarget)
        await authClient.requestPasswordReset({
          email: String(form.get("email")),
          redirectTo: localePath(locale, "/reset/new"),
        })

        // Результат не показываем: ответ «такой почты нет» превращает форму
        // в способ проверять, кто зарегистрирован.
        setPending(false)
        setSent(true)
      }}
    >
      <Field label={t.email}>
        <input
          className={INPUT_CLASS}
          type="email"
          name="email"
          autoComplete="email"
          required
          autoFocus
        />
      </Field>

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? t.sending : t.send}
      </button>
    </form>
  )
}

/** Шаг второй: задать новый пароль по токену из письма. */
export function ResetPasswordForm({ locale }: { locale: Locale }) {
  const t = AUTH_TEXTS[locale]
  const router = useRouter()
  const token = useSearchParams().get("token")
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  if (!token) {
    return (
      <p className="text-shell-muted text-sm leading-relaxed">{t.linkBroken}</p>
    )
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setError(undefined)
        setPending(true)

        const form = new FormData(event.currentTarget)
        const { error: failure } = await authClient.resetPassword({
          newPassword: String(form.get("password")),
          token,
        })

        setPending(false)

        if (failure) {
          setError(t.linkExpired)

          return
        }

        router.push(localePath(locale, "/signin"))
      }}
    >
      <Field label={t.newPassword} hint={t.passwordHint}>
        <input
          className={INPUT_CLASS}
          type="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={128}
          autoFocus
        />
      </Field>

      {error ? (
        <p role="alert" className="text-shell-accent mb-4 text-sm">
          {error}
        </p>
      ) : null}

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? t.saving : t.save}
      </button>
    </form>
  )
}
