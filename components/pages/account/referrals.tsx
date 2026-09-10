import { count, desc, eq, sum } from "drizzle-orm"

import { CopyLink } from "@/components/account/copy-link"
import { ACCOUNT_TEXTS } from "@/components/account/texts"
import { ensureReferralCode } from "@/lib/account-actions"
import { db } from "@/lib/db"
import { referralReward, referralVisit } from "@/lib/db/schema"
import type { Locale } from "@/lib/i18n"
import { REFERRAL_DAYS } from "@/lib/plans"
import { SITE_URL } from "@/lib/seo"
import { requireUser } from "@/lib/session"

/**
 * Приглашения: ссылка на видном месте, счётчики компактной строкой.
 *
 * «Дней Pro» переименовано в «Начислено за приглашения»: формула считает
 * накопленную награду, а не оставшийся срок доступа, и старая подпись
 * обещала не то.
 */
export async function AccountReferrals({ locale }: { locale: Locale }) {
  const user = await requireUser(locale)
  const t = ACCOUNT_TEXTS[locale].referrals
  const code = await ensureReferralCode()

  const [visits, rewards, granted] = await Promise.all([
    db
      .select({ value: count() })
      .from(referralVisit)
      .where(eq(referralVisit.code, code)),
    db
      .select()
      .from(referralReward)
      .where(eq(referralReward.inviterId, user.id))
      .orderBy(desc(referralReward.grantedAt))
      .limit(20),
    db
      .select({ value: sum(referralReward.daysGranted) })
      .from(referralReward)
      .where(eq(referralReward.inviterId, user.id)),
  ])

  const clicks = visits[0]?.value ?? 0
  const paid = rewards.length
  const days = Number(granted[0]?.value ?? 0)

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
        {t.title}
      </h1>
      <p className="text-shell-muted mt-1.5 max-w-2xl text-sm leading-relaxed">
        {t.lead(REFERRAL_DAYS.inviter, REFERRAL_DAYS.invited)}
      </p>

      <section className="border-shell-border bg-shell-panel mt-6 rounded-2xl border p-5 sm:p-6">
        <CopyLink url={`${SITE_URL}/i/${code}`} locale={locale} />

        {/* Счётчики строкой: три большие карточки с нулями занимали экран,
            ничего о нём не сообщая. */}
        <dl className="border-shell-border mt-5 grid grid-cols-3 gap-4 border-t pt-5 text-sm">
          <Stat label={t.clicks} value={String(clicks)} />
          <Stat label={t.paid} value={String(paid)} />
          <Stat label={t.earned} value={t.days(days)} accent={days > 0} />
        </dl>
      </section>

      {rewards.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-shell-fg text-sm font-medium">
            {t.rewardsTitle}
          </h2>
          <ul className="border-shell-border mt-3 divide-y divide-[var(--shell-divider)] rounded-2xl border">
            {rewards.map((reward) => (
              <li
                key={reward.id}
                className="flex items-baseline justify-between gap-4 px-4 py-3 text-sm"
              >
                <span className="text-shell-muted tabular-nums">
                  {reward.grantedAt.toLocaleDateString(
                    locale === "en" ? "en-GB" : "ru-RU",
                  )}
                </span>
                <span className="text-shell-fg font-medium tabular-nums">
                  + {t.days(reward.daysGranted)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
