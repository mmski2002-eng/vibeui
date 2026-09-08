"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { authClient } from "@/lib/auth-client"

export function SignInForm() {
  const router = useRouter()
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        setError(undefined)
        setPending(true)

        const form = new FormData(event.currentTarget)
        const { error: failure } = await authClient.signIn.email({
          email: String(form.get("email")),
          password: String(form.get("password")),
        })

        setPending(false)

        if (failure) {
          // Разные причины отказа объединены намеренно: подсказка «такой
          // почты нет» сама по себе выдаёт, кто зарегистрирован.
          setError(
            failure.status === 403
              ? "Почта не подтверждена. Проверьте письмо со ссылкой."
              : "Не удалось войти. Проверьте адрес и пароль.",
          )

          return
        }

        router.push("/account")
        router.refresh()
      }}
    >
      <Field label="Почта">
        <input
          className={INPUT_CLASS}
          type="email"
          name="email"
          autoComplete="email"
          required
          autoFocus
        />
      </Field>
      <Field label="Пароль">
        <input
          className={INPUT_CLASS}
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </Field>

      {error ? (
        <p role="alert" className="text-shell-accent mb-4 text-sm">
          {error}
        </p>
      ) : null}

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? "Входим…" : "Войти"}
      </button>

      <Link
        href="/reset"
        className="text-shell-muted hover:text-shell-fg mt-4 block text-center text-sm transition-colors"
      >
        Забыли пароль?
      </Link>
    </form>
  )
}
