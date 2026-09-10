"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Check, Loader2, MailCheck } from "lucide-react"

import { SUBMIT_CLASS } from "@/components/auth/auth-card"
import { AUTH_TEXTS } from "@/components/auth/texts"
import { authClient } from "@/lib/auth-client"
import { localePath, type Locale } from "@/lib/i18n"
import { safeNext } from "@/lib/safe-path"

/**
 * Отдельный шаг «Подтвердите почту» вместо абзаца под формой.
 *
 * Здесь видно адрес, срок действия ссылки и кнопка повторной отправки —
 * раньше человек, не получивший письмо, мог только зарегистрироваться
 * заново. Сюда же приходит Better Auth после перехода по ссылке: и когда
 * всё удалось, и когда ссылка истекла или уже была использована.
 */
export function VerifyPanel({ locale }: { locale: Locale }) {
  const t = AUTH_TEXTS[locale]
  const params = useSearchParams()
  const email = params.get("email") ?? ""
  const next = safeNext(params.get("next"), localePath(locale, "/account"))
  const state = params.get("state")
  const failure = params.get("error")

  const [sending, setSending] = useState<"idle" | "pending" | "sent" | "error">(
    "idle",
  )

  if (state === "done" && !failure) {
    return (
      <Panel
        title={t.verifyDone}
        lead={t.verifyDoneLead}
        action={
          <Link href={next} className={`${SUBMIT_CLASS} no-underline`}>
            {t.continueTo}
          </Link>
        }
      />
    )
  }

  if (failure) {
    const used = failure.includes("already") || failure.includes("used")

    return (
      <Panel
        title={used ? t.verifyUsed : t.verifyExpired}
        lead={used ? t.verifyUsedLead : t.verifyExpiredLead}
        action={
          used ? (
            <Link
              href={localePath(locale, "/signin")}
              className={`${SUBMIT_CLASS} no-underline`}
            >
              {t.toSignIn}
            </Link>
          ) : (
            <ResendButton
              locale={locale}
              email={email}
              next={next}
              state={sending}
              setState={setSending}
            />
          )
        }
      />
    )
  }

  return (
    <Panel
      title={t.verifyTitle}
      lead={email ? t.verifyLead(email) : t.verifyExpiredLead}
      action={
        <ResendButton
          locale={locale}
          email={email}
          next={next}
          state={sending}
          setState={setSending}
        />
      }
      note={
        <>
          <p className="border-shell-border text-shell-muted rounded-xl border border-dashed p-3 text-sm leading-relaxed">
            {t.spamHint}
          </p>
          <p className="text-shell-muted mt-3 text-sm leading-relaxed">
            {t.verifyWrong}
          </p>
          <p className="text-shell-muted mt-3 text-sm leading-relaxed">
            {t.verifyExisting}{" "}
            <Link
              href={localePath(locale, "/signin")}
              className="text-shell-fg underline"
            >
              {t.enterShort}
            </Link>
          </p>
        </>
      }
    />
  )
}

function Panel({
  title,
  lead,
  action,
  note,
}: {
  title: string
  lead: string
  action: React.ReactNode
  note?: React.ReactNode
}) {
  return (
    <div>
      <div className="text-shell-accent-text mb-4">
        <MailCheck className="size-7" aria-hidden="true" />
      </div>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-shell-muted mt-2 text-sm leading-relaxed">{lead}</p>
      <div className="mt-5">{action}</div>
      {note ? <div className="mt-5">{note}</div> : null}
    </div>
  )
}

function ResendButton({
  locale,
  email,
  next,
  state,
  setState,
}: {
  locale: Locale
  email: string
  next: string
  state: "idle" | "pending" | "sent" | "error"
  setState: (value: "idle" | "pending" | "sent" | "error") => void
}) {
  const t = AUTH_TEXTS[locale]

  if (!email) {
    return (
      <Link
        href={localePath(locale, "/signin")}
        className={`${SUBMIT_CLASS} no-underline`}
      >
        {t.toSignIn}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className={SUBMIT_CLASS}
        disabled={state === "pending" || state === "sent"}
        onClick={async () => {
          setState("pending")

          try {
            const { error } = await authClient.sendVerificationEmail({
              email,
              callbackURL: `${localePath(locale, "/verify")}?state=done&next=${encodeURIComponent(next)}`,
            })

            setState(error ? "error" : "sent")
          } catch {
            setState("error")
          }
        }}
      >
        {state === "pending" ? (
          <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {state === "sent" ? (
          <Check className="mr-2 size-4" aria-hidden="true" />
        ) : null}
        {state === "pending"
          ? t.resending
          : state === "sent"
            ? t.resent
            : t.resend}
      </button>

      {state === "error" ? (
        <p role="alert" className="text-shell-accent-text mt-3 text-sm">
          {t.resendLimit}
        </p>
      ) : null}
    </>
  )
}
