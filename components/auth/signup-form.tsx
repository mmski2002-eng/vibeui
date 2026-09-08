"use client"

import Link from "next/link"
import { useState } from "react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { authClient } from "@/lib/auth-client"

export function SignUpForm() {
  const [error, setError] = useState<string>()
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  if (sent) {
    return (
      <p className="text-shell-muted text-sm leading-relaxed">
        Письмо со ссылкой отправлено. Откройте её, чтобы подтвердить адрес и
        войти. Ссылка действует 30 минут.
      </p>
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
          setError(
            failure.status === 422
              ? "Такая почта уже зарегистрирована."
              : "Не удалось зарегистрироваться. Попробуйте ещё раз.",
          )

          return
        }

        setSent(true)
      }}
    >
      <Field label="Имя">
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
      <Field label="Почта">
        <input
          className={INPUT_CLASS}
          type="email"
          name="email"
          autoComplete="email"
          required
        />
      </Field>
      <Field label="Пароль" hint="Не короче 10 символов">
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
          Соглашаюсь с{" "}
          <Link href="/legal/offer" className="text-shell-fg underline">
            офертой
          </Link>{" "}
          и{" "}
          <Link href="/legal/privacy" className="text-shell-fg underline">
            обработкой персональных данных
          </Link>
        </span>
      </label>

      {error ? (
        <p role="alert" className="text-shell-accent mb-4 text-sm">
          {error}
        </p>
      ) : null}

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? "Создаём…" : "Создать аккаунт"}
      </button>
    </form>
  )
}
