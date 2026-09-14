"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Lock, Mail } from "lucide-react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { PasswordInput } from "@/components/auth/password-input"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { authClient } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"
import { safeNext } from "@/lib/safe-path"

export function SignInForm({ locale }: { locale: Locale }) {
  const t = AUTH_TEXTS[locale]
  const router = useRouter()
  const params = useSearchParams()
  const [error, setError] = useState<string>()
  const [unverified, setUnverified] = useState<string>()
  const [pending, setPending] = useState(false)

  // Куда человек шёл до того, как его развернули на вход. Адрес уже
  // абсолютный (`/en/...` для английской ветки), поэтому языковой префикс к
  // нему не добавляется — иначе получалось «/en/en/account».
  const next = safeNext(params.get("next"), localePath(locale, "/account"))
  // После сброса пароля человека приводят сюда: сказать «получилось» здесь
  // дешевле, чем оставить его гадать, сменился ли пароль.
  const afterReset = params.get("reset") === "done"

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setError(undefined)
        setUnverified(undefined)
        setPending(true)

        const form = new FormData(event.currentTarget)
        const email = String(form.get("email"))

        try {
          const { error: failure } = await authClient.signIn.email({
            email,
            password: String(form.get("password")),
          })

          if (failure) {
            // Неподтверждённая почта — единственная причина, которую можно
            // назвать: человек уже доказал знание пароля. Остальные отказы
            // объединены, иначе форма отвечает, кто здесь зарегистрирован.
            if (failure.status === 403) {
              setUnverified(email)
            } else {
              setError(
                failure.status === 429 ? t.tooMany : t.signInFailed,
              )
            }

            return
          }

          router.push(next)
          router.refresh()
        } catch {
          setError(t.offline)
        } finally {
          setPending(false)
        }
      }}
    >
      <Field label={t.email} icon={<Mail />}>
        <input
          className={INPUT_CLASS}
          type="email"
          name="email"
          placeholder={t.emailPlaceholder}
          autoComplete="email"
          required
          autoFocus
        />
      </Field>
      <Field
        label={t.password}
        icon={<Lock />}
        aside={
          <Link
            href={localePath(locale, "/reset")}
            className="text-shell-muted hover:text-shell-fg text-xs transition-colors"
          >
            {t.forgot}
          </Link>
        }
      >
        <PasswordInput
          locale={locale}
          className={INPUT_CLASS}
          name="password"
          autoComplete="current-password"
          required
        />
      </Field>

      {afterReset && !error && !unverified ? (
        <p role="status" className="text-shell-muted mb-4 text-sm">
          {t.resetDone}
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-shell-accent-text mb-4 text-sm">
          {error}
        </p>
      ) : null}

      {unverified ? (
        <p
          role="alert"
          className="border-shell-accent/40 bg-shell-accent/10 text-shell-fg mb-4 rounded-lg border px-3 py-2 text-sm leading-relaxed"
        >
          {t.notVerified}{" "}
          <Link
            href={`${localePath(locale, "/verify")}?email=${encodeURIComponent(unverified)}`}
            className="text-shell-accent-text underline"
          >
            {t.resend}
          </Link>
        </p>
      ) : null}

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? t.entering : t.enter}
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>
    </form>
  )
}
