"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Check, Loader2, MonitorSmartphone } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Field, INPUT_CLASS, SUBMIT_CLASS } from "@/components/auth/auth-card"
import { authClient } from "@/lib/auth-client"
import { updateProfile } from "@/lib/account-actions"
import { localePath, type Locale } from "@/lib/i18n"

/** Имя и язык писем: два поля, которые человек и правда меняет. */
export function ProfileForm({
  locale,
  name,
  accountLocale,
}: {
  locale: Locale
  name: string
  accountLocale: "ru" | "en"
}) {
  const t = ACCOUNT_TEXTS[locale].profile
  const router = useRouter()
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">(
    "idle",
  )

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        setState("pending")

        try {
          await updateProfile({
            name: String(form.get("name")),
            locale: String(form.get("locale")) === "en" ? "en" : "ru",
          })
          setState("done")
          router.refresh()
        } catch {
          setState("error")
        }
      }}
    >
      <Field label={t.nameLabel}>
        <input
          className={INPUT_CLASS}
          type="text"
          name="name"
          defaultValue={name}
          required
          maxLength={60}
          autoComplete="name"
        />
      </Field>

      <Field label={t.localeTitle} hint={t.localeNote}>
        <select
          name="locale"
          defaultValue={accountLocale}
          className={INPUT_CLASS}
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </Field>

      <button
        type="submit"
        className={SUBMIT_CLASS}
        disabled={state === "pending"}
      >
        {state === "pending" ? t.saving : t.save}
      </button>

      {state === "done" ? (
        <p role="status" className="text-shell-muted mt-3 text-sm">
          {t.saved}
        </p>
      ) : null}
      {state === "error" ? (
        <p role="alert" className="text-shell-accent-text mt-3 text-sm">
          {t.failed}
        </p>
      ) : null}
    </form>
  )
}

/** Почта: статус подтверждения и повторная отправка письма. */
export function EmailPanel({
  locale,
  email,
  verified,
}: {
  locale: Locale
  email: string
  verified: boolean
}) {
  const t = ACCOUNT_TEXTS[locale].profile
  const [state, setState] = useState<"idle" | "pending" | "sent" | "error">(
    "idle",
  )

  return (
    <div>
      <p className="text-shell-fg text-sm">{email}</p>
      <p
        className={`mt-1 text-sm ${verified ? "text-shell-muted" : "text-shell-accent-text"}`}
      >
        {verified ? t.verified : t.unverified}
      </p>

      {verified ? null : (
        <>
          <button
            type="button"
            disabled={state === "pending" || state === "sent"}
            onClick={async () => {
              setState("pending")

              try {
                const { error } = await authClient.sendVerificationEmail({
                  email,
                  callbackURL: localePath(locale, "/account"),
                })

                setState(error ? "error" : "sent")
              } catch {
                setState("error")
              }
            }}
            className="border-shell-border text-shell-fg hover:border-shell-accent mt-4 inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm transition-colors disabled:opacity-60"
          >
            {state === "pending" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {state === "sent" ? (
              <Check className="text-shell-accent-text size-4" aria-hidden="true" />
            ) : null}
            {t.verify}
          </button>

          {state === "error" ? (
            <p role="alert" className="text-shell-accent-text mt-2 text-sm">
              {t.tooMany}
            </p>
          ) : null}
        </>
      )}
    </div>
  )
}

export type DeviceRow = {
  id: string
  browser: string
  lastSeen: string
  current: boolean
}

/**
 * Устройства: где аккаунт открыт сейчас.
 *
 * Город по IP не показываем: база геолокации ошибается на провайдерских
 * подсетях, а «вход из другого города» — самая тревожная строка, какую
 * может увидеть человек.
 */
export function DevicesPanel({
  locale,
  devices,
}: {
  locale: Locale
  devices: DeviceRow[]
}) {
  const t = ACCOUNT_TEXTS[locale].profile
  const router = useRouter()
  const [state, setState] = useState<"idle" | "pending" | "done" | "error">(
    "idle",
  )

  const others = devices.filter((device) => !device.current).length

  return (
    <div>
      <ul className="grid gap-2">
        {devices.map((device) => (
          <li
            key={device.id}
            className="border-shell-border flex items-center gap-3 rounded-xl border px-3.5 py-3"
          >
            <MonitorSmartphone
              className="text-shell-muted size-4 shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p className="text-shell-fg truncate text-sm">
                {device.browser}
              </p>
              <p className="text-shell-muted text-xs">
                {t.lastSeen(device.lastSeen)}
              </p>
            </div>
            {device.current ? (
              <span className="text-shell-accent-text shrink-0 text-xs">
                {t.thisDevice}
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      {others === 0 ? (
        <p className="text-shell-muted mt-4 text-sm">{t.noOthers}</p>
      ) : (
        <button
          type="button"
          disabled={state === "pending"}
          onClick={async () => {
            setState("pending")

            try {
              const { error } = await authClient.revokeOtherSessions()

              if (error) {
                setState("error")

                return
              }

              setState("done")
              router.refresh()
            } catch {
              setState("error")
            }
          }}
          className="border-shell-border text-shell-fg hover:border-shell-accent mt-4 inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm transition-colors disabled:opacity-60"
        >
          {state === "pending" ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : null}
          {state === "pending" ? t.signingOut : t.signOutOthers}
        </button>
      )}

      {state === "done" ? (
        <p role="status" className="text-shell-muted mt-3 text-sm">
          {t.othersSignedOut}
        </p>
      ) : null}
      {state === "error" ? (
        <p role="alert" className="text-shell-accent-text mt-3 text-sm">
          {t.failed}
        </p>
      ) : null}
    </div>
  )
}
