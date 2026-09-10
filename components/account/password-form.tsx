"use client"

import { useState } from "react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { PasswordInput } from "@/components/auth/password-input"
import { authClient } from "@/lib/auth-client"
import type { Locale } from "@/lib/i18n"

/**
 * Смена пароля. Причина отказа разводится по видам: раньше любая ошибка —
 * включая обрыв сети и лимит попыток — подписывалась «текущий пароль не
 * подошёл», и человек менял верный пароль на новый в поисках несуществующей
 * опечатки.
 */
export function PasswordForm({ locale }: { locale: Locale }) {
  const t = ACCOUNT_TEXTS[locale].profile
  const [state, setState] = useState<"idle" | "pending" | "done">("idle")
  const [error, setError] = useState<string>()

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = event.currentTarget
        const data = new FormData(form)
        setError(undefined)
        setState("pending")

        try {
          const { error: failure } = await authClient.changePassword({
            currentPassword: String(data.get("current")),
            newPassword: String(data.get("next")),
            revokeOtherSessions: true,
          })

          if (failure) {
            setError(
              failure.status === 429
                ? t.tooMany
                : failure.status === 400 || failure.status === 401
                  ? t.wrongPassword
                  : t.failed,
            )

            return
          }

          form.reset()
          setState("done")

          return
        } catch {
          // Сюда попадают только обрывы сети: у ответа сервера есть статус.
          setError(t.failed)
        } finally {
          // Ожидание снимается в любом случае: заблокированная кнопка после
          // неудачи выглядит как зависший интерфейс.
          setState((was) => (was === "pending" ? "idle" : was))
        }
      }}
    >
      <Field label={t.current}>
        <PasswordInput
          locale={locale}
          className={INPUT_CLASS}
          name="current"
          autoComplete="current-password"
          required
        />
      </Field>
      <Field label={t.next} hint={t.hint}>
        <PasswordInput
          locale={locale}
          className={INPUT_CLASS}
          name="next"
          autoComplete="new-password"
          required
          minLength={10}
          maxLength={128}
        />
      </Field>

      {error ? (
        <p role="alert" className="text-shell-accent-text mb-4 text-sm">
          {error}
        </p>
      ) : null}

      {state === "done" ? (
        <p role="status" className="text-shell-muted mb-4 text-sm">
          {t.changed}
        </p>
      ) : null}

      <button
        type="submit"
        className={SUBMIT_CLASS}
        disabled={state === "pending"}
      >
        {state === "pending" ? t.changing : t.change}
      </button>
    </form>
  )
}
