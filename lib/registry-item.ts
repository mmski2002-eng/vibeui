import "server-only"

import { buildRegistryDocs, withPreserveHeader } from "@/lib/registry-docs"
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

  const source = await getBlockSource(slug)
  const files = (item.files ?? []).map((file) => ({
    path: file.path,
    type: file.type,
    target: file.target,
    content: source === null ? undefined : withPreserveHeader(source, item),
  }))

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    // shadcn CLI печатает docs после установки: правила доходят до агента
    // терминалом, минуя пересказ фетчера.
    docs: buildRegistryDocs(item),
    files,
  }
}
