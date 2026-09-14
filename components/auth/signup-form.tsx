"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Lock, Mail, User } from "lucide-react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { PasswordInput } from "@/components/auth/password-input"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { CONSENT_VERSION } from "@/lib/consent"
import { authClient } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"
import { safeNext } from "@/lib/safe-path"

export function SignUpForm({ locale }: { locale: Locale }) {
  const t = AUTH_TEXTS[locale]
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  // Абсолютный путь внутри сайта: языковой префикс в нём уже учтён.
  const next = safeNext(params.get("next"), localePath(locale, "/account"))

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setError(undefined)
        setPending(true)

        const form = new FormData(event.currentTarget)
        const email = String(form.get("email"))

        try {
          const { error: failure } = await authClient.signUp.email({
            name: String(form.get("name") ?? "").trim(),
            email,
            password: String(form.get("password")),
            // Письма уходят позже, из фоновых задач: язык страницы известен
            // только здесь, и дальше его помнит сам аккаунт.
            locale,
            // Версия документов, с которыми человек согласился. Сервер её
            // проверяет: галочка в браузере ничего не доказывает.
            consentVersion: CONSENT_VERSION,
            // Куда вернуть после подтверждения адреса: раньше письмо всегда
            // приводило на главную, а не туда, ради чего человек регистрировался.
            callbackURL: `${localePath(locale, "/verify")}?state=done&next=${encodeURIComponent(next)}`,
          })

          if (failure) {
            setError(
              failure.status === 422
                ? t.emailTaken
                : failure.status === 429
                  ? t.tooMany
                  : failure.status === 400
                    ? t.consentRequired
                    : t.signUpFailed,
            )

            return
          }

          router.push(
            `${localePath(locale, "/verify")}?email=${encodeURIComponent(email)}&next=${encodeURIComponent(next)}`,
          )
        } catch {
          setError(t.offline)
        } finally {
          setPending(false)
        }
      }}
    >
      <Field label={t.name} icon={<User />}>
        <input
          className={INPUT_CLASS}
          type="text"
          name="name"
          placeholder={t.nameOptional}
          autoComplete="name"
          maxLength={60}
          autoFocus
        />
      </Field>
      <Field label={t.email} icon={<Mail />}>
        <input
          className={INPUT_CLASS}
          type="email"
          name="email"
          placeholder={t.emailPlaceholder}
          autoComplete="email"
          required
        />
      </Field>
      <Field label={t.password} icon={<Lock />}>
        <PasswordInput
          locale={locale}
          className={INPUT_CLASS}
          name="password"
          placeholder={t.passwordHint}
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={128}
        />
      </Field>

      <label className="mb-4 flex items-start gap-2.5 text-sm leading-snug">
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
        <p role="alert" className="text-shell-accent-text mb-4 text-sm">
          {error}
        </p>
      ) : null}

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? t.creating : t.create}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  )
}
