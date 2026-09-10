import type { Metadata } from "next"

import { AccountNav } from "@/components/account/account-nav"
import {
  PaymentsList,
  PendingPayment,
  RenewalButton,
} from "@/components/account/billing-parts"
import { CopyLink } from "@/components/account/copy-link"
import { FavoritesGrid } from "@/components/account/favorites-grid"
import { HistoryList } from "@/components/account/history-list"
import { DevicesPanel, EmailPanel } from "@/components/account/profile-panels"
import { AccountSkeleton } from "@/components/account/skeleton"
import { TokenPanel } from "@/components/account/token-panel"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { CatalogThumbnail } from "@/components/catalog/catalog-thumbnail"

/**
 * Панели кабинета на вымышленных данных.
 *
 * Кабинет закрыт сессией и живой базой, поэтому вёрстку его панелей иначе
 * не посмотреть: здесь они собраны с фикстурами, без обращения к базе.
 * Страница не индексируется и в навигации не участвует.
 */
export const metadata: Metadata = {
  title: "Кабинет: панели",
  robots: { index: false, follow: false },
}

const FAVORITES = ["button-003", "hero-018", "chart-001", "badge-001"].map(
  (slug) => ({
    name: slug,
    title: slug,
    kind: slug.startsWith("hero") ? "block" : "component",
    kindLabel: slug.startsWith("hero") ? "Блоки" : "Компоненты",
    href: `/components/${slug}`,
    docUrl: `https://vibeui.ru/c/${slug}`,
    preview: <CatalogThumbnail slug={slug} locale="ru" />,
  }),
)

const HISTORY = ["button-003", "hero-018", "chart-001"].map((slug, index) => ({
  name: slug,
  title: slug,
  href: `/components/${slug}`,
  docUrl: `https://vibeui.ru/c/${slug}`,
  period: index === 2 ? "2026-08" : "2026-09",
  periodTitle: index === 2 ? "август 2026 г." : "сентябрь 2026 г.",
  takenAt: `${index + 1} сент.`,
}))

export default function LabAccountPage() {
  return (
    <CatalogShell locale="ru">
      <main className="mx-auto grid w-full max-w-[1360px] gap-10 px-4 py-10 lg:px-6">
        <Block title="Навигация">
          <AccountNav locale="ru" />
        </Block>

        <Block title="Каркас загрузки">
          <AccountSkeleton locale="ru" />
        </Block>

        <Block title="Избранное">
          <FavoritesGrid locale="ru" cards={FAVORITES} />
        </Block>

        <Block title="История">
          <HistoryList locale="ru" rows={HISTORY} />
        </Block>

        <Block title="Оплата">
          <PendingPayment locale="ru" />
          <RenewalButton locale="ru" cancelled={false} />
          <PaymentsList
            locale="ru"
            rows={[
              {
                id: "1",
                date: "1 сент. 2026",
                amount: "690 ₽",
                status: "succeeded",
              },
              {
                id: "2",
                date: "1 авг. 2026",
                amount: "690 ₽",
                status: "pending",
              },
              {
                id: "3",
                date: "1 июл. 2026",
                amount: "690 ₽",
                status: "canceled",
              },
            ]}
          />
        </Block>

        <Block title="Подключение к проекту">
          <TokenPanel
            locale="ru"
            pro
            tokens={[
              {
                id: "1",
                prefix: "vk_AbCdEfGh",
                createdAt: "1 сент. 2026",
                lastUsedAt: "9 сент. 2026",
                revoked: false,
              },
              {
                id: "2",
                prefix: "vk_ZyXwVuTs",
                createdAt: "1 авг. 2026",
                lastUsedAt: null,
                revoked: true,
              },
            ]}
          />
        </Block>

        <Block title="Приглашения">
          <CopyLink url="https://vibeui.ru/i/ab12cd34" locale="ru" />
        </Block>

        <Block title="Профиль">
          <div className="grid gap-6 lg:grid-cols-2">
            <EmailPanel locale="ru" email="me@example.com" verified={false} />
            <DevicesPanel
              locale="ru"
              devices={[
                {
                  id: "1",
                  browser: "Chrome · Windows",
                  lastSeen: "10 сент., 12:40",
                  current: true,
                },
                {
                  id: "2",
                  browser: "Safari · iOS",
                  lastSeen: "8 сент., 21:03",
                  current: false,
                },
              ]}
            />
          </div>
        </Block>
      </main>
    </CatalogShell>
  )
}

function Block({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="text-shell-muted mb-4 text-xs font-medium tracking-wide uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}
