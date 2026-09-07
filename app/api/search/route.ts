import { isLocale, type Locale } from "@/lib/i18n"
import { searchCatalog } from "@/lib/search/engine"
import { KINDS, type ItemKind } from "@/registry/categories"

/**
 * Подсказки поиска: `/api/search?q=тарифы&lang=ru&kind=component`.
 *
 * Выдача считается здесь, а не в браузере, потому что весь registry уже
 * лежит в памяти сервера. Иначе клиенту пришлось бы возить полторы сотни
 * килобайт индекса ради подсказок, которые он показывает восемь строк за раз.
 *
 * `kind` — раздел, в котором человек сейчас стоит. Он не сужает поиск, а
 * только поднимает своё в выдаче: искать всегда надо по всему ассортименту.
 */
export const dynamic = "force-dynamic"

/** Столько подсказок помещается в выпадающий список под полем. */
const SUGGESTION_LIMIT = 8

function parseKind(value: string | null): ItemKind | undefined {
  return KINDS.some((entry) => entry.slug === value)
    ? (value as ItemKind)
    : undefined
}

export function GET(request: Request) {
  const search = new URL(request.url).searchParams
  const query = search.get("q") ?? ""
  const lang = search.get("lang")
  const locale: Locale = isLocale(lang ?? undefined) ? (lang as Locale) : "ru"

  const outcome = searchCatalog(query, locale, {
    kind: parseKind(search.get("kind")),
    limit: SUGGESTION_LIMIT,
  })

  return Response.json(outcome, {
    // Подсказки одинаковы для всех: одинаковый запрос можно отдать из кеша,
    // а на сервере с одним ядром это заметная разница.
    headers: { "cache-control": "public, max-age=60" },
  })
}
