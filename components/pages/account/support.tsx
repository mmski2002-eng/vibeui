import { desc, eq } from "drizzle-orm"

import { REPORT_FORM_TEXTS } from "@/components/admin/texts"
import { ReportForm } from "@/components/report/report-form"
import { db } from "@/lib/db"
import { report } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n"
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

/**
 * Поддержка в кабинете: форма и список своих обращений.
 *
 * Список важен не меньше формы: без него человек не знает, дошло ли
 * предыдущее письмо, и пишет второй раз.
 */
export async function AccountSupport({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = REPORT_FORM_TEXTS[locale]

  const mine = await db
    .select()
    .from(report)
    .where(eq(report.userId, user.id))
    .orderBy(desc(report.createdAt))
    .limit(20)

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.supportTitle}
      </h1>
      <p className="text-shell-muted mt-1.5 max-w-2xl text-sm leading-relaxed">
        {t.supportLead}
      </p>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
        <section className="border-shell-border bg-shell-panel rounded-2xl border p-5 sm:p-6">
          <ReportForm
            locale={locale}
            kind="support"
            email={user.email}
            compact
          />
        </section>

        {mine.length > 0 ? (
          <section>
            <ul className="border-shell-border divide-y divide-[var(--shell-divider)] rounded-2xl border">
              {mine.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm"
                >
                  <span className="text-shell-fg min-w-0 flex-1 truncate">
                    {row.subject}
                  </span>
                  <span className="text-shell-muted shrink-0 text-xs">
                    {STATUS_LABEL[locale][row.status] ?? row.status}
                  </span>
                  <span className="text-shell-muted w-24 shrink-0 text-right text-xs tabular-nums">
                    {row.createdAt.toLocaleDateString(
                      locale === "en" ? "en-GB" : "ru-RU",
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  )
}
