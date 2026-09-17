import Link from "next/link"
import { Handshake } from "lucide-react"

import {
  CreateInviteForm,
  DeleteInviteButton,
} from "@/components/admin/partner-actions"
import { AdminHeading } from "@/components/admin/parts"
import { ADMIN_TEXTS } from "@/components/admin/texts"
import { CopyLink } from "@/components/account/copy-link"
import { EmptyState } from "@/components/account/ui/empty-state"
import { Panel } from "@/components/account/ui/panel"
import { StatusPill } from "@/components/account/ui/status-pill"
import { formatDate } from "@/lib/format"
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
        <div className="mt-6">
          <EmptyState index={2} icon={<Handshake />} title={t.empty} />
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {invites.map((invite, position) => (
            <Panel
              key={invite.id}
              as="li"
              index={position + 2}
              className="acc-lift grid gap-3 p-4 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <Link
                  href={`/account/admin/partners/${invite.id}`}
                  className="text-shell-fg hover:text-shell-accent-text min-w-0 flex-1 truncate font-medium transition-colors"
                >
                  {invite.name}
                </Link>
                {invite.promoCode ? (
                  <span
                    className={`font-mono text-xs ${invite.promoActive ? "text-shell-fg" : "text-shell-muted line-through"}`}
                    title={invite.promoActive ? t.promoCode : `${t.promoCode}: ${t.promoOff}`}
                  >
                    {invite.promoCode}
                  </span>
                ) : null}
                {invite.claimedBy ? (
                  <StatusPill tone="ok" dot>{t.claimed}</StatusPill>
                ) : (
                  <StatusPill tone="muted">{t.notClaimed}</StatusPill>
                )}
                <span className="text-shell-muted shrink-0 text-xs tabular-nums">
                  {t.referrals}: <span className="text-shell-fg">{invite.referrals}</span> · {t.paid}:{" "}
                  <span className="text-shell-fg">{invite.referralsPaid}</span>
                </span>
                <span className="text-shell-muted w-24 shrink-0 text-right text-xs tabular-nums">
                  {formatDate(invite.createdAt)}
                </span>
                {invite.claimedBy ? null : (
                  <DeleteInviteButton id={invite.id} />
                )}
              </div>
              {invite.claimedBy ? (
                <p className="text-shell-muted truncate text-xs">
                  {invite.partnerEmail}
                  {invite.claimedAt ? ` · ${formatDate(invite.claimedAt)}` : null}
                </p>
              ) : (
                <CopyLink url={`${SITE_URL}/?ref=${invite.code}`} />
              )}
            </Panel>
          ))}
        </ul>
      )}
    </>
  )
}
