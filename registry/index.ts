import { CATEGORIES } from "@/registry/categories"
import type { BlockItem } from "@/registry/meta"
import heroRegistry from "@/registry/blocks/hero/registry.json"

// Категории, попадающие на сайт. Служебные registry-файлы (_smoke) сюда не
// включаются, поэтому их slug'и на сайте недоступны в принципе.
const SOURCES = [
  { directory: "registry/blocks/hero", items: heroRegistry.items },
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
