import { randomUUID } from "node:crypto"
import { cookies } from "next/headers"

import { db } from "@/lib/db"
import { referralVisit } from "@/lib/db/schema"
import { resolveCode } from "@/lib/partners"

/** Сколько живёт привязка к пригласившему: два месяца на раздумья. */
const REF_COOKIE_DAYS = 60

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
  const { code } = await params
  const home = new URL("/", request.url)

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
