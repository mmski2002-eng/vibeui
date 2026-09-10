"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2 } from "lucide-react"

import { ADMIN_TEXTS } from "@/components/admin/texts"
import {
  grantProDays,
  resendVerification,
  resetMonthlyLimit,
  revokeUserTokens,
  saveUserNote,
  setBlocked,
  setRenewal,
  signOutEverywhere,
  verifyEmailManually,
} from "@/lib/admin-actions"

/**
 * Действия над аккаунтом.
 *
 * Каждое требует причину и подтверждение: это чужой доступ и чужие деньги, а
 * причина потом отвечает на вопрос «почему у него Pro» из журнала. Само
 * право проверяется на сервере — здесь только интерфейс.
 */
export function UserActions({
  userId,
  blocked,
  verified,
  hasSubscription,
  cancelling,
  note,
}: {
  userId: string
  blocked: boolean
  verified: boolean
  hasSubscription: boolean
  cancelling: boolean
  note: string
}) {
  const t = ADMIN_TEXTS.users.actions
  const router = useRouter()
  const [reason, setReason] = useState("")
  const [days, setDays] = useState(30)
  const [pending, setPending] = useState<string>()
  const [failed, setFailed] = useState(false)
  const [done, setDone] = useState(false)
  const [text, setText] = useState(note)

  const needsReason = reason.trim().length < 3

  async function run(name: string, action: () => Promise<unknown>) {
    setPending(name)
    setFailed(false)
    setDone(false)

    try {
      await action()
      setDone(true)
      setReason("")
      router.refresh()
    } catch {
      setFailed(true)
    } finally {
      setPending(undefined)
    }
  }

  return (
    <div className="border-shell-border bg-shell-panel grid gap-5 rounded-2xl border p-5">
      <div>
        <label className="text-shell-fg mb-1.5 block text-sm font-medium">
          {t.reason}
        </label>
        <input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          className="border-shell-border bg-shell-elevated text-shell-fg focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 w-full rounded-lg border px-3 text-sm outline-none focus-visible:ring-2"
        />
        <p className="text-shell-muted mt-1.5 text-xs">{t.reasonRequired}</p>
      </div>

      <div className="border-shell-border border-t pt-4">
        <p className="text-shell-fg text-sm font-medium">{t.grantPro}</p>
        <p className="text-shell-muted mt-1 text-sm leading-relaxed">
          {t.grantProNote}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className="text-shell-muted flex items-center gap-2 text-sm">
            {t.days}
            <input
              type="number"
              min={1}
              max={365}
              value={days}
              onChange={(event) => setDays(Number(event.target.value))}
              className="border-shell-border bg-shell-elevated text-shell-fg h-10 w-24 rounded-lg border px-3 text-sm outline-none"
            />
          </label>
          <Button
            busy={pending === "pro"}
            disabled={needsReason}
            label={t.grant}
            onRun={() =>
              run("pro", () => grantProDays({ userId, days, reason }))
            }
          />
        </div>
      </div>

      {hasSubscription ? (
        <div className="border-shell-border border-t pt-4">
          <Button
            busy={pending === "renewal"}
            disabled={needsReason}
            label={cancelling ? t.resumeRenewal : t.cancelRenewal}
            onRun={() =>
              run("renewal", () =>
                setRenewal({ userId, cancel: !cancelling, reason }),
              )
            }
          />
        </div>
      ) : null}

      <div className="border-shell-border grid gap-3 border-t pt-4">
        <Row note={t.blockNote}>
          <Button
            busy={pending === "block"}
            disabled={needsReason}
            label={blocked ? t.unblock : t.block}
            tone={blocked ? "default" : "danger"}
            onRun={() =>
              run("block", () =>
                setBlocked({ userId, blocked: !blocked, reason }),
              )
            }
          />
        </Row>

        <Row note={t.revokeTokensNote}>
          <Button
            busy={pending === "tokens"}
            disabled={needsReason}
            label={t.revokeTokens}
            onRun={() =>
              run("tokens", () => revokeUserTokens({ userId, reason }))
            }
          />
        </Row>

        <Row note={t.resetLimitNote}>
          <Button
            busy={pending === "limit"}
            disabled={needsReason}
            label={t.resetLimit}
            onRun={() =>
              run("limit", () => resetMonthlyLimit({ userId, reason }))
            }
          />
        </Row>

        {verified ? null : (
          <Row note={t.verifyEmailNote}>
            <Button
              busy={pending === "verify"}
              disabled={needsReason}
              label={t.verifyEmail}
              onRun={() =>
                run("verify", () => verifyEmailManually({ userId, reason }))
              }
            />
          </Row>
        )}

        {verified ? null : (
          <Row>
            <Button
              busy={pending === "resend"}
              label={t.resendVerification}
              onRun={() => run("resend", () => resendVerification({ userId }))}
            />
          </Row>
        )}

        <Row>
          <Button
            busy={pending === "sessions"}
            disabled={needsReason}
            label={t.signOutAll}
            onRun={() =>
              run("sessions", () => signOutEverywhere({ userId, reason }))
            }
          />
        </Row>
      </div>

      <div className="border-shell-border border-t pt-4">
        <p className="text-shell-fg text-sm font-medium">
          {ADMIN_TEXTS.users.card.note}
        </p>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          className="border-shell-border bg-shell-elevated text-shell-fg focus-visible:border-shell-accent focus-visible:ring-shell-ring mt-2 w-full rounded-lg border p-3 text-sm outline-none focus-visible:ring-2"
        />
        <Button
          busy={pending === "note"}
          label={ADMIN_TEXTS.users.card.noteSave}
          onRun={() => run("note", () => saveUserNote({ userId, note: text }))}
        />
      </div>

      {done ? (
        <p role="status" className="text-shell-muted text-sm">
          {t.done}
        </p>
      ) : null}
      {failed ? (
        <p role="alert" className="text-shell-accent-text text-sm">
          {t.failed}
        </p>
      ) : null}
    </div>
  )
}

function Row({
  note,
  children,
}: {
  note?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {note ? (
        <p className="text-shell-muted max-w-md flex-1 text-sm leading-relaxed">
          {note}
        </p>
      ) : (
        <span className="flex-1" />
      )}
      {children}
    </div>
  )
}

function Button({
  label,
  busy,
  disabled,
  tone = "default",
  onRun,
}: {
  label: string
  busy: boolean
  disabled?: boolean
  tone?: "default" | "danger"
  onRun: () => void
}) {
  return (
    <button
      type="button"
      disabled={busy || disabled}
      onClick={onRun}
      className={`mt-2 inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border px-3.5 text-sm transition-colors disabled:opacity-60 ${
        tone === "danger"
          ? "border-shell-accent/50 text-shell-accent-text hover:border-shell-accent"
          : "border-shell-border text-shell-fg hover:border-shell-accent"
      }`}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : null}
      {label}
    </button>
  )
}
