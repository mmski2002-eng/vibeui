import { CATEGORIES } from "@/registry/categories"
import type { BlockItem } from "@/registry/meta"
import featuresRegistry from "@/registry/blocks/features/registry.json"
import heroRegistry from "@/registry/blocks/hero/registry.json"
import pricingRegistry from "@/registry/blocks/pricing/registry.json"

// Категории, попадающие на сайт. Служебные registry-файлы (_smoke) сюда не
// включаются, поэтому их slug'и на сайте недоступны в принципе.
// Порядок этого списка задаёт порядок блоков в каталоге.
const SOURCES = [
  { directory: "registry/blocks/hero", items: heroRegistry.items },
  { directory: "registry/blocks/features", items: featuresRegistry.items },
  { directory: "registry/blocks/pricing", items: pricingRegistry.items },
] as const

type BlockEntry = {
  item: BlockItem
  directory: string
}

const BLOCKS: BlockEntry[] = SOURCES.flatMap((source) =>
  (source.items as unknown as BlockItem[])
    .filter((item) => !item.meta?.internal)
    .map((item) => ({ item, directory: source.directory })),
)

const BY_SLUG = new Map(BLOCKS.map((entry) => [entry.item.name, entry]))

export function getBlocks(): BlockItem[] {
  return BLOCKS.map((entry) => entry.item)
}

export function getBlock(slug: string): BlockItem | undefined {
  return BY_SLUG.get(slug)?.item
}

/** Директория registry.json, объявившего блок: пути файлов относительны ей. */
export function getBlockDirectory(slug: string): string | undefined {
  return BY_SLUG.get(slug)?.directory
}

export function getCategoryLabel(slug: string): string {
  return CATEGORIES.find((category) => category.slug === slug)?.label ?? slug
}

export function getFeaturedBlocks(): BlockItem[] {
  return getBlocks().filter((block) => block.meta?.featured)
}

/** Первый блок категории. Нужен витрине: она собирает страницу из типов секций. */
export function getBlockByCategory(category: string): BlockItem | undefined {
  return getBlocks().find((block) => block.categories?.[0] === category)
}

/** Категории, в которых реально есть блоки, с количеством. Для фильтра каталога. */
export function getUsedCategories(): {
  slug: string
  label: string
  count: number
}[] {
  const counts = new Map<string, number>()

  for (const block of getBlocks()) {
    const category = block.categories?.[0]

    if (category) {
      counts.set(category, (counts.get(category) ?? 0) + 1)
    }
  }

  return CATEGORIES.filter((category) => counts.has(category.slug)).map(
    (category) => ({
      slug: category.slug,
      label: category.label,
      count: counts.get(category.slug) ?? 0,
    }),
  )
}
