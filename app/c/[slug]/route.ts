import { resolveControlValues } from "@/lib/controls"
import { buildAgentBrief } from "@/lib/copy-for-ai"
import { isLocale, type Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
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
 * (`?tone=soft&children=Купить`), язык — в `?lang=en`. Ответ — килобайт
 * текста, так что рендер по запросу ничего не стоит.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const found = getCatalogItem(slug)

  if (!found) {
    return new Response("Not found\n", { status: 404 })
  }

  const search = new URL(request.url).searchParams
  const lang = search.get("lang") ?? undefined
  const locale: Locale = isLocale(lang) ? lang : "ru"

  const item = localizeItem(found, locale)
  const siteUrl = getSiteBaseUrl()
  const pagePath = locale === "en" ? "/en/components" : "/components"
  const values = resolveControlValues(item, search)

  const brief = buildAgentBrief(item, {
    installCommand: getInstallCommand(item.name),
    registryUrl: getRegistryItemUrl(item.name),
    kind: getItemKind(item.name) ?? "block",
    pageUrl: siteUrl ? `${siteUrl}${pagePath}/${item.name}` : null,
    fileUrl: getItemFileUrl(item.name),
    values,
    locale,
  })

  return new Response(`${brief}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  })
}
