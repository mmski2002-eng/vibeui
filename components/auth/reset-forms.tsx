"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { authClient } from "@/lib/auth-client"

/** Шаг первый: запросить письмо со ссылкой. */
export function ResetRequestForm() {
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  if (sent) {
    return (
      <p className="text-shell-muted text-sm leading-relaxed">
        Если такой адрес зарегистрирован, письмо со ссылкой уже отправлено.
        Ссылка действует 30 минут.
      </p>
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
          redirectTo: "/reset/new",
        })

        // Результат не показываем: ответ «такой почты нет» превращает форму
        // в способ проверять, кто зарегистрирован.
        setPending(false)
        setSent(true)
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

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? "Отправляем…" : "Прислать ссылку"}
      </button>
    </form>
  )
}

/** Шаг второй: задать новый пароль по токену из письма. */
export function ResetPasswordForm() {
  const router = useRouter()
  const token = useSearchParams().get("token")
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  if (!token) {
    return (
      <p className="text-shell-muted text-sm leading-relaxed">
        Ссылка неполная или устарела. Запросите новое письмо на странице
        восстановления.
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
        const { error: failure } = await authClient.resetPassword({
          newPassword: String(form.get("password")),
          token,
        })

        setPending(false)

        if (failure) {
          setError("Ссылка устарела. Запросите новое письмо.")

          return
        }

        router.push("/signin")
      }}
    >
      <Field label="Новый пароль" hint="Не короче 10 символов">
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
        {pending ? "Сохраняем…" : "Задать пароль"}
      </button>
    </form>
  )
}
