"use client"

import { useState } from "react"

import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { authClient } from "@/lib/auth-client"

export function PasswordForm() {
  const [state, setState] = useState<"idle" | "done" | "error">("idle")
  const [pending, setPending] = useState(false)

  return (
    <form
      className="mt-6 max-w-sm"
      onSubmit={async (event) => {
        event.preventDefault()
        setPending(true)

        const form = new FormData(event.currentTarget)
        const { error } = await authClient.changePassword({
          currentPassword: String(form.get("current")),
          newPassword: String(form.get("next")),
          revokeOtherSessions: true,
        })

        setPending(false)
        setState(error ? "error" : "done")
      }}
    >
      <Field label="Текущий пароль">
        <input
          className={INPUT_CLASS}
          type="password"
          name="current"
          autoComplete="current-password"
          required
        />
      </Field>
      <Field label="Новый пароль" hint="Не короче 10 символов">
        <input
          className={INPUT_CLASS}
          type="password"
          name="next"
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={128}
        />
      </Field>

      {state === "error" ? (
        <p role="alert" className="text-shell-accent mb-4 text-sm">
          Текущий пароль не подошёл.
        </p>
      ) : null}
      {state === "done" ? (
        <p className="text-shell-muted mb-4 text-sm">
          Пароль изменён, остальные сессии закрыты.
        </p>
      ) : null}

      <button type="submit" className={SUBMIT_CLASS} disabled={pending}>
        {pending ? "Сохраняем…" : "Сменить пароль"}
      </button>
    </form>
  )
}
