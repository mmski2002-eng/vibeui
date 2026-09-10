import Link from "next/link"
import { notFound } from "next/navigation"
import { asc, eq } from "drizzle-orm"

import { AdminHeading, Pill } from "@/components/admin/parts"
import { ReportPanel } from "@/components/admin/report-panel"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { report, reportMessage } from "@/lib/db/schema"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

type Kind = keyof typeof ADMIN_TEXTS.reports.kind
type Status = keyof typeof ADMIN_TEXTS.reports.status

/** Карточка обращения: переписка, ответ, статус и — для жалоб на компонент —
 *  живое превью того самого компонента. */
export async function AdminReport({ id }: { id: string }) {
  await requireAdmin()

  const t = ADMIN_TEXTS.reports

  const [row] = await db
    .select()
    .from(report)
    .where(eq(report.id, id))
    .limit(1)

  if (!row) {
    notFound()
  }

  const thread = await db
    .select()
    .from(reportMessage)
    .where(eq(reportMessage.reportId, id))
    .orderBy(asc(reportMessage.createdAt))
    .limit(100)

  const item = row.itemName ? getCatalogItem(row.itemName) : undefined
  const kind = row.itemName
    ? (getItemKind(row.itemName) ?? "component")
    : undefined

  return (
    <>
      <Link
        href="/account/admin/reports"
        className="text-shell-muted hover:text-shell-fg mb-4 inline-block text-sm transition-colors"
      >
        ← {t.title}
      </Link>

      <AdminHeading
        title={row.subject}
        lead={`${t.from}: ${row.email}`}
        action={
          <div className="flex items-center gap-2">
            <Pill>{t.kind[row.kind as Kind] ?? row.kind}</Pill>
            <Pill tone={row.status === "new" ? "accent" : "muted"}>
              {t.status[row.status as Status] ?? row.status}
            </Pill>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid content-start gap-4">
          <ul className="grid gap-3">
            {thread.map((message) => (
              <li
                key={message.id}
                className={`rounded-2xl border p-4 ${
                  message.authorType === "note"
                    ? "border-shell-border border-dashed"
                    : message.authorType === "admin"
                      ? "border-shell-accent/40 bg-shell-panel"
                      : "border-shell-border bg-shell-panel"
                }`}
              >
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-shell-fg text-xs font-medium">
                    {message.authorType === "note"
                      ? t.messageNote
                      : message.authorType === "admin"
                        ? t.messageAdmin
                        : t.messageUser}
                    {message.authorEmail ? ` · ${message.authorEmail}` : ""}
                  </span>
                  <span className="text-shell-muted text-xs tabular-nums">
                    {message.createdAt.toLocaleString("ru-RU")}
                  </span>
                </div>
                <p className="text-shell-fg text-sm leading-relaxed whitespace-pre-wrap">
                  {message.body}
                </p>
                {message.authorType === "admin" &&
                !message.deliveredByEmail ? (
                  <p className="text-shell-accent-text mt-2 text-xs">
                    Письмо не ушло — ответ сохранён только здесь.
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          <ReportPanel
            id={row.id}
            status={row.status}
            assignee={row.assigneeEmail}
          />
        </div>

        <div className="grid content-start gap-4">
          {row.itemName ? (
            <section className="border-shell-border bg-shell-panel overflow-hidden rounded-2xl border">
              <p className="text-shell-muted border-shell-border border-b px-4 py-2.5 text-xs font-medium tracking-wide uppercase">
                {t.about}
              </p>
              {/* Половина жалоб на компонент разбирается взглядом на превью,
                  поэтому оно здесь же, а не по ссылке. */}
              <div className="bg-preview-surface flex min-h-40 items-center justify-center">
                <CatalogThumbnail slug={row.itemName} locale="ru" />
              </div>
              <div className="px-4 py-3">
                <Link
                  href={`${itemBasePath(kind ?? "component")}/${row.itemName}`}
                  className="text-shell-fg hover:text-shell-accent-text block truncate text-sm transition-colors"
                >
                  {item?.title ?? row.itemName}
                </Link>
                <p className="text-shell-muted truncate font-mono text-xs">
                  {row.itemName}
                </p>
              </div>
            </section>
          ) : null}

          {row.userId ? (
            <Link
              href={`/account/admin/users/${row.userId}`}
              className="border-shell-border bg-shell-panel hover:border-shell-accent block rounded-2xl border p-4 text-sm transition-colors"
            >
              <span className="text-shell-muted block text-xs">{t.from}</span>
              <span className="text-shell-fg block truncate">{row.email}</span>
            </Link>
          ) : null}
        </div>
      </div>
    </>
  )
}
