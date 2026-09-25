/**
 * Вливает аккаунты vibeui.club в базу vibeui.ru.
 *
 * Канонический пользователь — тот, что уже есть на .ru с тем же email.
 * Сессии и коды подтверждения не переносятся: после склейки люди входят паролем.
 * Настройки сайта и стартовые лайки каталога не трогаются.
 *
 * По умолчанию только отчёт. Запись — APPLY=1.
 *
 *   CLUB_DATABASE_URL=postgres://.../vibeui_club \
 *   RU_DATABASE_URL=postgres://.../vibeui \
 *   node scripts/merge-club-db.mjs
 *
 * Клубную базу удобно поднять рядом на том же Postgres:
 *   createdb vibeui_club_import && pg_restore -d vibeui_club_import club.dump
 */
import { randomBytes } from "node:crypto"
import postgres from "postgres"

const clubUrl = process.env.CLUB_DATABASE_URL
const ruUrl = process.env.RU_DATABASE_URL
const apply = process.env.APPLY === "1"

if (!clubUrl || !ruUrl) {
  console.error("Нужны CLUB_DATABASE_URL и RU_DATABASE_URL")
  process.exit(1)
}

const club = postgres(clubUrl, { max: 1 })
const ru = postgres(ruUrl, { max: 1 })

const report = {
  clubUsers: 0,
  ruUsers: 0,
  inserted: 0,
  merged: 0,
  idRewritten: 0,
  subscriptionsKeptLater: 0,
  payments: 0,
  droppedReferralCodes: [],
  blockedCodes: [],
}

function emailKey(email) {
  return String(email ?? "").trim().toLowerCase()
}

function newId() {
  return `m${randomBytes(12).toString("hex")}`
}

function later(a, b) {
  return new Date(a).getTime() > new Date(b).getTime()
}

async function main() {
  const [clubUsers, ruUsers] = await Promise.all([
    club`select * from "user"`,
    ru`select * from "user"`,
  ])

  report.clubUsers = clubUsers.length
  report.ruUsers = ruUsers.length

  const ruByEmail = new Map(ruUsers.map((row) => [emailKey(row.email), row]))
  const ruIds = new Set(ruUsers.map((row) => row.id))
  const idMap = new Map()

  for (const row of clubUsers) {
    const same = ruByEmail.get(emailKey(row.email))

    if (same) {
      idMap.set(row.id, same.id)
      report.merged += 1
      continue
    }

    if (ruIds.has(row.id)) {
      const fresh = newId()
      idMap.set(row.id, fresh)
      ruIds.add(fresh)
      report.idRewritten += 1
      report.inserted += 1
      continue
    }

    idMap.set(row.id, row.id)
    ruIds.add(row.id)
    report.inserted += 1
  }

  const mapUser = (id) => (id == null ? null : (idMap.get(id) ?? id))

  const [
    clubAccounts,
    ruAccounts,
    clubSubs,
    ruSubs,
    clubPayments,
    ruPaymentIds,
    clubTokens,
    ruTokenHashes,
    clubUsage,
    clubFavorites,
    clubInvites,
    ruInviteCodes,
    ruPromoCodes,
    clubPayouts,
    clubPayoutRequests,
    clubReferrals,
    ruReferrals,
    clubVisits,
    clubReports,
    clubMessages,
    clubSearches,
    clubWebhooks,
    ruWebhookIds,
  ] = await Promise.all([
    club`select * from account`,
    ru`select * from account`,
    club`select * from subscription`,
    ru`select * from subscription`,
    club`select * from payment`,
    ru`select yookassa_id from payment`,
    club`select * from registry_token`,
    ru`select token_hash from registry_token`,
    club`select * from usage`,
    club`select * from favorite`,
    club`select * from partner_invite`,
    ru`select code from partner_invite`,
    ru`select promo_code from partner_invite where promo_code is not null`,
    club`select * from partner_payout`,
    club`select * from payout_request`,
    club`select * from referral`,
    ru`select * from referral`,
    club`select * from referral_visit`,
    club`select * from report`,
    club`select * from report_message`,
    club`select * from search_query`,
    club`select * from webhook_event`,
    ru`select id from webhook_event`,
  ])

  const ruAccountByUser = new Map(ruAccounts.map((row) => [row.user_id, row]))
  const ruSubByUser = new Map(ruSubs.map((row) => [row.user_id, row]))
  const takenPayment = new Set(ruPaymentIds.map((row) => row.yookassa_id))
  const takenHash = new Set(ruTokenHashes.map((row) => row.token_hash))
  const takenInvite = new Set(ruInviteCodes.map((row) => row.code))
  const takenPromo = new Set(ruPromoCodes.map((row) => row.promo_code))
  const ruReferralByUser = new Map(ruReferrals.map((row) => [row.user_id, row]))
  const takenReferral = new Set(ruReferrals.map((row) => row.code))
  const takenWebhook = new Set(ruWebhookIds.map((row) => row.id))

  for (const row of clubInvites) {
    if (takenInvite.has(row.code) || (row.promo_code && takenPromo.has(row.promo_code))) {
      report.blockedCodes.push(row.code)
    }
  }

  for (const row of clubReferrals) {
    const target = mapUser(row.user_id)
    const existing = ruReferralByUser.get(target)

    if (existing && existing.code !== row.code) {
      report.droppedReferralCodes.push(row.code)
    } else if (!existing && takenReferral.has(row.code)) {
      report.blockedCodes.push(row.code)
    }
  }

  console.log(JSON.stringify(report, null, 2))

  if (!apply) {
    console.log("Сухой прогон. Запись не делалась. Для влива: APPLY=1")
    if (report.blockedCodes.length) process.exitCode = 2
    return
  }

  if (report.blockedCodes.length) {
    console.error("Стоп: коды приглашений или рефералок уже заняты другим человеком")
    process.exit(2)
  }

  await ru.begin(async (tx) => {
    for (const row of clubUsers) {
      const target = idMap.get(row.id)
      const same = ruByEmail.get(emailKey(row.email))

      if (same) continue

      await tx`
        insert into "user" (
          id, name, email, email_verified, image, created_at, updated_at,
          invited_by, consent_at, consent_version, locale,
          blocked_at, blocked_reason, admin_note
        ) values (
          ${target}, ${row.name}, ${row.email}, ${row.email_verified}, ${row.image},
          ${row.created_at}, ${row.updated_at}, ${mapUser(row.invited_by)},
          ${row.consent_at}, ${row.consent_version}, ${row.locale},
          ${row.blocked_at}, ${row.blocked_reason}, ${row.admin_note}
        )
      `
    }

    for (const row of clubAccounts) {
      const userId = mapUser(row.user_id)
      const existing = ruAccountByUser.get(userId)

      if (existing) {
        if (!existing.password && row.password) {
          await tx`update account set password = ${row.password} where id = ${existing.id}`
        }
        continue
      }

      await tx`
        insert into account (
          id, user_id, account_id, provider_id, access_token, refresh_token,
          access_token_expires_at, refresh_token_expires_at, scope, id_token,
          password, created_at, updated_at
        ) values (
          ${row.id}, ${userId}, ${row.account_id}, ${row.provider_id},
          ${row.access_token}, ${row.refresh_token},
          ${row.access_token_expires_at}, ${row.refresh_token_expires_at},
          ${row.scope}, ${row.id_token}, ${row.password},
          ${row.created_at}, ${row.updated_at}
        )
        on conflict (id) do nothing
      `
    }

    for (const row of clubSubs) {
      const userId = mapUser(row.user_id)
      const existing = ruSubByUser.get(userId)

      if (!existing) {
        await tx`
          insert into subscription (
            id, user_id, plan, status, current_period_end, cancel_at_period_end,
            payment_method_id, failed_attempts, created_at, updated_at
          ) values (
            ${row.id}, ${userId}, ${row.plan}, ${row.status}, ${row.current_period_end},
            ${row.cancel_at_period_end}, ${row.payment_method_id}, ${row.failed_attempts},
            ${row.created_at}, ${row.updated_at}
          )
          on conflict (id) do nothing
        `
        continue
      }

      if (later(row.current_period_end, existing.current_period_end)) {
        report.subscriptionsKeptLater += 1
        await tx`
          update subscription set
            plan = ${row.plan},
            status = ${row.status},
            current_period_end = ${row.current_period_end},
            cancel_at_period_end = ${row.cancel_at_period_end},
            updated_at = now()
          where id = ${existing.id}
        `
      }
    }

    for (const row of clubPayments) {
      if (takenPayment.has(row.yookassa_id)) continue
      report.payments += 1
      await tx`
        insert into payment (
          id, user_id, yookassa_id, amount, currency, status, paid_at,
          receipt_status, receipt_url, payload, created_at,
          list_amount, promo_code, promo_percent, partner_id
        ) values (
          ${row.id}, ${mapUser(row.user_id)}, ${row.yookassa_id}, ${row.amount},
          ${row.currency}, ${row.status}, ${row.paid_at}, ${row.receipt_status},
          ${row.receipt_url}, ${tx.json(row.payload)}, ${row.created_at},
          ${row.list_amount}, ${row.promo_code}, ${row.promo_percent},
          ${mapUser(row.partner_id)}
        )
        on conflict (id) do nothing
      `
    }

    for (const row of clubTokens) {
      if (takenHash.has(row.token_hash)) continue
      await tx`
        insert into registry_token (
          id, user_id, token_hash, prefix, last_used_at, revoked_at, created_at
        ) values (
          ${row.id}, ${mapUser(row.user_id)}, ${row.token_hash}, ${row.prefix},
          ${row.last_used_at}, ${row.revoked_at}, ${row.created_at}
        )
        on conflict (id) do nothing
      `
    }

    for (const row of clubUsage) {
      await tx`
        insert into usage (user_id, period, item_name, first_used_at)
        values (${mapUser(row.user_id)}, ${row.period}, ${row.item_name}, ${row.first_used_at})
        on conflict do nothing
      `
    }

    for (const row of clubFavorites) {
      await tx`
        insert into favorite (user_id, item_name, created_at)
        values (${mapUser(row.user_id)}, ${row.item_name}, ${row.created_at})
        on conflict do nothing
      `
    }

    for (const row of clubInvites) {
      if (takenInvite.has(row.code)) continue
      await tx`
        insert into partner_invite (
          id, code, name, created_by, created_at, claimed_by, claimed_at,
          promo_code, promo_percent, promo_active, payout_inn, payout_details, payout_receipt
        ) values (
          ${row.id}, ${row.code}, ${row.name}, ${mapUser(row.created_by) ?? row.created_by},
          ${row.created_at}, ${mapUser(row.claimed_by)}, ${row.claimed_at},
          ${row.promo_code}, ${row.promo_percent}, ${row.promo_active},
          ${row.payout_inn}, ${row.payout_details}, ${row.payout_receipt}
        )
        on conflict (id) do nothing
      `
    }

    for (const row of clubPayouts) {
      await tx`
        insert into partner_payout (id, partner_id, amount, note, created_by, created_at)
        values (
          ${row.id}, ${mapUser(row.partner_id)}, ${row.amount}, ${row.note},
          ${row.created_by}, ${row.created_at}
        )
        on conflict (id) do nothing
      `
    }

    for (const row of clubPayoutRequests) {
      await tx`
        insert into payout_request (
          id, partner_id, amount, status, note, receipt_url, created_at,
          approved_at, approved_by, resolved_at, resolved_by
        ) values (
          ${row.id}, ${mapUser(row.partner_id)}, ${row.amount}, ${row.status},
          ${row.note}, ${row.receipt_url}, ${row.created_at}, ${row.approved_at},
          ${row.approved_by}, ${row.resolved_at}, ${row.resolved_by}
        )
        on conflict (id) do nothing
      `
    }

    for (const row of clubReferrals) {
      const userId = mapUser(row.user_id)
      if (ruReferralByUser.has(userId) || takenReferral.has(row.code)) continue
      await tx`
        insert into referral (code, user_id, created_at)
        values (${row.code}, ${userId}, ${row.created_at})
        on conflict do nothing
      `
    }

    for (const row of clubVisits) {
      await tx`
        insert into referral_visit (id, code, visitor_id, landed_at)
        values (${row.id}, ${row.code}, ${row.visitor_id}, ${row.landed_at})
        on conflict (id) do nothing
      `
    }

    for (const row of clubReports) {
      await tx`
        insert into report (
          id, kind, status, subject, message, item_name, user_id, email, locale,
          ip_hash, assignee_email, created_at, updated_at, closed_at
        ) values (
          ${row.id}, ${row.kind}, ${row.status}, ${row.subject}, ${row.message},
          ${row.item_name}, ${mapUser(row.user_id)}, ${row.email}, ${row.locale},
          ${row.ip_hash}, ${row.assignee_email}, ${row.created_at}, ${row.updated_at},
          ${row.closed_at}
        )
        on conflict (id) do nothing
      `
    }

    for (const row of clubMessages) {
      await tx`
        insert into report_message (
          id, report_id, author_type, author_email, body, delivered_by_email, created_at
        ) values (
          ${row.id}, ${row.report_id}, ${row.author_type}, ${row.author_email},
          ${row.body}, ${row.delivered_by_email}, ${row.created_at}
        )
        on conflict (id) do nothing
      `
    }

    for (const row of clubSearches) {
      await tx`
        insert into search_query (id, query, locale, kind, results, user_id, created_at)
        values (
          ${row.id}, ${row.query}, ${row.locale}, ${row.kind}, ${row.results},
          ${mapUser(row.user_id)}, ${row.created_at}
        )
        on conflict (id) do nothing
      `
    }

    for (const row of clubWebhooks) {
      if (takenWebhook.has(row.id)) continue
      await tx`
        insert into webhook_event (id, type, received_at, processed_at, payload)
        values (
          ${row.id}, ${row.type}, ${row.received_at}, ${row.processed_at},
          ${tx.json(row.payload)}
        )
        on conflict (id) do nothing
      `
    }
  })

  console.log("Влито.")
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await Promise.all([club.end(), ru.end()])
  })
