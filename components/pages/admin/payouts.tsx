import Link from "next/link"
import { Wallet } from "lucide-react"

import { AdminHeading, Pill, Section } from "@/components/admin/parts"
import { getAdminTexts } from "@/components/admin/texts"
import { EmptyState } from "@/components/account/ui/empty-state"
import { PayoutRequestActions } from "@/components/admin/payout-request-actions"
import { requireAdmin } from "@/lib/admin"
import { isEthereumPayout } from "@/lib/payout-method"
import { listPayoutRequests, type AdminPayoutRequest } from "@/lib/partners"

const rub = (value: string | number, locale: "ru" | "en") =>
  `${Number(value).toLocaleString(locale === "en" ? "en-US" : "ru-RU")} ₽`
const date = (value: Date | null, locale: "ru" | "en") =>
  value ? value.toLocaleDateString(locale === "en" ? "en-US" : "ru-RU") : ""

const STATUS_TONE: Record<string, "ok" | "muted" | "danger"> = {
  pending: "muted",
  approved: "ok",
  paid: "ok",
  rejected: "danger",
}

function statusLabel(status: string, locale: "ru" | "en") {
  const labels =
    locale === "en"
      ? {
          pending: "new",
          approved: "approved",
          paid: "paid",
          rejected: "rejected",
        }
      : {
          pending: "новая",
          approved: "согласована",
          paid: "выплачена",
          rejected: "отклонена",
        }
  return labels[status as keyof typeof labels] ?? status
}

/** Страница заявок блогеров на вывод: очередь на решение и история. */
export async function AdminPayouts({
  locale = "ru",
}: { locale?: "ru" | "en" } = {}) {
  await requireAdmin()

  const t = getAdminTexts(locale).payouts
  const [active, resolved] = await Promise.all([
    listPayoutRequests(["pending", "approved"], "asc"),
    listPayoutRequests(["paid", "rejected"], "desc", 30),
  ])

  return (
    <>
      <AdminHeading title={t.title} lead={t.lead} />

      {active.length === 0 ? (
        <div className="mt-6">
          <EmptyState index={1} icon={<Wallet />} title={t.empty} />
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {active.map((request, position) => (
            <ActiveRow
              key={request.id}
              request={request}
              index={position + 1}
              locale={locale}
            />
          ))}
        </ul>
      )}

      {resolved.length > 0 ? (
        <Section title={t.historyTitle}>
          <ul className="border-shell-border bg-shell-panel divide-shell-divider divide-y rounded-2xl border">
            {resolved.map((request) => (
              <li
                key={request.id}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 py-3 text-sm"
              >
                <span className="text-shell-fg min-w-0 flex-1 truncate">
                  {request.partnerName ?? request.partnerEmail}
                </span>
                <span className="text-shell-fg shrink-0 font-medium tabular-nums">
                  {rub(request.amount, locale)}
                </span>
                <Pill tone={STATUS_TONE[request.status] ?? "muted"}>
                  {statusLabel(request.status, locale)}
                </Pill>
                {request.receiptUrl ? (
                  <a
                    href={request.receiptUrl}
                    target="_blank"
                    rel="noopener"
                    className="text-shell-accent-text shrink-0 text-xs hover:underline"
                  >
                    {t.receipt}
                  </a>
                ) : null}
                <span className="text-shell-muted w-24 shrink-0 text-right text-xs tabular-nums">
                  {date(request.resolvedAt, locale)}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  )
}

function ActiveRow({
  request,
  index,
  locale,
}: {
  request: AdminPayoutRequest
  index: number
  locale: "ru" | "en"
}) {
  const t = getAdminTexts(locale).payouts
  const ethereumPayout = isEthereumPayout(request.payoutInn)

  return (
    <li
      className="border-shell-border bg-shell-panel acc-shadow acc-reveal grid gap-3 rounded-2xl border p-4"
      style={{ ["--i" as string]: index }}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Link
          href={`/account/admin/users/${request.partnerId}`}
          className="text-shell-fg hover:text-shell-accent-text min-w-0 flex-1 truncate font-medium transition-colors"
        >
          {request.partnerName ?? request.partnerEmail}
        </Link>
        <span className="text-shell-fg shrink-0 text-lg font-semibold tabular-nums">
          {rub(request.amount, locale)}
        </span>
        <Pill tone={STATUS_TONE[request.status] ?? "muted"}>
          {statusLabel(request.status, locale)}
        </Pill>
        <span className="text-shell-muted w-24 shrink-0 text-right text-xs tabular-nums">
          {date(request.createdAt, locale)}
        </span>
      </div>

      <p className="text-shell-muted text-xs">
        {ethereumPayout ? "Network" : t.inn}:{" "}
        <span className="text-shell-fg">
          {ethereumPayout ? "Ethereum (USDC)" : (request.payoutInn ?? "—")}
        </span>{" "}
        · {ethereumPayout ? "Wallet" : t.details}:{" "}
        <span className="text-shell-fg">{request.payoutDetails ?? "—"}</span>
      </p>

      <PayoutRequestActions
        id={request.id}
        status={request.status}
        requiresReceipt={!ethereumPayout}
        locale={locale}
      />
    </li>
  )
}
