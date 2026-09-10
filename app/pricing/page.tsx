import Link from "next/link"

import { CatalogShell } from "@/components/catalog/catalog-shell"
import { FREE_MONTHLY_LIMIT } from "@/lib/entitlements"
import { PLANS } from "@/lib/plans"
import { pageMetadata } from "@/lib/seo"
import { getSession } from "@/lib/session"
import { startCheckout } from "@/lib/payment-actions"

export const metadata = pageMetadata({
  locale: "ru",
  path: "/pricing",
  title: "Тарифы",
  description:
    "Бесплатно — сто компонентов в месяц. Pro открывает закрытые компоненты и снимает лимит.",
})

const FREE_FEATURES = [
  "Весь каталог, превью и поиск",
  `${FREE_MONTHLY_LIMIT} разных компонентов в месяц`,
  "Copy for AI и установка через shadcn",
  "Избранное и история",
]

const PRO_FEATURES = [
  "Закрытые Pro-компоненты",
  "Без лимита на копирование",
  "Персональный ключ установки",
  "14 дней Pro за каждого приглашённого",
]

export default async function PricingPage() {
  const session = await getSession()

  return (
    <CatalogShell locale="ru">
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:py-16 lg:px-6">
        <h1 className="text-shell-fg text-3xl font-semibold tracking-tight sm:text-4xl">
          Тарифы
        </h1>
        <p className="text-shell-muted mt-3 max-w-2xl text-base leading-relaxed">
          Витрина открыта целиком: смотреть, искать и примерять компоненты можно
          без аккаунта. Платным становится объём работы, а не доступ к дизайну.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <section className="border-shell-border bg-shell-panel rounded-2xl border p-6">
            <h2 className="text-shell-fg text-lg font-semibold">Бесплатно</h2>
            <p className="text-shell-fg mt-3 text-3xl font-semibold">0 ₽</p>
            <ul className="mt-6 grid gap-2.5">
              {FREE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="text-shell-muted text-sm leading-relaxed"
                >
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={session ? "/account" : "/signup"}
              className="border-shell-border-strong text-shell-fg hover:border-shell-accent mt-6 inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors"
            >
              {session ? "В кабинет" : "Создать аккаунт"}
            </Link>
          </section>

          <section className="border-shell-accent bg-shell-panel rounded-2xl border p-6">
            <h2 className="text-shell-fg text-lg font-semibold">Pro</h2>
            <p className="text-shell-fg mt-3 text-3xl font-semibold">
              {Math.round(Number(PLANS.monthly.price))} ₽
              <span className="text-shell-muted text-base font-normal">
                {" "}
                / {PLANS.monthly.period}
              </span>
            </p>
            <p className="text-shell-muted mt-1 text-sm">
              Год — {Math.round(Number(PLANS.yearly.price))} ₽,{" "}
              {PLANS.yearly.note}
            </p>
            <ul className="mt-6 grid gap-2.5">
              {PRO_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="text-shell-muted text-sm leading-relaxed"
                >
                  {feature}
                </li>
              ))}
            </ul>

            {session ? (
              <div className="mt-6 flex flex-wrap gap-2">
                <form action={startCheckout}>
                  <input type="hidden" name="plan" value="monthly" />
                  <button
                    type="submit"
                    className="bg-shell-accent text-shell-accent-fg inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors hover:bg-shell-accent-deep"
                  >
                    Оплатить месяц
                  </button>
                </form>
                <form action={startCheckout}>
                  <input type="hidden" name="plan" value="yearly" />
                  <button
                    type="submit"
                    className="border-shell-border-strong text-shell-fg hover:border-shell-accent inline-flex h-10 items-center justify-center rounded-lg border px-4 text-sm font-medium transition-colors"
                  >
                    Оплатить год
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/signup"
                className="bg-shell-accent text-shell-accent-fg mt-6 inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors hover:bg-shell-accent-deep"
              >
                Начать
              </Link>
            )}
          </section>
        </div>

        <p className="text-shell-muted mt-8 text-sm leading-relaxed">
          Оплата картой или через СБП. Подписка продлевается сама, отключить
          продление можно в кабинете в любой момент — доступ сохранится до конца
          оплаченного периода. Чек приходит на почту.
        </p>
      </main>
    </CatalogShell>
  )
}
