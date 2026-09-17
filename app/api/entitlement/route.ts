import { headers } from "next/headers"

import { auth } from "@/lib/auth"
import { isPro } from "@/lib/entitlements"

/**
 * Право текущего пользователя: вошёл ли и есть ли Pro. Нужен статичным
 * страницам item'ов — они не знают сессию на сервере, а кнопке «Копировать
 * для ИИ» надо заранее понять, показывать ли на закрытом item'е «Доступно с
 * Pro». Лимит не тратит, в отличие от выдачи исходника.
 */
export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  const pro = session ? await isPro(session.user.id) : false

  return Response.json(
    { signedIn: Boolean(session), pro },
    { headers: { "cache-control": "private, no-store" } },
  )
}
