import { resolveControlValues } from "@/lib/controls"
import { buildAgentBrief } from "@/lib/copy-for-ai"
import {
  getInstallCommand,
  getItemFileUrl,
  getRegistryItemUrl,
  getSiteBaseUrl,
} from "@/lib/site"
import { getCatalogItem, getItemKind } from "@/registry/index"

/**
 * Инструкция для агента по короткой ссылке `/c/<name>`.
 *
 * Отдаётся plain text: документ читает агент, а не браузер. Исходника внутри
 * нет — только команда установки, поэтому скопировать код вместо установки
 * невозможно (см. docs/DELIVERY.md).
 *
 * Маршрут динамический: значения контролов приезжают в query
 * (`?tone=soft&children=Купить`) и подставляются в сниппет использования.
 * Ответ — килобайт текста, так что рендер по запросу ничего не стоит.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const item = getCatalogItem(slug)

  if (!item) {
    return new Response("Not found\n", { status: 404 })
  }

  const siteUrl = getSiteBaseUrl()
  const values = resolveControlValues(item, new URL(request.url).searchParams)
  const brief = buildAgentBrief(item, {
    installCommand: getInstallCommand(item.name),
    registryUrl: getRegistryItemUrl(item.name),
    kind: getItemKind(item.name) ?? "block",
    pageUrl: siteUrl ? `${siteUrl}/components/${item.name}` : null,
    fileUrl: getItemFileUrl(item.name),
    values,
  })

  return new Response(`${brief}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  })
}
