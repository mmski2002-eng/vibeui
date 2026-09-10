import type { Metadata } from "next"

import {
  AdminHeading,
  DayBars,
  Metric,
  PeriodSwitch,
  Pill,
  Ranked,
  Section,
} from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { PaymentActions } from "@/components/admin/payment-actions"
import { ReportPanel } from "@/components/admin/report-panel"
import { UserActions } from "@/components/admin/user-actions"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { ReportForm } from "@/components/report/report-form"

/**
 * Панели админки на вымышленных данных: разделы закрыты правом и живой
 * базой, а вёрстку смотреть надо. Страница не индексируется.
 */
export const metadata: Metadata = {
  title: "Админка: панели",
  robots: { index: false, follow: false },
}

const DAYS = Array.from({ length: 30 }, (_, index) => ({
  day: `2026-09-${String(index + 1).padStart(2, "0")}`,
  value: Math.round(4 + Math.sin(index / 3) * 3 + (index % 5)),
}))

export default function LabAdminPage() {
  const t = ADMIN_TEXTS.summary

  return (
    <CatalogShell locale="ru">
      <main className="mx-auto grid w-full max-w-[1360px] gap-10 px-4 py-10 lg:px-6">
        <div>
          <AdminHeading
            title={t.title}
            lead={t.lead}
            action={
              <PeriodSwitch
                base="/lab/admin"
                current={30}
                labels={t.periods}
              />
            }
          />

          <Section title={t.money}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric
                label={t.revenue}
                value="12 420 ₽"
                note={t.versus("9 660 ₽")}
                accent
              />
              <Metric label={t.payments} value="18" />
              <Metric label={t.average} value="690 ₽" />
              <Metric label={t.activeSubs} value="24" />
              <Metric
                label={t.stuck}
                value="2"
                note={t.stuckNote}
                accent
              />
            </div>
          </Section>

          <Section title={t.people}>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Metric label={t.signups} value="63" />
              <Metric label={t.verified} value="81%" note="51 из 63" />
              <Metric label={t.exhausted} value="4" accent />
            </div>
            <div className="mt-3">
              <DayBars data={DAYS} label={t.signups} />
            </div>
          </Section>

          <Section title={t.discovery}>
            <div className="grid gap-4 lg:grid-cols-2">
              <Ranked
                rows={[
                  { query: "тарифы", value: 34 },
                  { query: "hero", value: 21 },
                  { query: "таблица", value: 12 },
                ]}
                empty={t.noData}
              />
              <Ranked
                rows={[
                  { query: "календарь бронирования", value: 7 },
                  { query: "канбан", value: 4 },
                ]}
                empty={t.noData}
              />
            </div>
          </Section>
        </div>

        <div>
          <h2 className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase">
            Значки
          </h2>
          <div className="flex flex-wrap gap-2">
            <Pill>Компонент</Pill>
            <Pill tone="accent">Новое</Pill>
            <Pill tone="solid">Pro</Pill>
          </div>
        </div>

        <div>
          <h2 className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase">
            Действия над платежом
          </h2>
          <PaymentActions paymentId="demo" />
        </div>

        <div>
          <h2 className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase">
            Разбор обращения
          </h2>
          <ReportPanel id="demo" status="new" assignee={null} />
        </div>

        <div>
          <h2 className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase">
            Действия над аккаунтом
          </h2>
          <div className="max-w-md">
            <UserActions
              userId="demo"
              blocked={false}
              verified={false}
              hasSubscription
              cancelling={false}
              note=""
            />
          </div>
        </div>

        <div>
          <h2 className="text-shell-muted mb-3 text-xs font-medium tracking-wide uppercase">
            Форма обращения
          </h2>
          <div className="border-shell-border bg-shell-panel max-w-md rounded-2xl border p-5">
            <ReportForm
              locale="ru"
              kind="component"
              itemName="button-003"
              email="me@example.com"
              compact
            />
          </div>
        </div>
      </main>
    </CatalogShell>
  )
}
