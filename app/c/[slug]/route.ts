import { denialText, resolveAccess } from "@/lib/access"
import { resolveControlValues } from "@/lib/controls"
import { buildAgentBrief } from "@/lib/copy-for-ai"
import { isLocale, type Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { signRegistryLink, verifyRegistryLink } from "@/lib/registry-link"
import { getSiteBaseUrl } from "@/lib/site"
import { getCatalogItem, getItemKind, itemBasePath } from "@/registry/index"

/**
 * Инструкция для агента по короткой ссылке `/c/<name>`.
 *
 * Отдаётся plain text: документ читает агент, а не браузер. Исходника внутри
 * нет — только команда установки, поэтому скопировать код вместо установки
 * невозможно (см. docs/DELIVERY.md).
 *
 * Открывается по подписи (её выдаёт кнопка «Копировать для ИИ» на сутки) или
 * по сессии. Команды в брифе — тоже подписанные ссылки на сутки, чтобы агент
 * поставил компонент без ключа. Маршрут динамический: значения контролов
 * приезжают в query (`?tone=soft`), язык — в `?lang=en`.
 */
export const dynamic = "force-dynamic"

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

  // Подписанная ссылка открывает инструкцию без сессии: доступ и лимит
  // проверены на её выдаче. Нет подписи — обычная проверка сессии.
  const signed = verifyRegistryLink(
    slug,
    Number(search.get("exp")),
    search.get("sig"),
  )

  if (!signed) {
    const access = await resolveAccess(slug)

    if (!access.allowed) {
      return new Response(denialText(access.reason), { status: 401 })
    }
  }

  const lang = search.get("lang") ?? undefined
  const locale: Locale = isLocale(lang) ? lang : "ru"

  const item = localizeItem(found, locale)
  const siteUrl = getSiteBaseUrl() ?? new URL(request.url).origin
  const kind = getItemKind(item.name) ?? "block"
  const base = itemBasePath(kind)
  const pagePath = locale === "en" ? `/en${base}` : base
  const values = resolveControlValues(item, search)
  const surface = search.get("theme")
  const theme = surface === "light" || surface === "dark" ? surface : undefined

  // Свежая подпись на сутки для ссылок в брифе: по ним агент ставит компонент.
  const link = signRegistryLink(item.name)
  const query = `exp=${link.exp}&sig=${link.sig}`
  const registryUrl = `${siteUrl}/r/pro/${item.name}.json?${query}`

  const brief = buildAgentBrief(item, {
    installCommand: `npx shadcn@latest add ${registryUrl}`,
    registryUrl,
    kind,
    pageUrl: `${siteUrl}${pagePath}/${item.name}`,
    fileUrl: `${siteUrl}/f/${item.name}.tsx?${query}`,
    values,
    locale,
    theme,
  })

  return new Response(`${brief}\n`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      // Ответ зависит от подписки и остатка лимита: общий кэш недопустим.
      "cache-control": "private, no-store",
    },
  })
}
