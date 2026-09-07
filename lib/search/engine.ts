import "server-only"

import MiniSearch, { type SearchOptions, type SearchResult } from "minisearch"

import type { Locale } from "@/lib/i18n"
import { localizeItem } from "@/lib/localize"
import { expandQuery, processTerm, tokenize } from "@/lib/search/dictionary"
import type { ItemKind } from "@/registry/categories"
import {
  getCatalogItems,
  getCategoryLabel,
  getItemKind,
} from "@/registry/index"

/**
 * Поиск по всему ассортименту.
 *
 * Считается на сервере: весь registry там уже в памяти, поэтому искать
 * можно по описаниям и сводкам целиком, ничего не выгружая в браузер.
 * Клиент получает готовую выдачу — сотни килобайт индекса ему возить
 * незачем.
 *
 * Раздел (компоненты/блоки/анимации) область поиска не ограничивает, а лишь
 * поднимает своё в выдаче. Прежний поиск фильтровал DOM открытой страницы,
 * и «тарифы» на `/components` не находились ничем — категория `pricing`
 * живёт в блоках. Угадывать раздел человек не обязан.
 */

export type SearchHit = {
  name: string
  kind: ItemKind
  category: string
  categoryLabel: string
  title: string
  description: string
}

export type SearchCategory = {
  slug: string
  kind: ItemKind
  label: string
  count: number
}

export type SearchOutcome = {
  /** Что реально ушло в поиск после чистки и подстановки синонимов. */
  terms: string[]
  /** Разделы, куда предлагается перейти: словарь плюс категории первых попаданий. */
  categories: SearchCategory[]
  hits: SearchHit[]
  /** Точных совпадений не нашлось совсем, показано только близкое. */
  approximate: boolean
  /** Сколько результатов пришло из строгого прохода. */
  exact: number
  /** Всего найдено — выдача может быть обрезана до `limit`. */
  total: number
}

type Document = {
  id: string
  name: string
  kind: ItemKind
  category: string
  categoryLabel: string
  title: string
  description: string
  summary: string
  tags: string
}

/**
 * Веса полей. Заголовок и подпись категории весят больше описания:
 * «кнопка» обязана поднять «Кнопку», а не «Вкладки», у которых слово
 * «кнопка» встретилось в описании внутренностей. Прежний поиск ранжирования
 * не имел вовсе — просто прятал непопавшие карточки, — и нужное уезжало вниз.
 */
const BOOST = {
  name: 5,
  title: 4,
  categoryLabel: 4,
  category: 3,
  tags: 2,
  description: 1,
  summary: 1,
}

/**
 * Поля строгого прохода. Описание и сводка сюда не входят намеренно:
 * слово «кнопка» встречается в описании сотен items, и поиск по ним
 * раздувал выдачу до шестисот с лишним результатов на однословный запрос.
 * Точный поиск отвечает за то, чем вещь названа, а не за то, что о ней
 * написано; описания подключаются только в мягком проходе.
 */
const STRICT_FIELDS = ["name", "title", "categoryLabel", "category", "tags"]

/** Насколько поднимается item из раздела, в котором человек сейчас стоит. */
const SECTION_BOOST = 1.35

/**
 * Насколько поднимается попадание в категорию, названную первым словом
 * запроса. Первым человек называет саму вещь: в «тарифы с переключателем»
 * главное — тарифы, а переключатель уточняет.
 */
const PRIMARY_CATEGORY_BOOST = 3

/** То же для категорий, названных уточняющими словами запроса. */
const SECONDARY_CATEGORY_BOOST = 1.5

/**
 * Множитель за каждую смысловую единицу запроса сверх первой, которую
 * результат действительно закрыл. В мягком проходе достаточно одной, и без
 * этого веса «тарифы с переключателем» ставит рядом всё, где есть хоть
 * что-то из двух.
 */
const COVERAGE_BOOST = 0.8

/**
 * Ниже этого числа строгих попаданий выдача дополняется близкими. Один-два
 * результата на осмысленный запрос — это почти то же самое, что «ничего не
 * найдено»: человек не понимает, узкий у него запрос или пустой каталог.
 */
const NEAR_THRESHOLD = 5

function buildDocuments(locale: Locale): Document[] {
  const other: Locale = locale === "ru" ? "en" : "ru"

  return getCatalogItems().map((item) => {
    const localized = localizeItem(item, locale)
    const category = localized.categories?.[0] ?? ""

    return {
      id: localized.name,
      name: localized.name,
      kind: getItemKind(localized.name) ?? "component",
      category,
      // Обе подписи категории в одном поле: русское имя ищут и на английской
      // витрине — им компонент называют в переписке и в промптах.
      categoryLabel: `${getCategoryLabel(category, locale)} ${getCategoryLabel(
        category,
        other,
      )}`,
      title: localized.title ?? localized.name,
      description: localized.description ?? "",
      summary: localized.meta?.ai?.summary ?? "",
      tags: (localized.meta?.tags ?? []).join(" "),
    }
  })
}

function buildIndex(locale: Locale): MiniSearch<Document> {
  const index = new MiniSearch<Document>({
    fields: [
      "name",
      "title",
      "categoryLabel",
      "category",
      "tags",
      "description",
      "summary",
    ],
    storeFields: ["name", "kind", "category", "title", "description"],
    // Токенизация и стемминг общие с разбором запроса: иначе «тарифы» из
    // запроса и «Тарифы» из подписи категории не сойдутся в один терм.
    tokenize,
    processTerm,
  })

  index.addAll(buildDocuments(locale))

  return index
}

// Индекс строится один раз на процесс: полторы тысячи документов — это
// десятки миллисекунд, но тратить их на каждое нажатие клавиши незачем.
const INDEXES = new Map<Locale, MiniSearch<Document>>()
const COUNTS = new Map<string, number>()

function getIndex(locale: Locale): MiniSearch<Document> {
  const existing = INDEXES.get(locale)

  if (existing) {
    return existing
  }

  const index = buildIndex(locale)
  INDEXES.set(locale, index)

  return index
}

function getCounts(): Map<string, number> {
  if (COUNTS.size === 0) {
    for (const item of getCatalogItems()) {
      const category = item.categories?.[0]

      if (category) {
        COUNTS.set(category, (COUNTS.get(category) ?? 0) + 1)
      }
    }
  }

  return COUNTS
}

/** Тип, внутри которого живёт категория: по нему строится ссылка на раздел. */
function categoryKind(slug: string): ItemKind {
  const item = getCatalogItems().find((entry) => entry.categories?.[0] === slug)

  return (item && getItemKind(item.name)) ?? "component"
}

export function searchCatalog(
  rawQuery: string,
  locale: Locale = "ru",
  options: { kind?: ItemKind; limit?: number } = {},
): SearchOutcome {
  const limit = options.limit ?? 60
  const query = expandQuery(rawQuery)
  const empty: SearchOutcome = {
    terms: [],
    categories: [],
    hits: [],
    approximate: false,
    exact: 0,
    total: 0,
  }

  if (query.groups.length === 0) {
    return empty
  }

  const index = getIndex(locale)

  // Категории, названные первым словом запроса, и все остальные: вес у них
  // разный, поэтому наборы держатся отдельно.
  const primary = new Set(query.groups[0]?.categories ?? [])
  const secondary = new Set(
    query.groups.slice(1).flatMap((group) => group.categories),
  )

  // Термы групп в том же виде, в каком они лежат в индексе: MiniSearch
  // прогоняет через `processTerm` и запрос тоже, поэтому сравнивать надо
  // обработанные формы, иначе покрытие никогда не совпадёт.
  const groupTerms = query.groups.map(
    (group) =>
      new Set(
        group.terms
          .map((term) => processTerm(term))
          .filter((term): term is string => term !== null),
      ),
  )

  const run = (combineWith: "AND" | "OR", parameters: SearchOptions) =>
    index
      .search(
        {
          combineWith,
          // Внутри группы — «любое из»: слово человека и всё, чем то же самое
          // называется в каталоге, равноправны. Между группами — «все», иначе
          // многословный запрос отдаёт всё по первому же слову.
          queries: query.groups.map((group) => ({
            combineWith: "OR" as const,
            queries: group.terms,
          })),
        },
        parameters,
      )
      .map((result: SearchResult) => {
        let score = result.score
        const category = result.category as string
        const matched = new Set(result.terms)

        if (primary.has(category)) {
          score *= PRIMARY_CATEGORY_BOOST
        } else if (secondary.has(category)) {
          score *= SECONDARY_CATEGORY_BOOST
        }

        // Сколько смысловых единиц запроса результат действительно закрыл.
        const covered = groupTerms.filter((terms) =>
          [...matched].some((term) => terms.has(term)),
        ).length

        if (covered > 1) {
          score *= 1 + COVERAGE_BOOST * (covered - 1)
        }

        if (options.kind && result.kind === options.kind) {
          score *= SECTION_BOOST
        }

        return { result, score }
      })
      .sort((first, second) => second.score - first.score)

  // Сначала строго: нужны все смысловые единицы запроса и только те поля,
  // которыми вещь названа.
  const strict = run("AND", {
    prefix: true,
    boost: BOOST,
    fields: STRICT_FIELDS,
  })
  let found = strict

  if (strict.length < NEAR_THRESHOLD) {
    // Затем мягко: любая из единиц, опечатки и поиск по описаниям. Показать
    // близкое честнее, чем сказать «ничего нет», когда нужное лежит рядом
    // под другим словом. Строгие попадания остаются первыми.
    const near = run("OR", { prefix: true, fuzzy: 0.2, boost: BOOST })
    const seen = new Set(strict.map((entry) => entry.result.id as string))

    found = [
      ...strict,
      ...near.filter((entry) => !seen.has(entry.result.id as string)),
    ]
  }

  // «Точных совпадений нет» — только когда их и правда нет. Раньше флаг
  // вставал от одного добранного результата, и запрос, у которого точное
  // попадание стояло первым, всё равно объявлялся неточным.
  const approximate = strict.length === 0 && found.length > 0

  const counts = getCounts()
  const suggested = new Set(query.categories)

  // Человеку нужен не только item, но и раздел, куда идти дальше.
  for (const entry of found.slice(0, 12)) {
    suggested.add(entry.result.category as string)
  }

  return {
    terms: query.groups.flatMap((group) => group.terms),
    categories: [...suggested]
      .filter((slug) => (counts.get(slug) ?? 0) > 0)
      .slice(0, 6)
      .map((slug) => ({
        slug,
        kind: categoryKind(slug),
        label: getCategoryLabel(slug, locale),
        count: counts.get(slug) ?? 0,
      })),
    hits: found.slice(0, limit).map(({ result }) => ({
      name: result.name as string,
      kind: result.kind as ItemKind,
      category: result.category as string,
      categoryLabel: getCategoryLabel(result.category as string, locale),
      title: result.title as string,
      description: result.description as string,
    })),
    approximate,
    exact: strict.length,
    total: found.length,
  }
}
