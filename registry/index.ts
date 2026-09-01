import {
  CATEGORIES,
  KINDS,
  type ItemGroup,
  type ItemKind,
} from "@/registry/categories"
import type { Locale } from "@/lib/i18n"
import type { CatalogItem } from "@/registry/meta"
import { SOURCES } from "@/registry/sources"

type CatalogEntry = {
  item: CatalogItem
  directory: string
  kind: ItemKind
  category: string | undefined
  group: ItemGroup | undefined
}

function categoryGroup(category: string | undefined): ItemGroup | undefined {
  return CATEGORIES.find((entry) => entry.slug === category)?.group
}

const ITEMS: CatalogEntry[] = SOURCES.flatMap((source) =>
  (source.items as unknown as CatalogItem[])
    .filter((item) => !item.meta?.internal)
    .map((item) => {
      const category = item.categories?.[0]

      return {
        item,
        directory: source.directory,
        kind: item.meta?.kind ?? source.kind,
        category,
        group: item.meta?.group ?? categoryGroup(category),
      }
    }),
)

const BY_SLUG = new Map(ITEMS.map((entry) => [entry.item.name, entry]))

export function getCatalogItems(): CatalogItem[] {
  return ITEMS.map((entry) => entry.item)
}

export function getCatalogItem(slug: string): CatalogItem | undefined {
  return BY_SLUG.get(slug)?.item
}

export function getItemsByKind(kind: ItemKind): CatalogItem[] {
  return ITEMS.filter((entry) => entry.kind === kind).map((entry) => entry.item)
}

/** Тип единицы установки: секция, мелкий компонент или шаблон страницы. */
export function getItemKind(slug: string): ItemKind | undefined {
  return BY_SLUG.get(slug)?.kind
}

/** Предметная область item'а. Выводится из категории, в metadata не дублируется. */
export function getItemGroup(slug: string): ItemGroup | undefined {
  return BY_SLUG.get(slug)?.group
}

/** Директория registry.json, объявившего item: пути файлов относительны ей. */
export function getItemDirectory(slug: string): string | undefined {
  return BY_SLUG.get(slug)?.directory
}

/**
 * Подпись категории. Базовый язык каталога русский, английское имя типа
 * лежит рядом: у компонентов оно совпадает с именем в чужих библиотеках,
 * и на английской витрине показывается именно оно.
 */
export function getCategoryLabel(slug: string, locale: Locale = "ru"): string {
  const category = CATEGORIES.find((entry) => entry.slug === slug)

  if (!category) {
    return slug
  }

  return locale === "ru" ? category.label : category.en
}

type CategoryCount = {
  slug: string
  label: string
  count: number
}

/**
 * Категории, в которых реально есть items, с количеством. Без аргумента —
 * по всему каталогу, с `kind` — только внутри типа.
 */
export function getUsedCategories(
  kind?: ItemKind,
  locale: Locale = "ru",
): CategoryCount[] {
  const counts = new Map<string, number>()

  for (const entry of ITEMS) {
    if ((kind && entry.kind !== kind) || !entry.category) {
      continue
    }

    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1)
  }

  return CATEGORIES.filter((category) => counts.has(category.slug)).map(
    (category) => ({
      slug: category.slug,
      label: locale === "ru" ? category.label : category.en,
      count: counts.get(category.slug) ?? 0,
    }),
  )
}

export type CatalogNavSection = {
  kind: ItemKind
  label: string
  count: number
  categories: CategoryCount[]
}

/**
 * Разделы sidebar: типы, внутри них — категории с counts. Blocks и components
 * не смешиваются в одну кашу, потому что категории считаются внутри типа.
 * Пустые типы не показываются. С аргументом — только один тип: каталог и
 * страница блоков живут на разных маршрутах и показывают каждый своё.
 */
export function getCatalogNavSections(
  kind?: ItemKind,
  locale: Locale = "ru",
): CatalogNavSection[] {
  return KINDS.filter((entry) => !kind || entry.slug === kind)
    .map((entry) => ({
      kind: entry.slug,
      label: entry.label,
      count: getItemsByKind(entry.slug).length,
      categories: getUsedCategories(entry.slug, locale),
    }))
    .filter((section) => section.count > 0)
}

/**
 * Карточка категории для витрины: подпись, количество и item, чьё превью
 * показывается на обложке. Обложка — первый featured item категории, иначе
 * просто первый: он написан раньше остальных и обычно самый показательный.
 */
export type CategoryCard = {
  slug: string
  label: string
  count: number
  coverSlug: string | undefined
  /** По чему ищет поле поиска: подпись, slug и заголовки items внутри. */
  search: string
}

export function getCategoryCards(
  kind: ItemKind,
  locale: Locale = "ru",
): CategoryCard[] {
  // По алфавиту, а не в порядке объявления: порядок в `categories.ts` — это
  // очередь работ, и глазами по нему категорию не найти.
  return [...getUsedCategories(kind, locale)]
    .sort((first, second) =>
      first.label.localeCompare(second.label, undefined, {
        sensitivity: "base",
      }),
    )
    .map((category) => {
      const items = ITEMS.filter(
        (entry) => entry.kind === kind && entry.category === category.slug,
      )
      const cover = items.find((entry) => entry.item.meta?.featured) ?? items[0]

      return {
        slug: category.slug,
        label: category.label,
        count: category.count,
        coverSlug: cover?.item.name,
        search: [
          category.label,
          category.slug,
          ...items.map((entry) => entry.item.title ?? entry.item.name),
        ]
          .join(" ")
          .toLowerCase(),
      }
    })
}

export function getItemsByCategory(
  kind: ItemKind,
  category: string,
): CatalogItem[] {
  return ITEMS.filter(
    (entry) => entry.kind === kind && entry.category === category,
  ).map((entry) => entry.item)
}

/** Тип, внутри которого живёт категория: по нему выбирается её маршрут. */
export function getCategoryKind(category: string): ItemKind | undefined {
  return ITEMS.find((entry) => entry.category === category)?.kind
}
