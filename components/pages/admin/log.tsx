import Link from "next/link"
import { desc, sql } from "drizzle-orm"

import { AdminHeading } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { adminAction } from "@/lib/db/schema"

const PAGE = 60

/** Журнал действий. Только чтение: записи не редактируются и не удаляются —
 *  иначе он перестаёт быть доказательством. */
export async function AdminLog({ before }: { before?: string }) {
  await requireAdmin()

  const t = ADMIN_TEXTS.log
  const cursor = before ? new Date(before) : null

  const rows = await db
    .select()
    .from(adminAction)
    .where(
      cursor && !Number.isNaN(cursor.getTime())
        ? sql`${adminAction.createdAt} < ${cursor}`
        : undefined,
    )
    .orderBy(desc(adminAction.createdAt))
    .limit(PAGE + 1)

  const page = rows.slice(0, PAGE)
  const next = rows.length > PAGE ? page[page.length - 1]?.createdAt : null

  return (
    <>
      <AdminHeading title={t.title} lead={t.lead} />

      {page.length === 0 ? (
        <p className="text-shell-muted text-sm">{t.empty}</p>
      ) : (
        <ul className="border-shell-border divide-y divide-[var(--shell-divider)] rounded-2xl border">
          {page.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm"
            >
              <span className="text-shell-muted w-36 shrink-0 tabular-nums">
                {row.createdAt.toLocaleString("ru-RU")}
              </span>
              <span className="text-shell-muted min-w-0 flex-1 truncate">
                {row.adminEmail}
              </span>
              <span className="text-shell-fg">
                {t.actions[row.action] ?? row.action}
              </span>
              <Link
                href={
                  row.targetType === "user"
                    ? `/account/admin/users/${row.targetId}`
                    : row.targetType === "payment"
                      ? `/account/admin/payments/${row.targetId}`
                      : `/account/admin/reports/${row.targetId}`
                }
                className="text-shell-muted hover:text-shell-fg shrink-0 font-mono text-xs transition-colors"
              >
                {row.targetId.slice(0, 8)}…
              </Link>
            </li>
          ))}
        </ul>
      )}

      {next ? (
        <Link
          href={`/account/admin/log?before=${next.toISOString()}`}
          className="border-shell-border text-shell-fg hover:border-shell-accent mt-4 inline-flex h-10 items-center rounded-lg border px-4 text-sm transition-colors"
        >
          {t.more}
        </Link>
      ) : null}
    </>
  )
}
