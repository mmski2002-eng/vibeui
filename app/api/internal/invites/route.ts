import { timingSafeEqual } from "node:crypto"
import { and, eq, isNull, like, sql } from "drizzle-orm"

import { db } from "@/lib/db"
import { partnerInvite } from "@/lib/db/schema"
import { createInvite, wordTaken } from "@/lib/partners"
import { commissionPercent, normalizePromo } from "@/lib/promo"
import { originFromHost } from "@/lib/seo"

/**
 * Приглашение блогера для агента рассылки (agents/). Агент присылает имя,
 * свой id блогера и желаемое слово вида `for_<ник>`; слово становится и
 * кодом ссылки, и будущим промокодом. Занятое слово получает суффикс.
 * Повтор с тем же creatorId возвращает уже созданное незанятое приглашение.
 */
export const dynamic = "force-dynamic"

const AGENT_TAG = (creatorId: string) => `[agent:${creatorId}]`

export async function POST(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 })

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : ""
  const creatorId = typeof body?.creatorId === "string" ? body.creatorId : ""
  const word = normalizePromo(typeof body?.word === "string" ? body.word : "")
  if (!name || !/^[0-9a-f-]{36}$/.test(creatorId) || !word) {
    return Response.json({ error: "invalid_request" }, { status: 400 })
  }

  const origin = originFromHost(request.headers.get("host"))
  const linkFor = (code: string) => `${origin}/?ref=${code}`

  const [existing] = await db
    .select({ code: partnerInvite.code })
    .from(partnerInvite)
    .where(and(like(partnerInvite.name, `%${AGENT_TAG(creatorId)}`), isNull(partnerInvite.claimedBy)))
    .limit(1)
  if (existing) return Response.json({ code: existing.code, url: linkFor(existing.code) })

  const code = await freeWord(word)
  if (!code) return Response.json({ error: "word_unavailable" }, { status: 409 })

  const invite = await createInvite(`${name} ${AGENT_TAG(creatorId)}`, "agent", code)
  await db.update(partnerInvite).set({ promoCode: code }).where(eq(partnerInvite.id, invite.id))

  return Response.json({ code, url: linkFor(code) }, { status: 201 })
}

/**
 * Воронка по приглашениям агента: сколько выдано, сколько блогеров
 * зарегистрировалось, переходы по их ссылкам, приведённые пользователи и
 * оплаты. Деньги — по валютам: `.ru` платит в рублях, `.club` в долларах.
 */
export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "unauthorized" }, { status: 401 })

  const [funnel] = await db.execute<{
    invites: number; claimed: number; visits: number; registrations: number; payments: number
  }>(sql`
    WITH invites AS (SELECT code, claimed_by FROM partner_invite WHERE name LIKE '%[agent:%'),
      codes AS (SELECT code FROM invites UNION SELECT r.code FROM referral r JOIN invites i ON i.claimed_by = r.user_id),
      referred AS (SELECT u.id FROM "user" u JOIN invites i ON i.claimed_by = u.invited_by)
    SELECT (SELECT count(*) FROM invites)::int AS invites,
      (SELECT count(claimed_by) FROM invites)::int AS claimed,
      (SELECT count(DISTINCT visitor_id) FROM referral_visit WHERE code IN (SELECT code FROM codes))::int AS visits,
      (SELECT count(*) FROM referred)::int AS registrations,
      (SELECT count(*) FROM payment p JOIN invites i ON i.claimed_by = p.partner_id WHERE p.status = 'succeeded')::int AS payments
  `)
  const revenue = await db.execute<{ currency: string; amount: string }>(sql`
    SELECT p.currency, sum(p.amount::numeric)::text AS amount FROM payment p
    JOIN partner_invite i ON i.claimed_by = p.partner_id AND i.name LIKE '%[agent:%'
    WHERE p.status = 'succeeded' GROUP BY p.currency
  `)
  const percent = await commissionPercent()

  return Response.json({
    ...funnel,
    commissionPercent: percent,
    revenue: revenue.map((row) => ({
      currency: row.currency,
      amount: Number(row.amount),
      commission: Math.round((Number(row.amount) * percent) / 100),
    })),
  })
}

function authorized(request: Request) {
  const key = process.env.AGENTS_API_KEY ?? ""
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? ""
  return key.length >= 24 && safeEqual(bearer, key)
}

async function freeWord(word: string): Promise<string | null> {
  for (let attempt = 1; attempt <= 20; attempt++) {
    const suffix = attempt === 1 ? "" : String(attempt)
    const candidate = `${word.slice(0, 24 - suffix.length)}${suffix}`
    if (!(await wordTaken(candidate))) return candidate
  }
  return null
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}
