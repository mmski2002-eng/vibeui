import { denialText, resolveAccess } from "@/lib/access"
import { signRegistryLink } from "@/lib/registry-link"
import { getSiteBaseUrl } from "@/lib/site"
import { getCatalogItem } from "@/registry/index"
import { getDeliverableSource } from "@/registry/source.server"
import { rateLimit } from "@/lib/rate-limit"

/**
 * Выдача исходника для панели «Исходник компонента». Здесь один раз
 * проверяются вход, подписка и лимит (`resolveAccess`), после чего рождается
 * подпись на 30 минут: панель показывает код, а команда установки с этой
 * подписью работает те же 30 минут без повторной авторизации.
 *
 * Ответ зависит от того, кто спросил — маршрут динамический.
 */
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const limited = rateLimit(request, "registry-source", 60)
  if (limited) return limited

  const slug = new URL(request.url).searchParams.get("name") ?? ""

  if (!getCatalogItem(slug)) {
    return new Response("Not found\n", { status: 404 })
  }

  const access = await resolveAccess(slug)

  if (!access.allowed) {
    return Response.json(
      { reason: access.reason, message: denialText(access.reason).trim() },
      { status: 401 },
    )
  }

  const source = await getDeliverableSource(slug)

  if (!source) {
    return new Response("Not found\n", { status: 404 })
  }

  const { exp, sig } = signRegistryLink(slug)
  const query = `exp=${exp}&sig=${sig}`
  const base = getSiteBaseUrl() ?? new URL(request.url).origin
  const registryUrl = `${base}/r/pro/${slug}.json?${query}`

  return Response.json(
    {
      source,
      registryUrl,
      installCommand: `npx shadcn@latest add ${registryUrl}`,
      // Подписанная короткая ссылка для «Копировать для ИИ»: агент откроет её
      // и получит бриф без входа, пока она жива.
      docUrl: `${base}/c/${slug}?${query}`,
      expiresAt: exp,
    },
    { headers: { "cache-control": "private, no-store" } },
  )
}
