import type { ReactNode } from "react"
import { desc, eq } from "drizzle-orm"

import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { TokenPanel } from "@/components/account/token-panel"
import { PageHeader } from "@/components/account/ui/page-header"
import { Panel, PanelHeader } from "@/components/account/ui/panel"
import { CopyButton } from "@/components/copy-button"
import { db } from "@/lib/db"
import { registryToken } from "@/lib/db/schema"
import { isPro } from "@/lib/entitlements"
import { formatDate } from "@/lib/format"
import type { Locale } from "@/lib/i18n"
import { requireUser } from "@/lib/session"
import { getInstallCommand } from "@/lib/site"

/**
 * Подключение к проекту: сначала сценарий, потом ключ.
 *
 * Раньше раздел назывался «Ключ установки» и начинался с объяснения, зачем
 * нужен ключ, — бесплатному аккаунту, которому ключ не нужен вовсе. Теперь
 * первым идёт то, что работает у всех: команда установки.
 */
export async function AccountConnect({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].connect

  const [pro, tokens] = await Promise.all([
    isPro(user.id),
    db
      .select()
      .from(registryToken)
      .where(eq(registryToken.userId, user.id))
      .orderBy(desc(registryToken.createdAt))
      .limit(5),
  ])

  const sample = getInstallCommand("button-001")

  return (
    <>
      <PageHeader title={t.title} lead={t.lead} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ol className="grid gap-3">
          <Step index={1} title={t.step1} note={t.step1Free}>
            {sample ? (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <code className="bg-shell-elevated border-shell-border text-shell-fg min-w-0 flex-1 overflow-x-auto rounded-lg border px-3 py-2.5 font-mono text-xs whitespace-nowrap">
                  {sample}
                </code>
                <CopyButton
                  value={sample}
                  label={ACCOUNT_TEXTS[locale].favorites.copy}
                  copiedLabel={ACCOUNT_TEXTS[locale].favorites.copied}
                />
              </div>
            ) : null}
          </Step>
          <Step index={2} title={t.step2} note={t.step2Note} />
          <Step index={3} title={t.step3} note={t.step3Note} />
        </ol>

        <section>
          <PanelHeader title={t.keyTitle} note={t.keyLead} className="acc-reveal" />
          <TokenPanel
            locale={locale}
            pro={pro}
            tokens={tokens.map((token) => ({
              id: token.id,
              prefix: token.prefix,
              createdAt: formatDate(token.createdAt, locale),
              lastUsedAt: token.lastUsedAt
                ? formatDate(token.lastUsedAt, locale)
                : null,
              revoked: Boolean(token.revokedAt),
            }))}
          />
        </section>
      </div>
    </>
  )
}

function Step({
  index,
  title,
  note,
  children,
}: {
  index: number
  title: string
  note: string
  children?: ReactNode
}) {
  return (
    <Panel as="li" index={index} className="p-5">
      <div className="flex items-start gap-3">
        <span className="bg-shell-accent text-shell-accent-fg mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-shell-fg font-medium">{title}</p>
          <p className="text-shell-muted mt-1.5 max-w-2xl text-sm leading-relaxed">
            {note}
          </p>
          {children}
        </div>
      </div>
    </Panel>
  )
}
