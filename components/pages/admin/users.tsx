import Link from "next/link"
import { and, desc, ilike, or, sql } from "drizzle-orm"

import { AdminHeading, Pill } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { subscription, user } from "@/lib/db/schema"
import { resolveSubscription } from "@/lib/subscription-state"

const PAGE = 40

/** Список пользователей с поиском. Тариф считается тем же кодом, что и в
 *  кабинете человека: два разных ответа на вопрос «есть ли у него Pro» —
 *  худшее, что может случиться с поддержкой. */
export async function AdminUsers({
  query,
  before,
}: {
  query?: string
  before?: string
}) {
  await requireAdmin()

  const t = ADMIN_TEXTS.users
  const needle = query?.trim()
  const cursor = before ? new Date(before) : null

  const filters = [
    needle
      ? or(ilike(user.email, `%${needle}%`), ilike(user.name, `%${needle}%`))
      : undefined,
    cursor && !Number.isNaN(cursor.getTime())
      ? sql`${user.createdAt} < ${cursor}`
      : undefined,
  ].filter(Boolean)

  const rows = await db
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
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(user.createdAt))
    .limit(PAGE + 1)

  const page = rows.slice(0, PAGE)
  const next = rows.length > PAGE ? page[page.length - 1]?.createdAt : null
  const params = new URLSearchParams()

  if (needle) params.set("q", needle)

  return (
    <>
      <AdminHeading title={t.title} lead={t.lead} />

      <form className="mb-4 flex flex-wrap items-center gap-2" action="">
        <input
          type="search"
          name="q"
          defaultValue={needle}
          placeholder={t.search}
          className="border-shell-border bg-shell-elevated text-shell-fg placeholder:text-shell-muted focus-visible:border-shell-accent focus-visible:ring-shell-ring h-10 min-w-0 flex-1 rounded-lg border px-3 text-sm outline-none sm:max-w-sm focus-visible:ring-2"
        />
        <button
          type="submit"
          className="border-shell-border text-shell-fg hover:border-shell-accent inline-flex h-10 items-center rounded-lg border px-3.5 text-sm transition-colors"
        >
          {t.columnUser}
        </button>
      </form>

      {page.length === 0 ? (
        <p className="text-shell-muted text-sm">{t.empty}</p>
      ) : (
        <ul className="border-shell-border divide-y divide-[var(--shell-divider)] rounded-2xl border">
          {page.map((row) => {
            const state = resolveSubscription(row.subscription ?? undefined)

            return (
              <li key={row.id}>
                <Link
                  href={`/account/admin/users/${row.id}`}
                  className="hover:bg-shell-elevated flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-sm transition-colors"
                >
                  <span className="min-w-0 flex-1">
                    <span className="text-shell-fg block truncate">
                      {row.email}
                    </span>
                    <span className="text-shell-muted block truncate text-xs">
                      {row.name}
                    </span>
                  </span>
                  {row.blockedAt ? (
                    <Pill tone="accent">{t.blocked}</Pill>
                  ) : null}
                  {row.emailVerified ? null : (
                    <Pill tone="accent">{t.unverified}</Pill>
                  )}
                  <Pill tone={state.kind === "free" ? "muted" : "solid"}>
                    {state.kind}
                  </Pill>
                  <span className="text-shell-muted w-24 shrink-0 text-right text-xs tabular-nums">
                    {row.createdAt.toLocaleDateString("ru-RU")}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      {next ? (
        <Link
          href={`/account/admin/users?${params.toString()}${params.size ? "&" : ""}before=${next.toISOString()}`}
          className="border-shell-border text-shell-fg hover:border-shell-accent mt-4 inline-flex h-10 items-center rounded-lg border px-4 text-sm transition-colors"
        >
          {t.more}
        </Link>
      ) : null}
    </>
  )
}
