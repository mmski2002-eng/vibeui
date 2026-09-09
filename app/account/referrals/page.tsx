import { count, eq } from "drizzle-orm"

import { CopyLink } from "@/components/account/copy-link"
import { ensureReferralCode } from "@/lib/account-actions"
import { db } from "@/lib/db"
import { referralReward, referralVisit } from "@/lib/db/schema"
import { REFERRAL_DAYS } from "@/lib/plans"
import { SITE_URL } from "@/lib/seo"
import { requireUser } from "@/lib/session"

export default async function ReferralsPage() {
  const user = await requireUser()
  const code = await ensureReferralCode()

  const [visits, rewards] = await Promise.all([
    db
      .select({ value: count() })
      .from(referralVisit)
      .where(eq(referralVisit.code, code)),
    db
      .select({ value: count() })
      .from(referralReward)
      .where(eq(referralReward.inviterId, user.id)),
  ])

  const clicks = visits[0]?.value ?? 0
  const paid = rewards[0]?.value ?? 0

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Приглашения
      </h1>
      <p className="text-shell-muted mt-2 max-w-xl text-sm leading-relaxed">
        Отправьте ссылку тому, кому библиотека пригодится. Когда он оплатит
        подписку, вы получите {REFERRAL_DAYS.inviter} дней Pro, а он —{" "}
        {REFERRAL_DAYS.invited} дней сверх оплаченного периода.
      </p>

      <CopyLink url={`${SITE_URL}/i/${code}`} />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Переходов" value={clicks} />
        <Stat label="Оплатили" value={paid} />
        <Stat label="Дней Pro" value={paid * REFERRAL_DAYS.inviter} accent />
      </div>

      <div className="border-shell-border mt-8 rounded-2xl border p-6">
        <h2 className="text-shell-fg text-sm font-medium">Как это считается</h2>
        <ol className="text-shell-muted mt-3 grid gap-2 text-sm leading-relaxed">
          <li>
            Переход по ссылке запоминается на 60 дней — регистрироваться сразу
            необязательно.
          </li>
          <li>
            Дни начисляются после оплаты, а не после регистрации: приглашать
            самого себя бессмысленно.
          </li>
          <li>Дни складываются с текущей подпиской, а не заменяют её.</li>
        </ol>
      </div>
    </>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="border-shell-border bg-shell-panel rounded-2xl border p-5">
      <p className="text-shell-muted text-sm">{label}</p>
      <p
        className={`mt-2 text-3xl font-semibold tabular-nums ${
          accent && value > 0 ? "text-shell-accent" : "text-shell-fg"
        }`}
      >
        {value}
      </p>
    </div>
  )
}
