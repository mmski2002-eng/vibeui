import { count, eq } from "drizzle-orm"

import { CopyLink } from "@/components/account/copy-link"
import { db } from "@/lib/db"
import { referralReward, referralVisit } from "@/lib/db/schema"
import { ensureReferralCode } from "@/lib/account-actions"
import { requireUser } from "@/lib/session"
import { SITE_URL } from "@/lib/seo"

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

  const paid = rewards[0]?.value ?? 0

  return (
    <>
      <h1 className="text-shell-fg text-2xl font-semibold tracking-tight">
        Приглашения
      </h1>
      <p className="text-shell-muted mt-2 max-w-2xl text-sm leading-relaxed">
        За каждого приглашённого, который оплатит подписку, вы получаете 14 дней
        Pro, а он — 7 дней сверх оплаченного периода.
      </p>

      <CopyLink url={`${SITE_URL}/i/${code}`} />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Переходов" value={visits[0]?.value ?? 0} />
        <Stat label="Оплатили" value={paid} />
        <Stat label="Дней Pro начислено" value={paid * 14} />
      </div>
    </>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-shell-border bg-shell-panel rounded-2xl border p-5">
      <p className="text-shell-muted text-xs font-medium tracking-wide uppercase">
        {label}
      </p>
      <p className="text-shell-fg mt-2 text-xl font-semibold">{value}</p>
    </div>
  )
}
