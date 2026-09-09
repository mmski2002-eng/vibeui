import Link from "next/link"
import { and, count, desc, eq } from "drizzle-orm"

import { UnlimitedStrip, UsageStrip } from "@/components/account/usage-strip"
import { db } from "@/lib/db"
import { favorite, usage } from "@/lib/db/schema"
import {
  currentPeriod,
  getSubscription,
  getUsedCount,
} from "@/lib/entitlements"
import { requireUser } from "@/lib/session"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

/** Первое число следующего месяца — день, когда лента обнулится. */
function nextReset() {
  const now = new Date()
  const next = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  )

  return next.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
}

export default async function AccountPage() {
  const user = await requireUser()

  const [plan, used, recent, favourites] = await Promise.all([
    getSubscription(user.id),
    getUsedCount(user.id),
    db
      .select()
      .from(usage)
      .where(and(eq(usage.userId, user.id), eq(usage.period, currentPeriod())))
      .orderBy(desc(usage.firstUsedAt))
      .limit(6),
    db
      .select({ value: count() })
      .from(favorite)
      .where(eq(favorite.userId, user.id)),
  ])

  const favouriteCount = favourites[0]?.value ?? 0

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="grid content-start gap-6">
        {plan ? (
          <UnlimitedStrip
            until={plan.currentPeriodEnd.toLocaleDateString("ru-RU")}
          />
        ) : (
          <UsageStrip used={used} resetsOn={nextReset()} />
        )}

        <section className="border-shell-border bg-shell-panel rounded-2xl border p-6 sm:p-7">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="text-shell-fg font-medium">Взято в этом месяце</h2>
            {recent.length > 0 ? (
              <Link
                href="/account/history"
                className="text-shell-muted hover:text-shell-fg text-sm transition-colors"
              >
                Весь журнал
              </Link>
            ) : null}
          </div>

          {recent.length === 0 ? (
            <p className="text-shell-muted text-sm leading-relaxed">
              Пока ничего. Откройте{" "}
              <Link href="/components" className="text-shell-accent underline">
                каталог
              </Link>{" "}
              и нажмите «Копировать для ИИ» — компонент появится здесь, чтобы
              его легко было найти снова.
            </p>
          ) : (
            <ul className="grid gap-1">
              {recent.map((row) => (
                <TakenRow
                  key={row.itemName}
                  name={row.itemName}
                  at={row.firstUsedAt}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid content-start gap-6">
        <aside className="border-shell-border bg-shell-panel rounded-2xl border p-6">
          <h2 className="text-shell-fg font-medium">
            {plan ? "Подписка" : "Что даёт Pro"}
          </h2>
          {plan ? (
            <>
              <p className="text-shell-muted mt-3 text-sm leading-relaxed">
                {plan.cancelAtPeriodEnd
                  ? `Продление отключено, доступ до ${plan.currentPeriodEnd.toLocaleDateString("ru-RU")}.`
                  : `Следующее списание ${plan.currentPeriodEnd.toLocaleDateString("ru-RU")}.`}
              </p>
              <Link
                href="/account/subscription"
                className="border-shell-border-strong text-shell-fg hover:border-shell-accent mt-5 inline-flex h-9 items-center rounded-lg border px-3 text-sm transition-colors"
              >
                Управлять
              </Link>
            </>
          ) : (
            <>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed">
                <li className="text-shell-muted">Закрытые компоненты</li>
                <li className="text-shell-muted">Без лимита на копирование</li>
                <li className="text-shell-muted">Ключ установки для CLI</li>
              </ul>
              <Link
                href="/pricing"
                className="bg-shell-accent text-shell-accent-fg mt-5 inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                Смотреть тарифы
              </Link>
            </>
          )}
        </aside>

        <aside className="border-shell-border bg-shell-panel rounded-2xl border p-6">
          <h2 className="text-shell-fg font-medium">Избранное</h2>
          <p className="text-shell-fg mt-3 text-3xl font-semibold tabular-nums">
            {favouriteCount}
          </p>
          <p className="text-shell-muted mt-2 text-sm leading-relaxed">
            {favouriteCount === 0
              ? "Сердце на карточке откладывает компонент сюда."
              : "Отложенные компоненты со всей витрины."}
          </p>
          {favouriteCount > 0 ? (
            <Link
              href="/account/favorites"
              className="text-shell-accent mt-4 inline-block text-sm hover:underline"
            >
              Открыть
            </Link>
          ) : null}
        </aside>

        <aside className="border-shell-border bg-shell-panel rounded-2xl border p-6">
          <h2 className="text-shell-fg font-medium">Приглашения</h2>
          <p className="text-shell-muted mt-3 text-sm leading-relaxed">
            За каждого, кто оплатит подписку по вашей ссылке, вы получаете 14
            дней Pro.
          </p>
          <Link
            href="/account/referrals"
            className="text-shell-accent mt-4 inline-block text-sm hover:underline"
          >
            Взять ссылку
          </Link>
        </aside>
      </div>
    </div>
  )
}

/** Строка журнала: имя компонента, его код и когда он был взят. */
function TakenRow({ name, at }: { name: string; at: Date }) {
  const item = getCatalogItem(name)
  const kind = getItemKind(name) ?? "component"

  return (
    <li>
      <Link
        href={`${itemBasePath(kind)}/${name}`}
        className="hover:bg-shell-elevated -mx-2 flex items-baseline justify-between gap-4 rounded-lg px-2 py-2 transition-colors"
      >
        <span className="min-w-0">
          <span className="text-shell-fg block truncate text-sm">
            {item?.title ?? name}
          </span>
          <span className="text-shell-muted block truncate font-mono text-xs">
            {name}
          </span>
        </span>
        <span className="text-shell-muted shrink-0 text-xs tabular-nums">
          {at.toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
        </span>
      </Link>
    </li>
  )
}
