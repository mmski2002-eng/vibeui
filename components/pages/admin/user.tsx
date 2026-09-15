import Link from "next/link"
import { notFound } from "next/navigation"
import { and, count, desc, eq } from "drizzle-orm"
import {
  ArrowLeft,
  CreditCard,
  KeyRound,
  LifeBuoy,
  MonitorSmartphone,
  ShieldAlert,
  UserPlus,
} from "lucide-react"

import { AdminHeading, Card, Row } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { UserActions } from "@/components/admin/user-actions"
import { Bars } from "@/components/account/ui/charts"
import { StatTile } from "@/components/account/ui/stat-tile"
import { StatusPill, type PillTone } from "@/components/account/ui/status-pill"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import {
  adminAction,
  payment,
  registryToken,
  report,
  session,
  usage,
  user,
} from "@/lib/db/schema"
import { formatDate, formatDateTime, formatNumber } from "@/lib/format"
import { resolveSubscription, getSubscriptionRow } from "@/lib/subscription-state"

type Event = {
  id: string
  at: Date
  icon: typeof CreditCard
  title: string
  note?: string
  href?: string
  tone?: PillTone
}

/**
 * Карточка пользователя: всё, что нужно поддержке, на одном экране.
 *
 * Середина — лента событий: регистрация, платежи, обращения и действия
 * администратора одним списком по времени. Раньше они лежали в шести
 * отдельных панелях, и историю «что с ним происходило» приходилось
 * собирать в голове.
 */
export async function AdminUser({ id }: { id: string }) {
  await requireAdmin()

  const t = ADMIN_TEXTS.users

  const [row] = await db.select().from(user).where(eq(user.id, id)).limit(1)

  if (!row) {
    notFound()
  }

  const [subscriptionRow, months, tokens, sessions, payments, reports, actions] =
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
        .limit(10),
      db
        .select()
        .from(report)
        .where(eq(report.userId, id))
        .orderBy(desc(report.createdAt))
        .limit(10),
      db
        .select()
        .from(adminAction)
        .where(
          and(eq(adminAction.targetType, "user"), eq(adminAction.targetId, id)),
        )
        .orderBy(desc(adminAction.createdAt))
        .limit(20),
    ])

  const state = resolveSubscription(subscriptionRow)
  const pro = state.kind !== "free" && state.kind !== "expired"
  const paidTotal = payments
    .filter((entry) => entry.status === "succeeded")
    .reduce((sum, entry) => sum + Number(entry.amount), 0)
  const usedTotal = months.reduce((sum, month) => sum + month.value, 0)

  const events: Event[] = [
    {
      id: "joined",
      at: row.createdAt,
      icon: UserPlus,
      title: t.card.joined(formatDate(row.createdAt)),
      note: `${t.card.locale}: ${row.locale}`,
    },
    ...payments.map((entry) => ({
      id: entry.id,
      at: entry.paidAt ?? entry.createdAt,
      icon: CreditCard,
      title: `${ADMIN_TEXTS.payments.cardTitle} · ${formatNumber(Number(entry.amount), "rub")}`,
      note: ADMIN_TEXTS.payments.status[
        entry.status as keyof typeof ADMIN_TEXTS.payments.status
      ] ?? entry.status,
      href: `/account/admin/payments/${entry.id}`,
      tone: (entry.status === "succeeded"
        ? "ok"
        : entry.status === "pending"
          ? "warn"
          : "muted") as PillTone,
    })),
    ...reports.map((entry) => ({
      id: entry.id,
      at: entry.createdAt,
      icon: LifeBuoy,
      title: entry.subject,
      note:
        ADMIN_TEXTS.reports.status[
          entry.status as keyof typeof ADMIN_TEXTS.reports.status
        ] ?? entry.status,
      href: `/account/admin/reports/${entry.id}`,
      tone: (entry.status === "new" ? "warn" : "muted") as PillTone,
    })),
    ...actions.map((entry) => ({
      id: entry.id,
      at: entry.createdAt,
      icon: ShieldAlert,
      title: ADMIN_TEXTS.log.actions[entry.action] ?? entry.action,
      note: entry.adminEmail,
      tone: "accent" as PillTone,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime())

  return (
    <>
      <Link
        href="/account/admin/users"
        className="text-shell-muted hover:text-shell-fg mb-4 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t.title}
      </Link>

      <AdminHeading
        title={row.email}
        lead={row.name}
        action={
          <>
            {row.blockedAt ? (
              <StatusPill tone="danger">{t.blocked}</StatusPill>
            ) : null}
            <StatusPill tone={row.emailVerified ? "ok" : "warn"}>
              {row.emailVerified ? t.verified : t.unverified}
            </StatusPill>
            <StatusPill
              tone={pro ? "solid" : "muted"}
              dot={pro}
            >
              {state.kind}
            </StatusPill>
          </>
        }
      />

      {row.blockedAt ? (
        <div className="border-shell-danger/40 bg-shell-danger-soft text-shell-fg acc-reveal mb-6 rounded-xl border px-4 py-3 text-sm">
          <span className="text-shell-danger font-medium">{t.blocked}</span>
          {row.blockedReason ? ` · ${row.blockedReason}` : null}
        </div>
      ) : null}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          index={0}
          label={t.card.subscription}
          value={
            "until" in state ? formatDate(state.until) : state.kind
          }
          note={state.kind}
          tone={pro ? "accent" : undefined}
        />
        <StatTile
          index={1}
          label={t.card.payments}
          value={paidTotal}
          kind="rub"
          note={`${payments.length}`}
        />
        <StatTile
          index={2}
          label={t.card.usage}
          value={usedTotal}
          spark={[...months].reverse().map((month) => month.value)}
        />
        <StatTile
          index={3}
          label={t.card.sessions}
          value={sessions.filter((entry) => entry.expiresAt > new Date()).length}
          note={`${t.card.tokens}: ${tokens.filter((token) => !token.revokedAt).length}`}
        />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid content-start gap-4">
          <Card title="Лента событий" index={4}>
            <ol className="relative grid gap-4 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-px before:bg-[var(--shell-divider)]">
              {events.map((event, position) => {
                const Icon = event.icon
                const body = (
                  <>
                    <span className="min-w-0 flex-1">
                      <span className="text-shell-fg block truncate text-sm">
                        {event.title}
                      </span>
                      {event.note ? (
                        <span className="text-shell-muted block truncate text-xs">
                          {event.note}
                        </span>
                      ) : null}
                    </span>
                    <span className="text-shell-muted shrink-0 text-xs tabular-nums">
                      {formatDateTime(event.at)}
                    </span>
                  </>
                )

                return (
                  <li
                    key={`${event.id}-${position}`}
                    className="acc-reveal relative flex items-start gap-3"
                    style={{ ["--i" as string]: position }}
                  >
                    <span
                      className={`bg-shell-panel relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border ${
                        event.tone === "ok"
                          ? "border-shell-ok/40 text-shell-ok"
                          : event.tone === "warn"
                            ? "border-shell-warn/40 text-shell-warn"
                            : event.tone === "accent"
                              ? "border-shell-accent-line text-shell-accent-text"
                              : "border-shell-border text-shell-muted"
                      }`}
                    >
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    {event.href ? (
                      <Link
                        href={event.href}
                        className="hover:bg-shell-elevated/60 -my-1.5 flex min-w-0 flex-1 items-baseline gap-3 rounded-lg px-2 py-1.5 transition-colors"
                      >
                        {body}
                      </Link>
                    ) : (
                      <span className="flex min-w-0 flex-1 items-baseline gap-3 px-2">
                        {body}
                      </span>
                    )}
                  </li>
                )
              })}
            </ol>
          </Card>

          {months.length > 0 ? (
            <Card title={t.card.usage} index={5}>
              <Bars
                data={[...months].reverse().map((month) => ({
                  day: `${month.period}-01`,
                  value: month.value,
                }))}
                height={90}
                index={6}
              />
            </Card>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <Card
              title={
                <span className="flex items-center gap-2">
                  <KeyRound className="text-shell-muted size-4" aria-hidden="true" />
                  {t.card.tokens}
                </span>
              }
              index={6}
            >
              {tokens.length === 0 ? (
                <p className="text-shell-muted text-sm">{t.card.nothing}</p>
              ) : (
                <dl>
                  {tokens.map((token) => (
                    <Row key={token.id} label={<span className="font-mono text-xs">{token.prefix}…</span>}>
                      <StatusPill tone={token.revokedAt ? "muted" : "ok"}>
                        {token.revokedAt ? "отозван" : "действует"}
                      </StatusPill>
                    </Row>
                  ))}
                </dl>
              )}
            </Card>

            <Card
              title={
                <span className="flex items-center gap-2">
                  <MonitorSmartphone className="text-shell-muted size-4" aria-hidden="true" />
                  {t.card.sessions}
                </span>
              }
              index={7}
            >
              {sessions.length === 0 ? (
                <p className="text-shell-muted text-sm">{t.card.nothing}</p>
              ) : (
                <dl>
                  {sessions.map((entry) => (
                    <Row
                      key={entry.id}
                      label={
                        <span className="block max-w-48 truncate text-xs">
                          {entry.userAgent ?? "—"}
                        </span>
                      }
                    >
                      <span className="text-xs tabular-nums">
                        {formatDate(entry.updatedAt)}
                      </span>
                    </Row>
                  ))}
                </dl>
              )}
            </Card>
          </div>
        </div>

        <UserActions
          userId={row.id}
          blocked={Boolean(row.blockedAt)}
          verified={row.emailVerified}
          note={row.adminNote ?? ""}
        />
      </div>
    </>
  )
}
