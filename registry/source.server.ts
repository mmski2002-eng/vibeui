import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"

import { getCatalogItem, getItemDirectory } from "@/registry/index"

const REGISTRY_ROOT = "registry"

/**
 * Читает исходник item'а каталога. Путь берётся только из registry item, slug служит
 * ключом поиска по известной карте — произвольный путь снаружи попасть не может.
 * База пути статична (`<cwd>/registry`), чтобы трассировка сборки не утягивала
 * в серверный бандл весь проект.
 */
export async function getBlockSource(slug: string): Promise<string | null> {
  const item = getCatalogItem(slug)
  const directory = getItemDirectory(slug)

  if (!item || !directory) {
    return null
  }

  const file = item.files?.[0]

  if (!file) {
    return null
  }

  const relativePath = path.join(
    path.relative(REGISTRY_ROOT, directory),
    file.path,
  )

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null
  }

  return readFile(path.join(process.cwd(), "registry", relativePath), "utf8")
}

/**
 * Импорты других items реестра в том виде, в каком они нужны в чужом
 * проекте: `@/registry/components/<cat>/<name>/<name>` → `@/components/vibeui/<name>`,
 * то есть путь, куда `files[0].target` кладёт зависимость. Составной блок
 * в репозитории импортирует исходник соседа напрямую, чтобы превью и
 * типы работали без сборки; пользователю уезжает версия под его дерево.
 */
export function rewriteRegistryImports(source: string): string {
  return source.replace(
    /(["'])@\/registry\/(?:animations|blocks|components)\/[\w-]+\/([\w-]+)\/\2\1/g,
    "$1@/components/vibeui/$2$1",
  )
}

/** Исходник item'а как он устанавливается: с переписанными импортами. */
export async function getDeliverableSource(slug: string): Promise<string | null> {
  const source = await getBlockSource(slug)

  return source === null ? null : rewriteRegistryImports(source)
}
