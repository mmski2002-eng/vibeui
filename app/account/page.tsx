import Link from "next/link"

import { SignOutButton } from "@/components/auth/sign-out-button"
import {
  FREE_MONTHLY_LIMIT,
  getSubscription,
  getUsedCount,
} from "@/lib/entitlements"
import { requireUser } from "@/lib/session"

export default async function AccountPage() {
  const user = await requireUser()
  const [plan, used] = await Promise.all([
    getSubscription(user.id),
    getUsedCount(user.id),
  ])

  const remaining = Math.max(0, FREE_MONTHLY_LIMIT - used)

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Обзор
      </h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <section className="border-shell-border bg-shell-panel rounded-2xl border p-5">
          <h2 className="text-shell-muted text-xs font-medium tracking-wide uppercase">
            Тариф
          </h2>
          <p className="text-shell-fg mt-2 text-xl font-semibold">
            {plan ? "Pro" : "Бесплатный"}
          </p>
          <p className="text-shell-muted mt-2 text-sm leading-relaxed">
            {plan
              ? `Действует до ${plan.currentPeriodEnd.toLocaleDateString("ru-RU")}`
              : "Pro открывает закрытые компоненты и снимает лимит копирований."}
          </p>
          <Link
            href={plan ? "/account/subscription" : "/pricing"}
            className="text-shell-accent mt-4 inline-block text-sm font-medium hover:underline"
          >
            {plan ? "Управлять подпиской" : "Посмотреть тарифы"}
          </Link>
        </section>

        <section className="border-shell-border bg-shell-panel rounded-2xl border p-5">
          <h2 className="text-shell-muted text-xs font-medium tracking-wide uppercase">
            Копирования в этом месяце
          </h2>
          <p className="text-shell-fg mt-2 text-xl font-semibold">
            {plan ? "Без лимита" : `${remaining} из ${FREE_MONTHLY_LIMIT}`}
          </p>
          <p className="text-shell-muted mt-2 text-sm leading-relaxed">
            {plan
              ? "Подписка снимает ограничение на число компонентов."
              : "Считаются разные компоненты: повторное копирование одного и того же ничего не тратит."}
          </p>
        </section>
      </div>

      <div className="border-shell-border mt-8 border-t pt-6">
        <SignOutButton />
      </div>
    </>
  )
}
