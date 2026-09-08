"use client"

import Link from "next/link"
import { useState } from "react"

import { createRegistryToken, revokeRegistryToken } from "@/lib/account-actions"

type TokenRow = {
  id: string
  prefix: string
  createdAt: string
  lastUsedAt: string | null
  revoked: boolean
}

export function TokenPanel({
  pro,
  tokens,
}: {
  pro: boolean
  tokens: TokenRow[]
}) {
  const [fresh, setFresh] = useState<string>()
  const [pending, setPending] = useState(false)

  if (!pro) {
    return (
      <div className="border-shell-border bg-shell-panel mt-6 rounded-2xl border p-5">
        <p className="text-shell-muted text-sm leading-relaxed">
          Ключ выдаётся вместе с подпиской: бесплатные компоненты ставятся и без
          него, обычной командой из карточки.
        </p>
        <Link
          href="/pricing"
          className="text-shell-accent mt-4 inline-block text-sm font-medium hover:underline"
        >
          Посмотреть тарифы
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true)
          setFresh(await createRegistryToken())
          setPending(false)
        }}
        className="bg-shell-accent text-shell-accent-fg inline-flex h-10 items-center rounded-lg px-4 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Создаём…" : "Создать новый ключ"}
      </button>
      <p className="text-shell-muted mt-2 text-xs">
        Новый ключ гасит предыдущий — так в проекте не остаётся забытых
        действующих ключей.
      </p>

      {fresh ? (
        <div className="border-shell-accent bg-shell-panel mt-5 rounded-2xl border p-5">
          <p className="text-shell-fg text-sm font-medium">
            Скопируйте ключ — второй раз он не покажется
          </p>
          <code className="bg-shell-elevated text-shell-fg mt-3 block overflow-x-auto rounded-lg px-3 py-2 font-mono text-xs">
            {fresh}
          </code>
          <p className="text-shell-muted mt-4 text-sm leading-relaxed">
            Положите его в <code className="font-mono">.env.local</code> проекта
            как <code className="font-mono">VIBEUI_TOKEN</code> и добавьте
            реестр в <code className="font-mono">components.json</code>:
          </p>
          <pre className="bg-shell-elevated text-shell-fg mt-3 overflow-x-auto rounded-lg p-3 font-mono text-xs">
            {`"registries": {
  "@vibeui": {
    "url": "https://vibeui.ru/r/pro/{name}.json",
    "headers": { "Authorization": "Bearer \${VIBEUI_TOKEN}" }
  }
}`}
          </pre>
          <p className="text-shell-muted mt-3 text-sm">
            Установка:{" "}
            <code className="font-mono">
              npx shadcn@latest add @vibeui/имя-компонента
            </code>
          </p>
        </div>
      ) : null}

      {tokens.length > 0 ? (
        <ul className="mt-6 grid gap-2">
          {tokens.map((token) => (
            <li
              key={token.id}
              className="border-shell-border bg-shell-panel flex items-center justify-between gap-4 rounded-xl border px-4 py-3"
            >
              <span className="min-w-0">
                <code className="text-shell-fg font-mono text-xs">
                  {token.prefix}…
                </code>
                <span className="text-shell-muted mt-1 block text-xs">
                  создан {token.createdAt}
                  {token.lastUsedAt ? `, использован ${token.lastUsedAt}` : ""}
                </span>
              </span>
              {token.revoked ? (
                <span className="text-shell-muted text-xs">отозван</span>
              ) : (
                <button
                  type="button"
                  onClick={() => revokeRegistryToken(token.id)}
                  className="border-shell-border text-shell-muted hover:text-shell-fg shrink-0 rounded-lg border px-3 py-1.5 text-xs transition-colors"
                >
                  Отозвать
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
