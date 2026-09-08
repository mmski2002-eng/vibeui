import { desc, eq } from "drizzle-orm"

import { SubscriptionActions } from "@/components/account/subscription-actions"
import { db } from "@/lib/db"
import { payment, subscription } from "@/lib/db/schema"
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

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Подписка
      </h1>

      {current ? (
        <div className="border-shell-border bg-shell-panel mt-6 rounded-2xl border p-5">
          <p className="text-shell-fg text-lg font-semibold">
            {current.status === "active" ? "Pro активен" : "Pro приостановлен"}
          </p>
          <p className="text-shell-muted mt-2 text-sm leading-relaxed">
            {current.cancelAtPeriodEnd
              ? `Продление отключено. Доступ сохраняется до ${current.currentPeriodEnd.toLocaleDateString("ru-RU")}.`
              : `Следующее списание ${current.currentPeriodEnd.toLocaleDateString("ru-RU")}.`}
          </p>
          <SubscriptionActions cancelled={current.cancelAtPeriodEnd} />
        </div>
      ) : (
        <p className="text-shell-muted mt-4 text-sm leading-relaxed">
          Подписки нет. Тарифы и условия — на{" "}
          <a href="/pricing" className="text-shell-accent hover:underline">
            странице цен
          </a>
          .
        </p>
      )}

      {history.length > 0 ? (
        <>
          <h2 className="text-shell-fg mt-10 text-sm font-semibold">
            История платежей
          </h2>
          <ul className="mt-3 grid gap-2">
            {history.map((row) => (
              <li
                key={row.id}
                className="border-shell-border bg-shell-panel flex items-center justify-between rounded-xl border px-4 py-3 text-sm"
              >
                <span className="text-shell-muted">
                  {row.paidAt?.toLocaleDateString("ru-RU") ?? "—"}
                </span>
                <span className="text-shell-fg font-medium">
                  {row.amount} ₽
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </>
  )
}
