import Link from "next/link"

import {
  CreateInviteForm,
  DeleteInviteButton,
} from "@/components/admin/partner-actions"
import { AdminHeading, Pill } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { CopyLink } from "@/components/account/copy-link"
import { requireAdmin } from "@/lib/admin"
import { listInvites } from "@/lib/partners"
import { SITE_URL } from "@/lib/seo"

/** Список приглашений блогеров: кто зарегистрировался, кого привёл. */
export async function AdminPartners() {
  await requireAdmin()

  const t = ADMIN_TEXTS.partners
  const invites = await listInvites()

  return (
    <>
      <AdminHeading title={t.title} lead={t.lead} />

      <CreateInviteForm />

      {invites.length === 0 ? (
        <p className="text-shell-muted mt-6 text-sm">{t.empty}</p>
      ) : (
        <ul className="border-shell-border mt-6 divide-y divide-[var(--shell-divider)] rounded-2xl border">
          {invites.map((invite) => (
            <li key={invite.id} className="grid gap-3 px-4 py-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <Link
                  href={`/account/admin/partners/${invite.id}`}
                  className="text-shell-fg hover:text-shell-accent-text min-w-0 flex-1 truncate font-medium transition-colors"
                >
                  {invite.name}
                </Link>
                {invite.claimedBy ? (
                  <Pill tone="solid">{t.claimed}</Pill>
                ) : (
                  <Pill>{t.notClaimed}</Pill>
                )}
                <span className="text-shell-muted shrink-0 text-xs tabular-nums">
                  {t.referrals}: {invite.referrals} · {t.paid}:{" "}
                  {invite.referralsPaid}
                </span>
                <span className="text-shell-muted w-24 shrink-0 text-right text-xs tabular-nums">
                  {invite.createdAt.toLocaleDateString("ru-RU")}
                </span>
                {invite.claimedBy ? null : (
                  <DeleteInviteButton id={invite.id} />
                )}
              </div>
              {invite.claimedBy ? (
                <p className="text-shell-muted truncate text-xs">
                  {invite.partnerEmail}
                  {invite.claimedAt
                    ? ` · ${invite.claimedAt.toLocaleDateString("ru-RU")}`
                    : null}
                </p>
              ) : (
                <CopyLink url={`${SITE_URL}/i/${invite.code}`} />
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
