"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Copy, Loader2 } from "lucide-react"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
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
 * CI это выглядит как внезапно сломавшаяся сборка. Ошибку операции панель
 * показывает: раньше неудача выглядела как «ничего не произошло», хотя
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
  const [fresh, setFresh] = useState<string>()
  const [pending, setPending] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [failed, setFailed] = useState(false)
  const [copied, setCopied] = useState(false)

  const active = tokens.filter((token) => !token.revoked)
  const hasActive = active.length > 0

  if (!pro) {
    return (
      <div className="border-shell-border bg-shell-panel rounded-2xl border p-5">
        <p className="text-shell-muted text-sm leading-relaxed">{t.keyFree}</p>
        <Link
          href={localePath(locale, "/pricing")}
          className="text-shell-accent-text mt-4 inline-block text-sm font-medium hover:underline"
        >
          {t.upgrade}
        </Link>
      </div>
    )
  }

  async function issue() {
    setPending(true)
    setFailed(false)

    try {
      setFresh(await createRegistryToken())
      setConfirming(false)
    } catch {
      // Действующий ключ при неудаче остаётся прежним: замена идёт одной
      // транзакцией на сервере.
      setFailed(true)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="grid gap-4">
      {fresh ? (
        <div className="border-shell-accent/50 bg-shell-panel rounded-2xl border p-5">
          <p className="text-shell-fg font-medium">{t.freshTitle}</p>
          <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
            {t.freshNote}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <code className="border-shell-border bg-shell-elevated text-shell-fg min-w-0 flex-1 overflow-x-auto rounded-lg border px-3 py-2 font-mono text-xs">
              {fresh}
            </code>
            <button
              type="button"
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
              className="bg-shell-accent text-shell-accent-fg inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              {copied ? (
                <Check className="size-4" aria-hidden="true" />
              ) : (
                <Copy className="size-4" aria-hidden="true" />
              )}
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </div>
      ) : null}

      <div className="border-shell-border bg-shell-panel rounded-2xl border p-5">
        {confirming ? (
          <>
            <p className="text-shell-fg text-sm font-medium">{t.replace}</p>
            <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
              {t.replaceWarning}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={issue}
                className="bg-shell-accent text-shell-accent-fg inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {pending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                {pending ? t.creating : t.confirmReplace}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="border-shell-border text-shell-muted hover:text-shell-fg inline-flex h-10 items-center rounded-lg border px-4 text-sm transition-colors"
              >
                {t.cancel}
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => (hasActive ? setConfirming(true) : issue())}
            className="bg-shell-accent text-shell-accent-fg inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            {pending ? t.creating : hasActive ? t.replace : t.create}
          </button>
        )}

        {failed ? (
          <p role="alert" className="text-shell-accent-text mt-3 text-sm">
            {t.failed}
          </p>
        ) : null}

        {tokens.length === 0 ? (
          <p className="text-shell-muted mt-4 text-sm">{t.noKeys}</p>
        ) : (
          <ul className="mt-5 grid gap-2">
            {tokens.map((token) => (
              <li
                key={token.id}
                className="border-shell-border flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl border px-3.5 py-3"
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
                  <span
                    className={`text-xs ${
                      token.revoked ? "text-shell-muted" : "text-shell-accent-text"
                    }`}
                  >
                    {token.revoked ? t.revoked : t.active}
                  </span>
                  {token.revoked ? null : (
                    <RevokeButton locale={locale} id={token.id} />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function RevokeButton({ locale, id }: { locale: Locale; id: string }) {
  const t = ACCOUNT_TEXTS[locale].connect
  const [asking, setAsking] = useState(false)
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState(false)

  if (asking) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <button
          type="button"
          disabled={pending}
          onClick={async () => {
            setPending(true)
            setFailed(false)

            try {
              await revokeRegistryToken(id)
            } catch {
              setFailed(true)
            } finally {
              setPending(false)
              setAsking(false)
            }
          }}
          className="text-shell-accent-text hover:underline disabled:opacity-60"
        >
          {pending ? t.revoking : t.confirmRevoke}
        </button>
        <button
          type="button"
          onClick={() => setAsking(false)}
          className="text-shell-muted hover:text-shell-fg"
        >
          {t.cancel}
        </button>
        {failed ? <span className="text-shell-accent-text">{t.failed}</span> : null}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setAsking(true)}
      className="text-shell-muted hover:text-shell-fg text-xs transition-colors"
    >
      {t.revoke}
    </button>
  )
}
