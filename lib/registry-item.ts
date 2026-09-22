import "server-only"

import { buildRegistryDocs, withPreserveHeader } from "@/lib/registry-docs"
import { signRegistryLink } from "@/lib/registry-link"
import { getCatalogItem } from "@/registry/index"
import { getDeliverableSource } from "@/registry/source.server"

/**
 * Registry-item в формате shadcn, собранный на лету. Для открытых
 * компонентов то же самое лежит статикой в `public/r/`, но закрытые туда не
 * попадают — иначе их забирали бы без подписки.
 *
 * `siteUrl` нужен составным блокам: их `registryDependencies` уезжают
 * подписанными адресами `/r/pro/<dep>.json?exp&sig`. Голое имя shadcn CLI
 * искал бы в ui.shadcn.com. Подпись рождается здесь: доступ к блоку уже
 * проверен (подписью или подпиской), а его части — часть того же item'а,
 * и лимит за них второй раз не списывается.
 */
export async function buildRegistryItem(slug: string, siteUrl: string) {
  const item = getCatalogItem(slug)

  if (!item) {
    return null
  }

  const source = await getDeliverableSource(slug)
  const files = (item.files ?? []).map((file) => ({
    path: file.path,
    type: file.type,
    target: file.target,
    content: source === null ? undefined : withPreserveHeader(source, item),
  }))

  const registryDependencies = (item.registryDependencies ?? []).map((name) => {
    const { exp, sig } = signRegistryLink(name)

    return `${siteUrl}/r/pro/${name}.json?exp=${exp}&sig=${sig}`
  })

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies ?? [],
    registryDependencies,
    // shadcn CLI печатает docs после установки: правила доходят до агента
    // терминалом, минуя пересказ фетчера.
    docs: buildRegistryDocs(item),
    files,
  }
}
