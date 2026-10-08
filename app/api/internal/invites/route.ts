import { timingSafeEqual } from "node:crypto"
import { and, eq, isNull, like } from "drizzle-orm"

import { db } from "@/lib/db"
import { partnerInvite } from "@/lib/db/schema"
import { createInvite, wordTaken } from "@/lib/partners"
import { normalizePromo } from "@/lib/promo"
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
  const key = process.env.AGENTS_API_KEY ?? ""
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? ""
  if (key.length < 24 || !safeEqual(bearer, key)) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

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
