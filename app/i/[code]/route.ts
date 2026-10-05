import { randomUUID } from "node:crypto"
import { cookies } from "next/headers"

import { db } from "@/lib/db"
import { referralVisit } from "@/lib/db/schema"
import { resolveCode } from "@/lib/partners"
import { originFromHost } from "@/lib/seo"
import { rateLimit } from "@/lib/rate-limit"

/** Сколько живёт привязка к пригласившему: два месяца на раздумья. */
const REF_COOKIE_DAYS = 60
const REF_CODE = /^[A-Za-z0-9_-]{3,24}$/

export const REF_COOKIE = "vibeui_ref"

/**
 * Ссылка партнёрской программы: приглашение блогера или код партнёра.
 * Кладёт код в куку и уводит на витрину: посадочной страницы у
 * приглашения нет, человек должен увидеть сам продукт. Занятое
 * приглашение и чужой код ведут на главную без куки.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const limited = rateLimit(request, "referral", 60)
  if (limited) return limited

  const { code } = await params
  // Берём только разрешённый публичный host. На .club нельзя уходить в .ru:
  // инстансы имеют разные базы, и код второго сервера там не существует.
  const home = new URL("/", originFromHost(request.headers.get("host")))

  if (!REF_CODE.test(code)) {
    return Response.redirect(home, 302)
  }

  if (!(await resolveCode(code))) {
    return Response.redirect(home, 302)
  }

  const store = await cookies()
  const visitorId = store.get("vibeui_visitor")?.value ?? randomUUID()

  store.set(REF_COOKIE, code, {
    maxAge: REF_COOKIE_DAYS * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  })
  store.set("vibeui_visitor", visitorId, {
    maxAge: REF_COOKIE_DAYS * 24 * 60 * 60,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
  })

  await db
    .insert(referralVisit)
    .values({ id: randomUUID(), code, visitorId })
    .onConflictDoNothing()

  return Response.redirect(home, 302)
}
