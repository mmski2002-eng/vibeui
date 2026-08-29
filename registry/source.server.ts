import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"

import { getBlock, getBlockDirectory } from "@/registry/index"

const REGISTRY_ROOT = "registry"

/**
 * Читает исходник блока. Путь берётся только из registry item, slug служит
 * ключом поиска по известной карте — произвольный путь снаружи попасть не может.
 * База пути статична (`<cwd>/registry`), чтобы трассировка сборки не утягивала
 * в серверный бандл весь проект.
 */
export async function getBlockSource(slug: string): Promise<string | null> {
  const item = getBlock(slug)
  const directory = getBlockDirectory(slug)

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
