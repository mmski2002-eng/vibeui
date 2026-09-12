import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"

import { PaymentActions } from "@/components/admin/payment-actions"
import { AdminHeading, Pill } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { requireAdmin } from "@/lib/admin"
import { db } from "@/lib/db"
import { payment, user } from "@/lib/db/schema"
import {
  getSubscriptionRow,
  resolveSubscription,
} from "@/lib/subscription-state"

function statusOf(value: string) {
  return value === "succeeded" ||
    value === "pending" ||
    value === "canceled" ||
    value === "refunded"
    ? value
    : ("unknown" as const)
}

/** Карточка платежа: что мы знаем, что можно сделать. */
export async function AdminPayment({ id }: { id: string }) {
  await requireAdmin()

  const t = ADMIN_TEXTS.payments

  const [row] = await db
    .select({
      id: payment.id,
      yookassaId: payment.yookassaId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
      receiptUrl: payment.receiptUrl,
      payload: payment.payload,
      userId: payment.userId,
      email: user.email,
    })
    .from(payment)
    .leftJoin(user, eq(user.id, payment.userId))
    .where(eq(payment.id, id))
    .limit(1)

  if (!row) {
    notFound()
  }

  const state = resolveSubscription(await getSubscriptionRow(row.userId))

  return (
    <>
      <Link
        href="/account/admin/payments"
        className="text-shell-muted hover:text-shell-fg mb-4 inline-block text-sm transition-colors"
      >
        ← {t.title}
      </Link>

      <AdminHeading
        title={`${Math.round(Number(row.amount))} ₽`}
        lead={row.email ?? row.userId}
      />

      <div className="border-shell-border bg-shell-panel grid gap-3 rounded-2xl border p-5 text-sm">
        <Row label={t.columnStatus}>
          <Pill tone={row.status === "succeeded" ? "muted" : "accent"}>
            {t.status[statusOf(row.status)]}
          </Pill>
        </Row>
        <Row label={t.yookassaId}>
          <span className="text-shell-fg font-mono text-xs">
            {row.yookassaId}
          </span>
        </Row>
        <Row label={t.created}>
          <span className="text-shell-fg tabular-nums">
            {row.createdAt.toLocaleString("ru-RU")}
          </span>
        </Row>
        <Row label={t.paid}>
          <span className="text-shell-fg tabular-nums">
            {row.paidAt?.toLocaleString("ru-RU") ?? ADMIN_TEXTS.common.nothing}
          </span>
        </Row>
        <Row label={t.receipt}>
          {row.receiptUrl ? (
            <a
              href={row.receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="text-shell-accent-text max-w-full truncate hover:underline"
            >
              {row.receiptUrl}
            </a>
          ) : (
            <span className="text-shell-muted">{t.receiptMissing}</span>
          )}
        </Row>
        <Row label={t.subscription}>
          <Link
            href={`/account/admin/users/${row.userId}`}
            className="text-shell-accent-text hover:underline"
          >
            {state.kind}
          </Link>
        </Row>
      </div>

      <PaymentActions paymentId={row.id} receiptUrl={row.receiptUrl} />

      {row.payload ? (
        <details className="border-shell-border mt-6 rounded-2xl border">
          <summary className="text-shell-fg cursor-pointer px-4 py-3 text-sm font-medium select-none marker:content-none [&::-webkit-details-marker]:hidden">
            {t.payload}
          </summary>
          {/* Ответ платёжного сервиса как есть: без него разбор спорного
              платежа превращается в переписку с поддержкой ЮKassa. */}
          <pre className="border-shell-border bg-shell-elevated text-shell-fg max-h-96 overflow-auto border-t p-4 text-xs leading-relaxed">
            {JSON.stringify(row.payload, null, 2)}
          </pre>
        </details>
      ) : null}
    </>
  )
}

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-shell-muted">{label}</span>
      {children}
    </div>
  )
}
