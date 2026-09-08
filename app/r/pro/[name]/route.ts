import { denialText, resolveAccess } from "@/lib/access"
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
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params
  const slug = name.replace(/\.json$/, "")

  if (!getCatalogItem(slug)) {
    return new Response("Not found\n", { status: 404 })
  }

  const access = await resolveAccess(slug)

  if (!access.allowed) {
    // 401 вместо 403: CLI показывает тело ответа, и человек видит, что
    // делать дальше.
    return new Response(denialText(access.reason), { status: 401 })
  }

  const item = await buildRegistryItem(slug)

  if (!item) {
    return new Response("Not found\n", { status: 404 })
  }

  return Response.json(item, {
    headers: { "cache-control": "private, no-store" },
  })
}
