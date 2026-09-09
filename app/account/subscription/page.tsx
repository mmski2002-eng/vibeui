import Link from "next/link"
import { desc, eq } from "drizzle-orm"

import { SubscriptionActions } from "@/components/account/subscription-actions"
import { db } from "@/lib/db"
import { payment, subscription } from "@/lib/db/schema"
import { PLANS, isPlanId } from "@/lib/plans"
import { requireUser } from "@/lib/session"

export default async function SubscriptionPage() {
  const user = await requireUser()
  const [rows, history] = await Promise.all([
    db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, user.id))
      .limit(1),
    db
      .select()
      .from(payment)
      .where(eq(payment.userId, user.id))
      .orderBy(desc(payment.createdAt))
      .limit(12),
  ])

  const current = rows[0]
  const plan = current && isPlanId(current.plan) ? PLANS[current.plan] : null

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Подписка
      </h1>

      {current ? (
        <section className="border-shell-border bg-shell-panel mt-6 rounded-2xl border p-6 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-shell-fg text-2xl font-semibold">
                {plan?.title ?? "Pro"}
              </p>
              <p className="text-shell-muted mt-2 text-sm leading-relaxed">
                {current.cancelAtPeriodEnd
                  ? `Продление отключено. Доступ сохраняется до ${current.currentPeriodEnd.toLocaleDateString("ru-RU")}, потом тариф станет бесплатным.`
                  : `Следующее списание ${current.currentPeriodEnd.toLocaleDateString("ru-RU")}${plan ? `, ${Math.round(Number(plan.price))} ₽` : ""}.`}
              </p>
            </div>
            <span
              className={`rounded-lg px-2.5 py-1 text-sm font-medium ${
                current.status === "active"
                  ? "bg-shell-accent text-shell-accent-fg"
                  : "border-shell-border text-shell-muted border"
              }`}
            >
              {current.status === "active" ? "Активна" : "Приостановлена"}
            </span>
          </div>

          <SubscriptionActions cancelled={current.cancelAtPeriodEnd} />
        </section>
      ) : (
        <div className="border-shell-border mt-6 rounded-2xl border border-dashed p-10 text-center">
          <p className="text-shell-fg text-sm">Подписки нет</p>
          <p className="text-shell-muted mx-auto mt-2 max-w-sm text-sm leading-relaxed">
            Бесплатного тарифа хватает на сто компонентов в месяц. Pro снимает
            лимит и открывает закрытые компоненты.
          </p>
          <Link
            href="/pricing"
            className="bg-shell-accent text-shell-accent-fg mt-6 inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold transition-opacity hover:opacity-90"
          >
            Смотреть тарифы
          </Link>
        </div>
      )}

      {history.length > 0 ? (
        <section className="mt-10">
          <h2 className="text-shell-fg text-sm font-medium">Платежи</h2>
          <ul className="border-shell-border mt-3 grid divide-y divide-[var(--shell-divider)] rounded-2xl border">
            {history.map((row) => (
              <li
                key={row.id}
                className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm"
              >
                <span className="text-shell-muted tabular-nums">
                  {row.paidAt?.toLocaleDateString("ru-RU") ?? "—"}
                </span>
                <span className="text-shell-fg font-medium tabular-nums">
                  {Math.round(Number(row.amount))} ₽
                </span>
              </li>
            ))}
          </ul>
          <p className="text-shell-muted mt-3 text-xs leading-relaxed">
            Чек на каждый платёж приходит на почту от ЮKassa.
          </p>
        </section>
      ) : null}
    </>
  )
}
