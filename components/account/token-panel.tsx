"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Check, Copy, KeyRound, ShieldOff } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { Button } from "@/components/account/ui/button"
import { EmptyState } from "@/components/account/ui/empty-state"
import { Panel } from "@/components/account/ui/panel"
import { StatusPill } from "@/components/account/ui/status-pill"
import { useToast } from "@/components/account/ui/toast"
import { createRegistryToken, revokeRegistryToken } from "@/lib/account-actions"
import { localePath, type Locale } from "@/lib/i18n"

type TokenRow = {
  id: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  revoked: boolean
}

/**
 * Ключ установки: выпуск, показ один раз, отзыв.
 *
 * Замена подтверждается отдельно — новый ключ гасит действующий, и в чужом
 * CI это выглядит как внезапно сломавшаяся сборка. Ошибка операции уходит
 * в тост: раньше неудача выглядела как «ничего не произошло», хотя
 * действующий ключ мог уже быть отозван.
 */
export function TokenPanel({
  locale,
  pro,
  tokens,
}: {
  locale: Locale
  pro: boolean
  tokens: TokenRow[]
}) {
  const t = ACCOUNT_TEXTS[locale].connect
  const toast = useToast()
  const [fresh, setFresh] = useState<string>()
  const [pending, setPending] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [copied, setCopied] = useState(false)

  const active = tokens.filter((token) => !token.revoked)
  const hasActive = active.length > 0

  if (!pro) {
    return (
      <Panel variant="soft" index={5}>
        <p className="text-shell-muted text-sm leading-relaxed">{t.keyFree}</p>
        <Link
          href={localePath(locale, "/pricing")}
          className="text-shell-accent-text mt-4 inline-block text-sm font-medium hover:underline"
        >
          {t.upgrade}
        </Link>
      </Panel>
    )
  }

  async function issue() {
    setPending(true)

    try {
      setFresh(await createRegistryToken())
      setConfirming(false)
    } catch {
      // Действующий ключ при неудаче остаётся прежним: замена идёт одной
      // транзакцией на сервере.
      toast({ title: t.failed, tone: "danger" })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-4">
      {fresh ? (
        <Panel variant="hero" index={0}>
          <p className="text-shell-fg flex items-center gap-2 font-medium">
            <KeyRound className="text-shell-accent-text size-4" aria-hidden="true" />
            {t.freshTitle}
          </p>
          <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
            {t.freshNote}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <code className="border-shell-border bg-shell-elevated text-shell-fg min-w-0 flex-1 overflow-x-auto rounded-lg border px-3 py-2.5 font-mono text-xs">
              {fresh}
            </code>
            <Button
              variant="primary"
              icon={
                copied ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )
              }
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(fresh)
                  setCopied(true)
                  window.setTimeout(() => setCopied(false), 2000)
                } catch {
                  // Буфер закрыт политикой браузера — ключ остаётся на
                  // экране, его можно выделить руками.
                }
              }}
            >
              {copied ? t.copied : t.copy}
            </Button>
          </div>
        </Panel>
      ) : null}

      <Panel index={5}>
        {confirming ? (
          <div className="border-shell-warn/40 bg-shell-warn-soft rounded-xl border p-4">
            <p className="text-shell-fg text-sm font-medium">{t.replace}</p>
            <p className="text-shell-muted mt-1.5 max-w-xl text-sm leading-relaxed">
              {t.replaceWarning}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" pending={pending} onClick={issue}>
                {pending ? t.creating : t.confirmReplace}
              </Button>
              <Button variant="ghost" onClick={() => setConfirming(false)}>
                {t.cancel}
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="primary"
            pending={pending}
            icon={<KeyRound className="size-4" aria-hidden="true" />}
            onClick={() => (hasActive ? setConfirming(true) : issue())}
          >
            {pending ? t.creating : hasActive ? t.replace : t.create}
          </Button>
        )}

        {tokens.length === 0 ? (
          <div className="mt-4">
            <EmptyState compact icon={<KeyRound />} title={t.noKeys} />
          </div>
        ) : (
          <ul className="mt-5 grid gap-2">
            {tokens.map((token) => (
              <li
                key={token.id}
                className="border-shell-border bg-shell-panel-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border px-3.5 py-3"
              >
                <div className="min-w-0">
                  <p className="text-shell-fg font-mono text-sm">
                    {token.prefix}…
                  </p>
                  <p className="text-shell-muted mt-0.5 text-xs">
                    {t.created(token.createdAt)} ·{" "}
                    {token.lastUsedAt
                      ? t.lastUsed(token.lastUsedAt)
                      : t.neverUsed}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusPill tone={token.revoked ? "muted" : "ok"} dot={!token.revoked}>
                    {token.revoked ? t.revoked : t.active}
                  </StatusPill>
                  {token.revoked ? null : (
                    <RevokeButton locale={locale} id={token.id} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}

function RevokeButton({ locale, id }: { locale: Locale; id: string }) {
  const t = ACCOUNT_TEXTS[locale].connect
  const router = useRouter()
  const toast = useToast()
  const [asking, setAsking] = useState(false)
  const [pending, setPending] = useState(false)

  if (asking) {
    return (
      <span className="flex items-center gap-1">
        <Button
          size="sm"
          variant="danger"
          pending={pending}
          onClick={async () => {
            setPending(true)

            try {
              await revokeRegistryToken(id)
              toast({ title: t.revoked, tone: "info" })
              router.refresh()
            } catch {
              toast({ title: t.failed, tone: "danger" })
            } finally {
              setPending(false)
              setAsking(false)
            }
          }}
        >
          {pending ? t.revoking : t.confirmRevoke}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setAsking(false)}>
          {t.cancel}
        </Button>
      </span>
    )
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      icon={<ShieldOff className="size-4" aria-hidden="true" />}
      onClick={() => setAsking(true)}
    >
      {t.revoke}
    </Button>
  )
}
