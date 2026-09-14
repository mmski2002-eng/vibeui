import { denialText, resolveAccess } from "@/lib/access"
import { verifyRegistryLink } from "@/lib/registry-link"
import { buildRegistryItem } from "@/lib/registry-item"
import { getCatalogItem } from "@/registry/index"

/**
 * Реестр закрытых компонентов. shadcn CLI ходит сюда с заголовком
 * Authorization — namespace с ключом прописывается в components.json
 * проекта, поэтому куки браузера здесь ни при чём.
 *
 * Маршрут динамический намеренно: ответ зависит от того, кто спросил.
 */
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params
  const slug = name.replace(/\.json$/, "")

  if (!getCatalogItem(slug)) {
    return new Response("Not found\n", { status: 404 })
  }

  // Подписанная ссылка (сутки) открывает item без ключа: доступ и лимит
  // проверены на её выдаче. Нет подписи — обычная проверка ключа/подписки.
  const query = new URL(request.url).searchParams
  const signed = verifyRegistryLink(
    slug,
    Number(query.get("exp")),
    query.get("sig"),
  )

  if (!signed) {
    const access = await resolveAccess(slug)

    if (!access.allowed) {
      // 401 вместо 403: CLI показывает тело ответа, и человек видит, что
      // делать дальше.
      return new Response(denialText(access.reason), { status: 401 })
    }
  }

  const item = await buildRegistryItem(slug)

  if (!item) {
    return new Response("Not found\n", { status: 404 })
  }

  return Response.json(item, {
    headers: { "cache-control": "private, no-store" },
  })
}
