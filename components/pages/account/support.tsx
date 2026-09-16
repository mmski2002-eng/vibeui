import { count, desc, eq } from "drizzle-orm"

import { REPORT_FORM_TEXTS } from "@/components/admin/texts"
import { ReportForm } from "@/components/report/report-form"
import { DataTable } from "@/components/account/ui/data-table"
import { PageHeader } from "@/components/account/ui/page-header"
import { PAGER_LABELS, Pager } from "@/components/account/ui/pager"
import { Panel } from "@/components/account/ui/panel"
import { StatusPill, type PillTone } from "@/components/account/ui/status-pill"
import { db } from "@/lib/db"
import { formatDate } from "@/lib/format"
import { report } from "@/lib/db/schema"
import { localePath, type Locale } from "@/lib/i18n"
import { requireUser } from "@/lib/session"

// Подписи статусов: словарь индексируется строкой из базы, поэтому тип
// объявлен явно — литеральные ключи здесь только мешали бы.
const STATUS_LABEL: Record<Locale, Record<string, string>> = {
  ru: {
    new: "Принято",
    in_progress: "В работе",
    answered: "Отвечено",
    closed: "Закрыто",
    spam: "Закрыто",
  },
  en: {
    new: "Received",
    in_progress: "In progress",
    answered: "Answered",
    closed: "Closed",
    spam: "Closed",
  },
}

const PER_PAGE = 20

/**
 * Поддержка в кабинете: форма и список своих обращений.
 *
 * Список важен не меньше формы: без него человек не знает, дошло ли
 * предыдущее письмо, и пишет второй раз.
 */
export async function AccountSupport({
  locale,
  page,
}: {
  locale: Locale
  page: number
}) {
  const user = await requireUser(locale)
  const t = REPORT_FORM_TEXTS[locale]
  const base = localePath(locale, "/account/support")

  const [mine, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(report)
      .where(eq(report.userId, user.id))
      .orderBy(desc(report.createdAt))
      .limit(PER_PAGE)
      .offset((page - 1) * PER_PAGE),
    db
      .select({ value: count() })
      .from(report)
      .where(eq(report.userId, user.id)),
  ])

  const tone: Record<string, PillTone> = {
    new: "warn",
    in_progress: "accent",
    answered: "ok",
    closed: "muted",
    spam: "muted",
  }

  return (
    <>
      <PageHeader title={t.supportTitle} lead={t.supportLead} />

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Panel index={1}>
          <ReportForm
            locale={locale}
            kind="support"
            email={user.email}
            compact
          />
        </Panel>

        {mine.length > 0 ? (
          <div>
            <DataTable
              index={2}
              empty=""
              columns={[
                { key: "subject", label: locale === "en" ? "Subject" : "Тема" },
                {
                  key: "status",
                  label: locale === "en" ? "Status" : "Статус",
                  className: "w-32",
                },
                {
                  key: "date",
                  label: locale === "en" ? "Date" : "Дата",
                  align: "right",
                  className: "w-28",
                },
              ]}
              rows={mine.map((row) => ({
                id: row.id,
                cells: [
                  <span key="subject" className="block truncate">
                    {row.subject}
                  </span>,
                  <StatusPill key="status" tone={tone[row.status] ?? "muted"}>
                    {STATUS_LABEL[locale][row.status] ?? row.status}
                  </StatusPill>,
                  <span
                    key="date"
                    className="text-shell-muted text-xs tabular-nums"
                  >
                    {formatDate(row.createdAt, locale)}
                  </span>,
                ],
              }))}
            />
            <Pager
              page={page}
              hasNext={page * PER_PAGE < total}
              total={total}
              perPage={PER_PAGE}
              href={(next) => (next > 1 ? `${base}?page=${next}` : base)}
              labels={PAGER_LABELS[locale]}
            />
          </div>
        ) : null}
      </div>
    </>
  )
}
