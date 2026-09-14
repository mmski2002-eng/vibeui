"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  Check,
  Laptop,
  MailCheck,
  MailWarning,
  Monitor,
  Smartphone,
} from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Button } from "@/components/account/ui/button"
import { StatusPill } from "@/components/account/ui/status-pill"
import { useToast } from "@/components/account/ui/toast"
import { Field, INPUT_CLASS } from "@/components/auth/auth-card"
import { authClient } from "@/lib/auth-client"
import { updateProfile } from "@/lib/account-actions"
import { localePath, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

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
  const toast = useToast()
  const [pending, setPending] = useState(false)

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        const form = new FormData(event.currentTarget)
        setPending(true)

        try {
          await updateProfile({
            name: String(form.get("name")),
            locale: String(form.get("locale")) === "en" ? "en" : "ru",
          })
          toast({ title: t.saved })
          router.refresh()
        } catch {
          toast({ title: t.failed, tone: "danger" })
        } finally {
          setPending(false)
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

      <Button type="submit" variant="primary" pending={pending}>
        {pending ? t.saving : t.save}
      </Button>
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
  const toast = useToast()
  const [state, setState] = useState<"idle" | "pending" | "sent">("idle")

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="bg-shell-elevated flex size-10 shrink-0 items-center justify-center rounded-lg">
          {verified ? (
            <MailCheck className="text-shell-ok size-5" aria-hidden="true" />
          ) : (
            <MailWarning className="text-shell-warn size-5" aria-hidden="true" />
          )}
        </span>
        <div className="min-w-0">
          <p className="text-shell-fg truncate text-sm font-medium">{email}</p>
          <StatusPill tone={verified ? "ok" : "warn"} className="mt-1">
            {verified ? t.verified : t.unverified}
          </StatusPill>
        </div>
      </div>

      {verified ? null : (
        <Button
          size="sm"
          pending={state === "pending"}
          disabled={state === "sent"}
          icon={
            state === "sent" ? (
              <Check className="text-shell-ok size-4" aria-hidden="true" />
            ) : undefined
          }
          onClick={async () => {
            setState("pending")

            try {
              const { error } = await authClient.sendVerificationEmail({
                email,
                callbackURL: localePath(locale, "/account"),
              })

              if (error) {
                toast({ title: t.tooMany, tone: "danger" })
                setState("idle")
              } else {
                setState("sent")
              }
            } catch {
              toast({ title: t.failed, tone: "danger" })
              setState("idle")
            }
          }}
        >
          {t.verify}
        </Button>
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
  const toast = useToast()
  const [pending, setPending] = useState(false)

  const others = devices.filter((device) => !device.current).length

  return (
    <div>
      <ul className="grid gap-2">
        {devices.map((device, position) => {
          const Icon = /Android|iOS/.test(device.browser)
            ? Smartphone
            : /macOS|Windows/.test(device.browser)
              ? Laptop
              : Monitor

          return (
            <li
              key={device.id}
              style={{ ["--i" as string]: position }}
              className={cn(
                "acc-reveal flex items-center gap-3 rounded-xl border px-3.5 py-3",
                device.current
                  ? "border-shell-accent-line bg-shell-accent-soft"
                  : "border-shell-border bg-shell-panel-2",
              )}
            >
              <span className="bg-shell-elevated text-shell-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-shell-fg truncate text-sm font-medium">
                  {device.browser}
                </p>
                <p className="text-shell-muted text-xs">
                  {t.lastSeen(device.lastSeen)}
                </p>
              </div>
              {device.current ? (
                <StatusPill tone="accent" dot>
                  {t.thisDevice}
                </StatusPill>
              ) : null}
            </li>
          )
        })}
      </ul>

      {others === 0 ? (
        <p className="text-shell-muted mt-4 text-sm">{t.noOthers}</p>
      ) : (
        <Button
          variant="danger"
          className="mt-4"
          pending={pending}
          onClick={async () => {
            setPending(true)

            try {
              const { error } = await authClient.revokeOtherSessions()

              if (error) {
                toast({ title: t.failed, tone: "danger" })

                return
              }

              toast({ title: t.othersSignedOut })
              router.refresh()
            } catch {
              toast({ title: t.failed, tone: "danger" })
            } finally {
              setPending(false)
            }
          }}
        >
          {pending ? t.signingOut : t.signOutOthers}
        </Button>
      )}
    </div>
  )
}
