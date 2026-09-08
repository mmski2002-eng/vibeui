import "server-only"

import { getCatalogItem } from "@/registry/index"
import { getBlockSource } from "@/registry/source.server"

/**
 * Registry-item в формате shadcn, собранный на лету. Для открытых
 * компонентов то же самое лежит статикой в `public/r/`, но закрытые туда не
 * попадают — иначе их забирали бы без подписки.
 */
export async function buildRegistryItem(slug: string) {
  const item = getCatalogItem(slug)

  if (!item) {
    return null
  }

  const files = await Promise.all(
    (item.files ?? []).map(async (file) => ({
      path: file.path,
      type: file.type,
      target: file.target,
      content: await getBlockSource(slug),
    })),
  )

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    files,
  }
}
