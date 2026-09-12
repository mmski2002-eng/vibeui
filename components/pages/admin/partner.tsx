import Link from "next/link"
import { notFound } from "next/navigation"

import { AdminHeading, Metric, Pill, Section } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { CopyLink } from "@/components/account/copy-link"
import { requireAdmin } from "@/lib/admin"
import {
  getInvite,
  partnerCode,
  referralsOf,
  referralTotals,
  visitsByCode,
  type ReferralRow,
} from "@/lib/partners"
import { SITE_URL } from "@/lib/seo"
import { resolveSubscription } from "@/lib/subscription-state"

const PAGE = 50

/** Аналитика по блогеру: обе его ссылки и список приведённых людей. */
export async function AdminPartner({
  id,
  before,
}: {
  id: string
  before?: string
}) {
  await requireAdmin()

  const t = ADMIN_TEXTS.partners
  const row = await getInvite(id)

  if (!row) {
    notFound()
  }

  const { invite } = row
  const partnerId = invite.claimedBy
  const cursor = before ? new Date(before) : undefined
  const validCursor =
    cursor && !Number.isNaN(cursor.getTime()) ? cursor : undefined

  const [inviteVisits, code, totals, rows] = await Promise.all([
    visitsByCode(invite.code),
    partnerId ? partnerCode(partnerId) : null,
    partnerId ? referralTotals(partnerId) : { total: 0, paid: 0 },
    partnerId
      ? referralsOf(partnerId, { before: validCursor, limit: PAGE + 1 })
      : [],
  ])
  const partnerVisits = code ? await visitsByCode(code) : 0

  const page = rows.slice(0, PAGE)
  const next = rows.length > PAGE ? page[page.length - 1]?.createdAt : null

  return (
    <>
      <AdminHeading
        title={invite.name}
        lead={
          partnerId
            ? `${t.registeredAt} ${invite.claimedAt?.toLocaleDateString("ru-RU") ?? ""} · ${row.partnerEmail}`
            : t.waiting
        }
        action={
          partnerId ? (
            <Link
              href={`/account/admin/users/${partnerId}`}
              className="border-shell-border text-shell-fg hover:border-shell-accent inline-flex h-10 items-center rounded-lg border px-4 text-sm transition-colors"
            >
              {t.account}
            </Link>
          ) : null
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label={t.inviteVisits} value={String(inviteVisits)} />
        <Metric label={t.partnerVisits} value={String(partnerVisits)} />
        <Metric label={t.referrals} value={String(totals.total)} />
        <Metric
          label={t.paid}
          value={String(totals.paid)}
          accent={totals.paid > 0}
        />
      </div>

      <Section title={t.inviteLink}>
        <CopyLink url={`${SITE_URL}/i/${invite.code}`} />
      </Section>

      {code ? (
        <Section title={t.partnerLink}>
          <CopyLink url={`${SITE_URL}/i/${code}`} />
        </Section>
      ) : null}

      <Section title={t.referralsTitle}>
        {page.length === 0 ? (
          <p className="text-shell-muted text-sm">{t.referralsEmpty}</p>
        ) : (
          <ul className="border-shell-border divide-y divide-[var(--shell-divider)] rounded-2xl border">
            {page.map((referral) => (
              <ReferralItem key={referral.id} referral={referral} />
            ))}
          </ul>
        )}

        {next ? (
          <Link
            href={`/account/admin/partners/${id}?before=${next.toISOString()}`}
            className="border-shell-border text-shell-fg hover:border-shell-accent mt-4 inline-flex h-10 items-center rounded-lg border px-4 text-sm transition-colors"
          >
            {t.more}
          </Link>
        ) : null}
      </Section>
    </>
  )
}

function ReferralItem({ referral }: { referral: ReferralRow }) {
  const t = ADMIN_TEXTS.partners
  const state = resolveSubscription(referral.subscription ?? undefined)
  const date = (value: Date) => value.toLocaleDateString("ru-RU")

  const status = !referral.firstPaidAt
    ? t.notPaid
    : state.kind === "expired"
      ? `${t.paidAt(date(referral.firstPaidAt))}, ${t.expired}`
      : state.kind === "cancelled"
        ? `${t.paidAt(date(referral.firstPaidAt))}, ${t.cancelled}, ${t.activeUntil(date(state.until))}`
        : "until" in state
          ? `${t.paidAt(date(referral.firstPaidAt))}, ${t.activeUntil(date(state.until))}`
          : t.paidAt(date(referral.firstPaidAt))

  return (
    <li className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 text-sm">
      <Link
        href={`/account/admin/users/${referral.id}`}
        className="min-w-0 flex-1"
      >
        <span className="text-shell-fg block truncate">{referral.email}</span>
        <span className="text-shell-muted block truncate text-xs">
          {referral.name}
        </span>
      </Link>
      <Pill tone={referral.firstPaidAt ? "solid" : "muted"}>{status}</Pill>
      {referral.paidTotal > 0 ? (
        <span className="text-shell-fg shrink-0 text-xs tabular-nums">
          {t.paidTotal}: {t.rub(referral.paidTotal)}
        </span>
      ) : null}
      <span className="text-shell-muted w-24 shrink-0 text-right text-xs tabular-nums">
        {date(referral.createdAt)}
      </span>
    </li>
  )
}
