import Link from "next/link"
import { desc, sql } from "drizzle-orm"

import { AdminHeading } from "@/components/admin/parts"
import { ButtonLink } from "@/components/account/ui/button"
import { CellStack, DataTable } from "@/components/account/ui/data-table"
import { formatDateTime } from "@/lib/format"
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

      <DataTable
        index={1}
        caption={t.title}
        empty={t.empty}
        columns={[
          { key: "when", label: t.columnWhen, className: "w-36" },
          { key: "what", label: t.columnWhat },
          { key: "who", label: t.columnWho, hideBelow: "md" },
          { key: "target", label: t.columnTarget, align: "right", className: "w-28" },
        ]}
        rows={page.map((row) => ({
          id: row.id,
          cells: [
            <span key="when" className="text-shell-muted text-xs tabular-nums">
              {formatDateTime(row.createdAt)}
            </span>,
            <CellStack
              key="what"
              primary={t.actions[row.action] ?? row.action}
              secondary={
                row.details &&
                typeof row.details === "object" &&
                "reason" in row.details &&
                typeof row.details.reason === "string"
                  ? row.details.reason
                  : undefined
              }
            />,
            <span key="who" className="text-shell-muted truncate text-xs">
              {row.adminEmail}
            </span>,
            <Link
              key="target"
              href={
                row.targetType === "user"
                  ? `/account/admin/users/${row.targetId}`
                  : row.targetType === "payment"
                    ? `/account/admin/payments/${row.targetId}`
                    : `/account/admin/reports/${row.targetId}`
              }
              className="text-shell-muted hover:text-shell-fg font-mono text-xs transition-colors"
            >
              {row.targetType} · {row.targetId.slice(0, 8)}…
            </Link>,
          ],
        }))}
      />

      {next ? (
        <ButtonLink
          href={`/account/admin/log?before=${next.toISOString()}`}
          className="mt-4"
        >
          {t.more}
        </ButtonLink>
      ) : null}
    </>
  )
}
