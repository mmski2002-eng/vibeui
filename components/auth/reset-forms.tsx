"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { PasswordInput } from "@/components/auth/password-input"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { authClient } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"

/** Шаг первый: запросить письмо со ссылкой. */
export function ResetRequestForm({ locale }: { locale: Locale }) {
  const t = AUTH_TEXTS[locale]
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string>()
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
        setError(undefined)
        setPending(true)

        const form = new FormData(event.currentTarget)

        try {
          const { error: failure } = await authClient.requestPasswordReset({
            email: String(form.get("email")),
            redirectTo: localePath(locale, "/reset/new"),
          })

          // «Такой почты нет» не показываем — это способ проверять чужие
          // адреса. А вот лимит попыток назвать нужно: иначе человек
          // нажимает снова и снова, не понимая, почему письма нет.
          if (failure?.status === 429) {
            setError(t.tooMany)

            return
          }

          setSent(true)
        } catch {
          setError(t.offline)
        } finally {
          setPending(false)
        }
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

      {error ? (
        <p role="alert" className="text-shell-accent-text mb-4 text-sm">
          {error}
        </p>
      ) : null}

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
  const params = useSearchParams()
  const token = params.get("token")
  const [error, setError] = useState<string>()
  const [expired, setExpired] = useState(false)
  const [pending, setPending] = useState(false)

  // Better Auth уводит сюда же с ?error=..., когда ссылка мертва.
  const failed = params.get("error")

  if (!token || failed) {
    return (
      <div className="grid gap-4">
        <p className="text-shell-muted text-sm leading-relaxed">
          {failed ? t.verifyExpiredLead : t.linkBroken}
        </p>
        <Link
          href={localePath(locale, "/reset")}
          className={`${SUBMIT_CLASS} no-underline`}
        >
          {t.send}
        </Link>
      </div>
    )
  }

  if (expired) {
    return (
      <div className="grid gap-4">
        <p className="text-shell-muted text-sm leading-relaxed">
          {t.verifyExpiredLead}
        </p>
        <Link
          href={localePath(locale, "/reset")}
          className={`${SUBMIT_CLASS} no-underline`}
        >
          {t.send}
        </Link>
      </div>
    )
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setError(undefined)
        setPending(true)

        const form = new FormData(event.currentTarget)

        try {
          const { error: failure } = await authClient.resetPassword({
            newPassword: String(form.get("password")),
            token,
          })

          if (failure) {
            // Истёкшая ссылка и временный сбой — разные вещи: в первом
            // случае нужно новое письмо, во втором просто повторить.
            if (failure.status === 400 || failure.status === 401) {
              setExpired(true)
            } else if (failure.status === 429) {
              setError(t.tooMany)
            } else {
              setError(t.signUpFailed)
            }

            return
          }

          router.push(`${localePath(locale, "/signin")}?reset=done`)
        } catch {
          setError(t.offline)
        } finally {
          setPending(false)
        }
      }}
    >
      <Field label={t.newPassword} hint={t.passwordHint}>
        <PasswordInput
          locale={locale}
          className={INPUT_CLASS}
          name="password"
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={128}
          autoFocus
        />
      </Field>

      {error ? (
        <p role="alert" className="text-shell-accent-text mb-4 text-sm">
          {error}
        </p>
      ) : null}

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? t.saving : t.save}
      </button>
    </form>
  )
}
