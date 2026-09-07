import Link from "next/link"

import { CatalogGrid } from "@/components/catalog/catalog-grid"
import { CatalogShell } from "@/components/catalog/catalog-shell"
import { SearchBox } from "@/components/catalog/search-box"
import { getDictionary, localePath, type Locale } from "@/lib/i18n"
import { searchCatalog, type SearchHit } from "@/lib/search/engine"
import { KINDS, type ItemKind } from "@/registry/categories"
import type { CatalogItem } from "@/registry/meta"
import { catalogBasePath, getCatalogItem } from "@/registry/index"

/**
 * Страница результатов поиска по всему ассортименту.
 *
 * Считается на сервере: registry там уже в памяти, поэтому выдача приезжает
 * готовой разметкой и работает без JavaScript — ссылкой на неё можно
 * поделиться, и она откроется тем же самым.
 *
 * Результаты разложены по типам (блоки, компоненты, анимации), потому что
 * выбор между секцией и мелким компонентом — это первое, что человек
 * различает глазами, и одна общая лента его прячет.
 */
export const SEARCH_LIMIT = 48

function groupByKind(hits: SearchHit[]) {
  return KINDS.map((kind) => ({
    kind: kind.slug as ItemKind,
    hits: hits.filter((hit) => hit.kind === kind.slug),
  })).filter((group) => group.hits.length > 0)
}

export function SearchPage({
  locale,
  query,
}: {
  locale: Locale
  query: string
}) {
  const t = getDictionary(locale)
  const needle = query.trim()
  const outcome = searchCatalog(needle, locale, { limit: SEARCH_LIMIT })
  const groups = groupByKind(outcome.hits)

  return (
    <CatalogShell locale={locale}>
      {/* Тот же отступ, что у строки каталога: высота шапки меняется на
          телефоне, и фиксированные 14 единиц загоняли поиск под неё. */}
      <div className="border-shell-border bg-shell sticky top-[var(--catalog-header-height)] z-20 border-b">
        <div className="mx-auto flex w-full max-w-[1440px] items-center px-4 py-2 lg:px-6">
          <SearchBox locale={locale} initialQuery={needle} autoFocus />
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 lg:px-6 lg:py-8">
        <div className="border-shell-border mb-6 border-b pb-6">
          <h1 className="text-shell-fg text-2xl font-semibold tracking-tight sm:text-3xl">
            {needle === "" ? t.search.title : `«${needle}»`}
          </h1>
          <p className="text-shell-muted mt-2 text-sm">
            {needle === ""
              ? t.search.hint
              : outcome.terms.length === 0
                ? // Запрос вычистился до пустого: в нём были одни оценки
                  // («что-нибудь красивое») — искать нечего, и сказать надо
                  // именно это, а не «ничего не найдено».
                  t.search.tooVague
                : outcome.hits.length === 0
                  ? t.search.nothing
                  : outcome.total > outcome.hits.length
                    ? t.search.shown(outcome.hits.length, outcome.total)
                    : t.search.found(outcome.total)}
          </p>

          {/* Разделы под запросом: человеку часто нужен не один item, а место,
              где лежат все такие. Прежний поиск на пустой выдаче не предлагал
              ничего — и это читалось как «в каталоге такого нет». */}
          {outcome.categories.length > 0 ? (
            <div className="mt-4">
              <p className="text-shell-muted mb-2 text-xs font-medium tracking-wide uppercase">
                {t.search.sections}
              </p>
              <div className="flex flex-wrap gap-2">
                {outcome.categories.map((category) => (
                  <Link
                    key={`${category.kind}/${category.slug}`}
                    href={localePath(
                      locale,
                      `${catalogBasePath(category.kind)}/${category.slug}`,
                    )}
                    className="border-shell-border text-shell-fg hover:border-shell-border-strong inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors"
                  >
                    {category.label}
                    <span className="text-shell-muted text-xs tabular-nums">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {needle !== "" && outcome.approximate && outcome.hits.length > 0 ? (
          <p className="text-shell-muted mb-6 text-sm">{t.search.near}</p>
        ) : null}

        {needle !== "" && outcome.hits.length === 0 ? (
          <p className="text-shell-muted py-16 text-center text-sm">
            {t.search.hint}
          </p>
        ) : null}

        {groups.map((group) => {
          const items = group.hits
            .map((hit) => getCatalogItem(hit.name))
            .filter((item): item is CatalogItem => item !== undefined)

          return (
            <section key={group.kind} className="mb-10">
              <h2 className="text-shell-fg mb-4 text-sm font-medium">
                {t.search.inSection[group.kind]}
                <span className="text-shell-muted ml-2 text-xs tabular-nums">
                  {group.hits.length}
                </span>
              </h2>

              {/* Карточка выдачи — та же карточка каталога: живое превью того
                  самого файла из registry, который получит пользователь. */}
              <CatalogGrid
                items={items}
                locale={locale}
                single={group.kind === "block"}
              />
            </section>
          )
        })}
      </main>
    </CatalogShell>
  )
}
