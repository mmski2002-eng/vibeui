import "server-only"

import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  gt,
  gte,
  isNotNull,
  lt,
  sql,
  sum,
} from "drizzle-orm"

import { fillDays, lastDays } from "@/lib/days"
import { db } from "@/lib/db"
import {
  payment,
  referralVisit,
  searchQuery,
  subscription,
  usage,
  user,
} from "@/lib/db/schema"
import { FREE_MONTHLY_LIMIT, currentPeriod } from "@/lib/entitlements"

/**
 * Числа для сводки администратора.
 *
 * Всё считается в SQL: выгружать таблицы в память и складывать в JavaScript
 * на сервере с одним ядром — самый дешёвый способ уронить сайт. Каждый
 * список ограничен сверху, у каждой выборки есть индекс.
 */

export type Period = 7 | 30 | 90

export function periodStart(days: Period, now = new Date()) {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
}

export type MoneyStats = {
  revenue: number
  revenueBefore: number
  payments: number
  average: number
  activeSubs: number
  cancelling: number
  stuck: number
  failing: number
}

export async function moneyStats(days: Period, now = new Date()) {
  const from = periodStart(days, now)
  const before = periodStart(days, from)
  const stuckSince = new Date(now.getTime() - 30 * 60 * 1000)

  const [current, previous, subs, stuck] = await Promise.all([
    db
      .select({
        total: sum(sql`cast(${payment.amount} as numeric)`),
        rows: count(),
      })
      .from(payment)
      .where(and(eq(payment.status, "succeeded"), gte(payment.createdAt, from))),
    db
      .select({ total: sum(sql`cast(${payment.amount} as numeric)`) })
      .from(payment)
      .where(
        and(
          eq(payment.status, "succeeded"),
          gte(payment.createdAt, before),
          lt(payment.createdAt, from),
        ),
      ),
    db
      .select({
        active: count(),
        cancelling: sql<number>`count(*) filter (where ${subscription.cancelAtPeriodEnd})`,
        failing: sql<number>`count(*) filter (where ${subscription.failedAttempts} > 0)`,
      })
      .from(subscription)
      .where(
        and(
          eq(subscription.status, "active"),
          gt(subscription.currentPeriodEnd, now),
        ),
      ),
    db
      .select({ value: count() })
      .from(payment)
      .where(
        and(eq(payment.status, "pending"), lt(payment.createdAt, stuckSince)),
      ),
  ])

  const revenue = Number(current[0]?.total ?? 0)
  const payments = current[0]?.rows ?? 0

  return {
    revenue,
    revenueBefore: Number(previous[0]?.total ?? 0),
    payments,
    average: payments > 0 ? Math.round(revenue / payments) : 0,
    activeSubs: subs[0]?.active ?? 0,
    cancelling: Number(subs[0]?.cancelling ?? 0),
    failing: Number(subs[0]?.failing ?? 0),
    stuck: stuck[0]?.value ?? 0,
  } satisfies MoneyStats
}

export type PeopleStats = {
  signups: number
  verified: number
  active: number
  exhausted: number
  newPro: number
  churn: number
  byDay: { day: string; value: number }[]
}

export async function peopleStats(days: Period, now = new Date()) {
  const from = periodStart(days, now)
  const period = currentPeriod(now)

  const [signups, byDay, active, exhausted, pro, churn] = await Promise.all([
    db
      .select({
        total: count(),
        verified: sql<number>`count(*) filter (where ${user.emailVerified})`,
      })
      .from(user)
      .where(gte(user.createdAt, from)),
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${user.createdAt}), 'YYYY-MM-DD')`,
        value: count(),
      })
      .from(user)
      .where(gte(user.createdAt, from))
      .groupBy(sql`date_trunc('day', ${user.createdAt})`)
      .orderBy(sql`date_trunc('day', ${user.createdAt})`),
    db
      .select({ value: countDistinct(usage.userId) })
      .from(usage)
      .where(gte(usage.firstUsedAt, from)),
    // Упёрлись в лимит: у кого в текущем месяце столько же строк, сколько
    // даёт бесплатный тариф. Это лист ожидания Pro, а не жалоба.
    db
      .select({ value: count() })
      .from(
        db
          .select({ userId: usage.userId })
          .from(usage)
          .where(eq(usage.period, period))
          .groupBy(usage.userId)
          .having(gte(count(), FREE_MONTHLY_LIMIT))
          .as("exhausted"),
      ),
    db
      .select({ value: count() })
      .from(subscription)
      .where(gte(subscription.createdAt, from)),
    db
      .select({ value: count() })
      .from(subscription)
      .where(
        and(
          eq(subscription.cancelAtPeriodEnd, true),
          gte(subscription.updatedAt, from),
        ),
      ),
  ])

  return {
    signups: signups[0]?.total ?? 0,
    verified: Number(signups[0]?.verified ?? 0),
    active: active[0]?.value ?? 0,
    exhausted: exhausted[0]?.value ?? 0,
    newPro: pro[0]?.value ?? 0,
    churn: churn[0]?.value ?? 0,
    byDay: byDay.map((row) => ({ day: row.day, value: row.value })),
  } satisfies PeopleStats
}

export type DiscoveryStats = {
  top: { query: string; value: number }[]
  empty: { query: string; value: number }[]
  visits: number
  invited: number
  invitedPaid: number
}

export async function discoveryStats(days: Period, now = new Date()) {
  const from = periodStart(days, now)

  const [top, empty, visits, invited, invitedPaid] = await Promise.all([
    db
      .select({ query: searchQuery.query, value: count() })
      .from(searchQuery)
      .where(gte(searchQuery.createdAt, from))
      .groupBy(searchQuery.query)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({ query: searchQuery.query, value: count() })
      .from(searchQuery)
      .where(and(gte(searchQuery.createdAt, from), eq(searchQuery.results, 0)))
      .groupBy(searchQuery.query)
      .orderBy(desc(count()))
      .limit(10),
    db
      .select({ value: count() })
      .from(referralVisit)
      .where(gte(referralVisit.landedAt, from)),
    db
      .select({ value: count() })
      .from(user)
      .where(and(gte(user.createdAt, from), isNotNull(user.invitedBy))),
    db
      .select({ value: sql<number>`count(distinct ${payment.userId})` })
      .from(payment)
      .innerJoin(user, eq(user.id, payment.userId))
      .where(
        and(
          gte(payment.paidAt, from),
          eq(payment.status, "succeeded"),
          isNotNull(user.invitedBy),
        ),
      ),
  ])

  return {
    top,
    empty,
    visits: visits[0]?.value ?? 0,
    invited: invited[0]?.value ?? 0,
    invitedPaid: Number(invitedPaid[0]?.value ?? 0),
  } satisfies DiscoveryStats
}

export type TrendStats = {
  revenueByDay: { day: string; value: number }[]
  signupsByDay: { day: string; value: number }[]
  activeByDay: { day: string; value: number }[]
  previous: { signups: number; active: number; newPro: number; payments: number }
  funnel: { signups: number; verified: number; active: number; pro: number }
}

/**
 * Ряды по дням и прошлый период для стрелок изменения. Дни без событий
 * добиваются нулями здесь, а не в разметке: график обязан показывать
 * пустоту так же честно, как пики.
 */
export async function trendStats(days: Period, now = new Date()) {
  const from = periodStart(days, now)
  const before = periodStart(days, from)
  const range = lastDays(days, now)

  const [revenue, signups, active, previous, funnel] = await Promise.all([
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${payment.paidAt}), 'YYYY-MM-DD')`,
        value: sql<number>`coalesce(sum(cast(${payment.amount} as numeric)), 0)`,
      })
      .from(payment)
      .where(and(eq(payment.status, "succeeded"), gte(payment.paidAt, from)))
      .groupBy(sql`date_trunc('day', ${payment.paidAt})`),
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${user.createdAt}), 'YYYY-MM-DD')`,
        value: count(),
      })
      .from(user)
      .where(gte(user.createdAt, from))
      .groupBy(sql`date_trunc('day', ${user.createdAt})`),
    db
      .select({
        day: sql<string>`to_char(date_trunc('day', ${usage.firstUsedAt}), 'YYYY-MM-DD')`,
        value: countDistinct(usage.userId),
      })
      .from(usage)
      .where(gte(usage.firstUsedAt, from))
      .groupBy(sql`date_trunc('day', ${usage.firstUsedAt})`),
    Promise.all([
      db
        .select({ value: count() })
        .from(user)
        .where(and(gte(user.createdAt, before), lt(user.createdAt, from))),
      db
        .select({ value: countDistinct(usage.userId) })
        .from(usage)
        .where(and(gte(usage.firstUsedAt, before), lt(usage.firstUsedAt, from))),
      db
        .select({ value: count() })
        .from(subscription)
        .where(
          and(
            gte(subscription.createdAt, before),
            lt(subscription.createdAt, from),
          ),
        ),
      db
        .select({ value: count() })
        .from(payment)
        .where(
          and(
            eq(payment.status, "succeeded"),
            gte(payment.createdAt, before),
            lt(payment.createdAt, from),
          ),
        ),
    ]),
    // Воронка периода: зарегистрировались → подтвердили → взяли компонент
    // → оформили Pro. Все четыре считаются по людям, пришедшим в период.
    db
      .select({
        signups: count(),
        verified: sql<number>`count(*) filter (where ${user.emailVerified})`,
        active: sql<number>`count(*) filter (where exists (select 1 from ${usage} where ${usage.userId} = ${user.id}))`,
        pro: sql<number>`count(*) filter (where exists (select 1 from ${subscription} where ${subscription.userId} = ${user.id}))`,
      })
      .from(user)
      .where(gte(user.createdAt, from)),
  ])

  return {
    revenueByDay: fillDays(range, revenue),
    signupsByDay: fillDays(range, signups),
    activeByDay: fillDays(range, active),
    previous: {
      signups: previous[0][0]?.value ?? 0,
      active: previous[1][0]?.value ?? 0,
      newPro: previous[2][0]?.value ?? 0,
      payments: previous[3][0]?.value ?? 0,
    },
    funnel: {
      signups: funnel[0]?.signups ?? 0,
      verified: Number(funnel[0]?.verified ?? 0),
      active: Number(funnel[0]?.active ?? 0),
      pro: Number(funnel[0]?.pro ?? 0),
    },
  } satisfies TrendStats
}
