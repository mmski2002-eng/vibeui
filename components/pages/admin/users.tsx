import { count, desc, ilike, or, sql } from "drizzle-orm"
import { Search } from "lucide-react"

import { AdminHeading, INPUT_CLASS } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { Button } from "@/components/account/ui/button"
import { CellStack, DataTable } from "@/components/account/ui/data-table"
import { Pager } from "@/components/account/ui/pager"
import { StatusPill } from "@/components/account/ui/status-pill"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { subscription, user } from "@/lib/db/schema"
import { formatDate } from "@/lib/format"
import { resolveSubscription } from "@/lib/subscription-state"

const PAGE = 40

/** Список пользователей с поиском и постраничной навигацией. Тариф считается
 *  тем же кодом, что и в кабинете человека: два разных ответа на вопрос
 *  «есть ли у него Pro» — худшее, что может случиться с поддержкой. */
export async function AdminUsers({
  query,
  page = 1,
}: {
  query?: string
  page?: number
}) {
  await requireAdmin()

  const t = ADMIN_TEXTS.users
  const needle = query?.trim()
  const where = needle
    ? or(ilike(user.email, `%${needle}%`), ilike(user.name, `%${needle}%`))
    : undefined

  const [rows, totalRows] = await Promise.all([
    db
      .select({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
        blockedAt: user.blockedAt,
        subscription,
      })
      .from(user)
      .leftJoin(subscription, sql`${subscription.userId} = ${user.id}`)
      .where(where)
      .orderBy(desc(user.createdAt))
      .limit(PAGE)
      .offset((page - 1) * PAGE),
    db.select({ value: count() }).from(user).where(where),
  ])

  const total = totalRows[0]?.value ?? 0
  const hasNext = page * PAGE < total
  const params = new URLSearchParams()

  if (needle) params.set("q", needle)

  const pageHref = (target: number) => {
    const p = new URLSearchParams(params)
    if (target > 1) p.set("page", String(target))
    const qs = p.toString()

    return `/account/admin/users${qs ? `?${qs}` : ""}`
  }

  return (
    <>
      <AdminHeading title={t.title} lead={t.lead} />

      <form
        className="acc-reveal mb-4 flex flex-wrap items-center gap-2"
        action=""
        style={{ ["--i" as string]: 1 }}
      >
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">{t.search}</span>
          <Search
            aria-hidden="true"
            className="text-shell-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          />
          <input
            type="search"
            name="q"
            defaultValue={needle}
            placeholder={t.search}
            className={`${INPUT_CLASS} w-full pl-9`}
          />
        </label>
        <Button type="submit">{t.find}</Button>
      </form>

      <DataTable
        index={2}
        caption={t.title}
        empty={t.empty}
        columns={[
          { key: "user", label: t.columnUser },
          { key: "state", label: t.columnState, hideBelow: "md" },
          { key: "plan", label: t.columnPlan, className: "w-28" },
          { key: "joined", label: t.columnJoined, align: "right", className: "w-32" },
        ]}
        rows={rows.map((row) => {
          const state = resolveSubscription(row.subscription ?? undefined)
          const pro =
            state.kind !== "free" && state.kind !== "expired"

          return {
            id: row.id,
            href: `/account/admin/users/${row.id}`,
            cells: [
              <CellStack key="user" primary={row.email} secondary={row.name} />,
              <span key="state" className="flex flex-wrap gap-1.5">
                {row.blockedAt ? (
                  <StatusPill tone="danger">{t.blocked}</StatusPill>
                ) : null}
                {row.emailVerified ? null : (
                  <StatusPill tone="warn">{t.unverified}</StatusPill>
                )}
              </span>,
              <StatusPill
                key="plan"
                tone={
                  state.kind === "past_due"
                    ? "warn"
                    : pro
                      ? "solid"
                      : "muted"
                }
              >
                {state.kind}
              </StatusPill>,
              <span key="joined" className="text-shell-muted text-xs tabular-nums">
                {formatDate(row.createdAt)}
              </span>,
            ],
          }
        })}
      />

      <Pager page={page} hasNext={hasNext} total={total} perPage={PAGE} href={pageHref} />
    </>
  )
}
