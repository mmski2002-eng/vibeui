import "server-only"

import { randomBytes, randomUUID } from "node:crypto"
import { and, count, desc, eq, gte, inArray, isNull, lt, sql } from "drizzle-orm"

import { fillDays, lastDays } from "@/lib/days"
import { db } from "@/lib/db"
import {
  partnerInvite,
  partnerPayout,
  payoutRequest,
  payment,
  referral,
  referralVisit,
  subscription,
  user,
} from "@/lib/db/schema"

/**
 * Партнёрская программа.
 *
 * Партнёр — блогер, зарегистрировавшийся по приглашению администратора.
 * Только у него есть реферальный код; обычный пользователь ссылку не
 * получает. Признак партнёра не хранится в `user`: он выводится из
 * `partner_invite.claimed_by`, и второго источника правды нет.
 */

/** Восемь символов base64url: 48 бит, столкновение практически невозможно. */
export function newCode() {
  return randomBytes(6).toString("base64url").slice(0, 8)
}

export async function isPartner(userId: string) {
  const [row] = await db
    .select({ id: partnerInvite.id })
    .from(partnerInvite)
    .where(eq(partnerInvite.claimedBy, userId))
    .limit(1)

  return Boolean(row)
}

export type ResolvedCode =
  | { kind: "invite"; inviteId: string }
  | { kind: "referral"; partnerId: string }
  | null

/**
 * Что стоит за кодом из ссылки `/i/<код>`: незанятое приглашение блогера,
 * код партнёра — или ничего. Занятое приглашение и код бывшего «общего»
 * реферала возвращают null: ссылка блогера одноразовая, а старую программу
 * закрыли.
 */
export async function resolveCode(code: string): Promise<ResolvedCode> {
  const [invite] = await db
    .select({ id: partnerInvite.id })
    .from(partnerInvite)
    .where(and(eq(partnerInvite.code, code), isNull(partnerInvite.claimedBy)))
    .limit(1)

  if (invite) {
    return { kind: "invite", inviteId: invite.id }
  }

  const [own] = await db
    .select({ partnerId: referral.userId })
    .from(referral)
    .innerJoin(partnerInvite, eq(partnerInvite.claimedBy, referral.userId))
    .where(eq(referral.code, code))
    .limit(1)

  return own ? { kind: "referral", partnerId: own.partnerId } : null
}

/**
 * Блогер зарегистрировался: приглашение занято, ему заведён свой код.
 * Условие `claimed_by IS NULL` в update — защита от гонки двух регистраций
 * по одной ссылке: вторая ничего не обновит и партнёром не станет.
 */
export async function claimInvite(inviteId: string, userId: string) {
  const claimed = await db
    .update(partnerInvite)
    .set({ claimedBy: userId, claimedAt: new Date() })
    .where(and(eq(partnerInvite.id, inviteId), isNull(partnerInvite.claimedBy)))
    .returning({ id: partnerInvite.id })

  if (claimed.length === 0) {
    return
  }

  await db
    .insert(referral)
    .values({ code: newCode(), userId })
    .onConflictDoNothing()
}

/** Код партнёра. Партнёру он заведён при регистрации; остальным — null. */
export async function partnerCode(userId: string) {
  if (!(await isPartner(userId))) {
    return null
  }

  const [existing] = await db
    .select({ code: referral.code })
    .from(referral)
    .where(eq(referral.userId, userId))
    .limit(1)

  if (existing) {
    return existing.code
  }

  const code = newCode()

  await db.insert(referral).values({ code, userId })

  return code
}

export async function visitsByCode(code: string) {
  const [row] = await db
    .select({ value: count() })
    .from(referralVisit)
    .where(eq(referralVisit.code, code))

  return row?.value ?? 0
}

export type ReferralRow = {
  id: string
  name: string
  email: string
  createdAt: Date
  subscription: typeof subscription.$inferSelect | null
  /** Дата первого успешного платежа: «оплатил» значит именно это. */
  firstPaidAt: Date | null
  /** Сумма успешных платежей в рублях. */
  paidTotal: number
}

/** Рефералы партнёра с подпиской и платежами, новые сверху. */
export async function referralsOf(
  partnerId: string,
  { before, limit }: { before?: Date; limit: number },
): Promise<ReferralRow[]> {
  const paid = db
    .select({
      userId: payment.userId,
      firstPaidAt: sql<Date | null>`min(${payment.paidAt})`.as("first_paid_at"),
      paidTotal: sql<string>`coalesce(sum(${payment.amount}::numeric), 0)`.as(
        "paid_total",
      ),
    })
    .from(payment)
    .where(eq(payment.status, "succeeded"))
    .groupBy(payment.userId)
    .as("paid")

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      subscription,
      firstPaidAt: paid.firstPaidAt,
      paidTotal: paid.paidTotal,
    })
    .from(user)
    .leftJoin(subscription, eq(subscription.userId, user.id))
    .leftJoin(paid, eq(paid.userId, user.id))
    .where(
      and(
        eq(user.invitedBy, partnerId),
        before ? sql`${user.createdAt} < ${before}` : undefined,
      ),
    )
    .orderBy(desc(user.createdAt))
    .limit(limit)

  return rows.map((row) => ({
    ...row,
    firstPaidAt: row.firstPaidAt ? new Date(row.firstPaidAt) : null,
    paidTotal: Number(row.paidTotal ?? 0),
  }))
}

/** Счётчики по партнёру: сколько привёл, сколько из них платили. */
export async function referralTotals(partnerId: string) {
  const [row] = await db
    .select({
      total: sql<number>`count(distinct ${user.id})`,
      paid: sql<number>`count(distinct ${payment.userId})`,
    })
    .from(user)
    .leftJoin(
      payment,
      and(eq(payment.userId, user.id), eq(payment.status, "succeeded")),
    )
    .where(eq(user.invitedBy, partnerId))

  return { total: Number(row?.total ?? 0), paid: Number(row?.paid ?? 0) }
}

/**
 * Почта для кабинета партнёра: первые два символа и домен. Блогер должен
 * узнать своего подписчика, но не получить базу адресов.
 */
export function maskEmail(email: string) {
  const [local = "", domain = ""] = email.split("@")

  return `${local.slice(0, 2)}***@${domain}`
}

export type PartnerInviteRow = typeof partnerInvite.$inferSelect & {
  partnerEmail: string | null
  partnerName: string | null
  referrals: number
  referralsPaid: number
}

/** Все приглашения с итогами по каждому: страница списка у админа. */
export async function listInvites(): Promise<PartnerInviteRow[]> {
  const rows = await db
    .select({
      invite: partnerInvite,
      partnerEmail: user.email,
      partnerName: user.name,
    })
    .from(partnerInvite)
    .leftJoin(user, eq(user.id, partnerInvite.claimedBy))
    .orderBy(desc(partnerInvite.createdAt))

  const totals = await Promise.all(
    rows.map((row) =>
      row.invite.claimedBy
        ? referralTotals(row.invite.claimedBy)
        : Promise.resolve({ total: 0, paid: 0 }),
    ),
  )

  return rows.map((row, index) => ({
    ...row.invite,
    partnerEmail: row.partnerEmail,
    partnerName: row.partnerName,
    referrals: totals[index]?.total ?? 0,
    referralsPaid: totals[index]?.paid ?? 0,
  }))
}

export async function getInvite(id: string) {
  const [row] = await db
    .select({
      invite: partnerInvite,
      partnerEmail: user.email,
      partnerName: user.name,
      partnerCreatedAt: user.createdAt,
    })
    .from(partnerInvite)
    .leftJoin(user, eq(user.id, partnerInvite.claimedBy))
    .where(eq(partnerInvite.id, id))
    .limit(1)

  return row ?? null
}

export async function createInvite(name: string, createdBy: string) {
  const row = {
    id: randomUUID(),
    code: newCode(),
    name,
    createdBy,
  }

  await db.insert(partnerInvite).values(row)

  return row
}

/** Удалить можно только незанятое приглашение: за занятым стоит аккаунт. */
export async function deleteInvite(id: string) {
  const deleted = await db
    .delete(partnerInvite)
    .where(and(eq(partnerInvite.id, id), isNull(partnerInvite.claimedBy)))
    .returning({ id: partnerInvite.id })

  return deleted.length > 0
}

export type PayoutRow = typeof partnerPayout.$inferSelect

/** Реквизиты выплаты блогера для его кабинета. */
export async function payoutProfile(partnerId: string) {
  const [row] = await db
    .select({
      inn: partnerInvite.payoutInn,
      details: partnerInvite.payoutDetails,
    })
    .from(partnerInvite)
    .where(eq(partnerInvite.claimedBy, partnerId))
    .limit(1)

  return { inn: row?.inn ?? "", details: row?.details ?? "" }
}

/** Сумма и число выплат блогеру: «выплачено» в реестре. */
export async function payoutTotals(partnerId: string) {
  const [row] = await db
    .select({
      paid: sql<string>`coalesce(sum(${partnerPayout.amount}::numeric), 0)`,
      count: count(),
    })
    .from(partnerPayout)
    .where(eq(partnerPayout.partnerId, partnerId))

  return { paid: Number(row?.paid ?? 0), count: Number(row?.count ?? 0) }
}

/** Список выплат блогеру, новые сверху. */
export async function listPayouts(
  partnerId: string,
  limit = 50,
): Promise<PayoutRow[]> {
  return db
    .select()
    .from(partnerPayout)
    .where(eq(partnerPayout.partnerId, partnerId))
    .orderBy(desc(partnerPayout.createdAt))
    .limit(limit)
}

export type PayoutRequestRow = typeof payoutRequest.$inferSelect

/** Незакрытая заявка блогера на вывод (ожидает решения или согласована). */
export async function openPayoutRequest(partnerId: string) {
  const [row] = await db
    .select()
    .from(payoutRequest)
    .where(
      and(
        eq(payoutRequest.partnerId, partnerId),
        inArray(payoutRequest.status, ["pending", "approved"]),
      ),
    )
    .orderBy(desc(payoutRequest.createdAt))
    .limit(1)

  return row ?? null
}

export type AdminPayoutRequest = PayoutRequestRow & {
  partnerName: string | null
  partnerEmail: string | null
  payoutInn: string | null
  payoutDetails: string | null
}

/** Заявки на вывод для админской страницы, с данными блогера и реквизитами. */
export async function listPayoutRequests(
  statuses: string[],
  order: "asc" | "desc" = "asc",
  limit = 100,
): Promise<AdminPayoutRequest[]> {
  const rows = await db
    .select({
      request: payoutRequest,
      partnerName: user.name,
      partnerEmail: user.email,
      payoutInn: partnerInvite.payoutInn,
      payoutDetails: partnerInvite.payoutDetails,
    })
    .from(payoutRequest)
    .leftJoin(user, eq(user.id, payoutRequest.partnerId))
    .leftJoin(partnerInvite, eq(partnerInvite.claimedBy, payoutRequest.partnerId))
    .where(inArray(payoutRequest.status, statuses))
    // Активные — старые сверху (очередь), решённые — новые сверху.
    .orderBy(order === "asc" ? payoutRequest.createdAt : desc(payoutRequest.createdAt))
    .limit(limit)

  return rows.map((row) => ({
    ...row.request,
    partnerName: row.partnerName,
    partnerEmail: row.partnerEmail,
    payoutInn: row.payoutInn,
    payoutDetails: row.payoutDetails,
  }))
}

/** Сколько заявок ждёт решения: для бейджа в навигации. */
export async function pendingPayoutCount() {
  const [row] = await db
    .select({ value: count() })
    .from(payoutRequest)
    .where(eq(payoutRequest.status, "pending"))

  return Number(row?.value ?? 0)
}

export type PartnerPeriod = 30 | 90

/**
 * Динамика партнёра за период: переходы и регистрации по дням, итоги
 * периода и такого же периода до него — для стрелок изменения.
 */
export async function partnerStats(
  partnerId: string,
  code: string,
  days: PartnerPeriod,
  now = new Date(),
) {
  const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  const before = new Date(from.getTime() - days * 24 * 60 * 60 * 1000)

  const [visitsByDay, signupsByDay, current, previous, paidByDay] =
    await Promise.all([
      db
        .select({
          day: sql<string>`to_char(date_trunc('day', ${referralVisit.landedAt}), 'YYYY-MM-DD')`,
          value: count(),
        })
        .from(referralVisit)
        .where(and(eq(referralVisit.code, code), gte(referralVisit.landedAt, from)))
        .groupBy(sql`date_trunc('day', ${referralVisit.landedAt})`),
      db
        .select({
          day: sql<string>`to_char(date_trunc('day', ${user.createdAt}), 'YYYY-MM-DD')`,
          value: count(),
        })
        .from(user)
        .where(and(eq(user.invitedBy, partnerId), gte(user.createdAt, from)))
        .groupBy(sql`date_trunc('day', ${user.createdAt})`),
      periodTotals(partnerId, code, from, now),
      periodTotals(partnerId, code, before, from),
      db
        .select({
          day: sql<string>`to_char(date_trunc('day', ${payment.paidAt}), 'YYYY-MM-DD')`,
          value: sql<number>`count(distinct ${payment.userId})`,
        })
        .from(payment)
        .innerJoin(user, eq(user.id, payment.userId))
        .where(
          and(
            eq(user.invitedBy, partnerId),
            eq(payment.status, "succeeded"),
            gte(payment.paidAt, from),
          ),
        )
        .groupBy(sql`date_trunc('day', ${payment.paidAt})`),
    ])

  const range = lastDays(days, now)

  return {
    visitsByDay: fillDays(range, visitsByDay),
    signupsByDay: fillDays(range, signupsByDay),
    paidByDay: fillDays(range, paidByDay),
    current,
    previous,
  }
}

async function periodTotals(
  partnerId: string,
  code: string,
  from: Date,
  to: Date,
) {
  const [visits, signups, paid] = await Promise.all([
    db
      .select({ value: count() })
      .from(referralVisit)
      .where(
        and(
          eq(referralVisit.code, code),
          gte(referralVisit.landedAt, from),
          lt(referralVisit.landedAt, to),
        ),
      ),
    db
      .select({ value: count() })
      .from(user)
      .where(
        and(
          eq(user.invitedBy, partnerId),
          gte(user.createdAt, from),
          lt(user.createdAt, to),
        ),
      ),
    db
      .select({ value: sql<number>`count(distinct ${payment.userId})` })
      .from(payment)
      .innerJoin(user, eq(user.id, payment.userId))
      .where(
        and(
          eq(user.invitedBy, partnerId),
          eq(payment.status, "succeeded"),
          gte(payment.paidAt, from),
          lt(payment.paidAt, to),
        ),
      ),
  ])

  return {
    visits: visits[0]?.value ?? 0,
    signups: signups[0]?.value ?? 0,
    paid: Number(paid[0]?.value ?? 0),
  }
}
