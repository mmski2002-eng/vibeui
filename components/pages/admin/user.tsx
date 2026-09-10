import Link from "next/link"
import { notFound } from "next/navigation"
import { count, desc, eq } from "drizzle-orm"

import { AdminHeading, Pill } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { UserActions } from "@/components/admin/user-actions"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import {
  payment,
  registryToken,
  report,
  session,
  usage,
  user,
} from "@/lib/db/schema"
import { getSubscriptionRow, resolveSubscription } from "@/lib/subscription-state"

/** Карточка пользователя: всё, что нужно поддержке, на одном экране. */
export async function AdminUser({ id }: { id: string }) {
  await requireAdmin()

  const t = ADMIN_TEXTS.users

  const [row] = await db.select().from(user).where(eq(user.id, id)).limit(1)

  if (!row) {
    notFound()
  }

  const [subscriptionRow, months, tokens, sessions, payments, reports] =
    await Promise.all([
      getSubscriptionRow(id),
      db
        .select({ period: usage.period, value: count() })
        .from(usage)
        .where(eq(usage.userId, id))
        .groupBy(usage.period)
        .orderBy(desc(usage.period))
        .limit(6),
      db
        .select()
        .from(registryToken)
        .where(eq(registryToken.userId, id))
        .orderBy(desc(registryToken.createdAt))
        .limit(5),
      db
        .select()
        .from(session)
        .where(eq(session.userId, id))
        .orderBy(desc(session.updatedAt))
        .limit(5),
      db
        .select()
        .from(payment)
        .where(eq(payment.userId, id))
        .orderBy(desc(payment.createdAt))
        .limit(5),
      db
        .select()
        .from(report)
        .where(eq(report.userId, id))
        .orderBy(desc(report.createdAt))
        .limit(5),
    ])

  const state = resolveSubscription(subscriptionRow)

  return (
    <>
      <Link
        href="/account/admin/users"
        className="text-shell-muted hover:text-shell-fg mb-4 inline-block text-sm transition-colors"
      >
        ← {t.title}
      </Link>

      <AdminHeading
        title={row.email}
        lead={row.name}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {row.blockedAt ? <Pill tone="accent">{t.blocked}</Pill> : null}
            <Pill tone={row.emailVerified ? "muted" : "accent"}>
              {row.emailVerified ? t.verified : t.unverified}
            </Pill>
            <Pill tone={state.kind === "free" ? "muted" : "solid"}>
              {state.kind}
            </Pill>
          </div>
        }
      />

      {row.blockedAt ? (
        <p className="border-shell-accent/40 bg-shell-accent/10 text-shell-fg mb-6 rounded-xl border px-4 py-3 text-sm">
          {row.blockedReason}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid content-start gap-4">
          <Card title={t.card.profile}>
            <dl className="grid gap-2 text-sm">
              <Line label={t.card.joined(
                row.createdAt.toLocaleDateString("ru-RU"),
              )} />
              <Line label={`${t.card.locale}: ${row.locale}`} />
              {row.adminNote ? (
                <Line label={`${t.card.note}: ${row.adminNote}`} />
              ) : null}
            </dl>
          </Card>

          <Card title={t.card.usage}>
            {months.length === 0 ? (
              <p className="text-shell-muted text-sm">{t.card.nothing}</p>
            ) : (
              <ul className="grid gap-1 text-sm">
                {months.map((month) => (
                  <li key={month.period} className="text-shell-muted">
                    {t.card.usageMonth(month.period, month.value)}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={t.card.payments}>
            {payments.length === 0 ? (
              <p className="text-shell-muted text-sm">{t.card.nothing}</p>
            ) : (
              <ul className="grid gap-1 text-sm">
                {payments.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={`/account/admin/payments/${entry.id}`}
                      className="text-shell-muted hover:text-shell-fg flex justify-between gap-3 transition-colors"
                    >
                      <span className="tabular-nums">
                        {(entry.paidAt ?? entry.createdAt).toLocaleDateString(
                          "ru-RU",
                        )}
                      </span>
                      <span>{entry.status}</span>
                      <span className="text-shell-fg tabular-nums">
                        {Math.round(Number(entry.amount))} ₽
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={t.card.reports}>
            {reports.length === 0 ? (
              <p className="text-shell-muted text-sm">{t.card.nothing}</p>
            ) : (
              <ul className="grid gap-1 text-sm">
                {reports.map((entry) => (
                  <li key={entry.id}>
                    <Link
                      href={`/account/admin/reports/${entry.id}`}
                      className="text-shell-muted hover:text-shell-fg block truncate transition-colors"
                    >
                      {entry.subject}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={t.card.tokens}>
            {tokens.length === 0 ? (
              <p className="text-shell-muted text-sm">{t.card.nothing}</p>
            ) : (
              <ul className="grid gap-1 text-sm">
                {tokens.map((token) => (
                  <li
                    key={token.id}
                    className="text-shell-muted flex justify-between gap-3"
                  >
                    {/* Только префикс: полное значение ключа мы и сами не
                        храним, в базе лежит отпечаток. */}
                    <span className="font-mono text-xs">{token.prefix}…</span>
                    <span className="text-xs">
                      {token.revokedAt ? "отозван" : "действует"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title={t.card.sessions}>
            {sessions.length === 0 ? (
              <p className="text-shell-muted text-sm">{t.card.nothing}</p>
            ) : (
              <ul className="grid gap-1 text-sm">
                {sessions.map((entry) => (
                  <li
                    key={entry.id}
                    className="text-shell-muted flex justify-between gap-3"
                  >
                    <span className="min-w-0 truncate text-xs">
                      {entry.userAgent ?? "—"}
                    </span>
                    <span className="shrink-0 text-xs tabular-nums">
                      {entry.updatedAt.toLocaleDateString("ru-RU")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card title={t.card.subscription}>
            <p className="text-shell-fg text-sm">{state.kind}</p>
            {"until" in state ? (
              <p className="text-shell-muted mt-1 text-sm tabular-nums">
                {state.until.toLocaleDateString("ru-RU")}
              </p>
            ) : null}
          </Card>

          <UserActions
            userId={row.id}
            blocked={Boolean(row.blockedAt)}
            verified={row.emailVerified}
            hasSubscription={Boolean(subscriptionRow)}
            cancelling={Boolean(subscriptionRow?.cancelAtPeriodEnd)}
            note={row.adminNote ?? ""}
          />
        </div>
      </div>
    </>
  )
}

function Card({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-shell-border bg-shell-panel rounded-2xl border p-5">
      <h2 className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Line({ label }: { label: string }) {
  return <div className="text-shell-muted">{label}</div>
}
