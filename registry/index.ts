import {
  CATEGORIES,
  KINDS,
  type ItemGroup,
  type ItemKind,
} from "@/registry/categories"
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

export function getCategoryLabel(slug: string): string {
  return CATEGORIES.find((category) => category.slug === slug)?.label ?? slug
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
export function getUsedCategories(kind?: ItemKind): CategoryCount[] {
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
      label: category.label,
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
export function getCatalogNavSections(kind?: ItemKind): CatalogNavSection[] {
  return KINDS.filter((entry) => !kind || entry.slug === kind)
    .map((entry) => ({
      kind: entry.slug,
      label: entry.label,
      count: getItemsByKind(entry.slug).length,
      categories: getUsedCategories(entry.slug),
    }))
    .filter((section) => section.count > 0)
}
