import Link from "next/link"
import { notFound } from "next/navigation"

import { CopyLink } from "@/components/account/copy-link"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { localePath, type Locale } from "@/lib/i18n"
import {
  maskEmail,
  partnerCode,
  referralsOf,
  referralTotals,
  visitsByCode,
} from "@/lib/partners"
import { SITE_URL } from "@/lib/seo"
import { requireUser } from "@/lib/session"

const PAGE = 50

/**
 * Кабинет партнёра: ссылка, счётчики и список приведённых людей.
 *
 * Не партнёру — 404, а не «раздел недоступен»: программа закрытая, и
 * объяснять, как в неё попасть, страница не должна.
 */
export async function AccountReferrals({
  locale,
  before,
}: {
  locale: Locale
  before?: string
}) {
  const user = await requireUser(locale)
  const code = await partnerCode(user.id)

  if (!code) {
    notFound()
  }

  const t = ACCOUNT_TEXTS[locale].referrals
  const cursor = before ? new Date(before) : undefined
  const validCursor =
    cursor && !Number.isNaN(cursor.getTime()) ? cursor : undefined

  const [clicks, totals, rows] = await Promise.all([
    visitsByCode(code),
    referralTotals(user.id),
    referralsOf(user.id, { before: validCursor, limit: PAGE + 1 }),
  ])

  const page = rows.slice(0, PAGE)
  const next = rows.length > PAGE ? page[page.length - 1]?.createdAt : null
  const dates = locale === "en" ? "en-GB" : "ru-RU"

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.title}
      </h1>
      <p className="text-shell-muted mt-1.5 max-w-2xl text-sm leading-relaxed">
        {t.lead}
      </p>

      <section className="border-shell-border bg-shell-panel mt-6 rounded-2xl border p-5 sm:p-6">
        <CopyLink url={`${SITE_URL}/i/${code}`} locale={locale} />

        <dl className="border-shell-border mt-5 grid grid-cols-3 gap-4 border-t pt-5 text-sm">
          <Stat label={t.clicks} value={String(clicks)} />
          <Stat label={t.signedUp} value={String(totals.total)} />
          <Stat
            label={t.paid}
            value={String(totals.paid)}
            accent={totals.paid > 0}
          />
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="text-shell-fg text-sm font-medium">{t.listTitle}</h2>
        {page.length === 0 ? (
          <p className="text-shell-muted mt-3 text-sm">{t.listEmpty}</p>
        ) : (
          <ul className="border-shell-border mt-3 divide-y divide-[var(--shell-divider)] rounded-2xl border">
            {page.map((referral) => (
              <li
                key={referral.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm"
              >
                <span className="min-w-0 flex-1">
                  <span className="text-shell-fg block truncate">
                    {maskEmail(referral.email)}
                  </span>
                  <span className="text-shell-muted block truncate text-xs">
                    {referral.name}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-medium ${
                    referral.firstPaidAt
                      ? "bg-shell-accent text-shell-accent-fg"
                      : "border-shell-border text-shell-muted border"
                  }`}
                >
                  {referral.firstPaidAt ? t.paidLabel : t.notPaid}
                </span>
                <span className="text-shell-muted w-24 shrink-0 text-right text-xs tabular-nums">
                  {referral.createdAt.toLocaleDateString(dates)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {next ? (
          <Link
            href={localePath(
              locale,
              `/account/referrals?before=${next.toISOString()}`,
            )}
            className="border-shell-border text-shell-fg hover:border-shell-accent mt-4 inline-flex h-10 items-center rounded-lg border px-4 text-sm transition-colors"
          >
            {t.more}
          </Link>
        ) : null}
      </section>

      <section className="border-shell-border mt-8 rounded-2xl border p-5 sm:p-6">
        <h2 className="text-shell-fg text-sm font-medium">{t.howTitle}</h2>
        <ol className="text-shell-muted mt-3 grid gap-2 text-sm leading-relaxed">
          {t.how.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>
    </>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="min-w-0">
      <dt className="text-shell-muted truncate text-xs">{label}</dt>
      <dd
        className={`mt-1 text-xl font-semibold tabular-nums ${
          accent ? "text-shell-accent-text" : "text-shell-fg"
        }`}
      >
        {value}
      </dd>
    </div>
  )
}
